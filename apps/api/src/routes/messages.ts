import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../db.js";
import { authenticate } from "../middleware/auth.js";
import { WHATSAPP_SESSION_WINDOW_HOURS } from "@openconduit/shared";
import { getWhatsAppProvider } from "../providers/factory.js";

const sendMessageSchema = z.object({
  contactId: z.string().uuid(),
  type: z.enum(["TEXT", "IMAGE", "DOCUMENT", "AUDIO", "VIDEO", "TEMPLATE"]),
  body: z.string().max(4096).optional(),
  templateId: z.string().uuid().optional(),
  mediaUrl: z.string().url().optional(),
});

export async function messageRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", authenticate);

  // Send message
  app.post("/", async (request, reply) => {
    const parsed = sendMessageSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Bad Request", message: parsed.error.message, statusCode: 400 });
    }

    const { contactId, type, body, templateId, mediaUrl } = parsed.data;

    const contact = await prisma.contact.findUnique({ where: { id: contactId } });
    if (!contact) {
      return reply.status(404).send({ error: "Not Found", message: "Contact not found", statusCode: 404 });
    }

    // Check 24-hour session window for non-template messages
    if (type !== "TEMPLATE") {
      const lastInbound = await prisma.message.findFirst({
        where: {
          conversation: { contactId },
          direction: "INBOUND",
        },
        orderBy: { createdAt: "desc" },
      });

      if (lastInbound) {
        const hoursSinceLastInbound =
          (Date.now() - lastInbound.createdAt.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastInbound > WHATSAPP_SESSION_WINDOW_HOURS) {
          return reply.status(422).send({
            error: "Unprocessable Entity",
            message: "Outside 24-hour session window. Only template messages can be sent.",
            statusCode: 422,
          });
        }
      }
    }

    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: { contactId, status: { not: "RESOLVED" } },
      orderBy: { updatedAt: "desc" },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          contactId,
          status: "OPEN",
          assignedToId: request.user.id,
        },
      });
    }

    // Resolve template body if needed
    let messageBody = body;
    if (type === "TEMPLATE" && templateId) {
      const template = await prisma.messageTemplate.findUnique({ where: { id: templateId } });
      if (!template) {
        return reply.status(404).send({ error: "Not Found", message: "Template not found", statusCode: 404 });
      }
      messageBody = template.body;
    }

    // Send via WhatsApp provider
    let providerMsgId: string | undefined;
    try {
      const provider = await getWhatsAppProvider();
      if (provider) {
        providerMsgId = await provider.sendMessage({
          to: contact.phone,
          type,
          body: messageBody,
          mediaUrl,
        });
      }
    } catch (err) {
      app.log.error(err, "Failed to send message via WhatsApp provider");
    }

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        direction: "OUTBOUND",
        type,
        body: messageBody,
        mediaUrl,
        providerMsgId,
        status: providerMsgId ? "SENT" : "FAILED",
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    return reply.status(201).send(message);
  });

  // Get message by ID
  app.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const message = await prisma.message.findUnique({
      where: { id: request.params.id },
      include: { conversation: { include: { contact: true } } },
    });

    if (!message) {
      return reply.status(404).send({ error: "Not Found", message: "Message not found", statusCode: 404 });
    }

    return message;
  });
}
