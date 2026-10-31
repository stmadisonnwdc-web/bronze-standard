'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useIdleOrInteraction, useMinWidth, useReducedMotion } from '@/lib/motion';

/**
 * One shared loop: GSAP's ticker drives Lenis, with no second requestAnimationFrame.
 * GSAP and Lenis are imported only on >= 768px without reduced motion, and only after first
 * interaction or 1.2s idle, so they stay out of the initial load; phones and reduced-motion
 * visitors never download them and scroll natively.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();
  const wide = useMinWidth(768);
  const pathname = usePathname();
  // Deferred like the 3D layer: nothing extra downloads until first interaction or 1.2s idle.
  const ready = useIdleOrInteraction(1200);
  const enabled = wide && !reduced && ready;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let cleanup = () => {};
    (async () => {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('lenis')]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [enabled]);

  // Recompute trigger positions after each route transition (only if GSAP was loaded).
  useEffect(() => {
    if (!enabled) return;
    const id = window.setTimeout(async () => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      ScrollTrigger.refresh();
    }, 450);
    return () => window.clearTimeout(id);
  }, [pathname, enabled]);

  // Scroll progress rail (decorative, desktop only by CSS).
  useEffect(() => {
    const rail = document.querySelector<HTMLElement>('.scroll-rail');
    if (!rail) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      rail.style.setProperty('--progress', String(max > 0 ? window.scrollY / max : 0));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [pathname]);

  return null;
}
