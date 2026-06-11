import { useEffect } from 'react';
import { getKasanePalette, type KasanePalette } from './kasanePalettes';

const TOKEN_MAP: Record<keyof Omit<KasanePalette, 'jp' | 'en'>, string> = {
  face: '--kasane-face',
  lining: '--kasane-lining',
  bg: '--color-bg',
  surface: '--color-surface',
  surfaceRaised: '--color-surface-raised',
  text: '--color-text',
  textMuted: '--color-text-muted',
  accent: '--color-accent',
  accentText: '--color-accent-text',
  border: '--color-border',
};

/**
 * Applies the current month's kasane palette to the document root as
 * CSS custom properties. Every component sources its colors from
 * these tokens, so the whole UI shifts with the calendar.
 */
export function useKasanePalette(month: number): void {
  useEffect(() => {
    const palette = getKasanePalette(month);
    const root = document.documentElement;
    for (const [key, cssVar] of Object.entries(TOKEN_MAP) as [
      keyof typeof TOKEN_MAP,
      string,
    ][]) {
      root.style.setProperty(cssVar, palette[key]);
    }
    root.style.setProperty('--kasane-name-jp', `"${palette.jp}"`);
    root.style.setProperty('--kasane-name-en', `"${palette.en}"`);
  }, [month]);
}
