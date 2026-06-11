// The kasane no irome (layered-robe color combination) for each month
// of the court calendar. These drive every CSS color token via custom
// properties — see useKasanePalette. Components must never hardcode
// hex values; everything flows from here.

export type KasanePalette = {
  /** Japanese name of the combination */
  jp: string;
  /** English gloss */
  en: string;
  /** Outer (face) layer color */
  face: string;
  /** Inner (lining) layer color */
  lining: string;
  /** Page background */
  bg: string;
  /** Card / panel surface */
  surface: string;
  /** Raised surface (active cards, nav) */
  surfaceRaised: string;
  /** Primary text */
  text: string;
  /** Muted / secondary text */
  textMuted: string;
  /** Accent (buttons, highlights, active states) */
  accent: string;
  /** Text color rendered on top of the accent color */
  accentText: string;
  /** Border / hairline color */
  border: string;
};

export const KASANE_PALETTES: Record<number, KasanePalette> = {
  1: {
    jp: '紅梅 (kōbai)',
    en: 'Red Plum',
    face: '#d65a6e',
    lining: '#7a3b46',
    bg: '#fdf3f1',
    surface: '#ffffff',
    surfaceRaised: '#fbe4e6',
    text: '#3a2226',
    textMuted: '#8a6469',
    accent: '#d65a6e',
    accentText: '#ffffff',
    border: '#f0cdd1',
  },
  2: {
    jp: '柳 (yanagi)',
    en: 'Willow',
    face: '#fbfdf3',
    lining: '#7c9b6e',
    bg: '#f6f9ee',
    surface: '#ffffff',
    surfaceRaised: '#e7efd9',
    text: '#33392b',
    textMuted: '#80917a',
    accent: '#7c9b6e',
    accentText: '#ffffff',
    border: '#dbe6cb',
  },
  3: {
    jp: '桜 (sakura)',
    en: 'Cherry Blossom',
    face: '#fdf7f8',
    lining: '#e8a0b4',
    bg: '#fef8f9',
    surface: '#ffffff',
    surfaceRaised: '#fbe3ea',
    text: '#3d2c31',
    textMuted: '#9c7c84',
    accent: '#e8a0b4',
    accentText: '#3d2c31',
    border: '#f6dde4',
  },
  4: {
    jp: '藤 (fuji)',
    en: 'Wisteria',
    face: '#9b8bc4',
    lining: '#cdd9c6',
    bg: '#f5f3fa',
    surface: '#ffffff',
    surfaceRaised: '#e7e1f3',
    text: '#332f44',
    textMuted: '#8782a0',
    accent: '#9b8bc4',
    accentText: '#ffffff',
    border: '#ded7ee',
  },
  5: {
    jp: '菖蒲 (ayame)',
    en: 'Iris',
    face: '#5f6fa6',
    lining: '#8fb59a',
    bg: '#f1f4f6',
    surface: '#ffffff',
    surfaceRaised: '#dde4ea',
    text: '#262c3d',
    textMuted: '#727c93',
    accent: '#5f6fa6',
    accentText: '#ffffff',
    border: '#cfd8e3',
  },
  6: {
    jp: '卯の花 (u no hana)',
    en: 'Deutzia',
    face: '#fbfffa',
    lining: '#9bc28d',
    bg: '#f6fbf4',
    surface: '#ffffff',
    surfaceRaised: '#e3f0dd',
    text: '#2c3729',
    textMuted: '#7f9078',
    accent: '#9bc28d',
    accentText: '#2c3729',
    border: '#d8ead2',
  },
  7: {
    jp: '蓮 (hasu)',
    en: 'Lotus',
    face: '#fdf6f7',
    lining: '#a13e4c',
    bg: '#fbf4f0',
    surface: '#ffffff',
    surfaceRaised: '#f3dfdc',
    text: '#3a2620',
    textMuted: '#9b7a72',
    accent: '#a13e4c',
    accentText: '#ffffff',
    border: '#ecd6d2',
  },
  8: {
    jp: '女郎花 (ominaeshi)',
    en: 'Patrinia',
    face: '#e8c95e',
    lining: '#7c9b6e',
    bg: '#fbf8ed',
    surface: '#ffffff',
    surfaceRaised: '#f1e8c8',
    text: '#3a3420',
    textMuted: '#9a9270',
    accent: '#cba53a',
    accentText: '#3a3420',
    border: '#ece1bd',
  },
  9: {
    jp: '菊 (kiku)',
    en: 'Chrysanthemum',
    face: '#fefcf6',
    lining: '#8a5b8c',
    bg: '#faf6f1',
    surface: '#ffffff',
    surfaceRaised: '#ede1ee',
    text: '#352d36',
    textMuted: '#8c7e8e',
    accent: '#8a5b8c',
    accentText: '#ffffff',
    border: '#e6d8e7',
  },
  10: {
    jp: '紅葉 (momiji)',
    en: 'Autumn Maple',
    face: '#c1502e',
    lining: '#caa14a',
    bg: '#fbf2ea',
    surface: '#ffffff',
    surfaceRaised: '#f3ddc9',
    text: '#3b2a1f',
    textMuted: '#9a8270',
    accent: '#c1502e',
    accentText: '#ffffff',
    border: '#edd6c4',
  },
  11: {
    jp: '檜皮 (hiwada)',
    en: 'Cypress Bark',
    face: '#8a5a3c',
    lining: '#d8c08a',
    bg: '#f8f3ec',
    surface: '#ffffff',
    surfaceRaised: '#ecdcc6',
    text: '#352922',
    textMuted: '#90806f',
    accent: '#8a5a3c',
    accentText: '#ffffff',
    border: '#e6d6c2',
  },
  12: {
    jp: '雪の下 (yuki no shita)',
    en: 'Beneath the Snow',
    face: '#fdfeff',
    lining: '#3f5e4a',
    bg: '#f3f6f5',
    surface: '#ffffff',
    surfaceRaised: '#dde8e1',
    text: '#27332c',
    textMuted: '#7c8c83',
    accent: '#3f5e4a',
    accentText: '#ffffff',
    border: '#d5e1da',
  },
};

export function getKasanePalette(month: number): KasanePalette {
  return KASANE_PALETTES[month] ?? KASANE_PALETTES[1];
}
