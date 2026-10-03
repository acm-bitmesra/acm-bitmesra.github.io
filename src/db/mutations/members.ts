"use server";

import { db } from "@/db";
import { chapterMembers, memberPermissions, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requirePermission } from "@/lib/auth/session";
import { PERMISSIONS, Permission } from "@/lib/permissions/constants";

/**
 * Adds an authorized member to the ACM allowlist.
 * Requires: 'admin:manage_members'
 */
export async function addChapterMemberAction(input: {
  name: string;
  email: string;
  roleId: string;
  termStart?: string;
}) {
  const context = await requirePermission(PERMISSIONS.ADMIN_MANAGE_MEMBERS);

  const cleanEmail = input.email.trim().toLowerCase();

  const existing = await db.query.chapterMembers.findFirst({
    where: eq(chapterMembers.email, cleanEmail),
  });

  if (existing) {
    throw new Error(`Member with email ${cleanEmail} is already registered.`);
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
    details: { name: newMember.name, email: newMember.email, roleId: newMember.roleId },
  });

  return { success: true, memberId: newMember.id };
}

/**
 * Updates a member's role or active status.
 * Requires: 'admin:manage_members'
 */
export async function updateChapterMemberAction(input: {
  memberId: string;
  roleId?: string;
  status?: "ACTIVE" | "INACTIVE" | "ALUMNI";
  isActive?: boolean;
}) {
  const context = await requirePermission(PERMISSIONS.ADMIN_MANAGE_MEMBERS);

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
    action: "MEMBER_AUTHORIZED",
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

  return { success: true };
}
