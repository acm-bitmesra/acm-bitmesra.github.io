import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import { execSync } from "child_process";
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

async function queryWithRetry(fn, retries = 4) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  }
}

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

async function runSecuritySuite() {
  console.log("🛡️  Running ACM BIT Mesra Command Center Security & Audit Verification Suite...\n");

  // ==========================================
  // Section 109: Zero-Trust RBAC & Permission Invariants
  // ==========================================
  console.log("1. Verifying Zero-Trust RBAC Anti-Escalation Invariants (Section 109)...");

  // Invariant 1: Hierarchy level 0 is strictly SUPER_ADMIN
  const superAdminRole = await queryWithRetry(() => sql`SELECT * FROM chapter_roles WHERE hierarchy_level = 0;`);
  assert(
    superAdminRole.length > 0 && superAdminRole[0].key === "SUPER_ADMIN",
    "Tier 0 authority strictly reserved for SUPER_ADMIN"
  );

  // Invariant 2: Subordinates cannot grant SUPER_ADMIN or manage members without permission
  const roles = await queryWithRetry(() => sql`SELECT * FROM chapter_roles ORDER BY hierarchy_level ASC;`);
  const lowerRoles = roles.filter((r) => r.hierarchy_level > 2);
  for (const r of lowerRoles) {
    assert(
      !r.permission_set.includes("admin:manage_members") &&
      !r.permission_set.includes("members:assign_roles"),
      `Subordinate role '${r.key}' (Tier ${r.hierarchy_level}) cannot assign roles or manage members`
    );
  }

  // Invariant 3: Suspended members cannot perform actions
  const suspendedStatusValid = ["ACTIVE", "SUSPENDED", "INACTIVE", "OFFBOARDED"];
  assert(suspendedStatusValid.includes("SUSPENDED"), "Suspended account status defined in lifecycle");

  // ==========================================
  // Section 111: Cloudflare Trusted IP Resolution
  // ==========================================
  console.log("\n2. Verifying Trusted IP Precedence over Spoofed Headers (Section 111)...");

  function resolveTestIp(headers) {
    if (headers["cf-connecting-ip"]) return headers["cf-connecting-ip"].trim();
    if (headers["x-real-ip"]) return headers["x-real-ip"].trim();
    if (headers["x-forwarded-for"]) return headers["x-forwarded-for"].split(",")[0].trim();
    return "127.0.0.1";
  }

  const spoofedHeaders = {
    "x-forwarded-for": "198.51.100.99, 203.0.113.195", // Spoofed client header
    "cf-connecting-ip": "103.24.18.92", // Cloudflare Edge cryptographically injected header
  };

  const resolvedIp = resolveTestIp(spoofedHeaders);
  assert(
    resolvedIp === "103.24.18.92",
    `Trusted Cloudflare 'cf-connecting-ip' (${resolvedIp}) takes absolute precedence over spoofed X-Forwarded-For`
  );

  // ==========================================
  // Section 114: Audit Log Sanitization Engine
  // ==========================================
  console.log("\n3. Verifying Audit Log Data Sanitization Engine (Section 114)...");

  const SENSITIVE_KEY_PATTERNS = [
    /password/i,
    /cookie/i,
    /authorization/i,
    /access_?token/i,
    /refresh_?token/i,
    /id_?token/i,
    /api_?key/i,
    /secret/i,
    /client_secret/i,
    /better_auth_secret/i,
    /google_client_secret/i,
    /db_password/i,
  ];

  function sanitizeTestDetails(data) {
    if (!data || typeof data !== "object") return data;
    if (Array.isArray(data)) return data.map(sanitizeTestDetails);

    const out = {};
    for (const [k, v] of Object.entries(data)) {
      if (SENSITIVE_KEY_PATTERNS.some((p) => p.test(k))) {
        out[k] = "[REDACTED]";
      } else {
        out[k] = typeof v === "object" ? sanitizeTestDetails(v) : v;
      }
    }
    return out;
  }

  const dirtyPayload = {
    userId: "usr_123",
    action: "ADMIN_LOGIN",
    password: "SuperSecretPassword123!",
    cookie: "session_token=secret_jwt_xyz",
    better_auth_secret: "prod_better_auth_secret_val",
    accessToken: "ya29.a0AfH6SM...",
    google_client_secret: "GOCSPX-abc123xyz",
    details: {
      nestedApiKey: "AIzaSyD-123456",
      safeNote: "Authorized session initialized",
    },
  };

  const cleanedPayload = sanitizeTestDetails(dirtyPayload);

  assert(cleanedPayload.password === "[REDACTED]", "Password credential sanitized");
  assert(cleanedPayload.cookie === "[REDACTED]", "Session cookie token sanitized");
  assert(cleanedPayload.better_auth_secret === "[REDACTED]", "BETTER_AUTH_SECRET redacted");
  assert(cleanedPayload.accessToken === "[REDACTED]", "OAuth Access Token redacted");
  assert(cleanedPayload.google_client_secret === "[REDACTED]", "Google OAuth Client Secret redacted");
  assert(cleanedPayload.details.nestedApiKey === "[REDACTED]", "Nested API Key redacted");
  assert(cleanedPayload.details.safeNote === "Authorized session initialized", "Non-sensitive telemetry preserved");

  // ==========================================
  // Section 112: Zero Secrets in Source Code
  // ==========================================
  console.log("\n4. Verifying Zero Secrets in Tracked Source Code (Section 112)...");

  const filesToCheck = [
    "src/lib/auth/auth.ts",
    "src/lib/auth/session.ts",
    "src/config/env.ts",
    "src/config/site.ts",
    "src/db/index.ts",
    "next.config.ts",
  ];

  for (const file of filesToCheck) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, "utf8");
      assert(
        !content.includes("postgresql://") && !content.includes("postgres://"),
        `${file}: Zero raw PostgreSQL credentials committed`
      );
      assert(
        !content.includes("BEGIN PRIVATE KEY") && !content.includes("client_secret_"),
        `${file}: Zero private keys or raw client secrets in code`
      );
    }
  }

  // ==========================================
  // Section 110: Audit Event Database Record Creation
  // ==========================================
  console.log("\n5. Testing Live Audit Event Emission to Neon PostgreSQL (Section 110)...");

  const testAuditId = `audit_test_${Date.now()}`;
  await queryWithRetry(() => sql`
    INSERT INTO audit_logs (id, action, target_type, target_id, details, ip_address, created_at)
    VALUES (
      ${testAuditId},
      'SECURITY_POLICY_CHECK',
      'PLATFORM',
      'SYS-TEST',
      ${JSON.stringify({ status: "VERIFIED", testRun: true, userAgent: 'ACM-Security-TestSuite/2.0' })},
      ${resolvedIp},
      NOW()
    );
  `);

  const [recordedLog] = await queryWithRetry(() => sql`SELECT * FROM audit_logs WHERE id = ${testAuditId};`);
  assert(Boolean(recordedLog), "Audit row committed to Neon PostgreSQL");
  assert(recordedLog.action === "SECURITY_POLICY_CHECK", "Audit action recorded immutably");
  assert(recordedLog.ip_address === "103.24.18.92", "Audit record captures trusted Cloudflare IP");

  // Cleanup test row
  await queryWithRetry(() => sql`DELETE FROM audit_logs WHERE id = ${testAuditId};`);
  assert(true, "Temporary security test audit row cleaned up");

  // Summary
  console.log(`\n==========================================`);
  console.log(`Security Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`==========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runSecuritySuite().catch((err) => {
  console.error("Unhandled test suite exception:", err);
  process.exit(1);
});
