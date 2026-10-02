# Content Audit & Verification Baseline
**ACM Student's Chapter, BIT Mesra**
*Birla Institute of Technology, Mesra, Ranchi, Jharkhand, India*
*Repository: https://github.com/acm-bitmesra/acm-bitmesra.github.io*

---

## 1. Executive Summary & Purpose

This document establishes the verified content baseline and audit trail for the official website rebuild of the ACM Student Chapter at Birla Institute of Technology (BIT), Mesra. 

In strict adherence to the project specification (Section 67: *Content Verification Rule*), **no unverified statistics, fictitious alumni quotes, fabricated competition winners, hallucinated executive committee members, or fake corporate sponsors** are permitted on the public site.

Where official historical records or current chapter appointments are pending confirmation from the Faculty Sponsor or Executive Body, records are explicitly tagged with `TODO: VERIFY` internally and omitted from public display or rendered with transparent institutional notices.

---

## 2. Repository History Audit

An audit of the previous commits (`2dfbe38` through `febde34`) reveals:
- **Initial prototype:** Basic Next.js scaffolding with preliminary conceptual project ideas (*Campus Security Platform*, *Institute Fest Platform*, *Smart Attendance*, *Digital Hostel Food Coupon*, *Lost ID Finder System*) and draft SIG categories.
- **Obsolete implementation:** The prior codebase lacked a unified ACM design system, typed event lifecycle management, structured dynamic routes for all chapter activities, WCAG AA compliance, and Cloudflare Worker native deployment.
- **Retained assets:** Official ACM BIT Mesra branding vectors (`app/icon.svg` ACM red crest), core domain mappings (`https://acm-bitmesra.github.io`), and technical focus areas (Competitive Programming, Systems, Open Source, AI & Data).

---

## 3. Verification Matrix

| Area | Current Status | Action / Policy |
| :--- | :--- | :--- |
| **Institutional Affiliation** | Verified | Birla Institute of Technology, Mesra, Ranchi, Jharkhand (Deemed University, est. 1955). Official ACM Student Chapter. |
| **Pillar Activities** | Verified | Competitive Programming (ICPC preparation, DSA), Hackathons (Hack-A-Bit), Technical Workshops, Open Source & Developer Community, Systems & Research. |
| **Flagship Events** | Documented | • **Hack-A-Bit:** Flagship annual hackathon.<br>• **CodeZilla:** Annual competitive programming contest.<br>• **CQM (Code Quotient Monthly):** Regular algorithmic challenges.<br>• **ICPC Track:** Regional contest preparation & practice sprints. |
| **Executive Body (Current)** | Pending Verification | Roles (Faculty Sponsor, President, Vice President, General Secretary, Treasurer, Tech Leads) require annual roster confirmation from student affairs / faculty advisor. Data layer uses typed placeholders marked `TODO: VERIFY`. Unverified identities will NOT be rendered to visitors. |
| **Alumni Archive** | Pending Documentation | Historical executive lists from prior academic batches are maintained in `src/data/team.ts` with explicit verification flags. |
| **Event Winners & Results** | Pending Historical Logs | Specific podium rankings and team rosters for previous Hack-A-Bit editions require verification from past archives before public rendering. |
| **Sponsors & Partners** | Pending Confirmation | Only institutional partners (ACM Global, BIT Mesra) and verified past partners are surfaced. No unverified corporate logos may be displayed. |
| **Recruitment & Inductions** | Documented Workflow | Outlines standard engineering chapter selection pipeline (registration, screening, coding round, interaction) without inventing arbitrary dates or cutoffs. |
| **Contact & Channels** | Documented | Centralized in `src/config/site.ts`. Official GitHub org: `acm-bitmesra`. Email and social handles are configurable. |

---

## 4. Content Writing Guidelines
- **Tone:** Technical, confident, institutional, precise, and inspiring.
- **Banned Copy:** Generic marketing clichés ("*Welcome to the wonderful world of coding*"), AI buzzword salad, fake placement claims, or claiming credit for personal student career outcomes.
- **Approved Taglines:**
  - *"Think deeply. Build boldly. Compete together. Share what you learn."*
  - *"Build. Compete. Create."*
  - *"A technical community at BIT Mesra empowering students through computing, open source, and collaborative engineering."*

---

## 5. Maintenance Protocol for Future Executive Bodies
1. To update the executive team: Edit `src/data/team.ts` and set `isVerified: true` once approved by the Faculty Sponsor.
2. To add an event: Add an entry to `src/data/events.ts` following the strict `Event` interface with valid ISO dates and lifecycle status (`upcoming`, `live`, `completed`, `archived`).
3. To publish technical writing: Add MDX/Markdown files to `src/content/blog/` with valid frontmatter. Draft articles (`draft: true`) are automatically excluded from production builds.
