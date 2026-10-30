import { toneClasses, toneForKey } from "../../styles/theme";
import { initialsOf } from "../../utils/text";
import { avatarSizeClasses } from "./constants/avatar.const";
import type { AvatarProps } from "./models/avatar.model";

/** Initials in a soft tone circle. The tone is derived from the name, so a person keeps their color everywhere. */
export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const tone = toneClasses[toneForKey(name)];
  return (
    <span
      title={name}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-medium ${tone.bg} ${tone.text} ${avatarSizeClasses[size]} ${className}`}
    >
      {initialsOf(name)}
    </span>
  );
}
