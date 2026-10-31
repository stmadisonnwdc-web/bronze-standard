'use client';

import { useEffect, useRef } from 'react';
import { EM_DASH, formatValue } from '@/lib/format';

/**
 * Baseline figure. The server renders the final value, so it is correct without JavaScript.
 * With JavaScript, a figure that starts below the fold counts up once on first intersection
 * (900ms, expo-out) and its underline draws left to right. It never re-animates. Null renders
 * as an em dash with no count. Reduced motion: final value, no count.
 */
export function CountUp({ value, unit }: { value: number | null; unit: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || value === null) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight) return; // already visible: no flash, no count
    const out = el.querySelector<HTMLElement>('.v');
    if (!out) return;
    el.dataset.pending = 'true';
    out.textContent = formatValue(0, unit);

    const io = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || done.current) return;
      done.current = true;
      io.disconnect();
      el.dataset.pending = 'false';
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / 900);
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        out.textContent = formatValue(Math.round(value * eased * 100) / 100, unit);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value, unit]);

  return (
    <span ref={ref} className="metric-value tnum" data-pending="false" data-null={value === null}>
      <span className="v">{value === null ? EM_DASH : formatValue(value, unit)}</span>
      {value === null ? <span className="visually-hidden"> (no figure yet)</span> : null}
      <span className="underline" aria-hidden="true" />
    </span>
  );
}
