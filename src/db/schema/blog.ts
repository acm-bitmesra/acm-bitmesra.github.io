import { pgTable, text, timestamp, boolean, integer, jsonb, index, uniqueIndex, bigint } from "drizzle-orm/pg-core";
import { chapterMembers } from "./members";

export type BlogPostStatus = "DRAFT" | "IN_REVIEW" | "APPROVED" | "PUBLISHED" | "ARCHIVED";

/**
 * Canonical Blog Posts
 * Stores technical articles, essays, and notes produced by ACM BIT Mesra.
 */
export const blogPosts = pgTable(
  "blog_posts",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    excerpt: text("excerpt").notNull(),
    contentMarkdown: text("content_markdown").notNull(),
    coverImageUrl: text("cover_image_url"),
    coverImageAlt: text("cover_image_alt"),
    category: text("category").notNull(), // e.g. 'Engineering', 'Competitive Programming', 'Research', 'Systems', 'Open Source'
    status: text("status").$type<BlogPostStatus>().default("DRAFT").notNull(),
    featured: boolean("featured").default(false).notNull(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    canonicalUrl: text("canonical_url"),
    readingTimeMinutes: integer("reading_time_minutes").default(5).notNull(),
    createdBy: text("created_by")
      .notNull()
      .references(() => chapterMembers.id),
    lastEditedBy: text("last_edited_by").references(() => chapterMembers.id),
    publishedBy: text("published_by").references(() => chapterMembers.id),
    submittedAt: timestamp("submitted_at"),
    publishedAt: timestamp("published_at"),
    archivedAt: timestamp("archived_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("blog_posts_slug_idx").on(table.slug),
    index("blog_posts_status_idx").on(table.status),
    index("blog_posts_published_at_idx").on(table.publishedAt),
    index("blog_posts_created_at_idx").on(table.createdAt),
    index("blog_posts_category_idx").on(table.category),
    index("blog_posts_featured_idx").on(table.featured),
  ]
);

/**
 * Historical Author & Role Snapshot
 * CRITICAL: When an article is published, stores an immutable snapshot
 * of the author's public identity and ACM role so future promotions do not rewrite history.
 */
export const blogPostAuthors = pgTable(
  "blog_post_authors",
  {
    id: text("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    memberId: text("member_id")
      .notNull()
      .references(() => chapterMembers.id),
    authorOrder: integer("author_order").default(0).notNull(),
    authorNameSnapshot: text("author_name_snapshot").notNull(), // e.g. "Shaswat Raj"
    authorRoleSnapshot: text("author_role_snapshot").notNull(), // e.g. "Joint Secretary · ACM BIT Mesra"
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("blog_post_authors_post_idx").on(table.postId),
    index("blog_post_authors_member_idx").on(table.memberId),
  ]
);

/**
 * Canonical Blog Tags
 */
export const blogTags = pgTable(
  "blog_tags",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("blog_tags_slug_idx").on(table.slug)]
);

/**
 * Tag Junction Table
 */
export const blogPostTags = pgTable(
  "blog_post_tags",
  {
    id: text("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => blogTags.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("blog_post_tags_post_idx").on(table.postId),
    index("blog_post_tags_tag_idx").on(table.tagId),
  ]
);

/**
 * Historical Slugs
 * Retains past slugs when an article slug is renamed, allowing clean 301/308 redirects.
 */
export const blogPostSlugs = pgTable(
  "blog_post_slugs",
  {
    id: text("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("blog_post_slugs_slug_idx").on(table.slug),
    index("blog_post_slugs_post_idx").on(table.postId),
  ]
);

/**
 * Audit Trail & Article Revision History
 */
export const blogPostRevisions = pgTable(
  "blog_post_revisions",
  {
    id: text("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    editorId: text("editor_id")
      .notNull()
      .references(() => chapterMembers.id),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    contentMarkdown: text("content_markdown").notNull(),
    changeNote: text("change_note"),
    changedAt: timestamp("changed_at").defaultNow().notNull(),
  },
  (table) => [index("blog_post_revisions_post_idx").on(table.postId)]
);

/**
 * Security & Governance Audit Logs
 */
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    memberId: text("member_id").references(() => chapterMembers.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    targetType: text("target_type"), // 'POST', 'MEMBER', 'ROLE', 'AUTH'
    targetId: text("target_id"),
    details: jsonb("details"),
    ipAddress: text("ip_address"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("audit_logs_member_idx").on(table.memberId),
    index("audit_logs_action_idx").on(table.action),
    index("audit_logs_created_at_idx").on(table.createdAt),
  ]
);


/**
 * Privacy-conscious per-article view totals.
 * Slugs keep static fallback articles countable too.
 * No IP address, user agent, cookie, or visitor identifier is stored.
 */
export const blogPageViews = pgTable("blog_page_views", {
  slug: text("slug").primaryKey(),
  viewCount: bigint("view_count", { mode: "number" }).default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
