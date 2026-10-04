import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { env } from "@/config/env";
import * as schema from "@/db/schema";
import { isAdminEmailAllowed } from "./config";

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

  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,

  onAPIError: {
    errorURL: "/admin/unauthorized",
  },

  // Explicitly trust only canonical application origins
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
     * Active chapter members provisioned in the roster are also authorized.
     */
    validateUserInfo: async ({ user, source }) => {
      if (source.oauth?.providerId !== "google") {
        return;
      }

      const email = user.email?.trim().toLowerCase();

      if (!email) {
        return {
          error: "email_not_allowed",
          errorDescription:
            "A valid email address is required to access the ACM BIT Mesra admin console.",
        };
      }

      // 1. Initial bootstrap check: Is email in the predefined allowlist?
      if (isAdminEmailAllowed(email)) {
        return;
      }

      // 2. Active chapter member check: Is user an active registered member in the roster?
      try {
        const existingMember = await db.query.chapterMembers.findFirst({
          where: (members, { eq }) => eq(members.email, email),
        });

        if (existingMember && existingMember.isActive && existingMember.status === "ACTIVE") {
          return;
        }
      } catch (err) {
        console.error("Error verifying chapter membership in validateUserInfo:", err);
      }

      return {
        error: "email_not_allowed",
        errorDescription:
          "This Google account is not authorized to access the ACM BIT Mesra admin console.",
      };
    },
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      prompt: "select_account",
      enabled: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
    },
  },
});
