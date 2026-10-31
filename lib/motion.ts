'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

export const ease = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOutQuint: [0.83, 0, 0.17, 1] as const,
};
export const dur = { micro: 0.18, base: 0.42, macro: 0.9, scene: 1.4 } as const;
export const STAGGER = 0.06;
export const MAX_STAGGER_CHILDREN = 6;

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener('change', cb);
    return () => mq.removeEventListener('change', cb);
  };
}

/** True when the reader asks for reduced motion. Server render assumes reduced (safe default). */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeMedia('(prefers-reduced-motion: reduce)'),
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => true,
  );
}

/** True for a fine pointer that can hover (no tilt or magnetism on touch). */
export function useFinePointer(): boolean {
  return useSyncExternalStore(
    subscribeMedia('(hover: hover) and (pointer: fine)'),
    () => window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    () => false,
  );
}

export function useMinWidth(px: number): boolean {
  const q = `(min-width: ${px}px)`;
  return useSyncExternalStore(subscribeMedia(q), () => window.matchMedia(q).matches, () => false);
}

/** Becomes true once, after first interaction or the given idle delay. */
export function useIdleOrInteraction(delayMs = 1200): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      setReady(true);
      cleanup();
    };
    const events = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart'] as const;
    events.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
    const t = window.setTimeout(go, delayMs);
    function cleanup() {
      window.clearTimeout(t);
      events.forEach((e) => window.removeEventListener(e, go));
    }
    return cleanup;
  }, [delayMs]);
  return ready;
}
