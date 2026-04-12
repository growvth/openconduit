import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";
import { config } from "../config.js";
import { getWhatsAppProvider } from "../providers/factory.js";

const settingsSchema = z.object({
  whatsappProvider: z.enum(["meta", "360dialog", "twilio"]).optional(),
  whatsappApiKey: z.string().max(500).optional(),
  whatsappPhoneNumberId: z.string().max(100).optional(),
  whatsappWebhookSecret: z.string().max(500).optional(),
  autoOptInOnFirstMessage: z.boolean().optional(),
});

export async function settingsRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", requireAdmin);

  app.get("/", async () => {
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({ data: {} });
    }

    return {
      ...settings,
      // Mask sensitive fields
      whatsappApiKey: settings.whatsappApiKey ? "••••••••" : null,
      whatsappWebhookSecret: settings.whatsappWebhookSecret ? "••••••••" : null,
      webhookUrl: `${config.publicUrl}/webhooks/whatsapp`,
    };
  });

  app.put("/", async (request, reply) => {
    const parsed = settingsSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Bad Request", message: parsed.error.message, statusCode: 400 });
    }

    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({ data: parsed.data });
    } else {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: parsed.data,
      });
    }

    return {
      ...settings,
      whatsappApiKey: settings.whatsappApiKey ? "••••••••" : null,
      whatsappWebhookSecret: settings.whatsappWebhookSecret ? "••••••••" : null,
      webhookUrl: `${config.publicUrl}/webhooks/whatsapp`,
    };
  });

  app.post("/test-connection", async (_request, reply) => {
    try {
      const provider = await getWhatsAppProvider();
      if (!provider) {
        return reply.status(400).send({
          error: "Bad Request",
          message: "WhatsApp provider not configured",
          statusCode: 400,
        });
      }
      const healthy = await provider.healthCheck();
      return { connected: healthy };
    } catch {
      return { connected: false };
    }
  });
}
