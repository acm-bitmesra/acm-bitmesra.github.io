import { env } from "@/config/env";

/**
 * Server-side University Identity & Domain Eligibility Validator.
 * Enforces strict, normalized server-side domain verification for student accounts.
 *
 * Security Requirements (Section 2 & 4.1):
 * 1. Must parse the actual domain after the final '@'.
 * 2. Case-insensitive exact equality comparison against the configured allowed domain.
 * 3. Never trust substring checks (e.g. reject 'student@bitmesra.ac.in.evil.example').
 * 4. Reject multiple '@' symbols or malformed headers.
 */

export function normalizeEmail(email: string | null | undefined): string {
  if (!email) return "";
  return email.trim().toLowerCase();
}

export function extractEmailDomain(email: string | null | undefined): string | null {
  if (!email) return null;
  const normalized = normalizeEmail(email);
  const parts = normalized.split("@");

  // Exactly one '@' must divide the user and domain parts
  if (parts.length !== 2) {
    return null;
  }

  const userPart = parts[0];
  const domainPart = parts[1];

  if (!userPart || !domainPart) {
    return null;
  }

  return domainPart;
}

export function isBitMesraStudentEmail(email: string | null | undefined): boolean {
  const domain = extractEmailDomain(email);
  if (!domain) return false;

  const allowedDomain = normalizeEmail(env.ALLOWED_STUDENT_EMAIL_DOMAIN || "bitmesra.ac.in");

  // Exact normalized string equality comparison
  return domain === allowedDomain;
}
