/**
 * Server-only ACM authentication configuration helpers.
 * Never expose these values through NEXT_PUBLIC_* variables.
 */

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getAdminEmailAllowlist(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAIL_ALLOWLIST ?? "")
      .split(",")
      .map(normalizeEmail)
      .filter(Boolean),
  );
}

export function isAdminEmailAllowed(email: string): boolean {
  return getAdminEmailAllowlist().has(normalizeEmail(email));
}
