# ACM BIT Mesra Privacy, Security & Data Protection Policy

---

## 1. Zero-Trust Access Invariants

1. **Authentication Boundary**:
   - Google OAuth is strictly gated to verified emails ending in `@bitmesra.ac.in`.
   - Domain validation uses exact normalized server-side string comparison on the domain token.
2. **Authorization Boundary**:
   - Authentication identity (`user`) is strictly decoupled from chapter executive privileges (`chapter_members`).
   - Every administrative API route and server action enforces `requirePermission()`.
3. **Data Ownership Boundary**:
   - Students can only read and mutate their own private profile information, submissions, and registrations.
   - User IDs from requests or URL parameters are never blindly trusted; the authenticated session ID is the sole authority.
4. **Token Security**:
   - OAuth tokens are encrypted at rest or ephemeral.
   - Tokens, passwords, and sensitive session cookies are never logged, exported in CSVs, or returned in client payloads.
5. **Audit Logging**:
   - All role adjustments, account link/unlink operations, event publications, score overrides, and data exports are append-only logged with actor metadata.
