# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MPAMS.Web** is the React + TypeScript frontend of MPAMS (Max Planck Academic Management System). It talks to `MPAMS.API` (.NET 8) and to nothing else. It is a sibling repository — the cross-repo specs, the product vision and the HTTP contract live one level up, in `../specs/`, which is its own git repo.

> **`../specs/API_REFERENCE.md` is the contract.** Never invent an endpoint shape, a field name or an error code — read it. If a screen needs an endpoint that does not exist or behaves inconsistently, that is a spec to write under `../specs/features/`, not something to work around client-side.

Stack: React 19, TypeScript 6, Vite 8, Mantine 9, TanStack Query 5, Zustand 5, React Router 8, Axios. Node ≥ 22.22 (React Router 8 requires it).

## Build & Run Commands

```bash
npm run dev            # Vite dev server on http://localhost:5173, proxying /api to localhost:5121
npm run build          # tsc -b && vite build — the && is the only real type gate, see below
npm run lint           # eslint .
npm run format         # prettier --write .
npm run format:check   # prettier --check .
```

There is no test runner yet. When one is added, note it here.

### The three gates

Nothing is finished until all three pass:

```bash
npx tsc -b --force     # types
npx eslint src         # lint
npx prettier --check src
```

`--force` matters: `tsc -b` is incremental and will happily report success from a stale `.tsbuildinfo`.

**Only `tsc` checks types.** Vite transpiles with esbuild, which strips types without looking at them — `npm run dev` runs code that does not typecheck, and so does `vite build` on its own. The `&&` in `"build": "tsc -b && vite build"` is the only thing standing between a type error and a deployed bundle. Never "verify" a change by seeing it render.

None of the three reads comments, so a typo in a Spanish comment ships silently. Re-read what you wrote.

## Architecture

```
src/
├─ main.tsx          BrowserRouter → MantineProvider → QueryClientProvider → App
├─ App.tsx           route table
├─ index.css         deliberately empty — an escape hatch, not a stylesheet
├─ core/             exactly one of each of these exists
│  ├─ api/           client.ts (axios + interceptors), errors.ts (ApiError union), toApiError.ts
│  ├─ layout/        AppLayout.tsx (AppShell, navbar, header)
│  ├─ routing/       NotFoundPage.tsx — route guards will live here
│  ├─ session/       store.ts (Zustand: token, claims)
│  └─ theme.ts       createTheme(...)
├─ shared/           reusable pieces there will be many of (does not exist yet)
└─ features/
   └─ <feature>/     everything about one feature, colocated
      ├─ api.ts      the calls to MPAMS.API
      ├─ types.ts    the contract types
      ├─ XPage.tsx
      └─ XPage.module.css
```

**`core/` vs `shared/` vs `features/`** — the question is _how many of these will there be?_ One instance (layout, routing, api client, session) → `core/`. Many reusable pieces → `shared/`. Everything about one product area → `features/<feature>/`.

Folders are created when their first real file exists. A placeholder does not count: git does not version empty directories, and a folder that exists before its purpose does is a folder nobody can explain.

### Feature colocation

`api.ts` and `types.ts` live **inside the feature**, not in a `services/` tree mirroring `features/`. A mirror forces the contract types to move with it, and then `features/auth/` holds a `.tsx` and a `.module.css` and understanding the login means opening two distant folders. Promote a module to `core/api/` only when features that do not know about each other consume it — catalogs (`document-types`, `countries`, `districts`) are the case, since person, student, employee and relative forms all need them.

`api.ts` exports **plain async functions**, one per endpoint, named for what they do. Not a class, not an `authService` object — the indirection buys nothing and defeats tree-shaking. They return `response.data`, so no component ever names `apiClient`.

The version prefix stays at the call site (`'/v1/auth/login'`, with `baseURL: '/api'`), not in `baseURL`. `Asp.Versioning` versions **per controller**, so `api/v1/auth` and `api/v2/students` can coexist; a version baked into `baseURL` would have to be fought off for whichever controller moves first.

### Data layer

- **`useQuery` reads, `useMutation` writes.** A login creates a session — it is a write.
- **Declare the type parameters**: `useMutation<TData, TError, TVariables>`. `TError` defaults to `Error`, but this app rejects with `ApiError`, which is a union of plain objects, not an `Error`. Inference from an `onError` annotation happens to work and is fragile: delete the callback and `TError` silently reverts.
- **`mutate`, not `mutateAsync`.** `mutate` returns nothing and never throws; errors go to `onError`. `mutateAsync` returns a promise that rejects, so awaiting it inside a submit handler without a `catch` leaves an unhandled rejection while still _looking_ correct.
- **Global `staleTime` of 5 minutes** (`core/api/queryClient.ts`). Most data is catalogs and records that rarely change. A query over volatile data — enrollments, anything another user edits concurrently — **overrides it** in its own options. Forgetting to is the risk: the screen keeps showing data up to 5 minutes old with no sign of it.
- **Queries retry only `network` and `unknown` errors**, up to 3 times. Never `validation`, `business`, `forbidden` or `unauthenticated` — repeating the request gives the same answer — and never an error without `kind`, which is a bug that skipped the interceptor. The check is `'kind' in error`, **not** `toApiError(error)`: what reaches `retry` is already an `ApiError`, and `toApiError` would turn everything into `unknown` and retry every `404`. With the backend down that mistake looks correct, because network errors are retried either way. Mutations keep the library default of no retries: a failed login fires one request.
- **Offline, queries and mutations pause instead of failing** (`networkMode: 'online'`): no request goes out, `isPending` stays `true` and they resume on reconnect. Pages do not handle it — `core/layout/OfflineNotice`, mounted once at the root (above the routes, so the login is covered too), tells the person why nothing moves. `onlineManager` starts as online and only learns from the `online`/`offline` events, so a page loaded without a connection gets network errors instead. That is also why DevTools _Offline_ cannot test retries: block the request URL instead.
- **`queryClient` is a module-level singleton**, outside React. The cache must survive re-renders, and it is reached from code that is not a component — `endSession()` in the store and the 401 interceptor — where `useQueryClient()` cannot be called.
- A `queries.ts` per feature earns its place when a `useQuery` has **two** consumers: the `queryKey` must match between them, and two hand-written keys that differ by a letter cache separately and invalidate separately. Until then a shared hook is a wrapper with one caller.

### Session and auth

The **JWT lives in memory only** — never `localStorage` or `sessionStorage` (XSS). This is `../specs/architecture.md`'s decision, and it was tried and reverted once. The consequence is that a refresh ends the session, which is why the store needs no third "still loading" state: after F5 the answer is immediate and final. That changes the day an `httpOnly` cookie is adopted, which needs its own ADR.

The store **does not authenticate** — hence `startSession(token)` / `endSession()`, not `login`/`logout`. The network call is `features/auth/api.ts`'s `login()`.

`endSession()` also **clears the react-query cache**, or the next user of the tab sees the previous one's data. It lives there and not at the call sites because there are three exits (account menu, `UnlockScreen`, the 401 interceptor) and the one that happens unattended runs outside React. Order matters: `set` first, so the guards unmount whatever is fetching, then `clear()`.

`LoginResponse` does **not** carry permissions. They exist only as claims inside the JWT, so the frontend decodes the token to build the menu and the route guards. **The UI adapts to permissions, never to a role name.**

## Conventions

### Language

Code in English — identifiers **and comments**, the same rule as `MPAMS.API` (decided 24-sep-2026). Text the user reads in Spanish (neutral Latin American — the users are Peruvian, no _voseo_). Commit messages in English.

Before naming any domain concept, read **`../specs/glossary.md`** — it carries the ES↔EN table (Cuota → `StudentFeeInstallment`, Familiar → `Relative`, …) so the frontend does not invent `SchoolYear` where the backend said `AcademicYear`.

### URLs

English, kebab-case, plural, mirroring the backend controllers (`/academic-years`, `/employees`). No accents or ñ — they behave as identifiers: they go in constants, in `<Navigate>`, in permission guards. The visible text (a `NavLink`'s `label`) is Spanish.

An unknown route shows **404, it does not redirect**. A URL can fail for three different reasons (does not exist / missing permission / not authenticated) and collapsing them leaves the user unable to tell what happened; the redirect also destroys the URL, which is the only evidence of what they tried to open. Redirect only for **known** routes that were renamed, always with `replace` — without it the back button traps the user in a bounce.

### Types mirror the contract

`types.ts` names fields **exactly** as the backend serializes them. Types at the boundary — HTTP, `JSON.parse`, a decoded JWT — are _assertions, not verifications_: `jwtDecode<T>` validates nothing, it believes you. Every mismatch found so far presented as "the app shows nothing" with the cause ten files away.

Three live examples worth not re-deriving:

- **`user.userId` is a number; the JWT's `sub` is a string.** Same datum, two serialization contexts. RFC 7519 §4.1.2 requires `sub` to be a string, so this will not converge.
- **Claim names are case-sensitive and literal.** They are `sub`, `role`, `permission` — verified against `JwtTokenService.GenerateToken`, the backend's only JWT issuer. This has broken twice (`permission` vs `Permission`, `uniqueName` vs `unique_name`); both times the reader got `undefined` with no error.
- **A repeated claim serializes as an array; a single one as a bare string.** A user with exactly one permission receives `"permission": "SM:Student.Manage"`. Always normalize `string | string[] | undefined` before use. And note `new Set('SM:Student.Manage')` does not fail — it builds a Set of 11 letters, because a string is iterable.

### Styling

**Never write a literal color in a component** (`color="indigo"`, `c="blue.6"`). It goes through the theme, or changing the theme stops working and nobody notices until half the app is repainted.

Institutional branding is **local and explicit**, not chrome-wide: one session spans several institutions, so repainting the shell would destroy the only stable location cue. Show the institution as a name + color chip next to the data.

If an element contributes spacing, typography or color, the design system contributes it — use `Text`, `Stack`, `Group`, not a bare `<p>` or `<div>` (which inherits the typographic baseline but gets its margins from the browser).

### Validation

The **backend defines what a valid value is**; the frontend mirrors what the contract declares and invents nothing. A client-side rule stricter than the server's does not fail safe — it locks a legitimate user out, and blames them for it. The login form once required a numeric username, which would have excluded every foreign employee.

Error messages arriving from the API (`message` and `errors`) are already Spanish, ready to display. The frontend has **no translation catalog** — branch on `code`/`kind`, never parse `message`.

## Best practices

Follow them. These are the ones this codebase has already paid for:

**Correctness**

- Run the three gates before calling anything done. ESLint catches neither of the two worst bugs found here: JSX where `(cond && <X/>)` without braces renders as literal text, and `form.errors` being truthy because `{}` is truthy.
- A `as` cast almost always means a type is declared wrong further up. Fix the declaration.
- Do not add a `?.` or a `| null` for a case that cannot happen — a defensive guard for an impossible state makes readers hunt for when it _can_.
- Verify a claim before writing it down. Every contract error this project has hit came from a document that asserted something the code did not do.

**Privacy and logging**

- **No PII in logs or `console`.** A username here is a national ID (`ADR-004`), and browser logs end up in screenshots and error reports.
- The axios interceptor already logs every API error with code, message and `traceId`. Do not log it again in an `onError`.
- Show `traceId` to the user only on an unexpected error (`kind: 'unknown'`) — it is what support needs. Printing it on "wrong password" makes a normal event look like a system failure.

**React and state**

- **Zustand with a selector**: `useSessionStore((state) => state.startSession)`. Destructuring the store subscribes the component to every change.
- `new QueryClient()` at **module level**, never inside a render — created in render, the cache is lost on every re-render.
- Hooks cannot be called inside `.map()`. One hook per component: that is why `NavLinkItem` exists.

**Forms and accessibility**

- `autoComplete="username"` / `"current-password"` on login fields — it is what password managers read.
- `noValidate` on the `<form>`, keeping `required` on the inputs. `required` earns the asterisk and `aria-required`; without `noValidate` the browser blocks submit first and shows its own bubble, in the _browser's_ language, and your Spanish messages never appear. **`required` communicates; `validate` enforces.**
- Field errors belong under their field (`getInputProps` wires them); the request error belongs in an `Alert` above the form — it has no field to attach to. Never both.

**Comments**

Comments are the exception. Do not explain what the code already says, and do not justify a decision in a comment — if the code exists, it was decided; the reasoning lives in `specs/` (ADRs, feature `design.md`). Do not restore comments the owner removed. When a decision is invisible and a well-meant change could break it (e.g. `UnlockScreen` shows `displayName` and never the document, `ADR-004`), protect it with a test that fails when it is broken, not with a comment. Traps with a library or tool are recorded in the section below, not in the code.

## Traps already stepped on

Version-dating stale material — if an example does one of these, it predates this project:

- imports from **`react-router-dom`** → v6/v7. React Router 8 **removed** that package. Always import from `react-router`.
- uses **`spacing`** on a `Stack`/`Group` → Mantine 6. Since 7 the prop is `gap`.

Mantine 9 specifics:

- **`NavLink` exists in both packages.** Mantine's renders an `<a href>` that reloads the whole page; combine with `component={RouterNavLink}`.
- **A Mantine `NavLink`'s `children` are not its text** — they are nested items. The text is `label`. `<NavLink>Inicio</NavLink>` renders an unlabelled item with loose text and no padding, and looks like "Mantine without styles".
- **`active` is a boolean you control.** Mantine knows nothing about routes. Bridge with `useMatch({ path: to, end: to === '/' })` — **with `end`**, or `/academic-years/2027` switches the "Años Escolares" item off. The root exception is mandatory: without it `/` matches everything.
- `AppShell` infers no measurements: `header={{ height }}` and `navbar={{ width, breakpoint }}` are required, and `padding` goes on the `AppShell`, not on `Main`.
- **`useForm` in `uncontrolled` mode does not re-render on typing**, so `form.values` read inside a validator points at the previous render's object. A rule that depends on another field reads it from the validator's second parameter, `(value, values)`, which holds the live values.

Tooling:

- `__dirname` does not exist in an ESM `vite.config.ts` under Vite 8 — use `import.meta.dirname`.
- `tsconfig.app.json` has **no `baseUrl`**: TypeScript 6 makes it an error, and since TS 5 `paths` resolves relative to the tsconfig itself, so `"@/*": ["./src/*"]` works without it.
- A `Cannot find module` about something named in a config almost always means the package is not installed, not that the file is misspelled.
- `@mantine/core/styles.css` is imported **before** `./index.css`, so local styles can override Mantine's.
- `@fontsource-variable/*` packages register the family with a **`Variable` suffix** (`'Inter Variable'`). Without it the browser silently falls back to the system font.

## Deliberately not installed

`@mantine/dates` and `@mantine/dropzone`. They arrive with the screen that needs them, not before. There is one icon library, `@tabler/icons-react` — do not add a second for one icon.
