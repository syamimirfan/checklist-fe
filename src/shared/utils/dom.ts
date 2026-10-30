/**
 * Empties an <input> the way a user deleting its text would, then focuses it.
 *
 * Callers own the value (a controlled input) and run their own logic in `onChange`
 * (login clears its error, sign-up updates the strength meter). React ignores a plain
 * `input.value = ""`, so this uses the native setter and fires a real input event, which
 * makes React call the caller's `onChange` exactly as if the text had been deleted by hand.
 */
export function clearInputValue(input: HTMLInputElement) {
  const setValue = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;
  setValue?.call(input, "");
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.focus();
}
