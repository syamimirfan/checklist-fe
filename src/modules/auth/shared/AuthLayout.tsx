import { Link } from "react-router-dom";
import { Copyright } from "../../../shared/components/layout";
import { Logo, ThemeToggle } from "../../../shared/components/ui";
import { surface, text } from "../../../shared/styles/theme";
import { AuthIllustration } from "./AuthIllustration";
import { defaultPanel, legalLinks } from "./constants/authLayout.const";
import type { AuthLayoutProps } from "./models/authLayout.model";

export function AuthLayout({
  title,
  subtitle,
  panel = defaultPanel,
  children,
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(22rem,29%)_1fr]">
      {/* The inner box sticks to the viewport so the headline stays visible when the form is taller than the screen. */}
      <aside
        className={`hidden border-r ${surface.border} ${surface.panel} lg:block`}
      >
        <div className="sticky top-0 flex h-screen flex-col justify-between p-10 xl:p-14">
          <Link to="/" className="inline-flex w-fit">
            <Logo />
          </Link>
          <AuthIllustration variant={panel.illustration} />
          <div>
            <h2
              className={`text-3xl font-bold leading-[1.15] tracking-tight xl:text-4xl ${text.heading}`}
            >
              {panel.headline}
            </h2>
            <p className={`mt-4 text-base leading-relaxed ${text.muted}`}>
              {panel.description}
            </p>
          </div>
        </div>
      </aside>

      <div
        className={`flex min-h-screen flex-col px-4 py-6 sm:px-12 ${surface.page}`}
      >
        <div className="flex items-center justify-between lg:justify-end">
          <Link to="/" className="inline-flex w-fit lg:hidden">
            <Logo />
          </Link>
          <ThemeToggle />
        </div>

        <div className="mx-auto flex w-full max-w-[25rem] flex-1 flex-col justify-center py-10">
          <h1
            className={`text-[2rem] font-bold leading-tight tracking-tight ${text.heading}`}
          >
            {title}
          </h1>
          {subtitle && (
            <p className={`mt-2 text-sm ${text.muted}`}>{subtitle}</p>
          )}
          <div className="mt-8">{children}</div>

          <nav
            aria-label="Legal"
            className={`mt-12 flex justify-center gap-5 text-sm ${text.muted}`}
          >
            {legalLinks.map((label) => (
              <a
                key={label}
                href="#"
                className="underline underline-offset-2 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <Copyright className="text-center" />
      </div>
    </div>
  );
}
