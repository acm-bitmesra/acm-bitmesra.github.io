"use server";

import { db } from "@/db";
import { chapterResources, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requirePermission } from "@/lib/auth/session";
import { PERMISSIONS } from "@/lib/permissions/constants";
import { revalidatePath } from "next/cache";

export async function createChapterResourceAction(input: {
  title: string;
  slug: string;
  description: string;
  category: "ROADMAP" | "GUIDE" | "ACADEMIC_PYQ" | "COMPETITIVE_PROGRAMMING" | "SYSTEMS" | "CAREER" | "OPEN_SOURCE";
  type: "LINK" | "DOCUMENT" | "GITHUB_REPO" | "PDF";
  url: string;
  difficulty?: string;
  featured?: boolean;
  tags?: string[];
}) {
  const context = await requirePermission(PERMISSIONS.RESOURCES_CREATE);

  const cleanSlug = input.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const existing = await db.query.chapterResources.findFirst({
    where: eq(chapterResources.slug, cleanSlug),
  });

  if (existing) {
    throw new Error(`A resource with slug "${cleanSlug}" already exists.`);
  }

  const resId = `res_${cleanSlug.replace(/[^a-z0-9]/g, "_")}_${Date.now().toString(36)}`;

  const [newRes] = await db
    .insert(chapterResources)
    .values({
      id: resId,
      title: input.title.trim(),
      slug: cleanSlug,
      description: input.description.trim(),
      category: input.category,
      type: input.type,
      url: input.url.trim(),
      difficulty: input.difficulty || "ALL_LEVELS",
      featured: Boolean(input.featured),
      tags: input.tags || [],
      createdBy: context.member.id,
    })
    .returning();

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "RESOURCE_CREATED",
    targetType: "RESOURCE",
    targetId: newRes.id,
    details: { title: newRes.title, category: newRes.category },
  });

  revalidatePath("/resources");
  revalidatePath("/admin/resources");

  return { success: true, resourceId: newRes.id };
}

export async function updateChapterResourceAction(
  resourceId: string,
  input: Partial<{
    title: string;
    description: string;
    category: "ROADMAP" | "GUIDE" | "ACADEMIC_PYQ" | "COMPETITIVE_PROGRAMMING" | "SYSTEMS" | "CAREER" | "OPEN_SOURCE";
    type: "LINK" | "DOCUMENT" | "GITHUB_REPO" | "PDF";
    url: string;
    difficulty: string;
    featured: boolean;
    tags: string[];
  }>
) {
  const context = await requirePermission(PERMISSIONS.RESOURCES_EDIT);

  const updates: Partial<typeof chapterResources.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (input.title !== undefined) updates.title = input.title.trim();
  if (input.description !== undefined) updates.description = input.description.trim();
  if (input.category !== undefined) updates.category = input.category;
  if (input.type !== undefined) updates.type = input.type;
  if (input.url !== undefined) updates.url = input.url.trim();
  if (input.difficulty !== undefined) updates.difficulty = input.difficulty;
  if (input.featured !== undefined) updates.featured = input.featured;
  if (input.tags !== undefined) updates.tags = input.tags;

  await db.update(chapterResources).set(updates).where(eq(chapterResources.id, resourceId));

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "RESOURCE_UPDATED",
    targetType: "RESOURCE",
    targetId: resourceId,
    details: updates,
  });

  revalidatePath("/resources");
  revalidatePath("/admin/resources");

  return { success: true };
}

export async function deleteChapterResourceAction(resourceId: string) {
  const context = await requirePermission(PERMISSIONS.RESOURCES_DELETE);

  const res = await db.query.chapterResources.findFirst({
    where: eq(chapterResources.id, resourceId),
  });

  if (!res) {
    throw new Error("Resource not found.");
  }

  await db.delete(chapterResources).where(eq(chapterResources.id, resourceId));

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "RESOURCE_DELETED",
    targetType: "RESOURCE",
    targetId: resourceId,
    details: { title: res.title },
  });

  revalidatePath("/resources");
  revalidatePath("/admin/resources");

  return { success: true };
}
