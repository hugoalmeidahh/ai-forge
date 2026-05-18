---
name: upgrade-prisma-v7
description: Upgrade a NestJS project from Prisma v6 to v7 using the PrismaPg adapter and generated client output.
---

# Upgrade Prisma v7

## Intent

Migrate a NestJS project from Prisma v6 (`prisma-client-js`) to Prisma v7 (`prisma-client`) with the `@prisma/adapter-pg` driver adapter and per-schema generated client output.

## When To Use

- When a project still uses `@prisma/client` v6 and `prisma` v6.
- When `schema.prisma` still has `provider = "prisma-client-js"` or lacks an `output` field.
- When PrismaService still passes the connection URL directly via `datasource.url = env(...)` in the schema instead of through the adapter.

## References

- `node_modules/@core/ai-prompts/backend-team/project-standards/SKILL.md` — apply after changes
- Template reference: `/home/jakeliny/Projects/template-api-monolith/`

## Workflow

### Step 1 — Discover all Prisma schemas

Search the project for every `schema.prisma` file:

```
Glob: **/schema.prisma (excluding node_modules, dist)
```

For each schema, note:
- Its directory path (e.g. `prisma/`, `prisma-transaction/`, `prisma-user/`)
- Whether it has a `migrations/` folder → **has migrations**
- Whether it is the "main" schema (referenced by the root `prisma.config.ts`) or a secondary schema

### Step 2 — Update `package.json`

1. Bump dependencies:
   - `@prisma/client`: `^7.x.x` (latest stable)
   - `prisma` (devDependency): `^7.x.x`
2. Add new dependency: `@prisma/adapter-pg`: `^7.x.x`
3. Update the `prisma:generate` script:
   - Main schema (root config): `npx prisma generate`
   - Each secondary schema: `npx prisma generate --schema=./path/to/schema.prisma --config=./path/to/prisma.config.ts`
   - Chain all with `&&`
   - Example for two schemas:
     ```
     "prisma:generate": "npx prisma generate && npx prisma generate --schema=./prisma-transaction/schema.prisma --config=./prisma-transaction/prisma.config.ts"
     ```
4. Run `npm install` to update `package-lock.json`.

### Step 3 — Create/update `prisma.config.ts` files

**Main schema** (`prisma.config.ts` at project root — for the schema that owns migrations):

```ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URI'),  // use the correct env var name
  },
});
```

**Secondary schemas** (e.g. `prisma-transaction/prisma.config.ts` — schemas WITHOUT migrations, like worker DBs or read-only replicas):

```ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma-transaction/schema.prisma',
  // no `migrations` block — this schema has no migrations
  datasource: {
    url: env('DATABASE_TRANSACTION_URI'),  // use the correct env var name
  },
});
```

> **Decision rule:** Only add a `migrations` block if the schema directory contains a `migrations/` folder and the project runs `prisma migrate` against it. Workers and auxiliary DBs typically don't.

### Step 4 — Update each `schema.prisma`

For every schema file found in Step 1:

1. Change generator provider:
   ```diff
   - provider = "prisma-client-js"
   + provider = "prisma-client"
   +  output   = "./generated/prisma"
   ```
2. Remove the `url` from the `datasource` block (it is now in `prisma.config.ts`):
   ```diff
   datasource db {
     provider = "postgresql"
   -  url      = env("DATABASE_URI")
   }
   ```

### Step 5 — Update PrismaService files

For each `*prisma*.service.ts` (e.g. `prisma.service.ts`, `prisma-transaction.service.ts`, `prisma-user.service.ts`):

1. Add the adapter import:
   ```ts
   import { PrismaPg } from '@prisma/adapter-pg';
   ```
2. Update the client import to use the generated path:
   ```ts
   // before
   import { Prisma, PrismaClient } from '@prisma/client';
   // after
   import { Prisma, PrismaClient } from '../../../../prisma/generated/prisma/client';
   // adjust relative path depth to match the file location
   ```
3. Read the connection string from `ConfigService` and guard it:
   ```ts
   constructor(private config: ConfigService) {
     const connectionString = config.get<string>('DATABASE_URI');
     if (!connectionString) {
       throw new Error('Missing DATABASE_URI environment variable');
     }
     super({
       adapter: new PrismaPg({ connectionString }),
       log: [ ... ],
     });
   ```
4. Remove any leftover `url` option passed to `super()`.

### Step 6 — Update all Prisma type imports across the codebase

Search for all files importing from old Prisma paths:

```
Grep: from '@prisma/client'
Grep: from '@internal/prisma-*/client'
Grep: from '.*runtime/library'
```

For each file found:

1. Replace `@prisma/client` with the generated path (adjust relative depth):
   ```ts
   // main schema
   from '../../../../prisma/generated/prisma/client'
   // secondary schema
   from '../../../../prisma-transaction/generated/prisma/client'
   ```
2. Remove `DefaultArgs` import from `runtime/library` — it no longer exists in v7:
   ```diff
   - import { DefaultArgs } from '../../../../prisma/generated/prisma/runtime/library';
   ```
3. Remove `DefaultArgs` type parameters from delegate declarations:
   ```diff
   - private repository: Prisma.AccountDelegate<DefaultArgs, Prisma.PrismaClientOptions>;
   + private repository: Prisma.AccountDelegate;
   ```

### Step 7 — Generate clients

```bash
npm run prisma:generate
```

Confirm that `generated/prisma/` directories appear inside each schema folder.

### Step 8 — Build and fix TypeScript errors

```bash
npm run build
```

Fix all TypeScript compilation errors before considering the task done. Common errors after migration:

- `DefaultArgs` still referenced somewhere → remove import and type parameter
- Delegate type still has generic args → simplify to `Prisma.XxxDelegate`
- Import path points to old `@prisma/client` → update to generated path
- `runtime/library` import not found → remove it

Repeat build until it exits with zero errors.

## Checks

- [ ] `npm run prisma:generate` completes without errors
- [ ] `npm run build` completes without TypeScript errors
- [ ] Every `schema.prisma` uses `provider = "prisma-client"` with `output`
- [ ] Every `datasource` block has no `url` field (moved to `prisma.config.ts`)
- [ ] Every `PrismaService` uses `PrismaPg` adapter and validates the env var at startup
- [ ] No file imports from `@prisma/client` (only from generated paths)
- [ ] No file imports `DefaultArgs` from `runtime/library`
- [ ] Secondary schemas without migrations have no `migrations` block in their `prisma.config.ts`
