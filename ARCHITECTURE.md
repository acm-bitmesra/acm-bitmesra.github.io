# Architecture Specification — ACM BIT Mesra

Official technical documentation for the architecture, data flow, static pre-rendering, edge deployment, and security design of the ACM Student Chapter website, BIT Mesra.

---

## 1. High-Level Architectural Principles

The ACM BIT Mesra digital platform is engineered around the following core architectural invariants:

1. **Content-Driven, Edge-First Architecture:**  
   Zero runtime database or cold starts. Every route, event, activity, blog article, and resource is compiled ahead-of-time (SSG) into deterministic static HTML, JSON, and CSS delivered directly from Cloudflare's global edge network.

2. **Strict Static Type Safety:**  
   All entity models (events, team members, blog posts, resources, sponsors, activities) are governed by strict TypeScript interfaces in `src/types/index.ts`. No untyped data is permitted.

3. **Institutional Integrity & Zero Hallucination:**  
   In compliance with Section 67 institutional guidelines, no unverified statistics, contest dates, or personal credentials are displayed to the public. Placeholder data is flagged with `verified: false` or `TODO: VERIFY` comments and automatically filtered from user-facing views.

4. **Minimal Client-Side JavaScript Footprint:**  
   Client components (`"use client"`) are strictly isolated to interactive endpoints:
   - Global Site Search Modal (`SearchModal` with `Cmd+K` keyboard shortcut)
   - Dynamic Resource Filtering (`ResourcesExplorer`)
   - Interactive Event Explorer (`EventsExplorer`)
   - Mobile Navigation Drawer (`Navbar`)  
   The shared initial JavaScript bundle is tightly capped at ~103 kB across all pages.

5. **Security by Default:**  
   All HTTP responses processed by the Cloudflare Worker include hardened security headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and strict referrer/permission policies.

---

## 2. Technology Stack & Rationale

| Layer | Technology | Version | Rationale |
| :--- | :--- | :--- | :--- |
| **Package Manager & Scripts** | Bun / Node.js | Bun Latest / Node v20+ | Ultra-fast execution, zero-config script running, native TypeScript support. |
| **Framework** | Next.js (App Router) | 15.1.7 | High-performance React 19 server components, static site generation (`output: "export"`), file-system routing. |
| **Language** | TypeScript | 5.7+ | Strict type-safety, robust IDE auto-completion, compile-time schema verification. |
| **Styling** | Tailwind CSS | 3.4+ | Utility-first, zero runtime CSS overhead, predictable design token variables. |
| **Iconography** | Lucide React + Custom SVGs | 1.16.0 | Cohesive 24x24 outline iconography with semantic stroke widths. |
| **Edge Infrastructure** | Cloudflare Workers & Static Assets | Wrangler 3.x | Sub-50ms latency globally, custom domain binding (`acmbitm.campsy.app`), zero server maintenance. |

---

## 3. Directory Layout & Module Boundaries

```text
├── public/                 # Static public assets (brand vectors, banners, robots)
├── scripts/
│   └── validate-production.mjs # Production export, links, and JSON-LD validation suite
├── src/
│   ├── app/                # Next.js App Router (pages, layouts, dynamic routes)
│   │   ├── about/          # Mission, beliefs, institutional relationship
│   │   ├── activities/     # Pillar overview & [slug] dynamic activity deep dives
│   │   ├── alumni/         # Alumni network and past leadership
│   │   ├── blog/           # Technical engineering posts & [slug] articles
│   │   ├── competitive-programming/ # CP roadmap, platform links, CQM info
│   │   ├── contact/        # Campus address, contact emails, social channels
│   │   ├── events/         # Chronological event archive & [slug] event pages
│   │   ├── gallery/        # High-density photo grid with category filters
│   │   ├── history/        # Chapter founding timeline and milestones
│   │   ├── icpc/           # ICPC regional track preparation & team chemistry
│   │   ├── join/           # Recruitment workflow, eligibility, FAQ
│   │   ├── privacy/        # Institutional data privacy policy
│   │   ├── resources/      # Curated DSA, CP, Web, and Systems resource explorer
│   │   ├── sponsors/       # Corporate and institutional partnership benefits
│   │   ├── team/           # Executive body & [slug] member profiles
│   │   ├── terms/          # Community terms of service
│   │   ├── accessibility/  # Digital accessibility statement
│   │   ├── layout.tsx      # Root HTML layout with OpenGraph & Organization JSON-LD
│   │   ├── page.tsx        # Homepage (Hero, Stats, Pillars, Events, Impact, CTA)
│   │   ├── robots.ts       # Crawl policy generator
│   │   └── sitemap.ts      # Automated sitemap generator indexing all 32+ routes
│   ├── components/         # Reusable presentation and interaction components
│   │   ├── events/         # Event cards, badge status indicators, explorers
│   │   ├── layout/         # Navbar, Footer, SiteLayout (with skip-to-content)
│   │   ├── resources/      # Client-side searchable & filterable resources grid
│   │   ├── search/         # Unified Cmd+K search dialog
│   │   └── ui/             # Atomic UI primitives: Badge, Button, Card, Icons
│   ├── config/             # Global site metadata, navigation, campus contact info
│   ├── data/               # Strictly typed data stores: events, team, blog, resources, etc.
│   ├── lib/                # Date formatting, class merge utilities
│   ├── types/              # Comprehensive TypeScript interfaces
│   └── worker.ts           # Cloudflare Worker request handler & security headers
├── next.config.ts          # Static export configuration
├── tailwind.config.ts      # Custom theme color palettes, typography, spacing
└── wrangler.jsonc          # Cloudflare Worker configuration & custom domain routes
```

---

## 4. Static Site Generation & Dynamic Routes

The site is built with `output: "export"`, producing pure HTML, CSS, JavaScript, and SVG assets in `./out`.

Dynamic routes implement `generateStaticParams()` to ensure all paths are statically baked during `next build`:

1. **Events (`/events/[slug]`):**  
   Pre-rendered from `events` data in `src/data/events.ts`. Injects full `schema.org/Event` JSON-LD metadata for search engines.
2. **Activities (`/activities/[slug]`):**  
   Pre-rendered for all 5 core pillars: Competitive Programming, Hackathons, Technical Workshops, Open Source, and Developer Education.
3. **Blog Articles (`/blog/[slug]`):**  
   Pre-rendered for all published articles. Automatically filters out drafts (`draft: true`). Injects `schema.org/BlogPosting` structured data.
4. **Team Profiles (`/team/[slug]`):**  
   Pre-rendered for verified public profiles (e.g. Faculty Sponsor).

---

## 5. Cloudflare Workers Edge Delivery

### 5.1 Configuration (`wrangler.jsonc`)

```jsonc
{
  "name": "acm-bitmesra-website",
  "main": "src/worker.ts",
  "compatibility_date": "2024-09-23",
  "routes": [
    {
      "pattern": "acmbitm.campsy.app",
      "custom_domain": true
    }
  ],
  "assets": {
    "directory": "./out",
    "binding": "ASSETS",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "404-page"
  }
}
```

### 5.2 Worker Handler & Security Policy (`src/worker.ts`)

Requests to `acmbitm.campsy.app` hit the Cloudflare Worker first. The worker fetches the pre-rendered asset from the `ASSETS` binding and adds standard security headers:

```typescript
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};
```

If the requested resource is absent, the worker serves `404.html` with an HTTP status `404`.

---

## 6. Search Architecture (Cmd+K)

The unified site search (`SearchModal`) operates entirely client-side without relying on an external Algolia or database index:
- Indexes all 6 primary content datasets: Pages, Events, Blog Articles, Resources, Activities, and Public Team Members.
- Weighted keyword matching across titles, descriptions, categories, and tags.
- Keyboard accessible with `Ctrl/Cmd+K` global listener and `Escape` dismissal.

---

## 7. SEO & Structured Data Pipeline

1. **Meta Tags & Canonical URLs:**  
   Managed via Next.js metadata API in each `page.tsx`. Canonical URLs point to `https://acmbitm.campsy.app/<route>`.
2. **Dynamic XML Sitemap:**  
   Generated by `src/app/sitemap.ts`, outputting all static pages and dynamic slugs with change frequency and priority metrics.
3. **Robots.txt:**  
   Generated by `src/app/robots.ts`, referencing `https://acmbitm.campsy.app/sitemap.xml`.
4. **Structured Data:**  
   - `schema.org/Organization` on Root Layout
   - `schema.org/Event` on Event pages
   - `schema.org/BlogPosting` on Blog pages
