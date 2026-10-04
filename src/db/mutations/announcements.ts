"use server";

import { db } from "@/db";
import { chapterAnnouncements, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requirePermission } from "@/lib/auth/session";
import { PERMISSIONS } from "@/lib/permissions/constants";
import { revalidatePath } from "next/cache";

export async function createAnnouncementAction(input: {
  title: string;
  message: string;
  linkUrl?: string;
  linkText?: string;
  type: "INFO" | "WARNING" | "ALERT" | "SUCCESS";
  isActive?: boolean;
  priority?: number;
}) {
  const context = await requirePermission(PERMISSIONS.ANNOUNCEMENTS_MANAGE);

  const [ann] = await db
    .insert(chapterAnnouncements)
    .values({
      id: `ann_${Date.now().toString(36)}`,
      title: input.title.trim(),
      message: input.message.trim(),
      linkUrl: input.linkUrl?.trim() || null,
      linkText: input.linkText?.trim() || null,
      type: input.type,
      isActive: input.isActive !== undefined ? input.isActive : true,
      priority: input.priority || 0,
      createdBy: context.member.id,
    })
    .returning();

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "ANNOUNCEMENT_CREATED",
    targetType: "ANNOUNCEMENT",
    targetId: ann.id,
    details: { title: ann.title },
  });

  revalidatePath("/");
  revalidatePath("/admin/announcements");
  revalidatePath("/admin");

  return { success: true, announcementId: ann.id };
}

export async function toggleAnnouncementActiveAction(announcementId: string, isActive: boolean) {
  const context = await requirePermission(PERMISSIONS.ANNOUNCEMENTS_MANAGE);

  await db
    .update(chapterAnnouncements)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(chapterAnnouncements.id, announcementId));

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "ANNOUNCEMENT_TOGGLED",
    targetType: "ANNOUNCEMENT",
    targetId: announcementId,
    details: { isActive },
  });

  revalidatePath("/");
  revalidatePath("/admin/announcements");
  revalidatePath("/admin");

  return { success: true };
}

export async function deleteAnnouncementAction(announcementId: string) {
  const context = await requirePermission(PERMISSIONS.ANNOUNCEMENTS_MANAGE);

  await db.delete(chapterAnnouncements).where(eq(chapterAnnouncements.id, announcementId));

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "ANNOUNCEMENT_DELETED",
    targetType: "ANNOUNCEMENT",
    targetId: announcementId,
    details: { deletedBy: context.member.id },
  });

  revalidatePath("/");
  revalidatePath("/admin/announcements");
  revalidatePath("/admin");

  return { success: true };
}
