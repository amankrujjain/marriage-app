/** Client-side slug helper (mirrors server slugify). */
export function slugifyTitle(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);
}

/** datetime-local value in Asia/Kolkata from an ISO string. */
export function toIstLocalInput(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? '00';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

/** Parse IST datetime-local into ISO UTC. */
export function fromIstLocalInput(value: string): string {
  const v = value.trim();
  if (!v) throw new Error('Schedule time is required');
  const d = new Date(`${v}:00+05:30`);
  if (Number.isNaN(d.getTime())) throw new Error('Invalid schedule time');
  return d.toISOString();
}

export function tagsFromInput(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(',')) {
    const t = part.trim();
    if (!t) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t.slice(0, 40));
    if (out.length >= 12) break;
  }
  return out;
}
