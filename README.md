# dive-nerd

A monorepo for dive planning and physics tooling, built with Next.js 14, Auth0,
and Turborepo + pnpm workspaces.

```
dive-nerd/
├── apps/
│   └── web/         # Next.js app (App Router)
└── packages/
    ├── dive-physics/
    └── dive-planner/
```

## Prerequisites

- Node.js `22.x` LTS (managed via [Volta](https://volta.sh) — `volta install node@22.12.0`, or via [nvm](https://github.com/nvm-sh/nvm) using the included `.nvmrc`)
- pnpm `8.15.3` (`volta install pnpm@8.15.3`)
- An [Auth0](https://manage.auth0.com) tenant + Application (Regular Web App)

## 1. Install dependencies

```bash
pnpm install
```

## 2. Configure environment variables

The root `pnpm dev` script loads `.env.local` from the repo root via
`dotenv-cli` and forwards the values into every workspace package through
Turborepo. So **all env vars live in a single `.env.local` at the repo root**,
not inside `apps/web`.

```bash
cp .env.example .env.local
```

Then fill in the values described below. `.env.local` is gitignored.

### Auth0

The app uses [`@auth0/nextjs-auth0`](https://github.com/auth0/nextjs-auth0). If
any of its required vars are missing, you will see a runtime error like:

> Error: "secret" is required

1. Create (or open) an Auth0 tenant at https://manage.auth0.com.
2. **Applications → Create Application** → "Regular Web Application".
3. In the application's **Settings** tab, set:
   - **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`
4. Copy **Domain**, **Client ID**, **Client Secret** into `.env.local`:
   ```bash
   AUTH0_ISSUER_BASE_URL=https://<your-tenant>.us.auth0.com   # the "Domain", prefixed with https://
   AUTH0_CLIENT_ID=...
   AUTH0_CLIENT_SECRET=...
   AUTH0_BASE_URL=http://localhost:3000
   ```
5. Generate a session-cookie encryption secret:
   ```bash
   openssl rand -hex 32
   ```
   Put the output into `AUTH0_SECRET`.

For production, set `AUTH0_BASE_URL` to your deployed URL and add the matching
Callback / Logout / Web Origin URLs in Auth0.

## 3. Run the dev server

```bash
pnpm dev
```

The web app is served at http://localhost:3000.

## Useful scripts

| Command            | What it does                                  |
| ------------------ | --------------------------------------------- |
| `pnpm dev`         | Run all workspaces in dev mode                |
| `pnpm build`       | Build all workspaces                          |
| `pnpm lint`        | Lint all workspaces                           |
| `pnpm test`        | Run all tests                                 |
| `pnpm test:watch`  | Run tests in watch mode                       |
| `pnpm clean`       | Remove `node_modules` everywhere              |

## Troubleshooting

- **`Error: "secret" is required`** — `AUTH0_SECRET` (and likely the other
  Auth0 vars) are missing from `.env.local`, or you forgot to restart the dev
  server after adding them. Env files are only read at process start.
- **Auth0 callback mismatch** — make sure `AUTH0_BASE_URL` exactly matches the
  origin you visit in the browser, and that the same origin is registered as an
  Allowed Callback URL in the Auth0 dashboard.
