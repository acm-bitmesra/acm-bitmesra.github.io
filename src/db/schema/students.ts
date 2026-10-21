import { pgTable, text, timestamp, boolean, integer, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "./auth";

/**
 * Academic Batches / Cohorts Registry (Section 10.4 & 13)
 * Dynamic, database-backed cohort manager supporting graduation cycles, programs, and branch options.
 */
export const academicBatches = pgTable(
  "academic_batches",
  {
    id: text("id").primaryKey(), // e.g. 'batch_2024_2028'
    label: text("label").notNull().unique(), // e.g. 'Batch of 2028 (2024–2028)'
    startYear: integer("start_year").notNull(),
    endYear: integer("end_year").notNull(),
    program: text("program").default("B.Tech").notNull(), // 'B.Tech', 'M.Tech', 'MCA', 'B.Sc'
    isActive: boolean("is_active").default(true).notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("academic_batches_active_idx").on(table.isActive),
    index("academic_batches_display_order_idx").on(table.displayOrder),
  ]
);

/**
 * Student Developer Profiles (Section 6 & 13)
 * Self-managed developer identities, public portfolio pages (/u/[slug]), and customizable blocks.
 */
export const studentProfiles = pgTable(
  "student_profiles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().unique(), // URL path e.g. /u/shaswatraj
    displayName: text("display_name").notNull(),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    academicProgram: text("academic_program").default("B.Tech"),
    department: text("department").default("Computer Science & Engineering"),
    batchId: text("batch_id").references(() => academicBatches.id, { onDelete: "set null" }),
    skills: jsonb("skills").$type<string[]>().default([]).notNull(),
    interests: jsonb("interests").$type<string[]>().default([]).notNull(),
    customBioMarkdown: text("custom_bio_markdown"),
    portfolioBlocks: jsonb("portfolio_blocks").$type<Array<{
      type: "intro" | "about" | "skills" | "projects" | "accounts" | "achievements" | "blogs" | "settings";
      title?: string;
      content?: unknown;
    }>>().default([]).notNull(),
    isPublic: boolean("is_public").default(true).notNull(),
    isPublished: boolean("is_published").default(true).notNull(),
    theme: text("theme").default("minimal").notNull(), // 'minimal', 'terminal', 'editorial'
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("student_profiles_user_idx").on(table.userId),
    uniqueIndex("student_profiles_slug_idx").on(table.slug),
    index("student_profiles_batch_idx").on(table.batchId),
    index("student_profiles_is_public_idx").on(table.isPublic),
  ]
);

export interface PinnedProject {
  id: string;
  title: string;
  description: string;
  demoUrl?: string;
  repoUrl?: string;
  tags: string[];
  imageUrl?: string;
  showImage?: boolean;
  order: number;
}

export interface PersonalBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readingTimeMinutes?: number;
  tags: string[];
}

export interface ProfileCustomSettings {
  showEmail?: boolean;
  resumeUrl?: string;
  showGithubStats?: boolean;
  showSkillIcons?: boolean;
  statsTheme?: string;
}

export type ConnectedProvider =
  | "github"
  | "codeforces"
  | "leetcode"
  | "gitlab"
  | "codepen"
  | "devto"
  | "portfolio"
  | "linkedin"
  | "hashnode"
  | "codechef"
  | "peerlist"
  | "notionfolio";

/**
 * External Developer & Coding Accounts Registry (Section 5, 8 & 13)
 * Distinguishes cryptographically verified OAuth-linked accounts (GitHub) from user-entered links.
 */
export const connectedAccounts = pgTable(
  "connected_accounts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    provider: text("provider").$type<ConnectedProvider>().notNull(),
    providerUserId: text("provider_user_id"), // e.g. Stable numeric GitHub User ID
    handle: text("handle").notNull(), // User handle e.g. 'torvalds'
    profileUrl: text("profile_url").notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),
    scopes: jsonb("scopes").$type<string[]>().default([]).notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}).notNull(),
    lastSyncedAt: timestamp("last_synced_at"),
    syncStatus: text("sync_status").$type<"SUCCESS" | "FAILED" | "PENDING">().default("PENDING").notNull(),
    syncError: text("sync_error"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("connected_accounts_user_idx").on(table.userId),
    index("connected_accounts_provider_idx").on(table.provider),
    uniqueIndex("connected_accounts_user_provider_idx").on(table.userId, table.provider),
  ]
);
