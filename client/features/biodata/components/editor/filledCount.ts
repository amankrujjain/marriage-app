export function filledCount(values: Array<string | number | undefined | null>): {
  filled: number;
  total: number;
  label: string;
} {
  const total = values.length;
  const filled = values.filter((v) => {
    if (typeof v === 'number') return true;
    return Boolean(v && String(v).trim());
  }).length;
  return { filled, total, label: `${filled} of ${total} filled` };
}
