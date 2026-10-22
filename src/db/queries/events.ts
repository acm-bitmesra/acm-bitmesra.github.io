import { db } from "@/db";
import { chapterEvents } from "@/db/schema";
import { desc, eq, or } from "drizzle-orm";
import { events } from "@/data/events";

export async function getAllChapterEvents() {
  try {
    return await db.query.chapterEvents.findMany({
      orderBy: [desc(chapterEvents.startDate)],
    });
  } catch (error) {
    console.error("Error fetching all chapter events:", error);
    return [];
  }
}

export async function getUpcomingChapterEvents() {
  try {
    return await db.query.chapterEvents.findMany({
      where: or(
        eq(chapterEvents.status, "UPCOMING"),
        eq(chapterEvents.status, "ONGOING")
      ),
      orderBy: [desc(chapterEvents.startDate)],
    });
  } catch (error) {
    console.error("Error fetching upcoming chapter events:", error);
    return [];
  }
}

export async function getChapterEventBySlug(slug: string) {
  try {
    const existing = await db.query.chapterEvents.findFirst({
      where: eq(chapterEvents.slug, slug),
    });
    if (existing) return existing;

    // Fallback: Check static events registry and auto-seed if present
    const staticEvent = events.find((e) => e.slug === slug);
    if (staticEvent) {
      const eventId = `evt_${staticEvent.slug.replace(/[^a-zA-Z0-9]/g, "_")}`;
      await db
        .insert(chapterEvents)
        .values({
          id: eventId,
          slug: staticEvent.slug,
          title: staticEvent.title,
          tagline: staticEvent.tagline || "",
          description: staticEvent.description,
          category: "FLAGSHIP",
          status:
            staticEvent.status === "upcoming"
              ? "UPCOMING"
              : staticEvent.status === "live"
              ? "ONGOING"
              : "PAST",
          startDate: new Date(staticEvent.date),
          endDate: staticEvent.endDate ? new Date(staticEvent.endDate) : null,
          location: staticEvent.location || "Online & BIT Mesra Campus, Ranchi",
          isOnline: Boolean(staticEvent.location?.includes("Online")),
          registrationUrl: staticEvent.registrationUrl || `/events/${staticEvent.slug}`,
          bannerUrl: staticEvent.coverImage || `/images/events/${staticEvent.slug}-og.png`,
          featured: Boolean(staticEvent.isFeatured),
          tags: staticEvent.tags || [],
        })
        .onConflictDoNothing();

      return await db.query.chapterEvents.findFirst({
        where: eq(chapterEvents.slug, slug),
      });
    }

    return null;
  } catch (error) {
    console.error("Error fetching chapter event by slug:", error);
    return null;
  }
}

