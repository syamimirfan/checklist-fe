/**
 * Central color/theme library — "Vibrant Tones".
 *
 * This is the single source of truth for brand colors used across the app.
 * Tailwind utility classes are generated from the matching tokens in
 * `src/shared/styles/index.css` (@theme block) — keep both files in sync.
 *
 * Use this module when you need a color value outside of a Tailwind class,
 * e.g. inline styles, SVG fills, chart colors, or dummy data (tag colors).
 */

export type ToneName = "violet" | "purple" | "fuchsia" | "pink" | "rose";

type AlertVariant = "error" | "success" | "info";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";

export interface Tone {
  soft: string;
  /** Lighter shade for text/icons on dark surfaces (dark mode). */
  light: string;
  base: string;
  dark: string;
  fg: string;
}

export const tones: Record<ToneName, Tone> = {
  violet: {
    soft: "#ede9fe",
    light: "#a78bfa",
    base: "#8b5cf6",
    dark: "#7c3aed",
    fg: "#ffffff",
  },
  purple: {
    soft: "#f3e8ff",
    light: "#c084fc",
    base: "#a855f7",
    dark: "#9333ea",
    fg: "#ffffff",
  },
  fuchsia: {
    soft: "#fae8ff",
    light: "#e879f9",
    base: "#d946ef",
    dark: "#c026d3",
    fg: "#ffffff",
  },
  pink: {
    soft: "#fce7f3",
    light: "#f472b6",
    base: "#ec4899",
    dark: "#db2777",
    fg: "#ffffff",
  },
  rose: {
    soft: "#ffe4e6",
    light: "#fb7185",
    base: "#f43f5e",
    dark: "#e11d48",
    fg: "#ffffff",
  },
};

export const toneNames = Object.keys(tones) as ToneName[];

/** Primary brand tone used for CTAs, links, and focus states. */
export const primaryTone: ToneName = "violet";

/**
 * Tailwind class groups per tone, for components that pick a tone at runtime (e.g. tag chips).
 * `bg` + `text` are a pair: pastel fill / dark text in light mode, translucent tint / light text in dark mode.
 */
export const toneClasses: Record<
  ToneName,
  { bg: string; text: string; ring: string; solid: string }
> = {
  violet: {
    bg: "bg-brand-violet-soft dark:bg-brand-violet/20",
    text: "text-brand-violet-dark dark:text-brand-violet-light",
    ring: "ring-brand-violet",
    solid: "bg-brand-violet",
  },
  purple: {
    bg: "bg-brand-purple-soft dark:bg-brand-purple/20",
    text: "text-brand-purple-dark dark:text-brand-purple-light",
    ring: "ring-brand-purple",
    solid: "bg-brand-purple",
  },
  fuchsia: {
    bg: "bg-brand-fuchsia-soft dark:bg-brand-fuchsia/20",
    text: "text-brand-fuchsia-dark dark:text-brand-fuchsia-light",
    ring: "ring-brand-fuchsia",
    solid: "bg-brand-fuchsia",
  },
  pink: {
    bg: "bg-brand-pink-soft dark:bg-brand-pink/20",
    text: "text-brand-pink-dark dark:text-brand-pink-light",
    ring: "ring-brand-pink",
    solid: "bg-brand-pink",
  },
  rose: {
    bg: "bg-brand-rose-soft dark:bg-brand-rose/20",
    text: "text-brand-rose-dark dark:text-brand-rose-light",
    ring: "ring-brand-rose",
    solid: "bg-brand-rose",
  },
};

/** Brand gradient used on the landing page hero and primary CTAs. */
export const brandGradient = `linear-gradient(135deg, ${tones.violet.base}, ${tones.fuchsia.base})`;

/**
 * Reusable neutral surface/text/border classes shared across pages.
 * Import these instead of hardcoding `text-neutral-900`, `border-neutral-200`,
 * etc. inline — keeps every page in visual sync and gives us one place to
 * re-theme the neutral palette later.
 *
 * Every entry carries its own `dark:` counterpart, so components using these
 * tokens get dark mode for free. If you add a new color class here (or anywhere),
 * add the `dark:` pair next to it.
 *
 * Dark-mode elevation: cards/headers (`page`) sit one step lighter than the
 * backdrop behind them (`pageMuted`), mirroring white-on-gray in light mode.
 */
export const surface = {
  /** Default page background (also used for cards and headers). */
  page: "bg-white dark:bg-neutral-900",
  /** Muted/alternate section background. */
  pageMuted: "bg-neutral-50 dark:bg-neutral-950",
  /** Side panel next to a white page: a step darker than `page` in light mode, the backdrop shade in dark mode. */
  panel: "bg-neutral-100 dark:bg-neutral-950",
  /** Background of form controls (inputs). */
  input: "bg-white dark:bg-neutral-900",
  /** Standard hairline border color, e.g. cards and dividers. */
  border: "border-neutral-200 dark:border-neutral-800",
  /** Hairline between stacked rows. Use with `divide-y`: `border` colors an element's own border, not the ones `divide-y` draws on its children. */
  divide: "divide-neutral-200 dark:divide-neutral-800",
  /** Empty track of a progress/strength bar. */
  track: "bg-neutral-200 dark:bg-neutral-800",
  /** Slightly stronger border for interactive controls (inputs, outline buttons). */
  borderInput: "border-neutral-300 dark:border-neutral-700",
  /** Sticky/translucent header background. */
  headerTranslucent: "bg-white/80 backdrop-blur-sm dark:bg-neutral-900/80",
  /** Hover background for low-emphasis surfaces (outline buttons). */
  hoverMuted: "hover:bg-neutral-50 dark:hover:bg-neutral-800",
  /** Hover background for ghost/text-only surfaces. */
  hoverSubtle: "hover:bg-neutral-100 dark:hover:bg-neutral-800",
} as const;

export const text = {
  /** Headings and primary content. */
  heading: "text-neutral-900 dark:text-neutral-50",
  /** Default body copy. */
  body: "text-neutral-600 dark:text-neutral-300",
  /** De-emphasized captions/metadata. */
  muted: "text-neutral-500 dark:text-neutral-400",
  /** Disabled/completed state (e.g. checked-off list items). */
  disabled: "text-neutral-400 dark:text-neutral-500",
  /** Form labels and outline-button text. */
  label: "text-neutral-700 dark:text-neutral-200",
  /** Placeholder text inside form controls. */
  placeholder: "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
  /** Text color placed directly on a brand-colored surface (e.g. the Logo mark, primary buttons). Same in both themes. */
  onBrand: "text-white",
} as const;

/**
 * Focus ring classes shared by every interactive control.
 * `ring-offset` must match the surface behind the control, otherwise the gap
 * between the control and its ring shows up white in dark mode.
 */
export const focusRingClasses =
  "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-violet dark:ring-offset-neutral-900";
export const focusVisibleRingClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-violet dark:ring-offset-neutral-900";

/** Button variant → class map, keyed off the same brand tones as everywhere else. */
export const buttonVariantClasses: Record<Variant, string> = {
  primary: `${toneClasses.violet.solid} ${text.onBrand} hover:bg-brand-violet-dark`,
  secondary: `${toneClasses.violet.bg} ${toneClasses.violet.text} hover:bg-brand-purple-soft dark:hover:bg-brand-purple/30`,
  outline: `border ${surface.borderInput} ${text.label} ${surface.hoverMuted}`,
  ghost: `${text.body} ${surface.hoverSubtle}`,
  // Destructive actions (delete): rose outline. Not built from `dangerTextClasses`, which is declared further down.
  danger:
    "border border-brand-rose-dark text-brand-rose-dark hover:bg-brand-rose-soft dark:border-brand-rose-light dark:text-brand-rose-light dark:hover:bg-brand-rose/15",
};

/** Input border/ring classes for default vs. error state. */
export const inputStateClasses = {
  default: `${surface.borderInput} focus:ring-brand-violet focus:border-brand-violet`,
  error: "border-brand-rose focus:ring-brand-rose",
} as const;

/** Shared base for text inputs: background, text color and the dark-mode ring offset. */
export const inputBaseClasses = `${surface.input} ${text.heading} ${text.placeholder} dark:ring-offset-neutral-900`;

/** Alert variant → brand tone, so Alert reuses the same soft/dark pairing as tags and badges. */
export const alertToneMap: Record<AlertVariant, ToneName> = {
  error: "rose",
  success: "violet",
  info: "purple",
};

/** Brand-colored inline text link, e.g. "Forgot password?" / "Sign up". */
export const linkClasses =
  "font-medium text-brand-violet hover:text-brand-violet-dark dark:text-brand-violet-light dark:hover:text-brand-violet-soft";

/** Soft pill badge using the primary brand tone, e.g. landing page eyebrow text. */
export const badgeSoftClasses = `rounded-full px-4 py-1 text-sm font-medium ${toneClasses.violet.bg} ${toneClasses.violet.text}`;

/** Accent color for native checkboxes (dashboard checklist items). */
export const checkboxAccentClasses = "accent-current text-brand-violet";

/** Cursor Pointer */
export const cursorPointer = "cursor-pointer";

/** Rounder corners for buttons that sit next to the auth inputs. The `!` beats Button's default `rounded-lg`. */
export const roundedControlClasses = "rounded-xl!";

/** Rose text for overdue/destructive states, with its dark pair. */
export const dangerTextClasses =
  "text-brand-rose-dark dark:text-brand-rose-light";

/** Bubble of a hover tooltip: inverted against the page, so it stands out in both themes. */
export const tooltipClasses =
  "bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900";

/** Compact (h-10) control for dense UI such as selects, date pickers and inline editors. `Input` is the roomy, labelled variant. */
export const compactFieldClasses = `h-10 w-full rounded-lg border px-3 text-sm ${inputBaseClasses} ${inputStateClasses.default} focus:outline-none focus:ring-2 focus:ring-offset-1`;

/** Multi-line counterpart of `compactFieldClasses`: sized by `rows`, resizable up and down. */
export const textareaFieldClasses = `w-full resize-y rounded-lg border px-3 py-2 text-sm leading-relaxed ${inputBaseClasses} ${inputStateClasses.default} focus:outline-none focus:ring-2 focus:ring-offset-1`;

/** Roomy (h-12) counterpart of `compactFieldClasses`, matching the labelled `Input`. Used in dialogs. */
export const roomyFieldClasses = `h-12 w-full rounded-xl border px-3.5 text-sm ${inputBaseClasses} ${inputStateClasses.default} focus:outline-none focus:ring-2 focus:ring-offset-1`;

/** Stable tone for any key (workspace dots, avatars), so the same entity always gets the same color. */
export function toneForKey(key: string): ToneName {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return toneNames[hash % toneNames.length];
}
