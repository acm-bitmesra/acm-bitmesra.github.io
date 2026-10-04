# ACM BIT MESRA OFFICIAL WEBSITE

[![Production Deployment](https://img.shields.io/badge/Production-Live-success?style=flat-square&logo=cloudflare)](https://acmbitm.campsy.app)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-OpenNext-F38020?style=flat-square&logo=cloudflare)](https://workers.cloudflare.com)
[![Neon Postgres](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=flat-square&logo=postgresql)](https://neon.tech)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

Official digital platform, engineering editorial, and institutional knowledge archive for the **ACM Student Chapter, Birla Institute of Technology, Mesra** (Ranchi, Jharkhand, India).

- **Live URL:** [https://acmbitm.campsy.app](https://acmbitm.campsy.app)
- **Alternate Mirror:** [https://acm-bitmesra.github.io](https://acm-bitmesra.github.io)
- **Institution:** Department of Computer Science & Engineering, BIT Mesra

---

## 🎯 Purpose & Capabilities

ACM BIT Mesra empowers undergraduate and postgraduate students through algorithmic problem solving, software engineering, developer education, and collaborative open source. This official platform serves as:

1. **Chapter Information & Discovery:**
   - **Hero & Identity:** Core ethos (*Build. Compete. Ship.*), institutional affiliations, and chapter history.
   - **Focus Areas:** Deep dives into Competitive Programming, Systems & Web Engineering, Applied AI / Research, and Developer Community.
   - **Executive Team:** Verified leadership directory, faculty sponsor ([Dr. Sumit Srivastava](https://acmbitm.campsy.app/team/dr-sumit-srivastava)), and domain coordinators.

2. **Events & Hackathons Hub:**
   - **Hacktoberfest 2026:** Flagship celebration of open source and open-weight AI experimentation.
   - **Hack-A-Bit:** Eastern India's premier annual 36-hour student hackathon archive.
   - **CodeZilla & CQM:** Annual flagship coding contest and monthly Code Quotient algorithmic sprints.
   - **Event State Engine:** Transparent registration states (`Registration Opening Soon`, `Registration Open`, `Live Now`, `Completed`).

3. **Knowledge & Editorial Platform:**
   - **Chapter Dispatches:** Database-backed engineering editorial and contest analysis powered by Neon PostgreSQL and Drizzle ORM.
   - **Curated Learning Hub:** Vetted DSA roadmaps, algorithmic sheets ([AlgoForge](https://stack-shade.github.io/algoforge/), [Striver A2Z DSA](https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/)), CSES problem set, and systems tracks.

4. **Modern UI/UX & Accessibility:**
   - **Dark & Light Mode:** Zero-FOUC theme engine with `localStorage` persistence and system preferences fallback.
   - **Responsive Breakpoints:** Container-based fluid layouts across 1440px, 1280px, 1024px, 768px, 640px, and mobile viewports.
   - **Impeccable Style:** High-contrast typography (≥4.5:1), min-44px tap targets, visible focus rings, and strict `whitespace-nowrap` on navigation and action controls.
   - **Instant Search:** Client-side fuzzy search (`⌘K`) across events, articles, resources, team members, and chapter activities.

---

## 🛠 Technology Stack

| Layer | Technologies |
|---|---|
| **Runtime & Package Manager** | [Bun](https://bun.sh) / [Node.js](https://nodejs.org) (v20+) |
| **Frontend Framework** | [Next.js 15.1.7](https://nextjs.org) (App Router, Server Components) |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org) (Strict Mode) |
| **Styling & Design System** | [Tailwind CSS 3.4](https://tailwindcss.com) + Impeccable Design Tokens |
| **Icons & Media** | [Lucide React](https://lucide.dev) + Custom SVG Vectors |
| **Database & ORM** | [Neon Serverless PostgreSQL](https://neon.tech) + [Drizzle ORM](https://orm.drizzle.team) |
| **Authentication** | [Better-Auth](https://better-auth.com) |
| **Edge Deployment** | [Cloudflare Workers](https://workers.cloudflare.com) via [@opennextjs/cloudflare](https://opennext.js.org/cloudflare) |
| **Domain** | `acmbitm.campsy.app` (Cloudflare Custom Domain) |

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js v20+
- Git

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/acm-bitmesra/acm-bitmesra.github.io.git
cd acm-bitmesra.github.io

# Install dependencies using Bun
bun install
# or using npm
npm install
```

### 2. Run Local Development Server

```bash
bun run dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Type Checking & Code Quality

```bash
# Typecheck TypeScript without emitting output
bun run typecheck

# Run Next.js ESLint verification
bun run lint
```

### 4. Build for Production

```bash
# Compile Next.js application
bun run build

# Package bundle with OpenNext for Cloudflare Workers
bun run build:worker
```

### 5. Deploy to Cloudflare Workers

```bash
# Build and deploy directly to Cloudflare edge
bun run deploy
```

---

## 📁 Repository Structure

```text
acm-bitmesra.github.io/
├── public/                 # Static brand assets, PWA icons, manifest, OG images
│   ├── icon.svg            # Official ACM BIT Mesra vector mark
│   ├── og.png              # OpenGraph 1200x630 social preview card
│   └── manifest.webmanifest# Progressive Web App metadata
├── src/
│   ├── app/                # Next.js App Router (pages, API routes, layout)
│   │   ├── (public)/       # Public routes: /, /about, /events, /team, /resources, /blog
│   │   ├── admin/          # Admin moderation & blog authoring console
│   │   ├── api/            # API endpoints: auth, blog RSS, dispatches
│   │   ├── layout.tsx      # Root layout, theme script, SEO metadata
│   │   └── globals.css     # Design tokens, surface colors, focus rings
│   ├── components/         # Modular React components
│   │   ├── layout/         # Navbar, Footer, Mobile Drawer, SiteLayout
│   │   ├── sections/       # Hero, StatsStrip, FeaturedEvent, UpcomingEvents, Pillars
│   │   ├── events/         # EventCard, EventsExplorer, EventShareActions
│   │   ├── blog/           # ArticleCard, BlogGrid, MarkdownRenderer
│   │   ├── ui/             # Badge, Button, ThemeToggle, Custom Icons
│   │   └── search/         # Keyboard-navigable SearchModal (⌘K)
│   ├── config/             # Site configuration, navigation links, socials
│   ├── data/               # Static fallback data (events, team, resources, stats)
│   ├── db/                 # Drizzle ORM schema, migrations, Neon database client
│   └── lib/                # Date formatting, utilities, sanitization
├── opennext.config.ts      # OpenNext Cloudflare Workers bundling configuration
├── wrangler.jsonc          # Cloudflare Worker routes and assets binding
└── package.json            # Scripts and dependencies
```

---

## 🌐 Official Social & Chapter Links

- **Instagram:** [@acmbitm](https://www.instagram.com/acmbitm?stkn=MXB1c3plOWYyeHFlZg==)
- **LinkedIn:** [ACM BIT Mesra](https://www.linkedin.com/company/acmbitm/)
- **GitHub:** [@acm-bitmesra](https://github.com/acm-bitmesra)
- **Email:** `acm@bitmesra.ac.in`
- **Campus Address:** Department of Computer Science & Engineering, Birla Institute of Technology, Mesra, Ranchi, Jharkhand 835215, India

---

## 📜 License

Licensed under the [MIT License](LICENSE). Built with pride and precision by the ACM BIT Mesra student community.
