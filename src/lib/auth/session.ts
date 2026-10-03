import { headers } from "next/headers";
import { auth } from "./auth";
import { db } from "@/db";
import { chapterMembers, chapterRoles, memberPermissions, auditLogs } from "@/db/schema";
import { eq, and, gt, or, isNull } from "drizzle-orm";
import { type Permission } from "../permissions/constants";

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
 * Authentication alone is NOT authorization:
 * A user must exist in `chapter_members` and have `isActive = true`.
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

    const email = session.user.email.toLowerCase();

    // 1. Look up chapter member by authUserId or email
    let member = await db.query.chapterMembers.findFirst({
      where: or(
        eq(chapterMembers.authUserId, session.user.id),
        eq(chapterMembers.email, email)
      ),
    });

    // 2. Initial Bootstrap Check (Section 50)
    // If the authenticated user matches BOOTSTRAP_ADMIN_EMAIL and no member exists yet,
    // automatically provision them as President to bootstrap the chapter.
    const bootstrapEmail = process.env.BOOTSTRAP_ADMIN_EMAIL?.toLowerCase();
    if (!member && bootstrapEmail && email === bootstrapEmail) {
      const presidentRole = await db.query.chapterRoles.findFirst({
        where: eq(chapterRoles.key, "PRESIDENT"),
      });

      if (presidentRole) {
        const [newMember] = await db
          .insert(chapterMembers)
          .values({
            id: `mem_${crypto.randomUUID().slice(0, 12)}`,
            authUserId: session.user.id,
            name: session.user.name || "Chapter Administrator",
            email: email,
            avatarUrl: session.user.image,
            roleId: presidentRole.id,
            status: "ACTIVE",
            termStart: "2026-27",
            isActive: true,
          })
          .returning();

        member = newMember;

        await db.insert(auditLogs).values({
          id: `audit_${crypto.randomUUID().slice(0, 12)}`,
          memberId: newMember.id,
          action: "MEMBER_AUTHORIZED",
          targetType: "BOOTSTRAP",
          targetId: newMember.id,
          details: { email, role: "PRESIDENT", reason: "Initial admin bootstrap via environment" },
        });
      }
    }

    if (!member || !member.isActive || member.status !== "ACTIVE") {
      return null;
    }

    // Link authUserId if previously unlinked
    if (!member.authUserId) {
      await db
        .update(chapterMembers)
        .set({ authUserId: session.user.id, avatarUrl: session.user.image || member.avatarUrl })
        .where(eq(chapterMembers.id, member.id));
      member.authUserId = session.user.id;
    }

    // 3. Resolve role and bundle of permissions
    const role = await db.query.chapterRoles.findFirst({
      where: eq(chapterRoles.id, member.roleId),
    });

    if (!role || !role.active) {
      return null;
    }

    // 4. Resolve explicit permissions that haven't expired
    const explicitPerms = await db.query.memberPermissions.findMany({
      where: and(
        eq(memberPermissions.memberId, member.id),
        or(isNull(memberPermissions.expiresAt), gt(memberPermissions.expiresAt, new Date()))
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
 * Throws an Error if unauthorized or lacking the required permission.
 */
export async function requirePermission(
  permission: Permission
): Promise<AuthorizedMemberContext> {
  const context = await getAuthorizedMember();

  if (!context) {
    throw new Error("UNAUTHORIZED: You must be an active, authorized ACM BIT Mesra member to perform this action.");
  }

  if (!context.permissions.includes(permission)) {
    throw new Error(`FORBIDDEN: Missing required chapter permission '${permission}'.`);
  }

  return context;
}
