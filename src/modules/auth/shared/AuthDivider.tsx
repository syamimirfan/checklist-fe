import type { ReactNode } from 'react';
import { surface, text } from '../../../shared/styles/theme';

/** Horizontal rule with a centered caption, e.g. "or continue with email". */
export function AuthDivider({ children }: { children: ReactNode }) {
  return (
    <div className={`my-8 flex items-center gap-4 text-sm ${text.muted}`}>
      <span className={`h-px flex-1 border-t ${surface.border}`} aria-hidden="true" />
      {children}
      <span className={`h-px flex-1 border-t ${surface.border}`} aria-hidden="true" />
    </div>
  );
}
