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
    ├── components/ui/        # Button, Input, Checkbox, Alert, Card, Logo, ThemeToggle,
    │                         #   Avatar, Icon, Modal, TagChip
    ├── components/layout/    # Header, Footer (public page chrome); Copyright (one-line
    │                         #   notice for auth pages and the logged-in app)
    ├── constants/            # routes (path builders for the logged-in app)
    ├── hooks/                # useTheme (light/dark state)
    ├── styles/               # theme.ts + index.css (Tailwind tokens)
    └── utils/                # small pure helpers (initialsOf)
```

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
