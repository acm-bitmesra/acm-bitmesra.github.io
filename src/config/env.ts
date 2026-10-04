import { z } from "zod";

/**
 * Server-only Environment Configuration Module for ACM BIT Mesra
 * Validates mandatory credentials, prevents client-side leaks, and enforces Zero-Trust policies.
 */

// Runtime guard: Prevent client-side bundle leakage
if (typeof window !== "undefined") {
  throw new Error(
    "CRITICAL SECURITY VIOLATION: @/config/env was imported in a client component. " +
    "Server configuration and secrets must NEVER be exposed to the browser."
  );
}

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required. Provide a valid Neon PostgreSQL connection string."),

  BETTER_AUTH_SECRET: z
    .string()
    .min(16, "BETTER_AUTH_SECRET must be at least 16 characters for cryptographic security"),

  BETTER_AUTH_URL: z
    .string()
    .url("BETTER_AUTH_URL must be a valid URL")
    .default("https://acmbitm.campsy.app"),

  GOOGLE_CLIENT_ID: z.string().optional().default(""),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(""),

  ADMIN_EMAIL_ALLOWLIST: z
    .string()
    .default("acm@bitmesra.ac.in,Btech10574.24@bitmesra.ac.in"),

  PUBLIC_SITE_URL: z
    .string()
    .url("PUBLIC_SITE_URL must be a valid URL")
    .default("https://acmbitm.campsy.app"),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("production"),
});

export type ServerEnv = z.infer<typeof envSchema>;

function parseEnv(): ServerEnv {
  const result = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://acmbitm.campsy.app"),
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    ADMIN_EMAIL_ALLOWLIST: process.env.ADMIN_EMAIL_ALLOWLIST,
    PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!result.success) {
    const issues = result.error.issues || [];
    const errorDetails = issues
      .map((issue) => `  - [${issue.path.join(".")}]: ${issue.message}`)
      .join("\n");

    const message =
      `\n=======================================================\n` +
      `ACM BIT MESRA CONFIGURATION ERROR: Invalid or Missing Environment Variables\n` +
      `=======================================================\n` +
      `${errorDetails}\n\n` +
      `Resolution:\n` +
      `  • In local development: Add these values to your .env or .dev.vars file.\n` +
      `  • In Cloudflare production: Use 'npx wrangler secret put <KEY>' to provision.\n` +
      `=======================================================\n`;

    console.error(message);
    throw new Error(`Environment validation failed. See server logs for details.`);
  }

  return result.data;
}

export const env = parseEnv();

/**
 * Returns the normalized list of email addresses permitted for initial SUPER_ADMIN bootstrap.
 * Each email is normalized by trimming whitespace and converting to lowercase.
 */
export function getAdminEmailAllowlist(): string[] {
  return env.ADMIN_EMAIL_ALLOWLIST.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);
}

/**
 * Verifies if an email address exactly matches an allowlisted administrator account.
 * Domain wildcards are strictly rejected. Exact normalized equality is enforced.
 */
export function isEmailInAdminAllowlist(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const allowlist = getAdminEmailAllowlist();
  return allowlist.includes(normalized);
}
