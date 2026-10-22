# ACM BIT Mesra Database Migration & Content Ingestion Guide

---

## 1. Schema Management via Drizzle ORM

The application models its relational data using Drizzle ORM mapped to Neon Serverless PostgreSQL.

### Configuration (`drizzle.config.ts`)
- Target Dialect: `postgresql`
- Schema Entrypoint: `src/db/schema/index.ts`
- Migrations Output: `drizzle/`

---

## 2. Migration Execution Process

### Step 1: Generate Migration SQL
```bash
npx drizzle-kit generate
```
This produces idempotent SQL statements under `./drizzle/`.

### Step 2: Safe Execution Against Database
To run migrations safely without interactive terminal prompts in non-interactive environments:
```bash
node scripts/apply-migrations.mjs
```

### Step 3: Seed & Initial Population
```bash
node scripts/seed-initial-data.mjs
```
Populates:
1. Default system roles (`SUPER_ADMIN`, `ADMIN`, `EVENT_MANAGER`, `MODERATOR`, `CONTENT_EDITOR`, `VIEWER`, `STUDENT`)
2. Initial academic batches (`2021-25`, `2022-26`, `2023-27`, `2024-28`, `2025-29`)
3. Static dataset reconciliation into `chapter_events`, `chapter_resources`, and `chapter_members`.

---

## 3. Rollback & Data Preservation Guarantee

- All table migrations preserve existing data using `IF NOT EXISTS` and non-destructive column expansions.
- Historical event participations and registrations are retained when a student disconnects or archives a profile.
