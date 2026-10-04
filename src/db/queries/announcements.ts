import { db } from "@/db";
import { chapterAnnouncements } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getAllChapterAnnouncements() {
  try {
    return await db.query.chapterAnnouncements.findMany({
      orderBy: [desc(chapterAnnouncements.createdAt)],
    });
  } catch (error) {
    console.error("Error fetching all announcements:", error);
    return [];
  }
}

export async function getActiveChapterAnnouncements() {
  try {
    return await db.query.chapterAnnouncements.findMany({
      where: eq(chapterAnnouncements.isActive, true),
      orderBy: [desc(chapterAnnouncements.priority), desc(chapterAnnouncements.createdAt)],
    });
  } catch (error) {
    console.error("Error fetching active announcements:", error);
    return [];
  }
}
