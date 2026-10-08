# Contributing to ACM BIT Mesra Official Website

Thank you for your interest in contributing to the **ACM Student Chapter, BIT Mesra** official website! We welcome contributions from BIT Mesra students, alumni, and open-source contributors.

---

## 1. Code of Conduct

We are committed to providing a welcoming, inclusive, and professional environment. All contributors are expected to adhere to standard ACM community guidelines:
- Be respectful, constructive, and collaborative.
- Zero tolerance for harassment, derogatory language, or academic dishonesty.
- Credit open-source libraries, assets, and inspirations appropriately.

---

## 2. Getting Started

### Prerequisites
- Node.js 20+ or Bun
- Git

### Initial Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/acm-bitmesra/acm-bitmesra.github.io.git
cd acm-bitmesra.github.io

# 2. Install dependencies
bun install

# 3. Start local development server
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your changes live.

---

## 3. Git Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification to keep the Git history readable and structured:

- `feat:` A new feature or user-facing route
- `fix:` A bug fix or accessibility correction
- `docs:` Documentation updates (`README`, `ARCHITECTURE`, etc.)
- `perf:` Performance improvements or asset optimizations
- `chore:` Maintenance tasks, dependency bumps, or toolchain configuration
- `test:` Adding or updating tests and validation scripts

### Example Commits:
```bash
git commit -m "feat: add ICPC regional qualification roadmap"
git commit -m "fix: adjust mobile drawer focus trap"
git commit -m "docs: update sponsorship contact instructions"
```

---

## 4. Coding Standards

- **TypeScript:** Strict type checking is enabled. Never use `any` unless strictly justified with an explanatory comment.
- **Styling:** Use Tailwind utility classes following the project's color and spacing tokens. Avoid arbitrary Tailwind classes (e.g. `p-[13px]`) where standard design tokens exist.
- **Components:** Server Components by default. Use `"use client"` only for components requiring browser APIs, state, or event listeners.
- **Accessibility:** Ensure semantic HTML elements (`<main>`, `<nav>`, `<article>`, `<button>`). Ensure color contrast meets WCAG AA standards.
- **Data Integrity:** Follow `CONTENT_GUIDE.md` for adding events or team members. Never commit unverified factual claims.

---

## 5. Verification Before Submitting a Pull Request

Always run the full test suite locally before pushing:

```bash
# Runs typecheck, linting, build, and production route validation
bun run test
```

All checks must pass with **0 errors and 0 warnings**.

---

## 6. Pull Request Workflow

1. Create a descriptive branch from `main`:
   ```bash
   git checkout -b feature/event-calendar-export
   ```
2. Make your focused changes and commit using conventional commit messages.
3. Push your branch to your fork.
4. Open a Pull Request against `main`.
5. Clearly describe what changed and link any relevant issues.
6. A chapter maintainer will review your PR and provide feedback.
