'use client';

import { useEffect, useState } from 'react';
import type { ThemeChoice } from '@/lib/state';

const order: ThemeChoice[] = ['system', 'light', 'dark'];
const label: Record<ThemeChoice, string> = { system: 'System', light: 'Light', dark: 'Dark' };

function read(): ThemeChoice {
  try {
    const v = window.localStorage.getItem('bs-theme');
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
}

/** Rendered only with JavaScript; the theme follows the system setting otherwise. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeChoice | null>(null);
  useEffect(() => setTheme(read()), []);
  if (!theme) return null;

  const next = order[(order.indexOf(theme) + 1) % order.length] ?? 'system';
  return (
    <button
      type="button"
      className="search-btn theme-toggle"
      onClick={() => {
        setTheme(next);
        try {
          if (next === 'system') window.localStorage.removeItem('bs-theme');
          else window.localStorage.setItem('bs-theme', next);
        } catch {
          /* storage unavailable: the choice lasts for this page view only */
        }
        if (next === 'system') document.documentElement.removeAttribute('data-theme');
        else document.documentElement.setAttribute('data-theme', next);
      }}
    >
      Theme: {label[theme]}
      <span className="visually-hidden">. Switch to {label[next]}.</span>
    </button>
  );
}
