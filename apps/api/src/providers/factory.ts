import { prisma } from "../db.js";
import { WhatsAppProviderInterface } from "./types.js";
import { MetaCloudApiProvider } from "./meta.js";

export async function getWhatsAppProvider(): Promise<WhatsAppProviderInterface | null> {
  const settings = await prisma.settings.findFirst();
  if (!settings?.whatsappProvider || !settings.whatsappApiKey) {
    return null;
  }

  switch (settings.whatsappProvider) {
    case "meta":
      return new MetaCloudApiProvider(
        settings.whatsappApiKey,
        settings.whatsappPhoneNumberId ?? "",
      );
    case "360dialog":
      // 360dialog uses the same Meta Cloud API format with a different base URL
      // For v1 we use Meta as the default implementation
      return new MetaCloudApiProvider(
        settings.whatsappApiKey,
        settings.whatsappPhoneNumberId ?? "",
      );
    case "twilio":
      // Twilio provider - to be implemented in v2
      return null;
    default:
      return null;
  }
}

export async function getWebhookSecret(): Promise<string | null> {
  const settings = await prisma.settings.findFirst();
  return settings?.whatsappWebhookSecret ?? null;
}
