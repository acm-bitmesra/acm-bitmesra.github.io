import { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "modern-competitive-programming-mindset",
    title: "The Competitive Programming Mindset: From Brute Force to Invariant Thinking",
    description:
      "A deep dive into how algorithmic intuition is developed—moving beyond memorizing algorithms to identifying invariants, problem reductions, and constraint signals.",
    date: "2026-09-28",
    author: "ACM BIT Mesra CP Wing",
    category: "Competitive Programming",
    tags: ["Algorithms", "Problem Solving", "Complexity", "Contests"],
    readingTime: "7 min read",
    draft: false,
    content: `
### Beyond Algorithm Memorization

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

Consistent upsolution turns blind spots into permanent computational intuition.
    `.trim(),
  },
  {
    slug: "demystifying-open-source-workflows",
    title: "Demystifying Open Source: From Finding Your First Issue to the Upstream Merge",
    description:
      "A practical blueprint for students wanting to contribute to production codebases without being overwhelmed by massive repositories.",
    date: "2026-09-20",
    author: "ACM BIT Mesra Developer Wing",
    category: "Open Source",
    tags: ["GitHub", "Git", "Open Source", "Software Engineering"],
    readingTime: "6 min read",
    draft: false,
    content: `
### Overcoming the Codebase Intimidation Barrier

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

Contributing to open source transforms you from a consumer of developer tools into an active builder of global technology infrastructure.
    `.trim(),
  },
  {
    slug: "building-reliable-student-infrastructure",
    title: "Architecting Student Infrastructure: Why Edge Computing and Static Delivery Matter",
    description:
      "How ACM BIT Mesra approaches architectural simplicity, static generation, and edge hosting to build student platforms that never crash during registrations.",
    date: "2026-09-15",
    author: "ACM BIT Mesra Technical Architecture",
    category: "Systems",
    tags: ["Architecture", "Edge", "Cloudflare", "Performance"],
    readingTime: "8 min read",
    draft: false,
    content: `
### The Annual Campus Traffic Spike

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

Architecture is not about how many cloud services you can assemble—it is about how reliably and sustainably your software serves people.
    `.trim(),
  },
  {
    slug: "internal-draft-article-example",
    title: "Internal Draft Article (Never Publicly Rendered)",
    description: "This is a draft article used to verify that draft posts are excluded from public index.",
    date: "2026-10-01",
    author: "ACM Draft Author",
    category: "ACM Updates",
    tags: ["Draft"],
    readingTime: "1 min read",
    draft: true,
    content: "This draft should never appear on public routes.",
  },
];

export function getPublishedBlogPosts(): BlogPost[] {
  return blogPosts.filter((post) => !post.draft);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug && !post.draft);
}

export function getRelatedBlogPosts(currentSlug: string): BlogPost[] {
  return blogPosts.filter((post) => post.slug !== currentSlug && !post.draft).slice(0, 2);
}
