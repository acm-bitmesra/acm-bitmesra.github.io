import * as dotenv from "dotenv";
dotenv.config();
import { neon } from "@neondatabase/serverless";

console.log("🔍 Running Comprehensive DB, Better Auth & Environment Diagnostics...\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runDiagnostics() {
  const dbUrl = process.env.DATABASE_URL;
  const authSecret = process.env.BETTER_AUTH_SECRET;
  const authUrl = process.env.BETTER_AUTH_URL;
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  // 1. Environment Variable Checks
  console.log("1. Validating Required Environment Variables...");
  assert(Boolean(dbUrl), "DATABASE_URL is defined");
  assert(Boolean(authSecret && authSecret.length >= 16), "BETTER_AUTH_SECRET is set and >= 16 chars");
  assert(authUrl === "https://acmbitm.campsy.app", `BETTER_AUTH_URL is ${authUrl}`);
  assert(Boolean(googleClientId), "GOOGLE_CLIENT_ID is defined");
  assert(Boolean(googleClientSecret), "GOOGLE_CLIENT_SECRET is defined");

  // 2. Database Connection & Schema Verification
  console.log("\n2. Testing Neon Database Live Connection...");
  const sql = neon(dbUrl);
  try {
    const [info] = await sql`
      SELECT current_database() as db_name, current_user as user_name, version() as pg_version
    `;
    assert(info.db_name === "neondb", `Connected to correct database: ${info.db_name}`);
    assert(info.user_name === "neondb_owner", `Authenticated as user: ${info.user_name}`);

    // Verify verification table columns
    const cols = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'verification'
    `;
    const colNames = cols.map(c => c.column_name);
    assert(colNames.includes("id"), "verification.id column exists");
    assert(colNames.includes("identifier"), "verification.identifier column exists");
    assert(colNames.includes("value"), "verification.value column exists");
    assert(colNames.includes("expires_at"), "verification.expires_at column exists");

    // Test insert, select, delete cycle on verification table
    const testId = `diag_${Date.now()}`;
    await sql`
      INSERT INTO "verification" ("id", "identifier", "value", "expires_at", "created_at", "updated_at")
      VALUES (${testId}, 'test-identifier', 'test-value', ${new Date(Date.now() + 60000)}, ${new Date()}, ${new Date()})
    `;
    const [inserted] = await sql`SELECT id FROM "verification" WHERE id = ${testId}`;
    assert(inserted?.id === testId, "Verification table write/read lifecycle verified");
    await sql`DELETE FROM "verification" WHERE id = ${testId}`;
    assert(true, "Temporary verification record cleaned up");
  } catch (err) {
    assert(false, `Database diagnostics failed: ${err.message}`);
  }

  // 3. Live Production Endpoint Test
  console.log("\n3. Testing Live Production Better Auth Social Sign-In Endpoint...");
  try {
    const res = await fetch("https://acmbitm.campsy.app/api/auth/sign-in/social", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://acmbitm.campsy.app",
      },
      body: JSON.stringify({
        provider: "google",
        callbackURL: "/dashboard",
      }),
    });

    assert(res.status === 200, `Production sign-in endpoint responded with HTTP ${res.status}`);
    const data = await res.json();
    assert(Boolean(data?.url), "Endpoint returned Google OAuth authorization URL");
    assert(data.url.includes("accounts.google.com/o/oauth2/v2/auth"), "URL is valid Google OAuth entrypoint");
    assert(data.url.includes("client_id="), "Google Client ID is embedded in auth URL");
    assert(data.url.includes("redirect_uri=https%3A%2F%2Facmbitm.campsy.app%2Fapi%2Fauth%2Fcallback%2Fgoogle"), "OAuth redirect URI matches production domain");
  } catch (err) {
    assert(false, `Production endpoint test failed: ${err.message}`);
  }

  console.log("\n==========================================");
  console.log(`Diagnostics Results: ${passed} Passed, ${failed} Failed`);
  console.log("==========================================\n");

  if (failed > 0) process.exit(1);
}

runDiagnostics();
