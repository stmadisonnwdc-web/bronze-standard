'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useIdleOrInteraction, useMinWidth, useReducedMotion } from '@/lib/motion';
import { hasWebGL } from '@/lib/three';

// The only path to Three.js. The chunk is requested only when `load` becomes true.
const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false, loading: () => null });

/**
 * Decides whether the 3D layer loads at all:
 * >= 768px, no reduced motion, WebGL available, and after first interaction or 1.2s idle.
 * Otherwise the server-rendered AVIF poster is the hero (WebGL-unavailable state included).
 */
export function HeroStage({ sectionId }: { sectionId: string }) {
  const wide = useMinWidth(768);
  const reduced = useReducedMotion();
  const ready = useIdleOrInteraction(1200);
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => setWebgl(hasWebGL()), []);

  const load = wide && !reduced && ready && webgl === true;
  if (!load) return null;
  return <HeroCanvas sectionId={sectionId} />;
}
