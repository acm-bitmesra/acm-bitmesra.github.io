import { pgTable, text, timestamp, boolean, integer, jsonb, index } from "drizzle-orm/pg-core";

/**
 * Chapter URL Redirects Table (Section 93)
 */
export const chapterRedirects = pgTable(
  "chapter_redirects",
  {
    id: text("id").primaryKey(),
    sourcePath: text("source_path").notNull().unique(), // e.g. '/hackabit2024'
    targetUrl: text("target_url").notNull(), // e.g. '/events/hack-a-bit'
    statusCode: integer("status_code").default(307).notNull(), // 301, 302, 307, 308
    active: boolean("active").default(true).notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("chapter_redirects_source_idx").on(table.sourcePath),
    index("chapter_redirects_active_idx").on(table.active),
  ]
);

/**
 * Chapter Media Library Table (Section 81 & 82)
 */
export const chapterMedia = pgTable(
  "chapter_media",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").default(0).notNull(),
    altText: text("alt_text"),
    caption: text("caption"),
    category: text("category").default("GENERAL").notNull(), // 'EVENTS', 'WORKSHOPS', 'ROSTER', 'GENERAL'
    uploadedBy: text("uploaded_by"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("chapter_media_category_idx").on(table.category),
    index("chapter_media_created_at_idx").on(table.createdAt),
  ]
);

/**
 * Chapter Security Alerts & Threat Engine (Section 48-51)
 */
export const securityAlerts = pgTable(
  "security_alerts",
  {
    id: text("id").primaryKey(),
    severity: text("severity").$type<"INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL">().default("INFO").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    sourceIp: text("source_ip"),
    targetUserId: text("target_user_id"),
    status: text("status").$type<"OPEN" | "RESOLVED" | "DISMISSED">().default("OPEN").notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("security_alerts_severity_idx").on(table.severity),
    index("security_alerts_status_idx").on(table.status),
    index("security_alerts_created_at_idx").on(table.createdAt),
  ]
);
