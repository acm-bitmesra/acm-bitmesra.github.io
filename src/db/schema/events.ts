import { pgTable, text, timestamp, boolean, integer, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";
import { chapterMembers } from "./members";

export type EventCategory = "HACKATHON" | "CONTEST" | "WORKSHOP" | "TECH_TALK" | "FLAGSHIP";
export type EventStatus = "UPCOMING" | "ONGOING" | "PAST" | "ARCHIVED";

export const chapterEvents = pgTable(
  "chapter_events",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    tagline: text("tagline"),
    description: text("description").notNull(),
    category: text("category").$type<EventCategory>().default("HACKATHON").notNull(),
    status: text("status").$type<EventStatus>().default("UPCOMING").notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    location: text("location").notNull(),
    isOnline: boolean("is_online").default(false).notNull(),
    registrationUrl: text("registration_url"),
    bannerUrl: text("banner_url"),
    featured: boolean("featured").default(false).notNull(),
    maxParticipants: integer("max_participants"),
    prizes: text("prizes"),
    tags: jsonb("tags").$type<string[]>().default([]).notNull(),
    createdBy: text("created_by").references(() => chapterMembers.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("chapter_events_slug_idx").on(table.slug),
    index("chapter_events_status_idx").on(table.status),
    index("chapter_events_start_date_idx").on(table.startDate),
    index("chapter_events_featured_idx").on(table.featured),
  ]
);
