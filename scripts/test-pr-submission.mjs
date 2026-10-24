import * as dotenv from "dotenv";
dotenv.config();
import { neon } from "@neondatabase/serverless";

console.log("🧪 Running Comprehensive Hacktoberfest Manual PR Submission Test Suite...\n");

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

const GITHUB_PR_REGEX =
  /^https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/pull\/([0-9]+)(?:[#/?].*)?$/i;

function parsePrUrl(url) {
  if (typeof url !== "string") return null;
  const match = url.trim().match(GITHUB_PR_REGEX);
  if (!match) return null;
  return {
    repoOwner: match[1],
    repoName: match[2],
    prNumber: parseInt(match[3], 10),
  };
}

function calculateScore({ isMerged, labels = [] }) {
  let score = 10; // Base PR
  if (isMerged) score += 20;
  const lowerLabels = labels.map((l) => l.toLowerCase());
  if (lowerLabels.includes("hacktoberfest-accepted") || lowerLabels.includes("accepted")) {
    score += 15;
  }
  if (lowerLabels.includes("difficulty:hard")) {
    score += 30;
  } else if (lowerLabels.includes("difficulty:medium")) {
    score += 15;
  } else if (lowerLabels.includes("difficulty:easy")) {
    score += 5;
  }
  return score;
}

async function runTestSuite() {
  // 1. Validate GitHub PR URL Parsing & Security Regex
  console.log("1. Testing GitHub PR URL Parsing & Security Regex...");
  
  const valid1 = parsePrUrl("https://github.com/acm-bitmesra/NexHound/pull/1");
  assert(
    valid1 && valid1.repoOwner === "acm-bitmesra" && valid1.repoName === "NexHound" && valid1.prNumber === 1,
    "Standard PR URL parsed correctly (NexHound/pull/1)"
  );

  const valid2 = parsePrUrl("https://github.com/acm-bitmesra/dev-net-audit/pull/42/files");
  assert(
    valid2 && valid2.repoOwner === "acm-bitmesra" && valid2.repoName === "dev-net-audit" && valid2.prNumber === 42,
    "PR URL with trailing /files parsed correctly"
  );

  const valid3 = parsePrUrl("https://github.com/huggingface/transformers/pull/9876?diff=unified#issuecomment-123");
  assert(
    valid3 && valid3.repoOwner === "huggingface" && valid3.repoName === "transformers" && valid3.prNumber === 9876,
    "PR URL with query parameters and hash fragment parsed correctly"
  );

  const invalid1 = parsePrUrl("https://github.com/acm-bitmesra/NexHound");
  assert(invalid1 === null, "Repository root URL rejected (not a PR)");

  const invalid2 = parsePrUrl("https://github.com/acm-bitmesra/NexHound/issues/5");
  assert(invalid2 === null, "Issue URL rejected (issues are not PRs)");

  const invalid3 = parsePrUrl("https://evil-phishing.com/acm-bitmesra/NexHound/pull/1");
  assert(invalid3 === null, "Phishing domain rejected (strict GitHub host check)");

  const invalid4 = parsePrUrl("javascript:alert(1)");
  assert(invalid4 === null, "XSS/pseudo-protocol URL rejected");

  // 2. Test Rubric Scoring Engine
  console.log("\n2. Testing Rubric Scoring Engine...");
  
  const scoreOpen = calculateScore({ isMerged: false, labels: [] });
  assert(scoreOpen === 10, `Open unmerged PR base score = 10 pts (got ${scoreOpen})`);

  const scoreMerged = calculateScore({ isMerged: true, labels: [] });
  assert(scoreMerged === 30, `Merged PR score = 30 pts (base 10 + merged 20) (got ${scoreMerged})`);

  const scoreAccepted = calculateScore({ isMerged: true, labels: ["hacktoberfest-accepted"] });
  assert(scoreAccepted === 45, `Merged + accepted label = 45 pts (got ${scoreAccepted})`);

  const scoreHard = calculateScore({ isMerged: true, labels: ["hacktoberfest-accepted", "difficulty:hard"] });
  assert(scoreHard === 75, `Merged + accepted + hard = 75 pts (got ${scoreHard})`);

  // 3. Testing Database Table Lifecycle with Neon DB
  console.log("\n3. Testing Neon Database Contribution Lifecycle...");
  const sql = neon(process.env.DATABASE_URL);

  const testCandidateId = `test_cand_${Date.now().toString(36)}`;
  const testEventId = "evt_hacktoberfest_2026";
  const testUserId = "pIBO1hMxGZT1ljEGA1CEE0QP8KfnPUXr"; // Verified registered user from DB
  const testPrNumber = 999901;

  try {
    // 3.1 Verify event exists
    const [event] = await sql`SELECT id, slug, title FROM chapter_events WHERE id = ${testEventId}`;
    assert(Boolean(event && event.slug === "hacktoberfest-2026"), "Event evt_hacktoberfest_2026 exists in DB");

    // 3.2 Insert test contribution candidate
    await sql`
      INSERT INTO contribution_candidates (
        id, event_id, user_id, github_username, pr_number, pr_title, pr_url,
        repo_owner, repo_name, pr_state, is_merged, pr_created_at, review_status, assigned_score, reviewer_notes
      ) VALUES (
        ${testCandidateId}, ${testEventId}, ${testUserId}, 'test-developer', ${testPrNumber},
        'Test PR: Add CLI documentation', 'https://github.com/acm-bitmesra/NexHound/pull/999901',
        'acm-bitmesra', 'NexHound', 'MERGED', true, NOW(), 'APPROVED', 30, 'Automated test suite submission'
      )
    `;
    assert(true, "Contribution candidate inserted successfully");

    // 3.3 Query contribution candidate
    const [fetched] = await sql`
      SELECT id, event_id, user_id, pr_number, assigned_score, review_status
      FROM contribution_candidates
      WHERE id = ${testCandidateId}
    `;
    assert(
      fetched && fetched.pr_number === testPrNumber && fetched.assigned_score === 30 && fetched.review_status === "APPROVED",
      "Contribution candidate retrieved with matching attributes"
    );

    // 3.4 Duplicate prevention check (uniqueIndex on event_id, repo_owner, repo_name, pr_number)
    let duplicatePrevented = false;
    try {
      await sql`
        INSERT INTO contribution_candidates (
          id, event_id, user_id, github_username, pr_number, pr_title, pr_url,
          repo_owner, repo_name, pr_state, is_merged, pr_created_at, review_status, assigned_score
        ) VALUES (
          ${testCandidateId + "_dup"}, ${testEventId}, ${testUserId}, 'test-developer', ${testPrNumber},
          'Duplicate PR', 'https://github.com/acm-bitmesra/NexHound/pull/999901',
          'acm-bitmesra', 'NexHound', 'MERGED', true, NOW(), 'APPROVED', 30
        )
      `;
    } catch {
      duplicatePrevented = true;
    }
    assert(duplicatePrevented, "Database unique constraint prevented duplicate PR submission");

    // 3.5 Cleanup test candidate
    await sql`DELETE FROM contribution_candidates WHERE id = ${testCandidateId}`;
    const [deleted] = await sql`SELECT id FROM contribution_candidates WHERE id = ${testCandidateId}`;
    assert(!deleted, "Temporary test contribution candidate cleaned up successfully");

  } catch (err) {
    assert(false, `Database lifecycle error: ${err.message}`);
  }

  console.log("\n==========================================");
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log("==========================================");

  if (failed > 0) process.exit(1);
}

runTestSuite();
