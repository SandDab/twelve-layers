// Ikebana stem catalog (GAME_DESIGN.md §10). Content is data: the
// mini-game and scoring logic in src/engine/ikebana.ts only know about
// tiers and seasons, never specific stems.

/** The heaven-earth-human height triad of classical ikebana arrangement. */
export type IkebanaTier = 'heaven' | 'earth' | 'human';

export type StemDef = {
  id: string;
  name: string;
  tier: IkebanaTier;
  season: 1 | 2 | 3 | 4;
};

export const STEMS: StemDef[] = [
  // Spring
  { id: 'plum_branch', name: 'Plum branch', tier: 'heaven', season: 1 },
  { id: 'cherry_spray', name: 'Cherry spray', tier: 'human', season: 1 },
  { id: 'violet', name: 'Violet', tier: 'earth', season: 1 },
  // Summer
  { id: 'iris', name: 'Iris', tier: 'heaven', season: 2 },
  { id: 'hydrangea', name: 'Hydrangea', tier: 'human', season: 2 },
  { id: 'reed', name: 'Reed', tier: 'earth', season: 2 },
  // Autumn
  { id: 'maple_branch', name: 'Maple branch', tier: 'heaven', season: 3 },
  { id: 'chrysanthemum', name: 'Chrysanthemum', tier: 'human', season: 3 },
  { id: 'pampas_grass', name: 'Pampas grass', tier: 'earth', season: 3 },
  // Winter
  { id: 'pine_branch', name: 'Pine branch', tier: 'heaven', season: 4 },
  { id: 'camellia', name: 'Camellia', tier: 'human', season: 4 },
  { id: 'narcissus', name: 'Narcissus', tier: 'earth', season: 4 },
];

export function getStem(id: string): StemDef | undefined {
  return STEMS.find((s) => s.id === id);
}
