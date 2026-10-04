import { headers } from "next/headers";
import { auth } from "./auth";
import { db } from "@/db";
import {
  chapterMembers,
  chapterRoles,
  memberPermissions,
  auditLogs,
} from "@/db/schema";
import { eq, and, gt, or, isNull } from "drizzle-orm";
import { type Permission } from "../permissions/constants";
import { isAdminEmailAllowed, normalizeEmail } from "./config";

export interface AuthorizedMemberContext {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
  };
  member: typeof chapterMembers.$inferSelect;
  role: typeof chapterRoles.$inferSelect;
  permissions: string[];
}

/**
 * Returns raw Better Auth session if present.
 */
export async function getAuthSession() {
  try {
    const headerList = await headers();
    return await auth.api.getSession({
      headers: headerList,
    });
  } catch {
    return null;
  }
}

/**
 * Resolves current authenticated session and verifies ACM chapter authorization.
 *
 * Authentication and authorization are separate:
 * 1. Better Auth verifies the Google identity.
 * 2. Google OAuth itself rejects accounts outside ADMIN_EMAIL_ALLOWLIST.
 * 3. The chapter member registry determines the user's chapter role and permissions.
 *
 * On the first successful login of an allowlisted admin, the member registry is
 * provisioned once with the existing highest-level PRESIDENT role. Existing
 * members are never role-escalated merely because their email remains allowlisted.
 */
export async function getAuthorizedMember(): Promise<AuthorizedMemberContext | null> {
  try {
    const headerList = await headers();
    const session = await auth.api.getSession({
      headers: headerList,
    });

    if (!session?.user?.email) {
      return null;
    }

    const email = normalizeEmail(session.user.email);

    // 1. Look up chapter member by Better Auth user ID or normalized email.
    let member = await db.query.chapterMembers.findFirst({
      where: or(
        eq(chapterMembers.authUserId, session.user.id),
        eq(chapterMembers.email, email),
      ),
    });

    // 2. One-time provisioning for the explicit admin allowlist.
    // This replaces the old single BOOTSTRAP_ADMIN_EMAIL mechanism.
    if (!member && isAdminEmailAllowed(email)) {
      const presidentRole = await db.query.chapterRoles.findFirst({
        where: eq(chapterRoles.key, "PRESIDENT"),
      });

      if (!presidentRole) {
        console.error(
          "Cannot provision allowlisted ACM administrator: PRESIDENT role is missing.",
        );
        return null;
      }

      try {
        const [newMember] = await db
          .insert(chapterMembers)
          .values({
            id: "mem_" + crypto.randomUUID().replaceAll("-", "").slice(0, 12),
            authUserId: session.user.id,
            name: session.user.name || "ACM Chapter Administrator",
            email,
            avatarUrl: session.user.image,
            roleId: presidentRole.id,
            status: "ACTIVE",
            termStart: "2026-27",
            isActive: true,
          })
          .returning();

        member = newMember;

        const clientIp =
          headerList.get("cf-connecting-ip") ??
          headerList.get("x-real-ip") ??
          null;

        await db.insert(auditLogs).values({
          id: "audit_" + crypto.randomUUID().replaceAll("-", "").slice(0, 12),
          memberId: newMember.id,
          action: "ADMIN_INITIAL_PROVISION",
          targetType: "CHAPTER_MEMBER",
          targetId: newMember.id,
          details: {
            email,
            role: presidentRole.key,
            reason: "First successful login for an explicit admin allowlist entry",
            ipAddress: clientIp,
            userAgent: headerList.get("user-agent"),
          },
        });
      } catch (provisioningError) {
        // A second simultaneous login can race on the unique email constraint.
        // Re-read the member before failing the authorization request.
        member = await db.query.chapterMembers.findFirst({
          where: eq(chapterMembers.email, email),
        });

        if (!member) {
          console.error(
            "Failed to provision allowlisted ACM administrator:",
            provisioningError,
          );
          return null;
        }
      }
    }

    if (!member || !member.isActive || member.status !== "ACTIVE") {
      return null;
    }

    // Link the Better Auth user ID if the chapter member existed before OAuth login.
    if (!member.authUserId) {
      await db
        .update(chapterMembers)
        .set({
          authUserId: session.user.id,
          avatarUrl: session.user.image || member.avatarUrl,
        })
        .where(eq(chapterMembers.id, member.id));

      member.authUserId = session.user.id;
    }

    // 3. Resolve role and its default permission bundle.
    const role = await db.query.chapterRoles.findFirst({
      where: eq(chapterRoles.id, member.roleId),
    });

    if (!role || !role.active) {
      return null;
    }

    // 4. Resolve explicit member permissions that have not expired.
    const explicitPerms = await db.query.memberPermissions.findMany({
      where: and(
        eq(memberPermissions.memberId, member.id),
        or(
          isNull(memberPermissions.expiresAt),
          gt(memberPermissions.expiresAt, new Date()),
        ),
      ),
    });

    const permissionSet = new Set<string>([
      ...role.permissionSet,
      ...explicitPerms.map((p) => p.permission),
    ]);

    return {
      user: session.user,
      member,
      role,
      permissions: Array.from(permissionSet),
    };
  } catch (error) {
    console.error("Error resolving authorized member:", error);
    return null;
  }
}

/**
 * Server-side authorization check.
 * Throws an Error if unauthenticated/unauthorized or lacking the required permission.
 */
export async function requirePermission(
  permission: Permission,
): Promise<AuthorizedMemberContext> {
  const context = await getAuthorizedMember();

  if (!context) {
    throw new Error(
      "UNAUTHORIZED: You must be an active, authorized ACM BIT Mesra member to perform this action.",
    );
  }

  if (!context.permissions.includes(permission)) {
    throw new Error(
      "FORBIDDEN: Missing required chapter permission '" + permission + "'.",
    );
  }

  return context;
}
