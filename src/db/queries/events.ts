import { db } from "@/db";
import { chapterEvents } from "@/db/schema";
import { desc, eq, or } from "drizzle-orm";

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
    return await db.query.chapterEvents.findFirst({
      where: eq(chapterEvents.slug, slug),
    });
  } catch (error) {
    console.error("Error fetching chapter event by slug:", error);
    return null;
  }
}
