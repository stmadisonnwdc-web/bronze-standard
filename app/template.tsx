'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { site } from '@/content/site';

// Module scope survives client navigations. Comparing paths (rather than a first-run flag)
// keeps the curtain off on first load, including under React Strict Mode's double effects.
let lastPath: string | null = null;

/** 420ms bone curtain on client-side navigation only. Hidden entirely under reduced motion (CSS). */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const navigated = lastPath !== null && lastPath !== pathname;
    lastPath = pathname;
    if (!navigated) return;
    setShow(true);
    const t = window.setTimeout(() => setShow(false), 460);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <>
      {show ? (
        <div className="curtain" aria-hidden="true">
          <span>{site.name}</span>
        </div>
      ) : null}
      {children}
    </>
  );
}
