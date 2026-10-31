'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { searchIndex } from '@/content/index';
import { useUI } from '@/lib/state';

/**
 * Command palette: Cmd/Ctrl+K or the Search button. Combobox pattern (input with
 * aria-activedescendant over a listbox), focus trapped, Escape closes, focus restored.
 * Without JavaScript the Search button is a link to /search. Opening fades in with CSS
 * (180ms backdrop, 420ms panel); reduced motion removes the transition.
 */
export function CommandPalette() {
  const { paletteOpen, openPalette, closePalette, paletteReturnFocus } = useUI();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchIndex.slice(0, 12);
    return searchIndex.filter((e) => e.title.toLowerCase().includes(q) || e.group.toLowerCase().includes(q)).slice(0, 20);
  }, [query]);

  // Global shortcut.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Escape closes from anywhere, including before focus has moved into the dialog.
      if (e.key === 'Escape' && useUI.getState().paletteOpen) {
        e.preventDefault();
        closePalette();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (useUI.getState().paletteOpen) closePalette();
        else openPalette(document.activeElement as HTMLElement | null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openPalette, closePalette]);

  // Focus on open, restore on close.
  useEffect(() => {
    if (paletteOpen) {
      setQuery('');
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      paletteReturnFocus?.focus?.();
    }
  }, [paletteOpen, paletteReturnFocus]);

  const go = (href: string) => {
    closePalette();
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      // Handled by the window listener; stop it here so it fires once.
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (results.length ? (a + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      const r = results[active];
      if (r) {
        e.preventDefault();
        go(r.href);
      }
    } else if (e.key === 'Tab') {
      // The input is the only tab stop inside the dialog: keep focus here.
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  const activeId = results[active] ? `${listId}-${active}` : undefined;

  return (
    paletteOpen ? (
        <div
          className="palette-backdrop"
          onMouseDown={(e) => e.target === e.currentTarget && closePalette()}
        >
          <div
            ref={dialogRef}
            className="palette"
            role="dialog"
            aria-modal="true"
            aria-label="Search the site"
            onKeyDown={onKeyDown}
          >
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={activeId}
              aria-label="Search pages, sections and procedures"
              placeholder="Search pages, sections and procedures"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
            />
            <ul id={listId} role="listbox" aria-label="Results">
              {results.length === 0 ? (
                <li className="empty" role="option" aria-selected="false" aria-disabled="true">
                  Nothing matches. Try “baseline” or “takedown”.
                </li>
              ) : (
                results.map((r, i) => (
                  <li
                    key={r.href}
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.href)}
                  >
                    <span>{r.title}</span>
                    <span className="mono quiet">{r.group}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : null
  );
}
