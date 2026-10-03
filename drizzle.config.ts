import { defineConfig } from "drizzle-kit";

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_TitzAVM6oSf7@ep-silent-math-b5nurzzp-pooler.c-7.us-east-2.aws.neon.tech/acmbitm?sslmode=require&channel_binding=require";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
