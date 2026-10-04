import { db } from "@/db";
import { chapterSponsors } from "@/db/schema";
import { asc, desc } from "drizzle-orm";
import { institutionalPartners } from "@/data/sponsors";

export async function getAllChapterSponsors() {
  try {
    const sponsors = await db.query.chapterSponsors.findMany({
      orderBy: [asc(chapterSponsors.displayOrder), desc(chapterSponsors.createdAt)],
    });

    if (sponsors.length > 0) return sponsors;

    // Fallback seed representation
    return institutionalPartners.map((p, idx) => ({
      id: `sp_${idx + 1}`,
      name: p.name,
      tier: "TITLE" as const,
      logoUrl: "/icon.svg",
      websiteUrl: p.url,
      description: p.description,
      year: "2026",
      active: true,
      displayOrder: idx,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  } catch (error) {
    console.error("Failed to fetch chapter sponsors from database, using fallback:", error);
    return institutionalPartners.map((p, idx) => ({
      id: `sp_${idx + 1}`,
      name: p.name,
      tier: "TITLE" as const,
      logoUrl: "/icon.svg",
      websiteUrl: p.url,
      description: p.description,
      year: "2026",
      active: true,
      displayOrder: idx,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }
}

export const getAllSponsors = getAllChapterSponsors;
