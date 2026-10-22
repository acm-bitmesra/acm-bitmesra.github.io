# ACM BIT Mesra Platform Operations & Deployment Manual

---

## 1. Cloudflare Workers + OpenNext Architecture

- Framework: Next.js 15 App Router
- Target Runtime: Cloudflare Workers with `nodejs_compat` via `@opennextjs/cloudflare`
- Custom Domain: `acmbitm.campsy.app`

---

## 2. Build & Deploy Commands

```bash
# Typecheck
bun run typecheck

# Lint
bun run lint

# Run verification test suite
bun run test

# Build OpenNext Cloudflare Worker
bun run build:worker

# Deploy to Cloudflare Production
bun run deploy
```

---

## 3. Incident Response & Rollback Strategy

1. **Rollback Deployment**:
   If an edge runtime issue is identified in production, roll back to the previously active version via Wrangler:
   ```bash
   npx wrangler rollback [DEPLOYMENT_ID]
   ```
2. **Database Resilience**:
   Neon Serverless PostgreSQL maintains point-in-time recovery branches. In case of unintended data corruption, branch restore can be executed via the Neon console.
