import { db } from "@/db";
import { chapterResources } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getAllChapterResources() {
  try {
    return await db.query.chapterResources.findMany({
      orderBy: [desc(chapterResources.createdAt)],
    });
  } catch (error) {
    console.error("Error fetching all chapter resources:", error);
    return [];
  }
}

export async function getFeaturedChapterResources() {
  try {
    return await db.query.chapterResources.findMany({
      where: eq(chapterResources.featured, true),
      orderBy: [desc(chapterResources.createdAt)],
    });
  } catch (error) {
    console.error("Error fetching featured chapter resources:", error);
    return [];
  }
}
