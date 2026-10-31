/** Shown under password fields on register and reset. */
export const PASSWORD_HINT =
  'Use 8 or more characters with a mix of letters and numbers.';

/**
 * 8–128 chars, at least one letter and one number.
 * Special characters are allowed but not required.
 */
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,128}$/;

export function isValidPassword(password: string): boolean {
  return PASSWORD_PATTERN.test(password);
}
