// Wardrobe (kasane no irome), GAME_DESIGN.md §8. One robe per season for
// M2; the full ~16-robe wardrobe is later content. Equipping a robe whose
// season matches the current month grants Allure/Taste and a small
// Tokimeki bump; an out-of-season robe penalizes both and starts gossip
// (see src/engine/household.ts: applyWardrobeEffects).

export type Robe = {
  id: string;
  name: string;
  season: 1 | 2 | 3 | 4; // 1: months 1-3, 2: 4-6, 3: 7-9, 4: 10-12
  kasane: [string, string]; // [face, lining]
  allure: number;
  taste: number;
  cost: number;
};

export const ROBES: Robe[] = [
  {
    id: 'sakura_gasane',
    name: 'Sakura-gasane',
    season: 1,
    kasane: ['pale pink', 'white'],
    allure: 4,
    taste: 3,
    cost: 40,
  },
  {
    id: 'aoi_gasane',
    name: 'Aoi-gasane (Hollyhock)',
    season: 2,
    kasane: ['lavender', 'pale green'],
    allure: 4,
    taste: 3,
    cost: 40,
  },
  {
    id: 'momiji_gasane',
    name: 'Momiji-gasane (Autumn Maple)',
    season: 3,
    kasane: ['deep crimson', 'gold'],
    allure: 5,
    taste: 4,
    cost: 50,
  },
  {
    id: 'yukinoshita_gasane',
    name: 'Yukinoshita-gasane (Beneath the Snow)',
    season: 4,
    kasane: ['white', 'deep green'],
    allure: 4,
    taste: 5,
    cost: 50,
  },
];

export function getRobe(id: string): Robe | undefined {
  return ROBES.find((r) => r.id === id);
}
