import { type ComponentPropsWithoutRef } from "react";
import type { Input } from "../../../../shared/components/ui";

export type PasswordInputProps = Omit<
  ComponentPropsWithoutRef<typeof Input>,
  "type" | "endAdornment"
>;
