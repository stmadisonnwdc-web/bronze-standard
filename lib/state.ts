'use client';

import { create } from 'zustand';

/** high: full scene · low: no postprocessing, DPR 1 · off: scene stopped, poster shown. */
export type QualityTier = 'high' | 'low' | 'off';
export type ThemeChoice = 'system' | 'light' | 'dark';

interface UIState {
  paletteOpen: boolean;
  paletteReturnFocus: HTMLElement | null;
  quality: QualityTier;
  theme: ThemeChoice;
  openPalette: (from: HTMLElement | null) => void;
  closePalette: () => void;
  setQuality: (q: QualityTier) => void;
  setTheme: (t: ThemeChoice) => void;
}

export const useUI = create<UIState>((set) => ({
  paletteOpen: false,
  paletteReturnFocus: null,
  quality: 'high',
  theme: 'system',
  openPalette: (from) => set({ paletteOpen: true, paletteReturnFocus: from }),
  closePalette: () => set({ paletteOpen: false }),
  setQuality: (quality) => set({ quality }),
  setTheme: (theme) => set({ theme }),
}));
