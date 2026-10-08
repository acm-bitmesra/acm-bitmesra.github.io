# Content Management Guide — ACM BIT Mesra

A comprehensive handbook for ACM Executive Body members, content leads, and contributors on managing and authoring content across the official website.

---

## 1. Guiding Principles & Verification Policy

The ACM BIT Mesra website is an official institutional archive. The following editorial standards are mandatory:

1. **Zero Hallucination / Fact Verification:**  
   Never guess, fabricate, or extrapolate dates, attendee numbers, sponsor logos, or team rosters.
2. **The Verification Flag:**  
   If an event, team member, or metric is unverified or awaiting confirmation from faculty, set `verified: false`. Unverified items are strictly suppressed from public listings until confirmed.
3. **Commitment to Quality:**  
   All markdown descriptions, problem statements, and blogs must be proofread for clarity, spelling, and professional tone.

---

## 2. Directory Locations for Content

All site content is stored as strictly typed TypeScript data structures under `src/data/`:

| Content Type | File Location | TypeScript Interface |
| :--- | :--- | :--- |
| **Events & Contests** | `src/data/events.ts` | `Event` (`src/types/index.ts`) |
| **Blog Articles** | `src/data/blog.ts` | `BlogPost` (`src/types/index.ts`) |
| **Team & Executive Body** | `src/data/team.ts` | `TeamMember` (`src/types/index.ts`) |
| **Curated Resources** | `src/data/resources.ts` | `Resource` (`src/types/index.ts`) |
| **Gallery Photographs** | `src/data/gallery.ts` | `GalleryItem` (`src/types/index.ts`) |
| **Partners & Sponsors** | `src/data/sponsors.ts` | `InstitutionalPartner` (`src/types/index.ts`) |
| **Activities & Pillars** | `src/data/activities.ts` | `ActivityPillar` (`src/types/index.ts`) |
| **Alumni Batches** | `src/data/alumni.ts` | `AlumniBatch` (`src/types/index.ts`) |

---

## 3. Adding an Event

Open `src/data/events.ts` and add a new entry to the `events` array:

```typescript
{
  id: "cqm-spring-2027",
  slug: "cqm-spring-2027",
  title: "Code Quintessence Mesra (CQM) — Spring 2027",
  shortDescription: "Bi-weekly intra-college algorithmic challenge for second and third-year engineers.",
  description: "Detailed multi-paragraph markdown explaining contest structure, difficulty curve, and platforms...",
  category: "Competitive Programming",
  status: "upcoming", // "upcoming" | "ongoing" | "completed"
  featured: true,     // Display in the homepage featured spot
  startDate: "2027-02-15T18:00:00Z",
  endDate: "2027-02-15T21:00:00Z",
  location: "Online / CodeChef or HackerEarth",
  mode: "Online",     // "Online" | "In-Person" | "Hybrid"
  registrationUrl: "https://forms.gle/...",
  rules: [
    "Individual participation only.",
    "Plagiarism will result in an immediate contest disqualification.",
    "Contest duration: exactly 3 hours."
  ],
  schedule: [
    { time: "17:45 IST", activity: "Contest Lobby Opens" },
    { time: "18:00 IST", activity: "Problems Unlocked" },
    { time: "21:00 IST", activity: "Editorial Stream" }
  ],
  verified: true // Must be true to appear publicly!
}
```

---

## 4. Authoring a Blog Article

Open `src/data/blog.ts` and add an entry to the `blogPosts` array:

```typescript
{
  slug: "optimizing-segment-tree-operations",
  title: "Optimizing Segment Tree Operations with Lazy Propagation",
  excerpt: "A practical guide to implementing efficient range updates and interval queries in C++.",
  content: `
### Introduction

Segment trees provide logarithmic time complexity for range queries...

\`\`\`cpp
#include <vector>
using namespace std;
// Implementation details here
\`\`\`

### Summary
Lazy propagation defers updates until necessary, ensuring O(log N) runtime per query.
  `,
  author: {
    name: "Alex Doe",
    role: "CP Lead",
    avatar: "/images/team/placeholder.svg"
  },
  publishedAt: "2026-11-01T00:00:00Z",
  readTime: "6 min read",
  category: "Algorithms",
  tags: ["Competitive Programming", "C++", "Data Structures"],
  featured: false,
  draft: false // Set to true to exclude from builds until ready
}
```

---

## 5. Adding Team Members

Open `src/data/team.ts` and add an entry to the `teamMembers` array:

```typescript
{
  id: "jane-doe",
  slug: "jane-doe",
  name: "Jane Doe",
  role: "Technical Lead",
  category: "executive", // "faculty" | "executive" | "core" | "alumni"
  bio: "Full-stack developer passionate about distributed systems and open-source tooling.",
  image: "/images/team/placeholder.svg",
  batch: "2023–2027",
  socials: {
    github: "https://github.com/janedoe",
    linkedin: "https://linkedin.com/in/janedoe"
  },
  verified: true // Must be verified by chapter leadership
}
```

---

## 6. Curating Student Resources

Open `src/data/resources.ts` and add an entry to the `studentResources` array:

```typescript
{
  id: "res-cses-problem-set",
  title: "CSES Problem Set",
  description: "A standard collection of competitive programming practice problems maintained by Antti Laaksonen.",
  url: "https://cses.fi/problemset/",
  category: "Competitive Programming", // "DSA" | "Competitive Programming" | "Web Development" | "Systems & Tools"
  type: "Documentation",             // "Guide" | "Repository" | "Documentation" | "Video"
  difficulty: "Intermediate",          // "Beginner" | "Intermediate" | "Advanced"
  tags: ["Algorithms", "Practice", "C++"],
  isExternal: true
}
```

---

## 7. Verification Checklist Before Submitting a PR

- [ ] Does `bun run test` pass with 0 errors?
- [ ] Are all dates formatted in ISO 8601 strings (`YYYY-MM-DDTHH:mm:ssZ`)?
- [ ] Are any unverified members or dates flagged with `verified: false`?
- [ ] Do external URLs use HTTPS?
- [ ] Is `bun run build` completing cleanly?
