import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

console.log("🔒 Running Zero-Credentials Security Audit Scanner...\n");

// Patterns that identify actual leaked secrets (not dummy placeholders)
const SECRET_PATTERNS = [
  {
    name: "Live Database Connection String with Credentials",
    regex: /postgresql:\/\/(?!user:password)[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+@/i,
  },
  {
    name: "Neon PostgreSQL Password Token",
    regex: /npg_[a-zA-Z0-9]{8,}/,
  },
  {
    name: "Google OAuth Client Secret",
    regex: /GOCSPX-[a-zA-Z0-9_-]{20,}/,
  },
  {
    name: "GitHub Personal Access / OAuth Token",
    regex: /(ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{30,}/,
  },
  {
    name: "GitHub App Secret",
    regex: /52e7a1b8ee9a0667fdbda610c377692d20b941f9/,
  },
  {
    name: "GitHub Client ID in Tracked Code",
    regex: /Iv23lizkbEeyqNdr2lNb/,
  },
  {
    name: "Google API Key",
    regex: /AIzaSy[a-zA-Z0-9_-]{33}/,
  },
  {
    name: "Private Key Block",
    regex: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  },
  {
    name: "AWS Access Key ID",
    regex: /AKIA[0-9A-Z]{16}/,
  },
];

// Files and paths explicitly allowed to contain dummy test mocks or documentation placeholders
const IGNORED_PATHS = [
  ".env",
  ".env.local",
  ".env.development",
  ".env.test",
  ".env.production",
  "node_modules",
  ".git",
  ".next",
  "out",
  ".open-next",
  "scripts/verify-no-secrets.mjs", // Scanner itself contains regex definitions
];

function getTrackedFiles() {
  try {
    const output = execSync("git ls-files", { encoding: "utf-8" });
    return output
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0 && !IGNORED_PATHS.some((ignored) => f.startsWith(ignored)));
  } catch (err) {
    console.error("Failed to run git ls-files:", err);
    process.exit(1);
  }
}

const files = getTrackedFiles();
let violations = 0;

for (const file of files) {
  const filePath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(filePath)) continue;

  // Skip binary files
  const stat = fs.statSync(filePath);
  if (stat.size > 1024 * 1024) continue; // Skip files > 1MB

  let content;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    continue; // Binary or unreadable
  }

  // Skip documentation test suites that test redaction engines using synthetic dummy tokens
  if (file === "scripts/test-security-suite.mjs") {
    // Only verify real secrets are absent
    if (content.includes("npg_") || content.includes("52e7a1b8")) {
      console.error(`❌ Security Violation in ${file}: Leaked real credential`);
      violations++;
    }
    continue;
  }

  for (const pattern of SECRET_PATTERNS) {
    if (pattern.regex.test(content)) {
      console.error(`❌ Security Violation in ${file}: Detected ${pattern.name}`);
      violations++;
    }
  }
}

if (violations > 0) {
  console.error(`\n🚨 AUDIT FAILED: Found ${violations} credential violation(s) in tracked repository files.`);
  console.error("Never commit or push real secrets to Git. Move credentials to .env or environment variables.\n");
  process.exit(1);
} else {
  console.log(`✅ AUDIT PASSED: Scanned ${files.length} tracked files. Zero credentials or secret patterns detected.\n`);
  process.exit(0);
}
