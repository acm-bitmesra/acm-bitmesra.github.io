import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_TitzAVM6oSf7@ep-silent-math-b5nurzzp-pooler.c-7.us-east-2.aws.neon.tech/acmbitm?sslmode=require&channel_binding=require";

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Please provide a valid Neon PostgreSQL connection string.");
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
export { sql };
export type Database = typeof db;
