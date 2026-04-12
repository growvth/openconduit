export const WHATSAPP_SESSION_WINDOW_HOURS = 24;

export const DEFAULT_PIPELINE_STAGES = [
  { name: "New Lead", order: 1, color: "#6366f1" },
  { name: "Contacted", order: 2, color: "#3b82f6" },
  { name: "Proposal Sent", order: 3, color: "#f59e0b" },
  { name: "Converted", order: 4, color: "#10b981" },
  { name: "Closed", order: 5, color: "#6b7280" },
] as const;

export const DEFAULT_TAGS = [
  { name: "New Lead", color: "#6366f1" },
  { name: "Interested", color: "#3b82f6" },
  { name: "Trial Done", color: "#f59e0b" },
  { name: "Converted", color: "#10b981" },
  { name: "Churned", color: "#ef4444" },
] as const;

export const BCRYPT_COST_FACTOR = 12;

export const JWT_EXPIRY = "24h";

export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE_SIZE = 25;

export const ALLOWED_MEDIA_TYPES = {
  image: ["image/jpeg", "image/png"],
  document: ["application/pdf"],
  audio: ["audio/mpeg", "audio/ogg"],
  video: ["video/mp4"],
} as const;
