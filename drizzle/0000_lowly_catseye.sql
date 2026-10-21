CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chapter_members" (
	"id" text PRIMARY KEY NOT NULL,
	"auth_user_id" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"avatar_url" text,
	"role_id" text NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"term_start" text DEFAULT '2026-27' NOT NULL,
	"term_end" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chapter_members_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "chapter_roles" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"display_name" text NOT NULL,
	"description" text,
	"permission_set" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"hierarchy_level" integer DEFAULT 100 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chapter_roles_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "member_permissions" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text NOT NULL,
	"permission" text NOT NULL,
	"granted_by" text,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text,
	"action" text NOT NULL,
	"target_type" text,
	"target_id" text,
	"details" jsonb,
	"ip_address" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_page_views" (
	"slug" text PRIMARY KEY NOT NULL,
	"view_count" bigint DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_post_authors" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"member_id" text NOT NULL,
	"author_order" integer DEFAULT 0 NOT NULL,
	"author_name_snapshot" text NOT NULL,
	"author_role_snapshot" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_post_revisions" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"editor_id" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content_markdown" text NOT NULL,
	"change_note" text,
	"changed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_post_slugs" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_post_tags" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"tag_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text NOT NULL,
	"content_markdown" text NOT NULL,
	"cover_image_url" text,
	"cover_image_alt" text,
	"category" text NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"canonical_url" text,
	"reading_time_minutes" integer DEFAULT 5 NOT NULL,
	"created_by" text NOT NULL,
	"last_edited_by" text,
	"published_by" text,
	"submitted_at" timestamp,
	"published_at" timestamp,
	"archived_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blog_tags" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "chapter_events" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"tagline" text,
	"description" text NOT NULL,
	"category" text DEFAULT 'HACKATHON' NOT NULL,
	"status" text DEFAULT 'UPCOMING' NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"location" text NOT NULL,
	"is_online" boolean DEFAULT false NOT NULL,
	"registration_url" text,
	"banner_url" text,
	"featured" boolean DEFAULT false NOT NULL,
	"max_participants" integer,
	"prizes" text,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chapter_events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "chapter_resources" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"category" text DEFAULT 'ROADMAP' NOT NULL,
	"type" text DEFAULT 'LINK' NOT NULL,
	"url" text NOT NULL,
	"difficulty" text DEFAULT 'ALL_LEVELS' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chapter_resources_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "chapter_announcements" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"link_url" text,
	"link_text" text,
	"type" text DEFAULT 'INFO' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chapter_sponsors" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"tier" text DEFAULT 'COMMUNITY' NOT NULL,
	"logo_url" text NOT NULL,
	"website_url" text,
	"description" text,
	"year" text DEFAULT '2026' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chapter_gallery" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"caption" text,
	"imageUrl" text NOT NULL,
	"event_year" text DEFAULT '2026' NOT NULL,
	"category" text DEFAULT 'EVENTS' NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chapter_media" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer DEFAULT 0 NOT NULL,
	"alt_text" text,
	"caption" text,
	"category" text DEFAULT 'GENERAL' NOT NULL,
	"uploaded_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chapter_redirects" (
	"id" text PRIMARY KEY NOT NULL,
	"source_path" text NOT NULL,
	"target_url" text NOT NULL,
	"status_code" integer DEFAULT 307 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chapter_redirects_source_path_unique" UNIQUE("source_path")
);
--> statement-breakpoint
CREATE TABLE "security_alerts" (
	"id" text PRIMARY KEY NOT NULL,
	"severity" text DEFAULT 'INFO' NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"source_ip" text,
	"target_user_id" text,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academic_batches" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"start_year" integer NOT NULL,
	"end_year" integer NOT NULL,
	"program" text DEFAULT 'B.Tech' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "academic_batches_label_unique" UNIQUE("label")
);
--> statement-breakpoint
CREATE TABLE "connected_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider" text NOT NULL,
	"provider_user_id" text,
	"handle" text NOT NULL,
	"profile_url" text NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"scopes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"last_synced_at" timestamp,
	"sync_status" text DEFAULT 'PENDING' NOT NULL,
	"sync_error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"slug" text NOT NULL,
	"display_name" text NOT NULL,
	"avatar_url" text,
	"bio" text,
	"academic_program" text DEFAULT 'B.Tech',
	"department" text DEFAULT 'Computer Science & Engineering',
	"batch_id" text,
	"skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"interests" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"custom_bio_markdown" text,
	"portfolio_blocks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"theme" text DEFAULT 'minimal' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "student_profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "student_profiles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contribution_candidates" (
	"id" text PRIMARY KEY NOT NULL,
	"job_id" text,
	"event_id" text NOT NULL,
	"user_id" text NOT NULL,
	"github_username" text NOT NULL,
	"pr_number" integer NOT NULL,
	"pr_title" text NOT NULL,
	"pr_url" text NOT NULL,
	"repo_owner" text NOT NULL,
	"repo_name" text NOT NULL,
	"pr_state" text NOT NULL,
	"is_merged" boolean DEFAULT false NOT NULL,
	"pr_created_at" timestamp NOT NULL,
	"pr_merged_at" timestamp,
	"labels" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"review_status" text DEFAULT 'PENDING' NOT NULL,
	"assigned_score" integer DEFAULT 0 NOT NULL,
	"reviewer_notes" text,
	"adjustment_reason" text,
	"reviewed_by" text,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contribution_scan_jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"scan_config" jsonb NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"total_candidates_found" integer DEFAULT 0 NOT NULL,
	"error" text,
	"started_at" timestamp,
	"finished_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_leaderboards" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"snapshot_version" integer DEFAULT 1 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"standings" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"published_by" text,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_registrations" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"user_id" text NOT NULL,
	"status" text DEFAULT 'REGISTERED' NOT NULL,
	"team_id" text,
	"custom_answers" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL,
	"checked_in_at" timestamp,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "event_rubrics" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"title" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"criteria" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"total_max_score" integer DEFAULT 100 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"user_id" text NOT NULL,
	"team_id" text,
	"title" text NOT NULL,
	"description" text,
	"project_url" text,
	"repo_url" text,
	"demo_url" text,
	"status" text DEFAULT 'SUBMITTED' NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_team_members" (
	"id" text PRIMARY KEY NOT NULL,
	"team_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'MEMBER' NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_teams" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"name" text NOT NULL,
	"join_code" text NOT NULL,
	"leader_user_id" text NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"max_size" integer DEFAULT 4 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "event_teams_join_code_unique" UNIQUE("join_code")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter_members" ADD CONSTRAINT "chapter_members_auth_user_id_user_id_fk" FOREIGN KEY ("auth_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter_members" ADD CONSTRAINT "chapter_members_role_id_chapter_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."chapter_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_permissions" ADD CONSTRAINT "member_permissions_member_id_chapter_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."chapter_members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_permissions" ADD CONSTRAINT "member_permissions_granted_by_chapter_members_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."chapter_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_member_id_chapter_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."chapter_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_authors" ADD CONSTRAINT "blog_post_authors_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_authors" ADD CONSTRAINT "blog_post_authors_member_id_chapter_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."chapter_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_revisions" ADD CONSTRAINT "blog_post_revisions_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_revisions" ADD CONSTRAINT "blog_post_revisions_editor_id_chapter_members_id_fk" FOREIGN KEY ("editor_id") REFERENCES "public"."chapter_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_slugs" ADD CONSTRAINT "blog_post_slugs_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_tags" ADD CONSTRAINT "blog_post_tags_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_tags" ADD CONSTRAINT "blog_post_tags_tag_id_blog_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."blog_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_created_by_chapter_members_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."chapter_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_last_edited_by_chapter_members_id_fk" FOREIGN KEY ("last_edited_by") REFERENCES "public"."chapter_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_published_by_chapter_members_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."chapter_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter_events" ADD CONSTRAINT "chapter_events_created_by_chapter_members_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."chapter_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter_resources" ADD CONSTRAINT "chapter_resources_created_by_chapter_members_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."chapter_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter_announcements" ADD CONSTRAINT "chapter_announcements_created_by_chapter_members_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."chapter_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connected_accounts" ADD CONSTRAINT "connected_accounts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_batch_id_academic_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."academic_batches"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contribution_candidates" ADD CONSTRAINT "contribution_candidates_job_id_contribution_scan_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."contribution_scan_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contribution_candidates" ADD CONSTRAINT "contribution_candidates_event_id_chapter_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."chapter_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contribution_candidates" ADD CONSTRAINT "contribution_candidates_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contribution_candidates" ADD CONSTRAINT "contribution_candidates_reviewed_by_chapter_members_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."chapter_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contribution_scan_jobs" ADD CONSTRAINT "contribution_scan_jobs_event_id_chapter_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."chapter_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_leaderboards" ADD CONSTRAINT "event_leaderboards_event_id_chapter_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."chapter_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_leaderboards" ADD CONSTRAINT "event_leaderboards_published_by_chapter_members_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."chapter_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_chapter_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."chapter_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_team_id_event_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."event_teams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_rubrics" ADD CONSTRAINT "event_rubrics_event_id_chapter_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."chapter_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_submissions" ADD CONSTRAINT "event_submissions_event_id_chapter_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."chapter_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_submissions" ADD CONSTRAINT "event_submissions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_submissions" ADD CONSTRAINT "event_submissions_team_id_event_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."event_teams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_team_members" ADD CONSTRAINT "event_team_members_team_id_event_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."event_teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_team_members" ADD CONSTRAINT "event_team_members_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_teams" ADD CONSTRAINT "event_teams_event_id_chapter_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."chapter_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_teams" ADD CONSTRAINT "event_teams_leader_user_id_user_id_fk" FOREIGN KEY ("leader_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chapter_members_email_idx" ON "chapter_members" USING btree ("email");--> statement-breakpoint
CREATE INDEX "chapter_members_auth_user_idx" ON "chapter_members" USING btree ("auth_user_id");--> statement-breakpoint
CREATE INDEX "chapter_members_role_idx" ON "chapter_members" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "member_permissions_member_idx" ON "member_permissions" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "member_permissions_perm_idx" ON "member_permissions" USING btree ("permission");--> statement-breakpoint
CREATE INDEX "audit_logs_member_idx" ON "audit_logs" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "blog_post_authors_post_idx" ON "blog_post_authors" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "blog_post_authors_member_idx" ON "blog_post_authors" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "blog_post_revisions_post_idx" ON "blog_post_revisions" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "blog_post_slugs_slug_idx" ON "blog_post_slugs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blog_post_slugs_post_idx" ON "blog_post_slugs" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "blog_post_tags_post_idx" ON "blog_post_tags" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "blog_post_tags_tag_idx" ON "blog_post_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blog_posts_status_idx" ON "blog_posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "blog_posts_published_at_idx" ON "blog_posts" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "blog_posts_created_at_idx" ON "blog_posts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "blog_posts_category_idx" ON "blog_posts" USING btree ("category");--> statement-breakpoint
CREATE INDEX "blog_posts_featured_idx" ON "blog_posts" USING btree ("featured");--> statement-breakpoint
CREATE UNIQUE INDEX "blog_tags_slug_idx" ON "blog_tags" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "chapter_events_slug_idx" ON "chapter_events" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "chapter_events_status_idx" ON "chapter_events" USING btree ("status");--> statement-breakpoint
CREATE INDEX "chapter_events_start_date_idx" ON "chapter_events" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "chapter_events_featured_idx" ON "chapter_events" USING btree ("featured");--> statement-breakpoint
CREATE UNIQUE INDEX "chapter_resources_slug_idx" ON "chapter_resources" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "chapter_resources_category_idx" ON "chapter_resources" USING btree ("category");--> statement-breakpoint
CREATE INDEX "chapter_resources_featured_idx" ON "chapter_resources" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "chapter_announcements_active_idx" ON "chapter_announcements" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "chapter_announcements_priority_idx" ON "chapter_announcements" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "chapter_sponsors_tier_idx" ON "chapter_sponsors" USING btree ("tier");--> statement-breakpoint
CREATE INDEX "chapter_sponsors_active_idx" ON "chapter_sponsors" USING btree ("active");--> statement-breakpoint
CREATE INDEX "chapter_gallery_year_idx" ON "chapter_gallery" USING btree ("event_year");--> statement-breakpoint
CREATE INDEX "chapter_gallery_category_idx" ON "chapter_gallery" USING btree ("category");--> statement-breakpoint
CREATE INDEX "chapter_media_category_idx" ON "chapter_media" USING btree ("category");--> statement-breakpoint
CREATE INDEX "chapter_media_created_at_idx" ON "chapter_media" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "chapter_redirects_source_idx" ON "chapter_redirects" USING btree ("source_path");--> statement-breakpoint
CREATE INDEX "chapter_redirects_active_idx" ON "chapter_redirects" USING btree ("active");--> statement-breakpoint
CREATE INDEX "security_alerts_severity_idx" ON "security_alerts" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "security_alerts_status_idx" ON "security_alerts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "security_alerts_created_at_idx" ON "security_alerts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "academic_batches_active_idx" ON "academic_batches" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "academic_batches_display_order_idx" ON "academic_batches" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "connected_accounts_user_idx" ON "connected_accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "connected_accounts_provider_idx" ON "connected_accounts" USING btree ("provider");--> statement-breakpoint
CREATE UNIQUE INDEX "connected_accounts_user_provider_idx" ON "connected_accounts" USING btree ("user_id","provider");--> statement-breakpoint
CREATE UNIQUE INDEX "student_profiles_user_idx" ON "student_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "student_profiles_slug_idx" ON "student_profiles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "student_profiles_batch_idx" ON "student_profiles" USING btree ("batch_id");--> statement-breakpoint
CREATE INDEX "student_profiles_is_public_idx" ON "student_profiles" USING btree ("is_public");--> statement-breakpoint
CREATE UNIQUE INDEX "contribution_candidates_repo_pr_idx" ON "contribution_candidates" USING btree ("event_id","repo_owner","repo_name","pr_number");--> statement-breakpoint
CREATE INDEX "contribution_candidates_user_idx" ON "contribution_candidates" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "contribution_candidates_status_idx" ON "contribution_candidates" USING btree ("review_status");--> statement-breakpoint
CREATE INDEX "contribution_scan_jobs_event_idx" ON "contribution_scan_jobs" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "contribution_scan_jobs_status_idx" ON "contribution_scan_jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "event_leaderboards_event_idx" ON "event_leaderboards" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_leaderboards_published_idx" ON "event_leaderboards" USING btree ("is_published");--> statement-breakpoint
CREATE UNIQUE INDEX "event_registrations_user_event_idx" ON "event_registrations" USING btree ("event_id","user_id");--> statement-breakpoint
CREATE INDEX "event_registrations_status_idx" ON "event_registrations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "event_registrations_event_idx" ON "event_registrations" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_rubrics_event_idx" ON "event_rubrics" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_submissions_event_idx" ON "event_submissions" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_submissions_user_idx" ON "event_submissions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "event_team_members_unique_idx" ON "event_team_members" USING btree ("team_id","user_id");--> statement-breakpoint
CREATE INDEX "event_team_members_user_idx" ON "event_team_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "event_teams_event_idx" ON "event_teams" USING btree ("event_id");--> statement-breakpoint
CREATE UNIQUE INDEX "event_teams_join_code_idx" ON "event_teams" USING btree ("join_code");