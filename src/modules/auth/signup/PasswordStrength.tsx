import { surface, toneClasses } from "../../../shared/styles/theme";
import { levels } from "./constants/passwordStrength.const";

/** One point each for: 8+ characters, upper and lower case, a number, a symbol. */
function scorePassword(password: string): number {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

/** Four-segment strength bar under the password field. */
export function PasswordStrength({ password }: { password: string }) {
  const score = password ? scorePassword(password) : 0;
  const { label, tone } = levels[score];

  return (
    <div className="flex gap-2" aria-live="polite">
      {[0, 1, 2, 3].map((segment) => (
        <span
          key={segment}
          className={`h-1 flex-1 rounded-full transition-colors ${
            segment < score ? toneClasses[tone].solid : surface.track
          }`}
          aria-hidden="true"
        />
      ))}
      {label && <span className="sr-only">Password strength: {label}</span>}
    </div>
  );
}
