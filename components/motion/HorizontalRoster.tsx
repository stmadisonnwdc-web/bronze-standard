'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useIdleOrInteraction, useMinWidth, useReducedMotion } from '@/lib/motion';
import { pad2 } from '@/lib/format';

/**
 * Pinned horizontal roster driven by vertical scroll, with a mono counter and progress rule.
 * The server renders a vertical grid; pinning is added only on >= 768px without reduced motion.
 */
export function HorizontalRoster({ count, heading, children }: { count: number; heading: ReactNode; children: ReactNode }) {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const wide = useMinWidth(768);
  const [index, setIndex] = useState(1);
  const ready = useIdleOrInteraction(1200);
  const pinned = wide && !reduced && ready && count > 1;

  useEffect(() => {
    if (!pinned || !section.current || !track.current) return;
    const sec = section.current;
    const tr = track.current;
    let cancelled = false;
    let cleanup = () => {};
    // GSAP loads only when pinning is used (>= 768px, no reduced motion).
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      sec.classList.add('roster-pinned');
      const distance = () => Math.max(0, tr.scrollWidth - sec.clientWidth);
      const ctx = gsap.context(() => {
        gsap.to(tr, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: sec,
            start: 'top top+=64',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              sec.style.setProperty('--rp', String(self.progress));
              setIndex(Math.min(count, Math.max(1, Math.round(self.progress * (count - 1)) + 1)));
            },
          },
        });
      }, sec);
      // Refresh once images have their dimensions.
      const imgs = Array.from(tr.querySelectorAll('img'));
      const onLoad = () => ScrollTrigger.refresh();
      imgs.forEach((i) => !i.complete && i.addEventListener('load', onLoad, { once: true }));
      ScrollTrigger.refresh();
      cleanup = () => {
        ctx.revert();
        sec.classList.remove('roster-pinned');
        imgs.forEach((i) => i.removeEventListener('load', onLoad));
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [pinned, count]);

  return (
    <div ref={section} className="roster-section" style={{ overflow: pinned ? 'hidden' : undefined }}>
      <div className="roster-head">
        {heading}
        {count > 0 ? (
          <div aria-hidden={!pinned}>
            <p className="mono quiet" style={{ marginBottom: 8 }}>
              {pinned ? pad2(index) : pad2(1)} / {pad2(count)}
            </p>
            <div className="roster-progress"><span /></div>
          </div>
        ) : null}
      </div>
      <div ref={track} className="roster-track">
        {children}
      </div>
    </div>
  );
}
