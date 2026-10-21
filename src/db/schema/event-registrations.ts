import { pgTable, text, timestamp, boolean, integer, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { chapterEvents } from "./events";
import { chapterMembers } from "./members";

/**
 * Event Teams (Section 7.3)
 */
export const eventTeams = pgTable(
  "event_teams",
  {
    id: text("id").primaryKey(),
    eventId: text("event_id")
      .notNull()
      .references(() => chapterEvents.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    joinCode: text("join_code").notNull().unique(), // e.g. 'HAB-8492'
    leaderUserId: text("leader_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    isLocked: boolean("is_locked").default(false).notNull(),
    maxSize: integer("max_size").default(4).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("event_teams_event_idx").on(table.eventId),
    uniqueIndex("event_teams_join_code_idx").on(table.joinCode),
  ]
);

/**
 * Event Team Members (Section 7.3)
 */
export const eventTeamMembers = pgTable(
  "event_team_members",
  {
    id: text("id").primaryKey(),
    teamId: text("team_id")
      .notNull()
      .references(() => eventTeams.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").$type<"LEADER" | "MEMBER">().default("MEMBER").notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("event_team_members_unique_idx").on(table.teamId, table.userId),
    index("event_team_members_user_idx").on(table.userId),
  ]
);

export type RegistrationStatus =
  | "REGISTERED"
  | "WAITLISTED"
  | "CANCELLED"
  | "CHECKED_IN"
  | "COMPLETED"
  | "NO_SHOW";

/**
 * Event Registrations (Section 7.2)
 * Manages participant entry, capacity locks, check-ins, and team linkages.
 */
export const eventRegistrations = pgTable(
  "chapter_event_registrations",
  {
    id: text("id").primaryKey(),
    eventId: text("event_id")
      .notNull()
      .references(() => chapterEvents.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: text("status").$type<RegistrationStatus>().default("REGISTERED").notNull(),
    teamId: text("team_id").references(() => eventTeams.id, { onDelete: "set null" }),
    customAnswers: jsonb("custom_answers").$type<Record<string, unknown>>().default({}).notNull(),
    registeredAt: timestamp("registered_at").defaultNow().notNull(),
    checkedInAt: timestamp("checked_in_at"),
    notes: text("notes"),
  },
  (table) => [
    uniqueIndex("chapter_event_registrations_user_event_idx").on(table.eventId, table.userId),
    index("chapter_event_registrations_status_idx").on(table.status),
    index("chapter_event_registrations_event_idx").on(table.eventId),
  ]
);

/**
 * Event Project Deliverables & Submissions (Section 7.4)
 */
export const eventSubmissions = pgTable(
  "event_submissions",
  {
    id: text("id").primaryKey(),
    eventId: text("event_id")
      .notNull()
      .references(() => chapterEvents.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    teamId: text("team_id").references(() => eventTeams.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    description: text("description"),
    projectUrl: text("project_url"),
    repoUrl: text("repo_url"),
    demoUrl: text("demo_url"),
    status: text("status").$type<"SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED">().default("SUBMITTED").notNull(),
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("event_submissions_event_idx").on(table.eventId),
    index("event_submissions_user_idx").on(table.userId),
  ]
);

/**
 * Event Evaluation Rubrics (Section 9.5)
 */
export const eventRubrics = pgTable(
  "event_rubrics",
  {
    id: text("id").primaryKey(),
    eventId: text("event_id")
      .notNull()
      .references(() => chapterEvents.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    version: integer("version").default(1).notNull(),
    criteria: jsonb("criteria").$type<Array<{
      key: string;
      label: string;
      maxPoints: number;
      weight: number;
      description?: string;
    }>>().default([]).notNull(),
    totalMaxScore: integer("total_max_score").default(100).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("event_rubrics_event_idx").on(table.eventId),
  ]
);

/**
 * GitHub Contribution Scan Jobs (Section 9.1 - 9.3)
 */
export const contributionScanJobs = pgTable(
  "contribution_scan_jobs",
  {
    id: text("id").primaryKey(),
    eventId: text("event_id")
      .notNull()
      .references(() => chapterEvents.id, { onDelete: "cascade" }),
    scanConfig: jsonb("scan_config").$type<{
      allowedRepos: string[]; // e.g. ["acm-bitmesra/acm-bitmesra.github.io"]
      startDate: string; // ISO
      endDate: string; // ISO
      acceptedStates: Array<"OPEN" | "MERGED" | "CLOSED">;
      requireMerged: boolean;
    }>().notNull(),
    status: text("status").$type<"PENDING" | "RUNNING" | "COMPLETED" | "FAILED">().default("PENDING").notNull(),
    totalCandidatesFound: integer("total_candidates_found").default(0).notNull(),
    error: text("error"),
    startedAt: timestamp("started_at"),
    finishedAt: timestamp("finished_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("contribution_scan_jobs_event_idx").on(table.eventId),
    index("contribution_scan_jobs_status_idx").on(table.status),
  ]
);

export type CandidateReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "DISQUALIFIED";

/**
 * Contribution Candidates (Section 9.2 - 9.4)
 * Public pull requests discovered for registered participants during a challenge scan.
 */
export const contributionCandidates = pgTable(
  "contribution_candidates",
  {
    id: text("id").primaryKey(),
    jobId: text("job_id").references(() => contributionScanJobs.id, { onDelete: "cascade" }),
    eventId: text("event_id")
      .notNull()
      .references(() => chapterEvents.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    githubUsername: text("github_username").notNull(),
    prNumber: integer("pr_number").notNull(),
    prTitle: text("pr_title").notNull(),
    prUrl: text("pr_url").notNull(),
    repoOwner: text("repo_owner").notNull(),
    repoName: text("repo_name").notNull(),
    prState: text("pr_state").notNull(), // 'OPEN', 'MERGED', 'CLOSED'
    isMerged: boolean("is_merged").default(false).notNull(),
    prCreatedAt: timestamp("pr_created_at").notNull(),
    prMergedAt: timestamp("pr_merged_at"),
    labels: jsonb("labels").$type<string[]>().default([]).notNull(),
    reviewStatus: text("review_status").$type<CandidateReviewStatus>().default("PENDING").notNull(),
    assignedScore: integer("assigned_score").default(0).notNull(),
    reviewerNotes: text("reviewer_notes"),
    adjustmentReason: text("adjustment_reason"),
    reviewedBy: text("reviewed_by").references(() => chapterMembers.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("contribution_candidates_repo_pr_idx").on(table.eventId, table.repoOwner, table.repoName, table.prNumber),
    index("contribution_candidates_user_idx").on(table.userId),
    index("contribution_candidates_status_idx").on(table.reviewStatus),
  ]
);

/**
 * Official Event Leaderboards (Section 9.5 & 16)
 * Deterministic snapshots of published rankings and standing points.
 */
export const eventLeaderboards = pgTable(
  "event_leaderboards",
  {
    id: text("id").primaryKey(),
    eventId: text("event_id")
      .notNull()
      .references(() => chapterEvents.id, { onDelete: "cascade" }),
    snapshotVersion: integer("snapshot_version").default(1).notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    standings: jsonb("standings").$type<Array<{
      rank: number;
      userId: string;
      displayName: string;
      githubUsername?: string;
      totalScore: number;
      approvedContributionsCount: number;
      tieBreakerScore?: number;
      award?: string;
    }>>().default([]).notNull(),
    publishedBy: text("published_by").references(() => chapterMembers.id, { onDelete: "set null" }),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("event_leaderboards_event_idx").on(table.eventId),
    index("event_leaderboards_published_idx").on(table.isPublished),
  ]
);
