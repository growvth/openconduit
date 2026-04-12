import crypto from "node:crypto";
import {
  WhatsAppProviderInterface,
  SendMessageParams,
  IncomingMessage,
  StatusUpdate,
} from "./types.js";

export class MetaCloudApiProvider implements WhatsAppProviderInterface {
  private apiKey: string;
  private phoneNumberId: string;
  private baseUrl = "https://graph.facebook.com/v21.0";

  constructor(apiKey: string, phoneNumberId: string) {
    this.apiKey = apiKey;
    this.phoneNumberId = phoneNumberId;
  }

  async sendMessage(params: SendMessageParams): Promise<string> {
    const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;

    const payload: Record<string, unknown> = {
      messaging_product: "whatsapp",
      to: params.to.replace("+", ""),
    };

    if (params.type === "TEXT") {
      payload.type = "text";
      payload.text = { body: params.body };
    } else if (params.type === "TEMPLATE" && params.templateName) {
      payload.type = "template";
      payload.template = { name: params.templateName, language: { code: "en" } };
    } else if (params.type === "IMAGE" && params.mediaUrl) {
      payload.type = "image";
      payload.image = { link: params.mediaUrl };
    } else if (params.type === "DOCUMENT" && params.mediaUrl) {
      payload.type = "document";
      payload.document = { link: params.mediaUrl };
    } else if (params.type === "AUDIO" && params.mediaUrl) {
      payload.type = "audio";
      payload.audio = { link: params.mediaUrl };
    } else if (params.type === "VIDEO" && params.mediaUrl) {
      payload.type = "video";
      payload.video = { link: params.mediaUrl };
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Meta API error: ${response.status} ${error}`);
    }

    const data = (await response.json()) as { messages: { id: string }[] };
    return data.messages[0].id;
  }

  parseWebhook(
    _headers: Record<string, string | undefined>,
    body: unknown,
  ): { messages: IncomingMessage[]; statusUpdates: StatusUpdate[] } {
    const messages: IncomingMessage[] = [];
    const statusUpdates: StatusUpdate[] = [];

    const payload = body as {
      entry?: {
        changes?: {
          value?: {
            messages?: {
              from: string;
              id: string;
              type: string;
              text?: { body: string };
              image?: { id: string; mime_type: string };
              document?: { id: string; mime_type: string };
              audio?: { id: string; mime_type: string };
              video?: { id: string; mime_type: string };
              timestamp: string;
            }[];
            statuses?: {
              id: string;
              status: string;
              timestamp: string;
              errors?: { title: string }[];
            }[];
          };
        }[];
      }[];
    };

    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const value = change.value;
        if (!value) continue;

        for (const msg of value.messages ?? []) {
          const typeMap: Record<string, string> = {
            text: "TEXT",
            image: "IMAGE",
            document: "DOCUMENT",
            audio: "AUDIO",
            video: "VIDEO",
          };

          messages.push({
            from: `+${msg.from}`,
            waMessageId: msg.id,
            type: typeMap[msg.type] ?? "TEXT",
            body: msg.text?.body,
            mediaType:
              msg.image?.mime_type ??
              msg.document?.mime_type ??
              msg.audio?.mime_type ??
              msg.video?.mime_type,
            timestamp: new Date(parseInt(msg.timestamp) * 1000),
          });
        }

        for (const status of value.statuses ?? []) {
          const statusMap: Record<string, StatusUpdate["status"]> = {
            sent: "SENT",
            delivered: "DELIVERED",
            read: "READ",
            failed: "FAILED",
          };

          statusUpdates.push({
            waMessageId: status.id,
            status: statusMap[status.status] ?? "SENT",
            timestamp: new Date(parseInt(status.timestamp) * 1000),
            errorMessage: status.errors?.[0]?.title,
          });
        }
      }
    }

    return { messages, statusUpdates };
  }

  validateWebhookSignature(
    headers: Record<string, string | undefined>,
    rawBody: string,
    secret: string,
  ): boolean {
    const signature = headers["x-hub-signature-256"];
    if (!signature) return false;

    const expected = `sha256=${crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex")}`;

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected),
    );
  }

  handleVerification(query: Record<string, string>): string | null {
    const mode = query["hub.mode"];
    const token = query["hub.verify_token"];
    const challenge = query["hub.challenge"];

    if (mode === "subscribe" && token && challenge) {
      return challenge;
    }
    return null;
  }

  async healthCheck(): Promise<boolean> {
    const url = `${this.baseUrl}/${this.phoneNumberId}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });
    return response.ok;
  }
}
