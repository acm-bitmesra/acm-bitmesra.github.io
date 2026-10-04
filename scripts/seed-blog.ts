import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";
import { eq } from "drizzle-orm";
import { DEFAULT_ROLES } from "../src/lib/permissions/constants";
import { slugify } from "../src/lib/blog/slugify";
import { calculateReadingTime } from "../src/lib/blog/reading-time";

import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Please provide a valid Neon PostgreSQL connection string in .env");
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🌱 Seeding ACM BIT Mesra Knowledge Platform...");

  // 1. Seed Roles
  console.log("1. Seeding Chapter Roles...");
  for (const r of DEFAULT_ROLES) {
    const roleId = `role_${r.key.toLowerCase()}`;
    await db
      .insert(schema.chapterRoles)
      .values({
        id: roleId,
        key: r.key,
        displayName: r.displayName,
        description: r.description,
        permissionSet: r.permissions,
        hierarchyLevel: r.hierarchyLevel,
        active: true,
      })
      .onConflictDoUpdate({
        target: schema.chapterRoles.key,
        set: {
          displayName: r.displayName,
          description: r.description,
          permissionSet: r.permissions,
          hierarchyLevel: r.hierarchyLevel,
        },
      });
  }
  console.log(`✓ Seeded ${DEFAULT_ROLES.length} chapter roles.`);

  // 2. Seed Default Institutional Author (ACM Chapter Organization Account)
  console.log("2. Seeding Default Editorial Chapter Members...");
  const presidentRole = await db.query.chapterRoles.findFirst({
    where: (t, { eq }) => eq(t.key, "PRESIDENT"),
  });
  const technicalHeadRole = await db.query.chapterRoles.findFirst({
    where: (t, { eq }) => eq(t.key, "TECHNICAL_HEAD"),
  });
  const jointSecretaryRole = await db.query.chapterRoles.findFirst({
    where: (t, { eq }) => eq(t.key, "JOINT_SECRETARY"),
  });

  const defaultMembers = [
    {
      id: "mem_acm_chapter",
      name: "ACM BIT Mesra Editorial Board",
      email: "acm@bitmesra.ac.in",
      roleId: presidentRole!.id,
    },
    {
      id: "mem_cp_wing",
      name: "ACM BIT Mesra CP Wing",
      email: "cp.acm@bitmesra.ac.in",
      roleId: technicalHeadRole!.id,
    },
    {
      id: "mem_dev_wing",
      name: "ACM BIT Mesra Developer Wing",
      email: "dev.acm@bitmesra.ac.in",
      roleId: technicalHeadRole!.id,
    },
    {
      id: "mem_systems_wing",
      name: "ACM BIT Mesra Technical Architecture",
      email: "systems.acm@bitmesra.ac.in",
      roleId: technicalHeadRole!.id,
    },
  ];

  // Bootstrap Admin if environment variable provided
  const bootstrapEmail = process.env.BOOTSTRAP_ADMIN_EMAIL || "sh20raj@gmail.com";
  if (bootstrapEmail) {
    defaultMembers.push({
      id: "mem_bootstrap_admin",
      name: "Shaswat Raj",
      email: bootstrapEmail.toLowerCase(),
      roleId: presidentRole!.id,
    });
  }

  for (const m of defaultMembers) {
    await db
      .insert(schema.chapterMembers)
      .values({
        id: m.id,
        name: m.name,
        email: m.email,
        roleId: m.roleId,
        status: "ACTIVE",
        termStart: "2026-27",
        isActive: true,
      })
      .onConflictDoUpdate({
        target: schema.chapterMembers.email,
        set: {
          name: m.name,
          roleId: m.roleId,
          isActive: true,
        },
      });
  }
  console.log(`✓ Seeded ${defaultMembers.length} chapter members.`);

  // 3. Migrate Existing Articles from static data
  console.log("3. Migrating Canonical Articles into Database...");
  const initialArticles = [
    {
      slug: "modern-competitive-programming-mindset",
      title: "The Competitive Programming Mindset: From Brute Force to Invariant Thinking",
      excerpt:
        "A deep dive into how algorithmic intuition is developed—moving beyond memorizing algorithms to identifying invariants, problem reductions, and constraint signals.",
      category: "Competitive Programming",
      authorName: "ACM BIT Mesra CP Wing",
      authorRole: "Technical Wing · ACM BIT Mesra",
      memberId: "mem_cp_wing",
      date: new Date("2026-09-28T10:00:00Z"),
      featured: true,
      tags: ["Algorithms", "Problem Solving", "Complexity", "Contests"],
      content: `### Beyond Algorithm Memorization

A common trap for students beginning their competitive programming journey is attempting to memorize solutions. When faced with an unfamiliar problem on Codeforces or in an ICPC regional qualifier, pure pattern recall fails the moment a small constraint shift is introduced.

Algorithmic problem solving is fundamentally about **invariant detection** and **constraint analysis**.

---

### Step 1: Constraint Signals

The constraints of a problem provide immediate hints about the required time complexity:

- **$N \\le 10$:** Factorial or exponential search ($O(N!)$ or $O(2^N)$), suggesting recursion with pruning or bitmask dynamic programming.
- **$N \\le 10^3$:** Quadratic solutions ($O(N^2)$), common for dynamic programming, 2D grid traversals, or all-pairs analysis.
- **$N \\le 2 \\times 10^5$:** Linearithmic solutions ($O(N \\log N)$), pointing towards sorting, binary search on answer, segment trees, or heap-based greedy approaches.
- **$N \\le 10^{18}$:** Logarithmic or constant-time solutions ($O(\\log N)$ or $O(1)$), pointing to matrix exponentiation, binary lifting, or number-theoretic formulas.

Before writing a single loop, check the constraints and multiply your projected operations against the standard $10^8$ operations per second limit.

---

### Step 2: Formulating Invariants

Invariants are properties of a system that remain unchanged through repeated operations. In greedy algorithms and two-pointer traversals, your ability to prove an invariant is the difference between an Accepted verdict and a costly penalty.

Ask yourself:
1. What monotonically increases or decreases with each operation?
2. If I make a local greedy choice, does an exchange argument prove that an optimal global configuration is never foreclosed?
3. Can the search space be partitioned into a monotonic predicate $P(x)$ such that $P(x)$ is true for all $x \\ge K$? If so, binary search on answer is immediately applicable.

---

### Step 3: The Upsolution Habit

The real rating growth does not happen during the two hours of a live round; it happens during the subsequent 48 hours. When you fail to solve Problem C or D:
- Read the official editorial line by line.
- Re-implement the solution from scratch without copying template code.
- Write down the specific observation you missed in an editorial notebook.

Consistent upsolution turns blind spots into permanent computational intuition.`,
    },
    {
      slug: "demystifying-open-source-workflows",
      title: "Demystifying Open Source: From Finding Your First Issue to the Upstream Merge",
      excerpt:
        "A practical blueprint for students wanting to contribute to production codebases without being overwhelmed by massive repositories.",
      category: "Open Source",
      authorName: "ACM BIT Mesra Developer Wing",
      authorRole: "Technical Wing · ACM BIT Mesra",
      memberId: "mem_dev_wing",
      date: new Date("2026-09-20T10:00:00Z"),
      featured: false,
      tags: ["GitHub", "Git", "Open Source", "Software Engineering"],
      content: `### Overcoming the Codebase Intimidation Barrier

Opening a production repository with hundreds of thousands of lines of code for the first time is daunting. Many junior developers abandon their intention to contribute because they assume they must understand the entire architecture before fixing a single issue.

In reality, even seasoned maintainers only have localized mental models of specific submodules at any given moment.

---

### Anatomy of a High-Quality First Issue

When starting out, filter issues using GitHub labels:
- \`good first issue\`
- \`help wanted\`
- \`documentation\`
- \`reproduced\`

Before writing code, reproduce the bug locally. Follow the project's development setup guide step-by-step. If you encounter any gaps in the documentation, filing a clarification or submitting a fix to the setup instructions is itself a valuable contribution.

---

### The Clean Pull Request Protocol

Maintainers are volunteers managing competing priorities. The easier you make your pull request to review, the faster it will be merged:

1. **Atomic Commits:** Each commit should represent one logical change with an informative commit message following the Conventional Commits specification (\`feat:\`, \`fix:\`, \`docs:\`, \`refactor:\`).
2. **Include Reproduction Steps & Tests:** State what was broken, how your code resolves it, and provide automated unit or integration tests that prove the fix.
3. **No Unrelated Formatting:** Avoid auto-formatting whole files that introduce hundreds of noisy diff lines unrelated to your change.
4. **Be Responsive to Feedback:** Treat code reviews as a collaborative masterclass. If a maintainer requests changes, address each comment politely and push follow-up commits promptly.

Contributing to open source transforms you from a consumer of developer tools into an active builder of global technology infrastructure.`,
    },
    {
      slug: "building-reliable-student-infrastructure",
      title: "Architecting Student Infrastructure: Why Edge Computing and Static Delivery Matter",
      excerpt:
        "How ACM BIT Mesra approaches architectural simplicity, static generation, and edge hosting to build student platforms that never crash during registrations.",
      category: "Systems",
      authorName: "ACM BIT Mesra Technical Architecture",
      authorRole: "Architecture Wing · ACM BIT Mesra",
      memberId: "mem_systems_wing",
      date: new Date("2026-09-15T10:00:00Z"),
      featured: false,
      tags: ["Architecture", "Edge", "Cloudflare", "Performance"],
      content: `### The Annual Campus Traffic Spike

Every university student society has experienced the dreaded registration crash: an annual hackathon or contest registration opens, hundreds of students load the portal simultaneously, and the server collapses under connection limits.

When building the digital platform for ACM BIT Mesra, we established a strict architectural rule: **eliminate unnecessary servers, minimize client-side JavaScript, and distribute pre-compiled static assets to the edge.**

---

### 1. Static Export First

Static Site Generation (SSG) pre-renders every page into pure HTML, CSS, and minimal JavaScript at build time. When a visitor requests \`/events/hack-a-bit\`, the response is served directly from edge memory without executing server-side database queries or cold-starting Node.js runtime instances.

Advantages:
- **Zero Cold Start:** No waiting for serverless function boots.
- **Immunity to Database Outages:** The content remains available even if backend APIs are temporarily offline.
- **Maximum Security:** There is no vulnerable backend attack surface exposed on public content pages.

---

### 2. Edge Asset Distribution via Cloudflare Workers

By pairing Next.js App Router with Cloudflare Workers static assets, assets are globally cached across hundreds of edge data centers. Whether an alumnus visits from Bengaluru, London, or San Francisco, latency remains sub-50 milliseconds.

---

### 3. Maintainability for Future Student Generations

Student platforms suffer when departing senior teams leave behind complex, undocumented container clusters or bespoke databases. By storing chapter records, team rosters, and events as strictly typed TypeScript data layers in Git, maintenance requires only a single pull request.

Architecture is not about how many cloud services you can assemble—it is about how reliably and sustainably your software serves people.`,
    },
  ];

  for (const a of initialArticles) {
    const postId = `post_${a.slug.slice(0, 15)}`;
    const readingTime = calculateReadingTime(a.content);

    await db
      .insert(schema.blogPosts)
      .values({
        id: postId,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        contentMarkdown: a.content,
        category: a.category,
        status: "PUBLISHED",
        featured: a.featured,
        seoTitle: `${a.title} | ACM BIT Mesra`,
        seoDescription: a.excerpt,
        readingTimeMinutes: readingTime,
        createdBy: a.memberId,
        publishedBy: a.memberId,
        publishedAt: a.date,
        createdAt: a.date,
        updatedAt: a.date,
      })
      .onConflictDoUpdate({
        target: schema.blogPosts.slug,
        set: {
          title: a.title,
          excerpt: a.excerpt,
          contentMarkdown: a.content,
          category: a.category,
          status: "PUBLISHED",
          featured: a.featured,
          readingTimeMinutes: readingTime,
          publishedAt: a.date,
        },
      });

    // Author snapshot (Historical Role snapshot)
    await db.delete(schema.blogPostAuthors).where(eq(schema.blogPostAuthors.postId, postId));
    await db.insert(schema.blogPostAuthors).values({
      id: `auth_${postId}`,
      postId: postId,
      memberId: a.memberId,
      authorOrder: 0,
      authorNameSnapshot: a.authorName,
      authorRoleSnapshot: a.authorRole,
    });

    // Tags
    for (const tagName of a.tags) {
      const tagSlug = slugify(tagName);
      let tag = await db.query.blogTags.findFirst({
        where: (t, { eq }) => eq(t.slug, tagSlug),
      });

      if (!tag) {
        const [newTag] = await db
          .insert(schema.blogTags)
          .values({
            id: `tag_${tagSlug}`,
            name: tagName,
            slug: tagSlug,
          })
          .returning();
        tag = newTag;
      }

      await db
        .insert(schema.blogPostTags)
        .values({
          id: `pt_${postId}_${tag.id}`,
          postId: postId,
          tagId: tag.id,
        })
        .onConflictDoNothing();
    }
  }

  console.log(`✓ Seeded ${initialArticles.length} production articles into Neon.`);
  console.log("🎉 Seeding completed successfully!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
