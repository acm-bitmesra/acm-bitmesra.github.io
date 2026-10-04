# Security Policy & Architecture

ACM Student Chapter, Birla Institute of Technology, Mesra  
Platform: **ACM BIT Mesra Command Center & Official Portal**  
Repository: `https://github.com/acm-bitmesra/acm-bitmesra.github.io`  
Canonical Deployment: `https://acmbitm.campsy.app`

---

## 1. Zero-Trust Security Model

Authentication does not imply authorization. Every privileged server request and server action independently executes verification through our Zero-Trust validation pipeline:

```text
Incoming Request
       │
       ▼
1. Validate Session Cookie (Better Auth cryptographic signature)
       │
       ▼
2. Extract Verified Identity (University Google Workspace identity)
       │
       ▼
3. Member Registry Lookup (chapter_members table, verified isActive = true)
       │
       ▼
4. Resolve Canonical Role (chapter_roles table, active = true)
       │
       ▼
5. Evaluate Hierarchy & Granular Permissions (role permissions + unexpired member_permissions)
       │
       ▼
6. Resource Ownership & Domain Checks (if mutating articles, members, or settings)
       │
       ▼
7. Execute Action & Record Immutable Security Audit Log (audit_logs table)
```

### Critical Invariants:
- The browser client is **never** trusted to specify `userId`, `memberId`, `role`, `hierarchyLevel`, or `isAdmin`.
- All authorization decisions take place inside server-only functions (`requirePermission`, `getAuthorizedMember`, `requireSuperAdmin`).
- Client components cannot access or import server configuration or environment modules.

---

## 2. Initial Admin Bootstrap & Allowlist Policy

Administrative bootstrap access is restricted to authorized accounts explicitly designated in:

```env
ADMIN_EMAIL_ALLOWLIST="acm@bitmesra.ac.in,Btech10574.24@bitmesra.ac.in"
```

### Bootstrap Rules:
1. **Normalization**: Emails are trimmed and transformed to lowercase (`email.trim().toLowerCase()`) before verification.
2. **Exact Equality**: Only exact string equality matching allowlisted emails is permitted. Domain wildcards (e.g. any `@bitmesra.ac.in` address) are strictly prohibited.
3. **One-Time Provisioning**: Initial bootstrap into `SUPER_ADMIN` happens only if the member does not already exist in the database.
4. **Governance Preservation**: Once a member record exists, subsequent logins **do not** automatically re-grant `SUPER_ADMIN`. This guarantees that legitimate chapter governance, demotions, and handovers cannot be bypassed by relogging in.

---

## 3. Secret Management & Critical Secret Rules

**Absolute Invariant**: Zero secrets or fallback credentials in source code.

- **Prohibited Patterns**:
  - `process.env.DATABASE_URL || "postgresql://..."`
  - `process.env.BETTER_AUTH_SECRET || "fallback-secret"`
  - `const API_KEY = "..."`
  - Any secret prefixed with `NEXT_PUBLIC_`

- **Server-Only Isolation**:
  - Centralized in `src/config/env.ts` with strict Zod schema validation.
  - Server runtime guards throw an immediate fatal error if imported into a client bundle.

- **Storage Channels**:
  - **Local Development**: `.env` and `.dev.vars` (strictly excluded by `.gitignore`).
  - **Cloudflare Workers Production**: Stored exclusively as encrypted Cloudflare Worker Secrets via:
    ```bash
    npx wrangler secret put DATABASE_URL
    npx wrangler secret put BETTER_AUTH_SECRET
    npx wrangler secret put GOOGLE_CLIENT_ID
    npx wrangler secret put GOOGLE_CLIENT_SECRET
    npx wrangler secret put ADMIN_EMAIL_ALLOWLIST
    ```

---

## 4. Credential Audit & Rotation Protocol

During security review of the legacy codebase, fallback connection strings and authentication strings were identified in earlier commits and immediately eliminated:

| Credential Type | Legacy Location | Status | Action Taken |
|---|---|---|---|
| PostgreSQL Connection String | `src/db/index.ts`, `drizzle.config.ts`, `scripts/seed-blog.ts` | **REPLACED & PURGED** | Fallbacks removed; production credentials moved strictly to `.env` / Cloudflare Secrets. Database password rotation initiated on Neon console. |
| Better Auth Session Secret | `src/lib/auth/auth.ts` | **REPLACED & PURGED** | Hardcoded default fallback removed. Cryptographic session secret validated via `src/config/env.ts`. |

### Rotation Checklist for Administrators:
1. **Neon PostgreSQL**: Log into Neon console (`neon.tech`), generate a new role password for `neondb_owner`, and update the secret via `wrangler secret put DATABASE_URL`.
2. **Better Auth Secret**: Generate a fresh 64-character random string (`openssl rand -hex 32`) and update `BETTER_AUTH_SECRET`.
3. **OAuth Credentials**: Rotate Google OAuth client secret on the Google Cloud Console if ever exposed.

---

## 5. Role Hierarchy & Governance Safeguards

The chapter role system enforces strict hierarchical boundaries:

```text
Level 0:  SUPER_ADMIN        (Full platform & security governance)
Level 1:  PRESIDENT          (Executive leadership & publishing head)
Level 2:  VICE_PRESIDENT     (Executive administration)
Level 3:  GENERAL_SECRETARY  (Operations & communication)
Level 4:  JOINT_SECRETARY    (Operations & editorial review)
Level 5:  TECHNICAL_HEAD     (Architecture, systems & coding wings)
Level 6:  CONTENT_HEAD       (Editorial & knowledge curation)
Level 7:  AUTHORIZED_EDITOR  (Peer review & article publishing)
Level 8:  SIG_LEAD           (Technical drafts & SIG guides)
Level 10: CHAPTER_MEMBER     (Draft authoring & student membership)
```

### Hierarchy Rules:
- An administrator can only edit, deactivate, or assign roles to members with a strictly higher numerical level (lower rank).
- No user can promote another user to a role higher than or equal to their own level.
- `SUPER_ADMIN` (level 0) is protected against modification, demotion, or deactivation by any non-Super-Admin user.

---

## 6. Vulnerability Reporting

If you discover a security vulnerability or sensitive information exposure in this repository or live deployment:

1. **Do not create a public GitHub issue.**
2. Send a detailed report directly to the chapter security and executive email:
   - **Email**: `acm@bitmesra.ac.in`
   - **Subject**: `[SECURITY VULNERABILITY REPORT] ACM BIT Mesra Portal`
3. Include reproduction steps, affected URLs/endpoints, and proof-of-concept where possible.
4. The chapter technical team will acknowledge receipt within 24 hours and coordinate responsible disclosure.
