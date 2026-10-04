import { pgTable, text, timestamp, boolean, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";
import { chapterMembers } from "./members";

export type ResourceCategory =
  | "ROADMAP"
  | "GUIDE"
  | "ACADEMIC_PYQ"
  | "COMPETITIVE_PROGRAMMING"
  | "SYSTEMS"
  | "CAREER"
  | "OPEN_SOURCE";

export type ResourceType = "LINK" | "DOCUMENT" | "GITHUB_REPO" | "PDF";

export const chapterResources = pgTable(
  "chapter_resources",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    category: text("category").$type<ResourceCategory>().default("ROADMAP").notNull(),
    type: text("type").$type<ResourceType>().default("LINK").notNull(),
    url: text("url").notNull(),
    difficulty: text("difficulty").default("ALL_LEVELS").notNull(), // 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS'
    featured: boolean("featured").default(false).notNull(),
    tags: jsonb("tags").$type<string[]>().default([]).notNull(),
    createdBy: text("created_by").references(() => chapterMembers.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("chapter_resources_slug_idx").on(table.slug),
    index("chapter_resources_category_idx").on(table.category),
    index("chapter_resources_featured_idx").on(table.featured),
  ]
);
