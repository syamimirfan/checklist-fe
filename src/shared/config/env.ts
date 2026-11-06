/**
 * STEP 1 — WHERE THE URL COMES FROM.
 * The only place the app reads the API address. It comes from `CHECKLIST_BASE_URL`
 * (`.env.development` for `npm run dev`, `.env.production` for a deployed build); Vite exposes
 * it because `envPrefix` in vite.config.ts is `CHECKLIST_`.
 * The trailing slash is trimmed so `${apiBaseUrl}${path}` never doubles it.
 */
export const apiBaseUrl = (import.meta.env.CHECKLIST_BASE_URL ?? "").replace(
  /\/+$/,
  "",
);
