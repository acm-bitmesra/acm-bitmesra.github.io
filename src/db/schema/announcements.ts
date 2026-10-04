import { pgTable, text, timestamp, boolean, integer, index } from "drizzle-orm/pg-core";
import { chapterMembers } from "./members";

export type AnnouncementType = "INFO" | "WARNING" | "ALERT" | "SUCCESS";

export const chapterAnnouncements = pgTable(
  "chapter_announcements",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    linkUrl: text("link_url"),
    linkText: text("link_text"),
    type: text("type").$type<AnnouncementType>().default("INFO").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    priority: integer("priority").default(0).notNull(),
    startDate: timestamp("start_date").defaultNow().notNull(),
    endDate: timestamp("end_date"),
    createdBy: text("created_by").references(() => chapterMembers.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("chapter_announcements_active_idx").on(table.isActive),
    index("chapter_announcements_priority_idx").on(table.priority),
  ]
);
