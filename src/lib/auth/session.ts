import { headers } from "next/headers";
import { auth } from "./auth";
import { db } from "@/db";
import { chapterMembers, chapterRoles, memberPermissions, auditLogs } from "@/db/schema";
import { eq, and, gt, or, isNull } from "drizzle-orm";
import { type Permission, DEFAULT_ROLES } from "../permissions/constants";
import { normalizeEmail, isAdminEmailAllowed } from "./config";

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
 * Zero-Trust Principle: Authentication alone is NOT authorization.
 * 1. Better Auth verifies the Google identity.
 * 2. Google OAuth validates the exact administrator allowlist.
 * 3. The chapter member registry determines the user's chapter role and permissions.
 *
 * On first login of an allowlisted administrator without an existing member record,
 * the member is securely provisioned once with the Level 0 SUPER_ADMIN role.
 * Existing members are never role-escalated on subsequent logins.
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

    // 1. Look up chapter member by Better Auth user ID or normalized email
    let member = await db.query.chapterMembers.findFirst({
      where: or(
        eq(chapterMembers.authUserId, session.user.id),
        eq(chapterMembers.email, email)
      ),
    });

    // 2. Initial Bootstrap Check (Master Implementation Prompt v2, Sections 3 & 4)
    // If the authenticated user matches ADMIN_EMAIL_ALLOWLIST and no member record exists yet,
    // securely provision them with the SUPER_ADMIN role.
    if (!member && isAdminEmailAllowed(email)) {
      let superAdminRole = await db.query.chapterRoles.findFirst({
        where: eq(chapterRoles.key, "SUPER_ADMIN"),
      });

      // If SUPER_ADMIN role does not exist in DB yet, create it dynamically
      if (!superAdminRole) {
        const superAdminDef = DEFAULT_ROLES.find((r) => r.key === "SUPER_ADMIN")!;
        const [insertedRole] = await db
          .insert(chapterRoles)
          .values({
            id: "role_super_admin",
            key: "SUPER_ADMIN",
            displayName: superAdminDef.displayName,
            description: superAdminDef.description,
            permissionSet: superAdminDef.permissions,
            hierarchyLevel: 0,
            active: true,
          })
          .returning();
        superAdminRole = insertedRole;
      }

      if (superAdminRole) {
        try {
          const memberId = "mem_" + crypto.randomUUID().replaceAll("-", "").slice(0, 12);
          const [newMember] = await db
            .insert(chapterMembers)
            .values({
              id: memberId,
              authUserId: session.user.id,
              name: session.user.name || "ACM Chapter Administrator",
              email,
              avatarUrl: session.user.image,
              roleId: superAdminRole.id,
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
            action: "SUPER_ADMIN_BOOTSTRAP",
            targetType: "CHAPTER_MEMBER",
            targetId: newMember.id,
            details: {
              email,
              role: "SUPER_ADMIN",
              reason: "Initial admin bootstrap via ADMIN_EMAIL_ALLOWLIST",
              ipAddress: clientIp,
              userAgent: headerList.get("user-agent"),
            },
          });
        } catch (provisioningError) {
          // Handle concurrent login race on unique email constraint
          member = await db.query.chapterMembers.findFirst({
            where: eq(chapterMembers.email, email),
          });

          if (!member) {
            console.error(
              "Failed to provision allowlisted ACM administrator:",
              provisioningError
            );
            return null;
          }
        }
      }
    }

    if (!member || !member.isActive || member.status !== "ACTIVE") {
      return null;
    }

    // Link the Better Auth user ID if previously unlinked or update avatar
    if (!member.authUserId) {
      await db
        .update(chapterMembers)
        .set({
          authUserId: session.user.id,
          avatarUrl: session.user.image || member.avatarUrl,
          updatedAt: new Date(),
        })
        .where(eq(chapterMembers.id, member.id));

      member.authUserId = session.user.id;
    }

    // 3. Resolve role and its default permission bundle
    const role = await db.query.chapterRoles.findFirst({
      where: eq(chapterRoles.id, member.roleId),
    });

    if (!role || !role.active) {
      return null;
    }

    // 4. Resolve explicit member permissions that have not expired
    const explicitPerms = await db.query.memberPermissions.findMany({
      where: and(
        eq(memberPermissions.memberId, member.id),
        or(
          isNull(memberPermissions.expiresAt),
          gt(memberPermissions.expiresAt, new Date())
        )
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
    console.error("Error resolving authorized member in getAuthorizedMember:", error);
    return null;
  }
}

/**
 * Server-side authorization check.
 * Throws an Error if unauthenticated/unauthorized or lacking the required permission.
 */
export async function requirePermission(
  permission: Permission
): Promise<AuthorizedMemberContext> {
  const context = await getAuthorizedMember();

  if (!context) {
    throw new Error(
      "UNAUTHORIZED: You must be an active, authorized ACM BIT Mesra member to perform this action."
    );
  }

  // SUPER_ADMIN (hierarchy 0) or user holding the explicit permission
  if (context.role.hierarchyLevel === 0 || context.permissions.includes(permission)) {
    return context;
  }

  throw new Error(`FORBIDDEN: Missing required chapter permission '${permission}'.`);
}

/**
 * Server-side Super Admin check.
 * Throws an Error if unauthorized or not a SUPER_ADMIN.
 */
export async function requireSuperAdmin(): Promise<AuthorizedMemberContext> {
  const context = await getAuthorizedMember();

  if (!context) {
    throw new Error("UNAUTHORIZED: Session expired or unauthenticated.");
  }

  if (context.role.hierarchyLevel !== 0 && context.role.key !== "SUPER_ADMIN") {
    throw new Error("FORBIDDEN: This operation requires SUPER_ADMIN chapter governance authority.");
  }

  return context;
}
