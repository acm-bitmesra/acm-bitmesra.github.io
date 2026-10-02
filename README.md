# ACM BIT Mesra — Official Website

Official digital platform and institutional archive for the **ACM Student Chapter, Birla Institute of Technology, Mesra** (Ranchi, Jharkhand, India).

Rebuilt with Next.js App Router, TypeScript, Tailwind CSS, Lucide icons, and deployed natively on **Cloudflare Workers** with edge asset delivery at [acmbitm.campsy.app](https://acmbitm.campsy.app).

---

## 🛠 Technology Stack

- **Runtime & Scripts:** [Bun](https://bun.sh) / [Node.js](https://nodejs.org) (v20+)
- **Framework:** [Next.js 15](https://nextjs.org) (App Router, Static Export Architecture)
- **Language:** [TypeScript](https://www.typescriptlang.org) (Strict Mode)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) + Custom ACM Design System tokens
- **Icons:** [Lucide React](https://lucide.dev)
- **Edge Deployment:** [Cloudflare Workers](https://workers.cloudflare.com) (Static Assets + Security Worker)
- **Custom Domain:** `acmbitm.campsy.app`
- **Linting & Code Quality:** ESLint, Prettier

---

## 🚀 Quick Start

### 1. Installation

```bash
# Using Bun (or npm)
bun install
# or
npm install
```

### 2. Development Server

```bash
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### 3. Production Build & Static Export

```bash
bun run build
# or
npm run build
```

The compiled, static production assets are emitted into `./out`.

### 4. Cloudflare Worker Deployment

```bash
# Deploy to Cloudflare Workers with custom domain acmbitm.campsy.app
bun run cf:deploy
# or
npx wrangler deploy
```

---

## 📁 Repository Structure

```text
├── CONTENT_AUDIT.md        # Content audit and verification policies
├── public/                 # Static assets, branding, vectors
├── src/
│   ├── app/                # Next.js App Router routes & layouts
│   ├── components/         # Reusable UI components & layouts
│   ├── config/             # Site configuration, navigation, constants
│   ├── data/               # Strictly typed data layers (events, team, resources)
│   ├── content/            # Editorial & blog content (MDX/Markdown)
│   ├── lib/                # Utilities and date helpers
│   ├── types/              # TypeScript models & schema definitions
│   └── worker.ts           # Cloudflare Worker entry point
├── next.config.ts          # Next.js configuration (static export)
├── tailwind.config.ts      # Tailwind CSS design system tokens
└── wrangler.jsonc          # Cloudflare Worker & Custom Domain routing
```

---

## 📚 Comprehensive Documentation

- [**System Architecture (`ARCHITECTURE.md`)**](ARCHITECTURE.md) — Technical overview, SSG pipeline, Cloudflare Worker design, and performance.
- [**Content Management Guide (`CONTENT_GUIDE.md`)**](CONTENT_GUIDE.md) — Instructions for updating events, blogs, team members, and verification policies.
- [**Deployment Guide (`DEPLOYMENT.md`)**](DEPLOYMENT.md) — Cloudflare Workers, custom domain (`acmbitm.campsy.app`), and DNS setup.
- [**Contributing Guidelines (`CONTRIBUTING.md`)**](CONTRIBUTING.md) — Developer setup, coding conventions, and PR workflow.
- [**Design System Specification (`DESIGN_SYSTEM.md`)**](DESIGN_SYSTEM.md) — Color tokens, typography scales, and UI guidelines.
- [**Content Audit Baseline (`CONTENT_AUDIT.md`)**](CONTENT_AUDIT.md) — Section 67 verification policy and legacy asset analysis.

---

## 📜 License

Licensed under the [MIT License](LICENSE). Built with pride by the ACM BIT Mesra community.
