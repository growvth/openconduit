/**
 * Validates and normalizes a phone number to E.164 format.
 * Returns null if the input cannot be normalized.
 */
export function normalizePhoneE164(phone: string): string | null {
  // Strip all non-digit characters except leading +
  const cleaned = phone.replace(/[^\d+]/g, "");

  // Must start with + and have 7-15 digits (E.164 spec)
  if (/^\+\d{7,15}$/.test(cleaned)) {
    return cleaned;
  }

  // If just digits (no +), try adding +
  if (/^\d{7,15}$/.test(cleaned)) {
    return `+${cleaned}`;
  }

  return null;
}

/**
 * Validates an email address format.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates a hex color string.
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(color);
}

/**
 * Sanitize a string by stripping HTML tags.
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}
