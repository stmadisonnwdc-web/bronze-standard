import type { GateStatus } from '@/content/gates';
import { formatDate } from '@/lib/format';

const label: Record<GateStatus, string> = { cleared: 'Cleared', open: 'Open', blocked: 'Blocked' };

/** Status is carried by text and shape, never by color alone. */
export function GateChip({ status, checked }: { status: GateStatus; checked?: string }) {
  return (
    <span className="chip" data-status={status}>
      {status === 'cleared' ? (
        <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 5.2 4 7.5 8.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
      ) : status === 'blocked' ? (
        <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 2l6 6M8 2 2 8" stroke="currentColor" strokeWidth="1.4" /></svg>
      ) : (
        <svg viewBox="0 0 10 10" aria-hidden="true"><circle cx="5" cy="5" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
      )}
      {label[status]}
      {checked ? <span className="quiet">· {formatDate(checked)}</span> : null}
    </span>
  );
}
