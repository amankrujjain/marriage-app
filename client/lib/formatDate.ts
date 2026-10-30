/** Calendar parts from ISO, YYYY-MM-DD, DD/MM/YYYY, DD/MM/YY, etc. */
export function parseDateParts(
  raw: string,
): { year: number; month: number; day: number } | null {
  const text = raw.trim();
  if (!text) return null;

  // 1999-11-26 or 1999-11-26T00:00:00.000Z
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    return {
      year: Number(iso[1]),
      month: Number(iso[2]),
      day: Number(iso[3]),
    };
  }

  // 26/11/1999 or 26-11-1999 or 26/11/99
  const dmy = text.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})$/);
  if (dmy) {
    const day = Number(dmy[1]);
    const month = Number(dmy[2]);
    let year = Number(dmy[3]);
    if (year < 100) year += year >= 50 ? 1900 : 2000;
    return { year, month, day };
  }

  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) {
    return {
      year: parsed.getUTCFullYear(),
      month: parsed.getUTCMonth() + 1,
      day: parsed.getUTCDate(),
    };
  }

  return null;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Display format used across the UI / biodata sheet: DD/MM/YYYY */
export function formatDateDisplay(raw: string | undefined | null): string {
  if (!raw?.trim()) return '';
  const parts = parseDateParts(raw);
  if (!parts) return raw.trim();
  return `${pad2(parts.day)}/${pad2(parts.month)}/${parts.year}`;
}

/** Value for <input type="date"> — YYYY-MM-DD */
export function toDateInputValue(raw: string | undefined | null): string {
  if (!raw?.trim()) return '';
  const parts = parseDateParts(raw);
  if (!parts) return '';
  return `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}`;
}

/** Normalize stored dates to YYYY-MM-DD (no time / timezone). */
export function normalizeDateStorage(raw: string | undefined | null): string {
  return toDateInputValue(raw);
}

export function looksLikeDateValue(raw: string): boolean {
  return parseDateParts(raw) !== null;
}
