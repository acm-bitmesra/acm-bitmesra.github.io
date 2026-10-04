import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { isAdminEmailAllowed } from "./config";

const betterAuthSecret = process.env.BETTER_AUTH_SECRET;
const betterAuthUrl = process.env.BETTER_AUTH_URL;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!betterAuthSecret) {
  throw new Error("BETTER_AUTH_SECRET is not configured.");
}

if (!betterAuthUrl) {
  throw new Error("BETTER_AUTH_URL is not configured.");
}

if (!googleClientId || !googleClientSecret) {
  throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required.");
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  secret: betterAuthSecret,
  baseURL: betterAuthUrl,

  // Explicitly trust only the two application origins.
  trustedOrigins: [
    "http://localhost:3000",
    "https://acmbitm.campsy.app",
  ],

  user: {
    /**
     * Enforce the ACM administrator allowlist before Google OAuth can:
     * - create a Better Auth user
     * - link an OAuth account
     * - sign an existing OAuth user in
     *
     * The allowlist is intentionally exact-match, not domain-wide.
     */
    validateUserInfo: ({ user, source }) => {
      if (source.oauth?.providerId !== "google") {
        return;
      }

      const email = user.email?.trim().toLowerCase();

      if (!email || !isAdminEmailAllowed(email)) {
        return {
          error: "email_not_allowed",
          errorDescription:
            "This Google account is not authorized to access the ACM BIT Mesra admin console.",
        };
      }
    },
  },

  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      // Avoid silently authenticating the wrong cached Google account.
      prompt: "select_account",
    },
  },
});
