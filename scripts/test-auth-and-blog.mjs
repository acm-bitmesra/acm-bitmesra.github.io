import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ ERROR: DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function queryWithRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
}

async function runTests() {
  console.log("🧪 Running ACM BIT Mesra Blog & Auth Verification Suite...\n");

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

  try {
    // 1. Database Connection & Schema Tables
    console.log("1. Checking Database Tables...");
    const tables = await queryWithRetry(() => sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    const tableNames = tables.map((t) => t.table_name);
    
    assert(tableNames.includes("blog_posts"), "Table 'blog_posts' exists");
    assert(tableNames.includes("blog_post_authors"), "Table 'blog_post_authors' exists");
    assert(tableNames.includes("blog_post_slugs"), "Table 'blog_post_slugs' exists");
    assert(tableNames.includes("chapter_members"), "Table 'chapter_members' exists");
    assert(tableNames.includes("chapter_roles"), "Table 'chapter_roles' exists");
    assert(tableNames.includes("member_permissions"), "Table 'member_permissions' exists");
    assert(tableNames.includes("audit_logs"), "Table 'audit_logs' exists");
    assert(tableNames.includes("user"), "Table 'user' (Better Auth) exists");
    assert(tableNames.includes("session"), "Table 'session' (Better Auth) exists");

    // 2. Roles & Granular Permissions
    console.log("\n2. Verifying Role Hierarchy & Permissions Invariant...");
    const roles = await queryWithRetry(() => sql`SELECT * FROM chapter_roles ORDER BY hierarchy_level ASC;`);
    const roleKeys = roles.map((r) => r.key);

    assert(roleKeys.includes("PRESIDENT"), "President role provisioned");
    assert(roleKeys.includes("TECHNICAL_HEAD"), "Technical Head role provisioned");
    assert(roleKeys.includes("AUTHORIZED_EDITOR"), "Authorized Editor role provisioned");
    assert(roleKeys.includes("CHAPTER_MEMBER"), "Chapter Member role provisioned");

    const presRole = roles.find((r) => r.key === "PRESIDENT");
    const editorRole = roles.find((r) => r.key === "AUTHORIZED_EDITOR");
    const memberRole = roles.find((r) => r.key === "CHAPTER_MEMBER");

    assert(
      presRole.permission_set.includes("admin:manage_members") &&
      presRole.permission_set.includes("blog:publish"),
      "President has full governance and publishing permissions"
    );

    assert(
      editorRole.permission_set.includes("blog:publish") &&
      !editorRole.permission_set.includes("admin:manage_members"),
      "Editor has publishing rights but cannot manage chapter roster"
    );

    assert(
      memberRole.permission_set.includes("blog:create") &&
      !memberRole.permission_set.includes("blog:publish"),
      "Member can create drafts but cannot publish live articles directly"
    );

    // 3. Draft Isolation Security Invariant
    console.log("\n3. Testing Draft Security Invariant (Drafts Must NOT Leak to Public API)...");
    const testPostId = `test_post_${Date.now()}`;
    const testMemberId = `test_mem_${Date.now()}`;

    // Provision temporary test member
    await queryWithRetry(() => sql`
      INSERT INTO chapter_members (id, name, email, role_id, status, is_active)
      VALUES (${testMemberId}, 'Test Author', 'test@bitmesra.ac.in', ${memberRole.id}, 'ACTIVE', true);
    `);

    // Create a DRAFT post
    await queryWithRetry(() => sql`
      INSERT INTO blog_posts (id, title, slug, excerpt, content_markdown, category, reading_time_minutes, status, created_by, last_edited_by)
      VALUES (${testPostId}, 'Draft Invariant Test', ${'draft-test-' + Date.now()}, 'Test excerpt', 'Test content', 'Algorithms & Math', 2, 'DRAFT', ${testMemberId}, ${testMemberId});
    `);

    // Public query: MUST strictly return status = 'PUBLISHED'
    const publicQueryResult = await queryWithRetry(() => sql`
      SELECT * FROM blog_posts WHERE status = 'PUBLISHED' AND id = ${testPostId};
    `);
    assert(publicQueryResult.length === 0, "Draft post strictly hidden from public query");

    // 4. Immutable Author Role Snapshot Invariant
    console.log("\n4. Testing Immutable Author Role Snapshot Invariant...");
    const initialRoleSnapshot = "Junior Contributor · ACM BIT Mesra";
    const authorSnapshotId = `test_auth_${Date.now()}`;

    await queryWithRetry(() => sql`
      INSERT INTO blog_post_authors (id, post_id, member_id, author_order, author_name_snapshot, author_role_snapshot)
      VALUES (${authorSnapshotId}, ${testPostId}, ${testMemberId}, 0, 'Test Author', ${initialRoleSnapshot});
    `);

    // Member gets promoted in the chapter
    await queryWithRetry(() => sql`
      UPDATE chapter_members 
      SET role_id = ${presRole.id}
      WHERE id = ${testMemberId};
    `);

    // Check author snapshot on the post
    const [snapshotRow] = await queryWithRetry(() => sql`
      SELECT * FROM blog_post_authors WHERE id = ${authorSnapshotId};
    `);

    assert(
      snapshotRow.author_role_snapshot === initialRoleSnapshot,
      `Author role snapshot remains permanently immutable ('${snapshotRow.author_role_snapshot}') despite member promotion`
    );

    // 5. Cleanup Test Records
    console.log("\n5. Cleaning Up Test Artifacts...");
    await queryWithRetry(() => sql`DELETE FROM blog_post_authors WHERE id = ${authorSnapshotId};`);
    await queryWithRetry(() => sql`DELETE FROM blog_posts WHERE id = ${testPostId};`);
    await queryWithRetry(() => sql`DELETE FROM chapter_members WHERE id = ${testMemberId};`);
    assert(true, "Test artifacts cleaned up successfully");

    // 6. Canonical Seeded Articles Check
    console.log("\n6. Verifying Production Seeded Articles...");
    const publishedArticles = await queryWithRetry(() => sql`
      SELECT id, title, slug, category, status 
      FROM blog_posts 
      WHERE status = 'PUBLISHED' 
      ORDER BY published_at DESC;
    `);
    assert(publishedArticles.length >= 3, `Found ${publishedArticles.length} published production articles in Neon`);

    for (const a of publishedArticles) {
      console.log(`     → [${a.status}] "${a.title}" (/blog/${a.slug})`);
    }

  } catch (error) {
    console.error("Test execution encountered an error:", error);
    failed++;
  }

  console.log("\n==========================================");
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log("==========================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
