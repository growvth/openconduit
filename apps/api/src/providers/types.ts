export interface SendMessageParams {
  to: string;
  type: string;
  body?: string;
  mediaUrl?: string;
  templateName?: string;
}

export interface IncomingMessage {
  from: string;
  waMessageId: string;
  type: string;
  body?: string;
  mediaUrl?: string;
  mediaType?: string;
  timestamp: Date;
}

export interface StatusUpdate {
  waMessageId: string;
  status: "SENT" | "DELIVERED" | "READ" | "FAILED";
  timestamp: Date;
  errorMessage?: string;
}

export interface WhatsAppProviderInterface {
  /** Send a message and return the provider message ID */
  sendMessage(params: SendMessageParams): Promise<string>;

  /** Parse an incoming webhook payload into messages and status updates */
  parseWebhook(
    headers: Record<string, string | undefined>,
    body: unknown,
  ): { messages: IncomingMessage[]; statusUpdates: StatusUpdate[] };

  /** Validate webhook signature (HMAC) */
  validateWebhookSignature(
    headers: Record<string, string | undefined>,
    rawBody: string,
    secret: string,
  ): boolean;

  /** Handle webhook verification challenge */
  handleVerification(query: Record<string, string>): string | null;

  /** Check provider connectivity */
  healthCheck(): Promise<boolean>;
}
