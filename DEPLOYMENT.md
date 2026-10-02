# Cloudflare Workers Deployment Guide — ACM BIT Mesra

Complete instructions for building, deploying, and managing the official ACM BIT Mesra website on **Cloudflare Workers** with the custom domain `acmbitm.campsy.app`.

---

## 1. Prerequisites

Before deploying, ensure you have:
1. **Cloudflare Account:** Access to the Cloudflare dashboard containing the domain `campsy.app` or permissions to manage Workers.
2. **Wrangler CLI:** Cloudflare's official command-line interface installed (included in `devDependencies`).
3. **Node.js (v20+) or Bun:** Runtime environment for building Next.js static assets.

---

## 2. Wrangler Configuration (`wrangler.jsonc`)

The deployment configuration is maintained in `wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "acm-bitmesra-website",
  "main": "src/worker.ts",
  "compatibility_date": "2024-09-23",
  "compatibility_flags": ["nodejs_compat"],
  "routes": [
    {
      "pattern": "acmbitm.campsy.app",
      "custom_domain": true
    }
  ],
  "assets": {
    "directory": "./out",
    "binding": "ASSETS",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "404-page"
  }
}
```

### Key Parameters:
- `pattern: "acmbitm.campsy.app"` with `custom_domain: true`: Cloudflare automatically creates and routes the custom domain to this worker, provisioning a managed SSL certificate.
- `assets.directory: "./out"`: Directs Cloudflare to serve the pre-rendered Next.js static export.
- `html_handling: "auto-trailing-slash"`: Seamlessly resolves both `/events` and `/events/` to `/events.html` or `/events/index.html`.
- `not_found_handling: "404-page"`: Fallback to `./out/404.html` when a resource is not found.

---

## 3. Local Deployment Workflow

### Step 1: Authenticate with Cloudflare

```bash
# Log in to Cloudflare via browser OAuth
npx wrangler login
```

Verify your authenticated account:
```bash
npx wrangler whoami
```

### Step 2: Run Quality & Integrity Tests

Ensure the build compiles cleanly with zero type errors, lint warnings, or broken links:

```bash
npm run test
# or
bun run test
```

### Step 3: Compile Static Production Assets

```bash
npm run build
# or
bun run build
```

This generates all 38+ static HTML pages, sitemap, robots, and SVG vectors in the `./out` directory.

### Step 4: Deploy to Cloudflare Workers

```bash
npm run cf:deploy
# or
bun run cf:deploy
# or
npx wrangler deploy
```

Wrangler uploads the static assets, deploys the edge worker script (`src/worker.ts`), and configures the route `acmbitm.campsy.app`.

---

## 4. Cloudflare Dashboard Domain Setup

If configuring manually or verifying status via the web UI:

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Select **Compute (Workers & Pages)** → Click on **`acm-bitmesra-website`**.
3. Navigate to **Settings** → **Domains & Routes**.
4. Click **Add** → **Custom Domain**.
5. Enter: `acmbitm.campsy.app`.
6. Click **Add Custom Domain**. Cloudflare will provision DNS and generate a free edge SSL certificate.

---

## 5. Preview & Staging Deployments

To deploy a preview version without affecting the production domain:

```bash
# Deploy to a development worker URL (e.g. acm-bitmesra-website.<subdomain>.workers.dev)
npx wrangler deploy --env preview
```

---

## 6. Continuous Deployment (GitHub Actions)

To enable automated zero-downtime deployments on every push to `main`, configure `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Test Suite
        run: npm run test

      - name: Build Next.js Static Export
        run: npm run build

      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```
