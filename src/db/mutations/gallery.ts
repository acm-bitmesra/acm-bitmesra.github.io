"use server";

import { db } from "@/db";
import { chapterGallery, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requirePermission } from "@/lib/auth/session";
import { PERMISSIONS } from "@/lib/permissions/constants";
import { revalidatePath } from "next/cache";

export async function createGalleryItemAction(input: {
  title: string;
  caption?: string;
  imageUrl: string;
  category?: string;
  eventYear?: string;
  displayOrder?: number;
}) {
  const context = await requirePermission(PERMISSIONS.GALLERY_MANAGE);

  const [item] = await db
    .insert(chapterGallery)
    .values({
      id: `gal_${crypto.randomUUID().slice(0, 12)}`,
      title: input.title.trim(),
      caption: input.caption?.trim() || null,
      imageUrl: input.imageUrl.trim(),
      category: input.category || "EVENTS",
      eventYear: input.eventYear || "2026",
      displayOrder: input.displayOrder || 0,
    })
    .returning();

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "GALLERY_ITEM_CREATED",
    targetType: "GALLERY",
    targetId: item.id,
    details: { title: item.title, category: item.category },
  });

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return { success: true, id: item.id };
}

export async function deleteGalleryItemAction(id: string) {
  const context = await requirePermission(PERMISSIONS.GALLERY_MANAGE);

  await db.delete(chapterGallery).where(eq(chapterGallery.id, id));

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "GALLERY_ITEM_DELETED",
    targetType: "GALLERY",
    targetId: id,
    details: { deletedAt: new Date().toISOString() },
  });

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return { success: true };
}
