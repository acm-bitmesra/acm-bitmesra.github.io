import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { env } from "@/config/env";
import * as schema from "@/db/schema";
import { isAdminEmailAllowed } from "./config";
import { isBitMesraStudentEmail } from "./domain-eligibility";

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
     * Enforce Identity Eligibility:
     * 1. Exact-match Bootstrap Administrator Allowlist (ADMIN_EMAIL_ALLOWLIST)
     * 2. Active Chapter Members provisioned in chapter_members
     * 3. Verified University Identity: Any student with normalized email ending in @bitmesra.ac.in
     *
     * Non-qualifying accounts are strictly rejected server-side.
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
            "A valid email address is required to access ACM BIT Mesra services.",
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

      // 3. University Student Domain Eligibility (Section 2 & 4.1):
      // Every verified student with exact @bitmesra.ac.in domain is eligible to create an account
      if (isBitMesraStudentEmail(email)) {
        return;
      }

      return {
        error: "email_not_allowed",
        errorDescription:
          "Access restricted. Only verified Birla Institute of Technology, Mesra (@bitmesra.ac.in) accounts and authorized chapter members are eligible.",
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
