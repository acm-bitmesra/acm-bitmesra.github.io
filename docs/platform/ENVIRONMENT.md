# ACM BIT Mesra Student Developer Platform — Environment Configuration

---

## 1. Environment Variable Inventory

| Variable Name | Status | Type | Purpose | Production Setup |
| :--- | :---: | :---: | :--- | :--- |
| `DATABASE_URL` | **Required** | Secret | Neon PostgreSQL connection string (pooled) | `wrangler secret put DATABASE_URL` |
| `BETTER_AUTH_SECRET` | **Required** | Secret | High-entropy session signing secret (min. 32 chars) | `wrangler secret put BETTER_AUTH_SECRET` |
| `BETTER_AUTH_URL` | **Required** | Public | Canonical platform origin URL (`https://acmbitm.campsy.app`) | Configured in wrangler / env |
| `PUBLIC_SITE_URL` | **Required** | Public | Public origin for OpenGraph, sitemaps, and metadata | Configured in wrangler / env |
| `GOOGLE_CLIENT_ID` | **Required** | Public | Google OAuth Client ID for `@bitmesra.ac.in` sign-in | Cloud Console Credentials |
| `GOOGLE_CLIENT_SECRET` | **Required** | Secret | Google OAuth Client Secret | `wrangler secret put GOOGLE_CLIENT_SECRET` |
| `GITHUB_CLIENT_ID` | **Optional** | Public | GitHub OAuth Client ID for developer account linking | GitHub Developer Settings |
| `GITHUB_CLIENT_SECRET` | **Optional** | Secret | GitHub OAuth Client Secret | `wrangler secret put GITHUB_CLIENT_SECRET` |
| `GITHUB_REDIRECT_URI` | **Optional** | Public | Callback URI for GitHub account linking | `https://acmbitm.campsy.app/api/integrations/github/callback` |
| `ADMIN_EMAIL_ALLOWLIST`| **Required** | Secret | Comma-separated allowlist of bootstrap super-admins | `wrangler secret put ADMIN_EMAIL_ALLOWLIST` |
| `ALLOWED_STUDENT_EMAIL_DOMAIN` | **Default** | Public | Exact allowed university domain (default: `bitmesra.ac.in`) | Configured in env |
| `OAUTH_TOKEN_ENCRYPTION_KEY` | **Optional** | Secret | 256-bit AES encryption key for token storage at rest | `wrangler secret put OAUTH_TOKEN_ENCRYPTION_KEY` |

---

## 2. Local Setup Guide

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set your Neon database URL in `DATABASE_URL`.
3. Generate a strong Better Auth secret:
   ```bash
   openssl rand -base64 32
   ```
4. Set `BETTER_AUTH_URL=http://localhost:3000` and `PUBLIC_SITE_URL=http://localhost:3000`.
5. Obtain Google OAuth credentials from the Google Cloud Console (Authorized Redirect: `http://localhost:3000/api/auth/callback/google`).
6. (Optional) Create a GitHub OAuth App in GitHub Developer Settings (Authorized Callback: `http://localhost:3000/api/integrations/github/callback`).

---

## 3. Cloudflare Production Provisioning

Provision production secrets on Cloudflare Workers using Wrangler CLI:
```bash
bun x wrangler secret put DATABASE_URL
bun x wrangler secret put BETTER_AUTH_SECRET
bun x wrangler secret put GOOGLE_CLIENT_SECRET
bun x wrangler secret put GITHUB_CLIENT_SECRET
bun x wrangler secret put ADMIN_EMAIL_ALLOWLIST
```

---

## 4. GitHub Actions CI/CD Secrets

For automated continuous integration and Cloudflare deployments via `.github/workflows/deploy.yml`, the following secrets are configured in repository settings (`Settings` → `Secrets and variables` → `Actions`):

| Secret Name | Purpose | Example / Format |
| :--- | :--- | :--- |
| `CLOUDFLARE_API_TOKEN` | Wrangler deployment token | Cloudflare User Token with Workers Edit permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare target account ID | 32-character hexadecimal string |
| `DATABASE_URL` | Neon database connection for CI tests & build | `postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require` |
| `BETTER_AUTH_SECRET` | Cryptographic session signing | 32+ character random string |
| `BETTER_AUTH_URL` | Canonical platform URL | `https://acmbitm.campsy.app` |
| `PUBLIC_SITE_URL` | Public site domain | `https://acmbitm.campsy.app` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `*.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | Google Cloud secret |
| `GH_CLIENT_ID` | GitHub integration client ID *(must use `GH_`)* | GitHub App Client ID |
| `GH_CLIENT_SECRET` | GitHub integration client secret *(must use `GH_`)* | GitHub App Client Secret |
| `GH_REDIRECT_URI` | GitHub integration callback URI | `https://acmbitm.campsy.app/api/integrations/github/callback` |
| `ADMIN_EMAIL_ALLOWLIST` | Superadmin bootstrap list | `acm@bitmesra.ac.in,Btech10574.24@bitmesra.ac.in` |

*Note: GitHub Actions forbids custom secret names from starting with `GITHUB_`. The workflow maps `GH_CLIENT_ID`, `GH_CLIENT_SECRET`, and `GH_REDIRECT_URI` to their respective application variables.*

