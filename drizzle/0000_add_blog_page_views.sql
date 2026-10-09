-- Privacy-conscious, per-article pageview totals.
-- No visitor identity or IP addresses are persisted.
CREATE TABLE IF NOT EXISTS "blog_page_views" (
  "slug" text PRIMARY KEY NOT NULL,
  "view_count" bigint DEFAULT 0 NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
