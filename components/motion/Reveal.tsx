'use client';

import { createElement, useEffect, useRef, type ReactNode } from 'react';

type Tag = 'h1' | 'h2' | 'h3' | 'p';

/**
 * Text mask reveal: each line rises out of an overflow-hidden line box with a clip-path
 * inset (900ms, expo-out, 80ms line stagger). Hidden styles apply only under `.js`, so
 * without JavaScript the text is simply present. Reduced motion: shown immediately (CSS).
 */
export function Reveal({ as = 'h2', lines, className, id }: { as?: Tag; lines: readonly string[]; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add('is-in');
            io.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const children: ReactNode = lines.map((line, i) => (
    <span className="reveal-line" key={i}>
      <span style={{ ['--i' as string]: i }}>{line}</span>
    </span>
  ));

  return createElement(as, { ref, id, className: ['reveal', className].filter(Boolean).join(' ') }, children);
}
