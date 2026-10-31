'use client';

import { useRef, type ReactNode } from 'react';

const MAX_DEG = 6;

/**
 * Tilts up to 6deg toward the cursor with a tracking specular highlight; 420ms reset.
 * The script only writes CSS variables; the tilt itself applies only for a fine pointer
 * without reduced motion (see .tilt in globals.css), so touch and reduced motion get none.
 */
export function TiltCard({ children, className = 'card' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={`${className} tilt`}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || e.pointerType !== 'mouse') return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', `${((px - 0.5) * 2 * MAX_DEG).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${(-(py - 0.5) * 2 * MAX_DEG).toFixed(2)}deg`);
        el.style.setProperty('--sx', `${(px * 100).toFixed(1)}%`);
        el.style.setProperty('--sy', `${(py * 100).toFixed(1)}%`);
      }}
      onPointerLeave={() => {
        ref.current?.style.setProperty('--rx', '0deg');
        ref.current?.style.setProperty('--ry', '0deg');
      }}
    >
      {children}
      <span className="specular" aria-hidden="true" />
    </div>
  );
}
