import { FastifyInstance } from "fastify";
import { prisma } from "../db.js";
import { getWhatsAppProvider, getWebhookSecret } from "../providers/factory.js";
import { normalizePhoneE164 } from "@openconduit/shared";

export async function webhookRoutes(app: FastifyInstance): Promise<void> {
  // Webhook verification (GET) - no auth required
  app.get("/whatsapp", async (request, reply) => {
    const provider = await getWhatsAppProvider();
    if (!provider) {
      return reply.status(503).send({ error: "Provider not configured" });
    }

    const challenge = provider.handleVerification(
      request.query as Record<string, string>,
    );

    if (challenge) {
      return reply.type("text/plain").send(challenge);
    }

    return reply.status(403).send({ error: "Verification failed" });
  });

  // Incoming webhook (POST) - no JWT, validated via HMAC
  app.post("/whatsapp", {
    config: { rawBody: true },
  }, async (request, reply) => {
    const provider = await getWhatsAppProvider();
    if (!provider) {
      app.log.warn("Webhook received but no provider configured");
      return reply.status(200).send(); // Return 200 to prevent retries
    }

    // Validate webhook signature
    const secret = await getWebhookSecret();
    if (secret) {
      const rawBody =
        typeof request.body === "string"
          ? request.body
          : JSON.stringify(request.body);

      const valid = provider.validateWebhookSignature(
        request.headers as Record<string, string | undefined>,
        rawBody,
        secret,
      );

      if (!valid) {
        app.log.warn("Webhook signature validation failed");
        return reply.status(401).send({ error: "Invalid signature" });
      }
    }

    const { messages, statusUpdates } = provider.parseWebhook(
      request.headers as Record<string, string | undefined>,
      request.body,
    );

    // Process incoming messages
    for (const msg of messages) {
      try {
        const phone = normalizePhoneE164(msg.from);
        if (!phone) {
          app.log.warn(`Invalid phone number from webhook: ${msg.from}`);
          continue;
        }

        // Find or create contact
        let contact = await prisma.contact.findUnique({ where: { phone } });
        if (!contact) {
          contact = await prisma.contact.create({
            data: {
              phone,
              name: phone,
              waId: msg.from,
            },
          });

          // Auto-tag as Unknown
          const unknownTag = await prisma.tag.findUnique({
            where: { name: "Unknown" },
          });
          if (unknownTag) {
            await prisma.contactTag.create({
              data: { contactId: contact.id, tagId: unknownTag.id },
            });
          }
        }

        // Check auto opt-in setting
        const settings = await prisma.settings.findFirst();
        if (settings?.autoOptInOnFirstMessage && !contact.optedIn) {
          await prisma.contact.update({
            where: { id: contact.id },
            data: { optedIn: true, optedInAt: new Date() },
          });
        }

        // Find or create conversation
        let conversation = await prisma.conversation.findFirst({
          where: { contactId: contact.id, status: { not: "RESOLVED" } },
          orderBy: { updatedAt: "desc" },
        });

        if (!conversation) {
          conversation = await prisma.conversation.create({
            data: { contactId: contact.id, status: "OPEN" },
          });
        } else {
          // Re-open if pending
          if (conversation.status === "PENDING") {
            await prisma.conversation.update({
              where: { id: conversation.id },
              data: { status: "OPEN" },
            });
          }
        }

        // Store message
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            direction: "INBOUND",
            type: msg.type as "TEXT" | "IMAGE" | "DOCUMENT" | "AUDIO" | "VIDEO",
            body: msg.body,
            mediaUrl: msg.mediaUrl,
            mediaType: msg.mediaType,
            providerMsgId: msg.waMessageId,
            status: "DELIVERED",
            sentAt: msg.timestamp,
          },
        });

        // Update conversation timestamp
        await prisma.conversation.update({
          where: { id: conversation.id },
          data: { updatedAt: new Date() },
        });

        // Auto-tagging rules
        if (msg.body) {
          const rules = await prisma.autoTagRule.findMany();
          for (const rule of rules) {
            if (msg.body.toLowerCase().includes(rule.keyword.toLowerCase())) {
              await prisma.contactTag.upsert({
                where: {
                  contactId_tagId: {
                    contactId: contact.id,
                    tagId: rule.tagId,
                  },
                },
                create: { contactId: contact.id, tagId: rule.tagId },
                update: {},
              });
            }
          }
        }
      } catch (err) {
        app.log.error(err, "Error processing incoming webhook message");
      }
    }

    // Process status updates
    for (const status of statusUpdates) {
      try {
        await prisma.message.updateMany({
          where: { providerMsgId: status.waMessageId },
          data: { status: status.status },
        });
      } catch (err) {
        app.log.error(err, "Error processing status update");
      }
    }

    return reply.status(200).send();
  });
}
