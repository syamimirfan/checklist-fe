/// <reference types="vite/client" />

/** The env vars the app reads (see `.env.development`). Vite only exposes names starting with `envPrefix` (`CHECKLIST_`, set in vite.config.ts). */
interface ImportMetaEnv {
  /** Base URL of the checklist-be API, including `/api`, e.g. `http://localhost:8000/api`. */
  readonly CHECKLIST_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
