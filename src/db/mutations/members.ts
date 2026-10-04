"use server";

import { db } from "@/db";
import { chapterMembers, chapterRoles, memberPermissions, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requirePermission } from "@/lib/auth/session";
import { PERMISSIONS, Permission, canManageHierarchy } from "@/lib/permissions/constants";

/**
 * Adds an authorized member to the ACM chapter registry.
 * Requires: 'admin:manage_members'
 * Enforces hierarchy: Caller cannot assign a role higher or equal to their own tier.
 */
export async function addChapterMemberAction(input: {
  name: string;
  email: string;
  roleId: string;
  termStart?: string;
}) {
  const context = await requirePermission(PERMISSIONS.ADMIN_MANAGE_MEMBERS);
  const cleanEmail = input.email.trim().toLowerCase();

  const targetRole = await db.query.chapterRoles.findFirst({
    where: eq(chapterRoles.id, input.roleId),
  });

  if (!targetRole) {
    throw new Error("Specified role does not exist.");
  }

  // Hierarchy enforcement: Only SUPER_ADMIN (level 0) or strictly higher tier can appoint a role
  if (!canManageHierarchy(context.role.hierarchyLevel, targetRole.hierarchyLevel)) {
    throw new Error(
      `GOVERNANCE VIOLATION: You cannot appoint a role (${targetRole.displayName}) with higher or equal governance level than your own.`
    );
  }

  const existing = await db.query.chapterMembers.findFirst({
    where: eq(chapterMembers.email, cleanEmail),
  });

  if (existing) {
    throw new Error(`Member with email ${cleanEmail} is already registered in the chapter.`);
  }

  const [newMember] = await db
    .insert(chapterMembers)
    .values({
      id: `mem_${crypto.randomUUID().slice(0, 12)}`,
      name: input.name.trim(),
      email: cleanEmail,
      roleId: input.roleId,
      termStart: input.termStart || "2026-27",
      status: "ACTIVE",
      isActive: true,
    })
    .returning();

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "MEMBER_AUTHORIZED",
    targetType: "MEMBER",
    targetId: newMember.id,
    details: {
      name: newMember.name,
      email: newMember.email,
      roleId: newMember.roleId,
      roleKey: targetRole.key,
    },
  });

  return { success: true, memberId: newMember.id };
}

/**
 * Updates a member's role or active status.
 * Requires: 'admin:manage_members'
 * Zero-Trust & Hierarchy Enforcement:
 * - Cannot modify members of higher or equal governance tier.
 * - Cannot assign a role of higher or equal governance tier.
 */
export async function updateChapterMemberAction(input: {
  memberId: string;
  roleId?: string;
  status?: "ACTIVE" | "INACTIVE" | "ALUMNI";
  isActive?: boolean;
}) {
  const context = await requirePermission(PERMISSIONS.ADMIN_MANAGE_MEMBERS);

  const targetMember = await db.query.chapterMembers.findFirst({
    where: eq(chapterMembers.id, input.memberId),
  });

  if (!targetMember) {
    throw new Error("Target chapter member not found.");
  }

  const targetRole = await db.query.chapterRoles.findFirst({
    where: eq(chapterRoles.id, targetMember.roleId),
  });

  if (targetRole && !canManageHierarchy(context.role.hierarchyLevel, targetRole.hierarchyLevel)) {
    throw new Error(
      `GOVERNANCE RESTRICTION: You cannot modify a member with equal or higher governance rank (${targetRole.displayName}).`
    );
  }

  if (input.roleId) {
    const newRole = await db.query.chapterRoles.findFirst({
      where: eq(chapterRoles.id, input.roleId),
    });

    if (!newRole) {
      throw new Error("New appointed role does not exist.");
    }

    if (!canManageHierarchy(context.role.hierarchyLevel, newRole.hierarchyLevel)) {
      throw new Error(
        `GOVERNANCE RESTRICTION: You cannot promote a member to a role (${newRole.displayName}) with higher or equal rank than your own.`
      );
    }
  }

  const updates: Partial<typeof chapterMembers.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (input.roleId) updates.roleId = input.roleId;
  if (input.status) updates.status = input.status;
  if (input.isActive !== undefined) updates.isActive = input.isActive;

  await db.update(chapterMembers).set(updates).where(eq(chapterMembers.id, input.memberId));

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "MEMBER_STATUS_CHANGED",
    targetType: "MEMBER",
    targetId: input.memberId,
    details: updates,
  });

  return { success: true };
}

/**
 * Grants an explicit permission to a member without changing their display role.
 * Requires: 'admin:manage_members'
 */
export async function grantMemberPermissionAction(input: {
  memberId: string;
  permission: Permission;
  expiresAt?: Date | null;
}) {
  const context = await requirePermission(PERMISSIONS.ADMIN_MANAGE_MEMBERS);

  const [perm] = await db
    .insert(memberPermissions)
    .values({
      id: `perm_${crypto.randomUUID().slice(0, 12)}`,
      memberId: input.memberId,
      permission: input.permission,
      grantedBy: context.member.id,
      expiresAt: input.expiresAt || null,
    })
    .returning();

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "PERMISSION_GRANTED",
    targetType: "PERMISSION",
    targetId: perm.id,
    details: { memberId: input.memberId, permission: input.permission },
  });

  return { success: true, permissionId: perm.id };
}

/**
 * Revokes an explicit permission from a member.
 * Requires: 'admin:manage_members'
 */
export async function revokeMemberPermissionAction(permissionId: string) {
  const context = await requirePermission(PERMISSIONS.ADMIN_MANAGE_MEMBERS);

  await db.delete(memberPermissions).where(eq(memberPermissions.id, permissionId));

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "PERMISSION_REVOKED",
    targetType: "PERMISSION",
    targetId: permissionId,
    details: { revokedBy: context.member.id },
  });

  return { success: true };
}
