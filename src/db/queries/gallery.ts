import { db } from "@/db";
import { chapterGallery } from "@/db/schema";
import { asc, desc } from "drizzle-orm";
import { galleryItems } from "@/data/gallery";

export async function getAllChapterGalleryItems() {
  try {
    const items = await db.query.chapterGallery.findMany({
      orderBy: [asc(chapterGallery.displayOrder), desc(chapterGallery.createdAt)],
    });

    if (items.length > 0) return items;

    // Fallback seed representation
    return galleryItems.map((g, idx) => ({
      id: g.id,
      title: g.title,
      caption: g.description,
      imageUrl: "/icon.svg",
      eventYear: "2026",
      category: g.category.toUpperCase(),
      displayOrder: idx,
      createdAt: new Date(),
    }));
  } catch (error) {
    console.error("Failed to fetch gallery from database, using fallback:", error);
    return galleryItems.map((g, idx) => ({
      id: g.id,
      title: g.title,
      caption: g.description,
      imageUrl: "/icon.svg",
      eventYear: "2026",
      category: g.category.toUpperCase(),
      displayOrder: idx,
      createdAt: new Date(),
    }));
  }
}

export const getAllGalleryItems = getAllChapterGalleryItems;
