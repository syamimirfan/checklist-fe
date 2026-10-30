import { useSyncExternalStore } from 'react';

/**
 * Light/dark theme state.
 *
 * - The theme is applied by toggling the `dark` class on <html>
 *   (see `@custom-variant dark` in src/shared/styles/index.css).
 * - Until the user picks one, we follow the OS setting (and track changes to it).
 *   Once they pick, their choice is saved in localStorage and wins.
 * - index.html has a tiny inline script that applies the same logic before React
 *   loads, to avoid a flash of the wrong theme. Keep STORAGE_KEY in sync with it.
 */
export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'checklist-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    // Storage can be unavailable (private mode, blocked cookies) — fall back to the OS setting.
    return null;
  }
}

const systemTheme = (): Theme => (window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light');

let currentTheme: Theme = readStoredTheme() ?? systemTheme();
const listeners = new Set<() => void>();

// While this class is on <html>, index.css fades every color change. Keep TRANSITION_MS
// in sync with the duration there.
const TRANSITION_CLASS = 'theme-transition';
const TRANSITION_MS = 500;
let transitionTimer: number | undefined;

function applyTheme(next: Theme) {
  const root = document.documentElement;
  // Only animate real changes — not the initial apply on load.
  if (next !== currentTheme) {
    root.classList.add(TRANSITION_CLASS);
    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(() => root.classList.remove(TRANSITION_CLASS), TRANSITION_MS);
  }
  root.classList.toggle('dark', next === 'dark');
  if (next === currentTheme) return;
  currentTheme = next;
  listeners.forEach((listener) => listener());
}

applyTheme(currentTheme);

// Follow live OS changes, but only while the user hasn't made an explicit choice.
window.matchMedia(DARK_QUERY).addEventListener('change', () => {
  if (readStoredTheme() === null) applyTheme(systemTheme());
});

export function setTheme(next: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Not persisted, but still applied for this session.
  }
  applyTheme(next);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, () => currentTheme);
  return {
    theme,
    setTheme,
    toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
  };
}
