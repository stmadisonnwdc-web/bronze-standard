'use client';

import Link from 'next/link';
import { useRef, type ReactNode } from 'react';

const RADIUS = 120;
const MAX = 6;

/**
 * Primary CTA drifts up to 6px toward the cursor within 120px; a 1px rule grows on hover.
 * The script only writes --mx/--my. CSS applies the offset solely for a fine pointer without
 * reduced motion, and eases it back with a 420ms expo-out transition.
 */
export function MagneticLink({ href, children, className = 'btn', disabled }: { href: string; children: ReactNode; className?: string; disabled?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);

  if (disabled) {
    return (
      <span className={`magnetic ${className}`} aria-disabled="true" role="link">
        {children}
      </span>
    );
  }

  return (
    <Link
      ref={ref}
      href={href}
      className={`magnetic ${className}`}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || e.pointerType !== 'mouse') return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        const k = dist > RADIUS ? 0 : (1 - dist / RADIUS) * MAX;
        el.style.setProperty('--mx', `${((dx / dist) * k).toFixed(2)}px`);
        el.style.setProperty('--my', `${((dy / dist) * k).toFixed(2)}px`);
      }}
      onPointerLeave={() => {
        ref.current?.style.setProperty('--mx', '0px');
        ref.current?.style.setProperty('--my', '0px');
      }}
    >
      {children}
      <span className="rule-grow" aria-hidden="true" />
    </Link>
  );
}
