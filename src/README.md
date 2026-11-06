# Project structure

The app is organised **by module** (feature), not by file type. Everything
for one feature lives in one folder, so you rarely need to look elsewhere.

```
src/
├── main.tsx                  # entry point
├── app/                      # app shell: router, redux store, typed hooks, and
│                             #   AppShell/Sidebar (layout + auth guard for every logged-in page)
├── assets/                   # static files imported by the app (e.g. fonts)
├── modules/                  # one folder per feature
│   ├── landing/              # public landing page
│   ├── auth/                 # everything account-related
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── shared/           # used by 2+ auth flows: authSlice, authApi, AuthLayout,
│   │                         #   AuthDivider, SocialButton, PasswordInput
│   ├── checklists/           # the domain: workspaces, checklists, items, tags, comments.
│   │                         #   Slice + mock API + selectors, ChecklistPage and its tabs
│   └── dashboard/            # logged-in list views (my checklists, due soon, templates,
│                             #   assigned to me, one workspace)
└── shared/                   # used by 2+ modules
    ├── api/                  # HTTP client + ApiError for talking to checklist-be, and
    │                         #   getApiErrorMessages (backend error -> text to show)
    ├── config/               # env.ts: apiBaseUrl from CHECKLIST_BASE_URL
    ├── toast/                # toast slice (showToast / dismissToast); drawn by ui/Toaster,
    │                         #   fed from app/ToastHost; filled with useApiErrorHandler()
    ├── components/ui/        # Button, Input, Checkbox, Alert, Card, Logo, ThemeToggle,
    │                         #   Avatar, Icon, Modal, TagChip
    ├── components/layout/    # Header, Footer (public page chrome); Copyright (one-line
    │                         #   notice for auth pages and the logged-in app)
    ├── constants/            # routes (path builders for the logged-in app)
    ├── hooks/                # useTheme (light/dark state)
    ├── styles/               # theme.ts + index.css (Tailwind tokens)
    └── utils/                # small pure helpers (initialsOf)
```

## Talking to the backend (data binding)

The landing page is the first module bound to `checklist-be` (Django). Its flow
is the template for binding the next one. Data goes down this chain, one file per step:

```
1. URL       ← CHECKLIST_BASE_URL in .env.development
2. CLIENT    : fetch + JSON + ApiError
3. ENDPOINT  : landing/constants/landingPage.const.ts
4. MODELS    : DTO → UI model
5. SERVICE   : fetchLandingPage() → UI model
6. HOOK      : loading / success / error
```

| #   | Step         | Where                                                                       | What it does                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --- | ------------ | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **URL**      | `.env.development`, `shared/config/env.ts`                                  | `CHECKLIST_BASE_URL=http://localhost:8000/api` (typed in `vite-env.d.ts`). `env.ts` is the only file that reads it, as `apiBaseUrl`. Vite only hands the browser variables starting with `envPrefix`, which `vite.config.ts` sets to `CHECKLIST_` (its default is `VITE_`). A deployed build sets its own in `.env.production`. Everything with that prefix ships in the public bundle, so never name a secret `CHECKLIST_…`. |
| 2   | **Client**   | `shared/api/httpClient.ts`                                                  | `http.get(path)`: joins the base URL and the path, reads JSON, and turns every failure into an `ApiError` (`status`, `code`, `message`, `fields`) using the backend's `{ error: { code, message, fields } }` body. Nothing else calls `fetch`.                                                                                                                                                                                |
| 3   | **Endpoint** | `modules/landing/constants/landingPage.const.ts`                            | `landingEndpoint = "/landing/"`: the path only (Django needs the trailing slash). Base URL + path = `http://localhost:8000/api/landing/`.                                                                                                                                                                                                                                                                                     |
| 4   | **Models**   | `modules/landing/models/landingPage.model.ts`, `utils/landingPageMapper.ts` | Two shapes in one file: the DTO `LandingPageDto` (the response exactly as the backend sends it, snake_case) and the UI model `LandingPageContent` (camelCase, what components read). The mapper is the only place that converts between them; components never see a DTO.                                                                                                                                                     |
| 5   | **Service**  | `modules/landing/services/landingPage.service.ts`                           | `fetchLandingPage()`: calls `http.get<LandingPageDto>(landingEndpoint)`, maps it, returns the UI model. A second call while one is in flight shares it, so React StrictMode's double-run in dev sends one request, not two.                                                                                                                                                                                                   |
| 6   | **Hook**     | `modules/landing/hooks/useLandingPage.ts`                                   | Returns `{ status: "loading" }`, `{ status: "success", content }` or `{ status: "error", message }`. `LandingPage.tsx` reads it, showing the built-in copy (`defaultLandingContent`) while loading or if the backend is down. A failure is also shown as a toast through `useApiErrorHandler()`.                                                                                                                              |

Errors reach the user the same way everywhere: the backend puts its message in
the error response, the client keeps it in `ApiError.message`, and
`useApiErrorHandler()` (`app/hooks.ts`) shows it as a toast.

## Dark mode

Dark mode is class-based: `useTheme` toggles a `dark` class on `<html>`, and
Tailwind's `dark:` variant reacts to it. It follows the OS setting until the
user clicks the toggle; after that their choice is saved in `localStorage`.

- **Use the tokens in `shared/styles/theme.ts`** (`surface.*`, `text.*`,
  `toneClasses`, `linkClasses`, …) instead of writing `text-neutral-900`,
  `bg-white`, etc. directly. Each token already includes its `dark:` pair.
- **Need a new color class?** Add the `dark:` counterpart right next to it.
  A class like `bg-white` on its own stays white in dark mode.
- Use `brand-<tone>-light` for brand-colored text on dark surfaces; the
  `-dark` shades are too low-contrast there.
- Put the toggle somewhere reachable on every new top-level page. Public pages
  use `<Header>` from `shared/components/layout` (it already includes the
  toggle; pass page-specific actions as its children). Logged-in pages get it
  from the `AppShell` sidebar.

## Rules of thumb

- **New page/feature?** Create `modules/<name>/` with its page component,
  an `index.ts`, and (if needed) a `dummyData.ts` for its mock data.
- **Importing from another module?** Go through its `index.ts`
  (`import { logout } from '../auth'`), not into its internal files.
- **Only one flow uses it?** Keep it inside that flow's folder.
  **Two or more flows in a module?** Move it to that module's `shared/`.
  **Two or more modules?** Move it to top-level `shared/`.
- `app/` wires modules together (routes, store). Modules should not import
  from each other's internals, and `shared/` must not import from `modules/`.
- Each module keeps its own mock data in `dummyData.ts`; replace it with real
  API calls there when the backend is ready.
