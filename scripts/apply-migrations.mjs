import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ ERROR: DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function applyMigrations() {
  console.log("🚀 Applying database migrations from drizzle/0000_lowly_catseye.sql...");
  
  const migrationPath = path.join(process.cwd(), "drizzle", "0000_lowly_catseye.sql");
  if (!fs.existsSync(migrationPath)) {
    console.error("❌ Migration file not found:", migrationPath);
    process.exit(1);
  }

  const content = fs.readFileSync(migrationPath, "utf-8");
  const statements = content
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Found ${statements.length} SQL statements to execute.`);

  let succeeded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await sql.query(stmt);
      succeeded++;
    } catch (err) {
      const errMsg = err?.message || String(err);
      if (
        errMsg.includes("already exists") ||
        errMsg.includes("duplicate key") ||
        (errMsg.includes("relation") && errMsg.includes("already exists"))
      ) {
        skipped++;
      } else {
        console.error(`⚠️ Statement ${i + 1} failed: ${errMsg}`);
        failed++;
      }
    }
  }

  console.log(`\nMigration completed: ${succeeded} executed, ${skipped} skipped (already exists), ${failed} failed.`);
}

applyMigrations()
  .then(() => {
    console.log("✅ Database schema is up to date.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Migration runner error:", err);
    process.exit(1);
  });
