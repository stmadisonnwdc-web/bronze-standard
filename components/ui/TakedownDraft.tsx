'use client';

import { useEffect } from 'react';

const KEY = 'bs-takedown-draft';
const FIELDS = ['path', 'requester', 'assetRef', 'reason'] as const;

/**
 * Keeps a takedown draft for this tab only (sessionStorage), so a failed submission can be
 * retried without retyping. Cleared on the confirmation page. Without JavaScript this does nothing.
 */
export function TakedownDraft({ formId, restore }: { formId: string; restore: boolean }) {
  useEffect(() => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return;
    if (restore) {
      try {
        const draft = JSON.parse(window.sessionStorage.getItem(KEY) || '{}') as Record<string, string>;
        for (const f of FIELDS) {
          const el = form.elements.namedItem(f);
          if (!el || draft[f] === undefined) continue;
          if (el instanceof RadioNodeList) el.value = draft[f];
          else if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.value = draft[f];
        }
      } catch {
        /* nothing to restore */
      }
    }
    const save = () => {
      const data: Record<string, string> = {};
      const fd = new FormData(form);
      for (const f of FIELDS) data[f] = String(fd.get(f) ?? '');
      try {
        window.sessionStorage.setItem(KEY, JSON.stringify(data));
      } catch {
        /* storage unavailable */
      }
    };
    form.addEventListener('submit', save);
    return () => form.removeEventListener('submit', save);
  }, [formId, restore]);
  return null;
}

export function ClearTakedownDraft() {
  useEffect(() => {
    try {
      window.sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);
  return null;
}
