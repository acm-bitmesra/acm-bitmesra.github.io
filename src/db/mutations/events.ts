"use server";

import { db } from "@/db";
import { chapterEvents, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requirePermission } from "@/lib/auth/session";
import { PERMISSIONS } from "@/lib/permissions/constants";
import { revalidatePath } from "next/cache";

export async function createChapterEventAction(input: {
  title: string;
  slug: string;
  tagline?: string;
  description: string;
  category: "HACKATHON" | "CONTEST" | "WORKSHOP" | "TECH_TALK" | "FLAGSHIP";
  status: "UPCOMING" | "ONGOING" | "PAST" | "ARCHIVED";
  startDate: string;
  endDate?: string;
  location: string;
  isOnline: boolean;
  registrationUrl?: string;
  bannerUrl?: string;
  featured?: boolean;
  prizes?: string;
  tags?: string[];
}) {
  const context = await requirePermission(PERMISSIONS.EVENTS_CREATE);

  const cleanSlug = input.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const existing = await db.query.chapterEvents.findFirst({
    where: eq(chapterEvents.slug, cleanSlug),
  });

  if (existing) {
    throw new Error(`An event with slug "${cleanSlug}" already exists.`);
  }

  const eventId = `evt_${cleanSlug.replace(/[^a-z0-9]/g, "_")}_${Date.now().toString(36)}`;

  const [newEvent] = await db
    .insert(chapterEvents)
    .values({
      id: eventId,
      slug: cleanSlug,
      title: input.title.trim(),
      tagline: input.tagline?.trim() || null,
      description: input.description.trim(),
      category: input.category,
      status: input.status,
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      location: input.location.trim(),
      isOnline: input.isOnline,
      registrationUrl: input.registrationUrl?.trim() || null,
      bannerUrl: input.bannerUrl?.trim() || null,
      featured: Boolean(input.featured),
      prizes: input.prizes?.trim() || null,
      tags: input.tags || [],
      createdBy: context.member.id,
    })
    .returning();

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "EVENT_CREATED",
    targetType: "EVENT",
    targetId: newEvent.id,
    details: { title: newEvent.title, slug: newEvent.slug },
  });

  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath("/admin");

  return { success: true, eventId: newEvent.id, slug: newEvent.slug };
}

export async function updateChapterEventAction(
  eventId: string,
  input: Partial<{
    title: string;
    tagline: string;
    description: string;
    category: "HACKATHON" | "CONTEST" | "WORKSHOP" | "TECH_TALK" | "FLAGSHIP";
    status: "UPCOMING" | "ONGOING" | "PAST" | "ARCHIVED";
    startDate: string;
    endDate: string;
    location: string;
    isOnline: boolean;
    registrationUrl: string;
    bannerUrl: string;
    featured: boolean;
    prizes: string;
    tags: string[];
  }>
) {
  const context = await requirePermission(PERMISSIONS.EVENTS_EDIT);

  const updates: Partial<typeof chapterEvents.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (input.title !== undefined) updates.title = input.title.trim();
  if (input.tagline !== undefined) updates.tagline = input.tagline.trim();
  if (input.description !== undefined) updates.description = input.description.trim();
  if (input.category !== undefined) updates.category = input.category;
  if (input.status !== undefined) updates.status = input.status;
  if (input.startDate !== undefined) updates.startDate = new Date(input.startDate);
  if (input.endDate !== undefined) updates.endDate = input.endDate ? new Date(input.endDate) : null;
  if (input.location !== undefined) updates.location = input.location.trim();
  if (input.isOnline !== undefined) updates.isOnline = input.isOnline;
  if (input.registrationUrl !== undefined) updates.registrationUrl = input.registrationUrl.trim() || null;
  if (input.bannerUrl !== undefined) updates.bannerUrl = input.bannerUrl.trim() || null;
  if (input.featured !== undefined) updates.featured = input.featured;
  if (input.prizes !== undefined) updates.prizes = input.prizes.trim() || null;
  if (input.tags !== undefined) updates.tags = input.tags;

  await db.update(chapterEvents).set(updates).where(eq(chapterEvents.id, eventId));

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "EVENT_UPDATED",
    targetType: "EVENT",
    targetId: eventId,
    details: updates,
  });

  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath("/admin");

  return { success: true };
}

export async function deleteChapterEventAction(eventId: string) {
  const context = await requirePermission(PERMISSIONS.EVENTS_DELETE);

  const event = await db.query.chapterEvents.findFirst({
    where: eq(chapterEvents.id, eventId),
  });

  if (!event) {
    throw new Error("Event not found.");
  }

  await db.delete(chapterEvents).where(eq(chapterEvents.id, eventId));

  await db.insert(auditLogs).values({
    id: `audit_${crypto.randomUUID().slice(0, 12)}`,
    memberId: context.member.id,
    action: "EVENT_DELETED",
    targetType: "EVENT",
    targetId: eventId,
    details: { title: event.title, slug: event.slug },
  });

  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath("/admin");

  return { success: true };
}
