# ACM BIT Mesra Role-Based Access Control (RBAC) Matrix

---

## 1. Role Hierarchy

| Role Key | Hierarchy Level | Target Audience | Primary Responsibilities |
| :--- | :---: | :--- | :--- |
| `SUPER_ADMIN` | 0 | Executive President & Lead Architect | Full platform configuration, role management, system audits |
| `ADMIN` | 10 | Chapter Officers / Core Team | Event management, editorial approvals, member rosters |
| `EVENT_MANAGER` | 20 | Event & Hackathon Leads | Event configuration, team locks, candidate reviews, exports |
| `MODERATOR` | 30 | Review Committee & Volunteers | Contribution reviews, PR approvals, dispute evaluations |
| `CONTENT_EDITOR` | 40 | Editorial & Media Wing | News drafts, blog creation, resource management |
| `VIEWER` | 80 | Institutional Faculty & Observers | Read-only administrative metrics and reports |
| `STUDENT` | 100 | Verified `@bitmesra.ac.in` Students | Profile editing, GitHub linking, event participation, submissions |

---

## 2. Permission Capabilities Matrix

| Operation / Scope | `SUPER_ADMIN` | `ADMIN` | `EVENT_MANAGER` | `MODERATOR` | `CONTENT_EDITOR` | `STUDENT` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Manage Platform Roles & Permissions** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Provision & Deprovision Admins** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Manage Academic Batches / Cohorts** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Create & Publish Events** | ✅ | ✅ | ✅ (Own) | ❌ | ❌ | ❌ |
| **Trigger GitHub Contribution Scans** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Review & Score Contributions** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Publish Official Leaderboards** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Export Event Rosters (CSV/JSON)** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Export Global Platform Data** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Publish Blog Articles & News** | ✅ | ✅ | ❌ | ❌ | ✅ (Drafts) | ❌ |
| **Edit Self Developer Profile** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Connect Personal GitHub Account** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Register for Events / Form Teams** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View Audit Logs** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 3. Anti-Escalation & Security Invariants

1. **Deny-by-Default**: Routes and server actions default to rejecting unauthenticated or unpermitted callers.
2. **Strict Non-Self-Promotion**: No user can grant themselves a higher role level or assign permissions beyond their own hierarchy.
3. **Super Admin Guard**: The system cannot remove or demote the last remaining active `SUPER_ADMIN`.
4. **Ownership Enforcement**: Students can only mutate their own profiles, submissions, and team memberships. Changing an ID in a request payload does not bypass server-side ownership verification.
