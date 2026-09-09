# MPAMS.Web — Max Planck Academic Management System

Web frontend for managing student enrollment, payments, and school administration. Built with **React 19**, **TypeScript 6**, **Vite 8**, and **Mantine 9**.

It is the client of [`MPAMS.API`](../MPAMS.API) and talks to nothing else.

---

## Tech Stack

| Concern            | Technology                                                              |
| ------------------ | ----------------------------------------------------------------------- |
| Framework          | React 19 + TypeScript 6                                                 |
| Build / dev server | Vite 8                                                                  |
| UI                 | Mantine 9 (`@mantine/core`, `hooks`, `form`, `modals`, `notifications`) |
| Routing            | React Router 8 — _declarative mode_                                     |
| Server state       | TanStack Query 5                                                        |
| Client state       | Zustand 5                                                               |
| HTTP               | Axios (single client with interceptors)                                 |
| Icons              | `@tabler/icons-react`                                                   |
| Quality            | TypeScript, ESLint 10, Prettier 3                                       |

> React Router 8 **removed** the `react-router-dom` package. Always import from `react-router`; anything referencing `react-router-dom` is v6/v7 material.

---

## Getting Started

### Prerequisites

- **Node.js ≥ 22.22.0** (required by React Router 8)
- **`MPAMS.API` running on `http://localhost:5121`** — the dev server proxies `/api` to it. Without the API up, every request fails as a network error.

### Setup

```bash
npm install
npm run dev
```

The app starts on `http://localhost:5173`.

### Scripts

| Command                | What it does                                                 |
| ---------------------- | ------------------------------------------------------------ |
| `npm run dev`          | Vite dev server with HMR, proxying `/api` → `localhost:5121` |
| `npm run build`        | `tsc -b && vite build` — typechecks, then bundles            |
| `npm run lint`         | ESLint                                                       |
| `npm run format`       | Prettier, writing changes                                    |
| `npm run format:check` | Prettier, checking only                                      |

There is no test runner yet.

### Before you push

```bash
npx tsc -b --force
npx eslint src
npx prettier --check src
```

**Only `tsc` checks types.** Vite transpiles with esbuild, which strips types without reading them — `npm run dev` will happily run code that does not compile. The `&&` in the `build` script is the only real gate. Do not treat "it renders" as verification.

---

## Project Structure

```
src/
├─ main.tsx          provider tree: BrowserRouter → Mantine → QueryClient → App
├─ App.tsx           route table
├─ core/             one instance of each: api client, layout, routing, session, theme
│  ├─ api/           axios client + interceptors, the ApiError union, the error classifier
│  ├─ layout/        AppShell: header, collapsible navbar, <Outlet />
│  ├─ routing/       404 page — route guards will live here
│  ├─ session/       Zustand store: token and decoded claims
│  └─ theme.ts       Mantine theme
└─ features/
   └─ auth/          one folder per product area, everything colocated
      ├─ api.ts      the calls to MPAMS.API
      ├─ types.ts    the contract types
      └─ LoginPage.tsx
```

`core/` holds what there is exactly one of; `features/<name>/` holds everything about one product area, including its API calls and contract types. A `shared/` folder for reusable pieces will appear when the first one does.

Folders are created when their first real file exists — a placeholder does not count.

---

## How it talks to the API

**[`../specs/API_REFERENCE.md`](../specs/API_REFERENCE.md) is the contract.** It documents every endpoint, field, and error code, and it reflects the actual backend implementation. Never infer an endpoint's shape — read it. If a screen needs something the API does not offer, that is a spec to write under `../specs/features/`, not a client-side workaround.

Every response and error has the same shape. Errors carry a machine-readable `code`, a Spanish `message` ready to display, and a `traceId` that correlates with the server log. **Branch on `code`; never parse `message`.** The frontend has no translation catalog by design — what arrives is what is shown.

`core/api/client.ts` attaches the bearer token and classifies every failure into one of six kinds (`validation`, `unauthenticated`, `forbidden`, `business`, `network`, `unknown`) before it reaches a component.

---

## Authentication

Login posts to `/api/v1/auth/login` and receives a JWT plus the user's profile.

**The token is held in memory only** — never in `localStorage` or `sessionStorage`, to limit XSS exposure. The consequence is deliberate: **a page refresh ends the session.** Persisting it would require an `httpOnly` cookie plus CSRF protection, which means backend changes and its own decision record. See [`../specs/architecture.md`](../specs/architecture.md).

Permissions are **not** in the login response. They exist only as claims inside the JWT, so the frontend decodes the token to build the menu and the route guards. The UI adapts to permissions, never to a role name.

---

## Conventions

Code and identifiers in English; everything the user reads in Spanish (neutral Latin American). Route paths are English, kebab-case, plural, mirroring the backend controllers — `/academic-years`, `/employees`.

Before naming any domain concept, check [`../specs/glossary.md`](../specs/glossary.md), which carries the shared ES↔EN vocabulary.

**[`CLAUDE.md`](./CLAUDE.md) holds the full conventions**: folder criteria, data-layer rules, styling discipline, accessibility requirements, and the traps this codebase has already stepped on. Read it before writing code here — several of the entries exist because the same bug appeared twice.

---

## Where this fits

This repository is one of three:

|                 | What it holds                                                                       |
| --------------- | ----------------------------------------------------------------------------------- |
| `../specs/`     | Product vision, roadmap, ADRs, the HTTP contract — anything that survives a rewrite |
| `../MPAMS.API/` | The .NET 8 backend                                                                  |
| `MPAMS.Web/`    | This repository                                                                     |

Current state, decisions taken, and open blockers live in [`../specs/ESTADO.md`](../specs/ESTADO.md) — the entry point for any new session.
