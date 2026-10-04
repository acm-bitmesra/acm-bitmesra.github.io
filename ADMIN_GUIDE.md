# ACM BIT Mesra Command Center — Administrator Guide

Official Operations & Editorial Handbook for Chapter Administrators  
Organization: **ACM Student's Chapter, BIT Mesra**  
Platform: `https://acmbitm.campsy.app/admin`  
Repository: `https://github.com/acm-bitmesra/acm-bitmesra.github.io`

---

## 🧭 Table of Contents
1. [Overview & Role Hierarchy](#1-overview--role-hierarchy)
2. [Logging In & Identity Verification](#2-logging-in--identity-verification)
3. [Global Command Palette (`⌘K`)](#3-global-command-palette-k)
4. [Publishing Technical Articles](#4-publishing-technical-articles)
5. [Creating & Managing Events](#5-creating--managing-events)
6. [Managing Chapter Roster & Assigning Roles](#6-managing-chapter-roster--assigning-roles)
7. [Audit Explorer & Security Incidents](#7-audit-explorer--security-incidents)
8. [Yearly Executive Handover Workflow](#8-yearly-executive-handover-workflow)
9. [Zero-Trust Security & Troubleshooting](#9-zero-trust-security--troubleshooting)

---

## 1. Overview & Role Hierarchy

The ACM BIT Mesra Command Center operates on a **Zero-Trust Role-Based Access Control (RBAC)** architecture. Permissions are enforced strictly server-side on every request and mutation.

### Role Hierarchy Tiers:
| Tier | Role Key | Title | Primary Responsibilities |
| :---: | :--- | :--- | :--- |
| **0** | `SUPER_ADMIN` | Super Admin | Root platform authority, allowlist enforcement, session termination, infrastructure. |
| **1** | `PRESIDENT` | President | Full chapter governance, public declarations, executive committee oversight. |
| **2** | `VICE_PRESIDENT` | Vice President | Executive administration, contest approvals, team lead coordination. |
| **3** | `GENERAL_SECRETARY` | General Secretary | Chapter communications, official announcements, activity records. |
| **4** | `JOINT_SECRETARY` | Joint Secretary | Operational coordination, article review, student inquiries. |
| **5** | `TECHNICAL_HEAD` | Technical Head | Codebase maintenance, system architectures, research notes. |
| **6** | `CONTENT_HEAD` | Content Head | Editorial pipeline, blog publications, social copy, media curation. |
| **7** | `AUTHORIZED_EDITOR` | Editor | Article drafting, peer review, publishing authorized articles. |
| **8** | `SIG_LEAD` | SIG Lead | Special Interest Group coordination (AI, Web, Systems, ICPC). |
| **10**| `CHAPTER_MEMBER` | Member | Internal draft creation, reading, and personal profile management. |

---

## 2. Logging In & Identity Verification

1. Navigate to `https://acmbitm.campsy.app/admin/login`.
2. Click **"Continue with Google"**.
3. Select your official university Google account (`@bitmesra.ac.in`).
4. The server validates your identity against the `ADMIN_EMAIL_ALLOWLIST` and the `chapter_members` PostgreSQL registry.
5. If authorized, you are redirected to the **Command Center Dashboard** (`/admin/dashboard`).
6. If unauthorized, access is denied without disclosing internal permissions (`/admin/unauthorized`).

---

## 3. Global Command Palette (`⌘K`)

Press **`Cmd + K`** (macOS) or **`Ctrl + K`** (Windows/Linux) anywhere in the admin console to open the Command Palette.

### Available Instant Actions:
- **`N`** → Create New Article (`/admin/blog/new`)
- **`E`** → Create New Event (`/admin/events/new`)
- **`M`** → Chapter Roster (`/admin/members`)
- Jump directly to **Audit Logs**, **Security Console**, **Gallery**, **Sponsors**, or **System Health**.
- Navigate using keyboard `↑` / `↓` arrows and press `Enter` to execute.

---

## 4. Publishing Technical Articles

### Editorial Lifecycle:
`DRAFT` → `IN_REVIEW` → `APPROVED` → `PUBLISHED` (or `ARCHIVED`)

1. Open `/admin/blog` and click **"Create Article"**.
2. Fill in:
   - **Title & Slug**: Clear, technical, descriptive.
   - **Category**: `TECHNICAL`, `ICPC`, `OPEN_SOURCE`, `SYSTEMS`, or `ANNOUNCEMENT`.
   - **Excerpt**: 2-3 sentence overview (used for search indexing and social cards).
   - **Markdown Content**: Full GitHub Flavored Markdown support with syntax highlighting.
   - **Reading Time**: Estimated reading time in minutes.
3. Save as `DRAFT` while working.
4. When ready, an Editor or Super Admin holding `blog:publish` permission can promote the status to `PUBLISHED`.
5. Articles instantly reflect on the public blog (`/blog/[slug]`) and invalidate edge cache tags automatically.

---

## 5. Creating & Managing Events

1. Open `/admin/events`.
2. Click **"Add Event"** or choose an existing event to edit.
3. Key fields:
   - **Event Type**: `FLAGSHIP_HACKATHON` (e.g. Hack-A-Bit), `CONTEST` (e.g. CodeZilla), `WORKSHOP`, `TALK`.
   - **Date & Venue**: Physical campus venue or virtual Google Meet/YouTube link.
   - **Registration URL**: External Unstop/Devfolio link or internal Google Form.
   - **Featured Switch**: Highlighting an event mounts it to the Homepage Hero Spotlight.
4. Status transitions: `UPCOMING` → `ONGOING` → `COMPLETED`.

---

## 6. Managing Chapter Roster & Assigning Roles

1. Open `/admin/members`.
2. Locate a member using the real-time search and role filter.
3. Click **"Edit Role"**:
   - Select the target role tier.
   - **Anti-Escalation Rule**: You cannot promote any user to a tier equal to or higher than your own hierarchy level.
   - Self-promotion is strictly rejected server-side.
4. Role changes are immediately committed and an immutable record is appended to `audit_logs`.

---

## 7. Audit Explorer & Security Incidents

1. Open `/admin/audit` to view real-time operations across the platform.
2. Filter by:
   - **Action**: `POST_PUBLISHED`, `ROLE_CHANGED`, `SESSION_REVOKED`, `REDIRECT_CREATED`.
   - **Member**: Specific actor ID.
   - **IP Address**: Cryptographically verified Cloudflare Edge IP (`cf-connecting-ip`).
3. For security alerts and anomalous traffic spikes:
   - Open `/admin/security/incidents`.
   - Correlate incidents by ID and source IP.
   - Append internal investigation notes (notes remain strictly confidential).

---

## 8. Yearly Executive Handover Workflow

At the end of each academic tenure (e.g. June/July transition):

1. Open `/admin/terms/handover` (`/admin/terms`).
2. Follow the **10-Step Handover Checklist**:
   - [x] Verify election of incoming President, VP, and General Secretary.
   - [x] Rotate GitHub Organization Owner rights to incoming Tech Head.
   - [x] Rotate official social media credentials (Instagram, LinkedIn, X).
   - [x] Update `ADMIN_EMAIL_ALLOWLIST` in Cloudflare Worker Secrets:
     ```bash
     wrangler secret put ADMIN_EMAIL_ALLOWLIST
     ```
   - [x] Revoke outgoing administrative sessions in `/admin/security/sessions`.
   - [x] Offboard outgoing executives to `Alumni` or `Viewer` status.
3. Click **"Export End-of-Term Report"** to download the signed institutional archive JSON file for historical records.

---

## 9. Zero-Trust Security & Troubleshooting

- **"UNAUTHORIZED / FORBIDDEN"**: Verify that your active Google account is listed in `ADMIN_EMAIL_ALLOWLIST` and that your role in `chapter_members` contains the required permission.
- **Session Expiry**: Sessions expire after 7 days of inactivity. Simply sign back in with your university account.
- **Reporting Vulnerabilities**: Review [`SECURITY.md`](./SECURITY.md) and report security concerns immediately to `acm@bitmesra.ac.in`.
