// Enums
export const ConversationStatus = {
  OPEN: "OPEN",
  RESOLVED: "RESOLVED",
  PENDING: "PENDING",
} as const;
export type ConversationStatus =
  (typeof ConversationStatus)[keyof typeof ConversationStatus];

export const MessageDirection = {
  INBOUND: "INBOUND",
  OUTBOUND: "OUTBOUND",
} as const;
export type MessageDirection =
  (typeof MessageDirection)[keyof typeof MessageDirection];

export const MessageType = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  DOCUMENT: "DOCUMENT",
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
  TEMPLATE: "TEMPLATE",
} as const;
export type MessageType = (typeof MessageType)[keyof typeof MessageType];

export const MessageStatus = {
  SENT: "SENT",
  DELIVERED: "DELIVERED",
  READ: "READ",
  FAILED: "FAILED",
} as const;
export type MessageStatus =
  (typeof MessageStatus)[keyof typeof MessageStatus];

export const UserRole = {
  ADMIN: "ADMIN",
  AGENT: "AGENT",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const WhatsAppProvider = {
  META: "meta",
  DIALOG360: "360dialog",
  TWILIO: "twilio",
} as const;
export type WhatsAppProvider =
  (typeof WhatsAppProvider)[keyof typeof WhatsAppProvider];

// API request/response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export interface ContactCreateRequest {
  phone: string;
  name: string;
  notes?: string;
  tags?: string[];
}

export interface ContactUpdateRequest {
  name?: string;
  phone?: string;
  notes?: string;
  pipelineStageId?: string;
  assignedToId?: string;
}

export interface SendMessageRequest {
  contactId: string;
  type: MessageType;
  body?: string;
  templateId?: string;
  mediaUrl?: string;
}

export interface TagCreateRequest {
  name: string;
  color: string;
}

export interface PipelineStageCreateRequest {
  name: string;
  order: number;
  color: string;
}

export interface ReminderCreateRequest {
  contactId: string;
  note: string;
  dueAt: string;
}

export interface SettingsUpdateRequest {
  whatsappProvider: WhatsAppProvider;
  whatsappApiKey: string;
  whatsappPhoneNumberId: string;
  whatsappWebhookSecret: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
