import { db } from "@/db";
import { chapterEvents, eventRegistrations } from "@/db/schema";
import { desc, eq, or, sql } from "drizzle-orm";
import { events } from "@/data/events";

export async function getAllChapterEvents() {
  try {
    let allEvents = await db.query.chapterEvents.findMany({
      orderBy: [desc(chapterEvents.startDate)],
    });

    // Auto-seed any static events not yet present in the DB
    const existingSlugs = new Set(allEvents.map((e) => e.slug));
    const missingEvents = events.filter((e) => !existingSlugs.has(e.slug));

    if (missingEvents.length > 0) {
      for (const staticEvent of missingEvents) {
        const eventId = `evt_${staticEvent.slug.replace(/[^a-zA-Z0-9]/g, "_")}`;
        await db
          .insert(chapterEvents)
          .values({
            id: eventId,
            slug: staticEvent.slug,
            title: staticEvent.title,
            tagline: staticEvent.tagline || "",
            description: staticEvent.description,
            category:
              staticEvent.category === "Workshop"
                ? "WORKSHOP"
                : staticEvent.category === "Hackathon"
                ? "HACKATHON"
                : staticEvent.category === "Coding Contest"
                ? "CONTEST"
                : "FLAGSHIP",
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
            maxParticipants: staticEvent.maxParticipants || null,
            tags: staticEvent.tags || [],
          })
          .onConflictDoNothing();
      }

      allEvents = await db.query.chapterEvents.findMany({
        orderBy: [desc(chapterEvents.startDate)],
      });
    }

    // Query registration counts for each event
    const regCounts = await db
      .select({
        eventId: eventRegistrations.eventId,
        count: sql<number>`count(*)::int`,
      })
      .from(eventRegistrations)
      .groupBy(eventRegistrations.eventId);

    const countMap = new Map<string, number>();
    for (const item of regCounts) {
      countMap.set(item.eventId, Number(item.count || 0));
    }

    return allEvents.map((evt) => ({
      ...evt,
      registrationCount: countMap.get(evt.id) || 0,
    }));
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
    const staticEvent = events.find((e) => e.slug === slug);
    const existing = await db.query.chapterEvents.findFirst({
      where: eq(chapterEvents.slug, slug),
    });

    if (existing) {
      // Sync static definition if status, title, dates or limits were updated
      const expectedStatus = staticEvent
        ? staticEvent.status === "upcoming"
          ? "UPCOMING"
          : staticEvent.status === "live"
          ? "ONGOING"
          : "PAST"
        : null;

      if (
        staticEvent &&
        expectedStatus &&
        (existing.status !== expectedStatus ||
          existing.title !== staticEvent.title ||
          existing.location !== (staticEvent.location || "Online & BIT Mesra Campus, Ranchi") ||
          existing.startDate.toISOString().slice(0, 10) !== staticEvent.date ||
          existing.maxParticipants !== (staticEvent.maxParticipants || null))
      ) {
        await db
          .update(chapterEvents)
          .set({
            title: staticEvent.title,
            description: staticEvent.description,
            category:
              staticEvent.category === "Workshop"
                ? "WORKSHOP"
                : staticEvent.category === "Hackathon"
                ? "HACKATHON"
                : staticEvent.category === "Coding Contest"
                ? "CONTEST"
                : "FLAGSHIP",
            status: expectedStatus,
            startDate: new Date(staticEvent.date),
            endDate: staticEvent.endDate ? new Date(staticEvent.endDate) : null,
            location: staticEvent.location || "Online & BIT Mesra Campus, Ranchi",
            maxParticipants: staticEvent.maxParticipants || null,
            updatedAt: new Date(),
          })
          .where(eq(chapterEvents.id, existing.id));

        return await db.query.chapterEvents.findFirst({
          where: eq(chapterEvents.slug, slug),
        });
      }

      return existing;
    }

    // Fallback: Check static events registry and auto-seed if present
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
          category:
            staticEvent.category === "Workshop"
              ? "WORKSHOP"
              : staticEvent.category === "Hackathon"
              ? "HACKATHON"
              : staticEvent.category === "Coding Contest"
              ? "CONTEST"
              : "FLAGSHIP",
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
          maxParticipants: staticEvent.maxParticipants || null,
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


