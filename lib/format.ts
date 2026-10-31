/** Null is never zero and never a guess: it renders as an em dash. */
export const EM_DASH = '—';

export function formatValue(value: number | null, unit?: string): string {
  if (value === null || Number.isNaN(value)) return EM_DASH;
  const n = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
  if (!unit) return n;
  if (unit === 'USD') return `$${n}`;
  if (unit === '%') return `${n}%`;
  return `${n} ${unit}`;
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}
