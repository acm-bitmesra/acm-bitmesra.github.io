import { pgTable, text, timestamp, integer, index } from "drizzle-orm/pg-core";

export const chapterGallery = pgTable(
  "chapter_gallery",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    caption: text("caption"),
    imageUrl: text("imageUrl").notNull(),
    eventYear: text("event_year").default("2026").notNull(),
    category: text("category").default("EVENTS").notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("chapter_gallery_year_idx").on(table.eventYear),
    index("chapter_gallery_category_idx").on(table.category),
  ]
);
