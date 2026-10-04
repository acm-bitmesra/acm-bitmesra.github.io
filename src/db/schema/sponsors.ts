import { pgTable, text, timestamp, boolean, integer, index } from "drizzle-orm/pg-core";

export type SponsorTier = "TITLE" | "PLATINUM" | "GOLD" | "SILVER" | "COMMUNITY" | "PARTNER";

export const chapterSponsors = pgTable(
  "chapter_sponsors",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    tier: text("tier").$type<SponsorTier>().default("COMMUNITY").notNull(),
    logoUrl: text("logo_url").notNull(),
    websiteUrl: text("website_url"),
    description: text("description"),
    year: text("year").default("2026").notNull(),
    active: boolean("active").default(true).notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("chapter_sponsors_tier_idx").on(table.tier),
    index("chapter_sponsors_active_idx").on(table.active),
  ]
);
