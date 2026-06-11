// Class picker: four family backgrounds (GAME_DESIGN.md §2). Chosen once,
// at new game, and permanent for the save. All `attrs` sum to exactly 100
// (lint-enforced — see src/content/lint.ts).

import { KANZASHI, type KanzashiId } from './kanzashi';
import type { ClassId, FactionId } from '../engine/types';

export type ClassDef = {
  id: ClassId;
  name: string;
  blurb: string;
  attrs: { charisma: number; allure: number; rhetoric: number; taste: number };
  startKoku: number;
  incomeMult: number;
  composureCapMult: number;
  startRobes: string[];
  startFavors?: { npc: string; count: number }[];
  startGossipTags?: string[];
  startFactionRep?: Partial<Record<FactionId, number>>;
  perks: string[]; // engine-known perk ids: 'poem_hint', 'gossip_ear', etc.
  scheduledRipples?: { triggerMonth: number; sceneId: string }[];
  // Display-only summaries for the class picker screen.
  perkSummary: string;
  liabilitySummary: string;
};

export const CLASS_IDS: ClassId[] = ['governors_heir', 'judges_child', 'old_name', 'salon_child'];

export const BASE_COMPOSURE_CAP = 100;

export const CLASSES: Record<ClassId, ClassDef> = {
  governors_heir: {
    id: 'governors_heir',
    name: "The Governor's Heir",
    blurb:
      'Provincial governor stock, new money — the carriages murmur about your family\'s ' +
      'origins, but the koku is real.',
    attrs: { charisma: 30, allure: 25, rhetoric: 25, taste: 20 },
    startKoku: 300,
    incomeMult: 1.25,
    composureCapMult: 1,
    startRobes: [],
    startGossipTags: ['smells_of_the_provinces'],
    startFactionRep: { rivalHouses: -10 },
    perks: ['triple_starting_koku', 'estate_income_25'],
    perkSummary: '3x starting Koku, +25% estate income.',
    liabilitySummary: '"Smells of the provinces" — old-houses faction starts at -10.',
  },

  judges_child: {
    id: 'judges_child',
    name: "The Judge's Child",
    blurb:
      'Raised among case law and precedent in a myōbō legal-scholar household — sharp-tongued, ' +
      'plainly dressed.',
    attrs: { charisma: 25, allure: 25, rhetoric: 35, taste: 15 },
    startKoku: 100,
    incomeMult: 1,
    composureCapMult: 1.25,
    startRobes: ['plain_robe'],
    perks: ['composure_cap_25', 'poem_hint'],
    perkSummary: '+25% Composure cap; the poem builder shows a structural hint.',
    liabilitySummary: 'Taste 15, and a bare starting wardrobe — early kasane mistakes near-guaranteed.',
  },

  old_name: {
    id: 'old_name',
    name: 'The Old Name',
    blurb:
      'A once-great house in decline — the name still opens doors that the treasury cannot.',
    attrs: { charisma: 20, allure: 30, rhetoric: 15, taste: 35 },
    startKoku: 50,
    incomeMult: 0.75,
    composureCapMult: 1,
    startRobes: ['heirloom_robe'],
    startFactionRep: { rivalHouses: 10 },
    perks: ['heirloom_robe_set', 'recognized_old_name'],
    scheduledRipples: [{ triggerMonth: 6, sceneId: 'old_name_debt_01' }],
    perkSummary: 'Heirloom kasane robe, +10 old-houses reputation, recognized by senior NPCs.',
    liabilitySummary: 'Lowest starting Koku, weakest estate income, and a family debt comes due in month 6.',
  },

  salon_child: {
    id: 'salon_child',
    name: 'The Salon Child',
    blurb:
      "Grew up underfoot in a celebrated literary salon — everyone's favorite, and everyone's subject.",
    attrs: { charisma: 35, allure: 25, rhetoric: 20, taste: 20 },
    startKoku: 100,
    incomeMult: 1,
    composureCapMult: 0.75,
    startRobes: [],
    startFavors: [{ npc: 'sharpBrush', count: 2 }],
    perks: ['gossip_ear', 'gossip_multiplier_1_5'],
    perkSummary: 'Starts with 2 Favor with The Sharp Brush, and a "gossip ear" hint per anchor event.',
    liabilitySummary: '-25% Composure cap, and gossip about you spreads at x1.5.',
  },
};

export function getClassDef(id: ClassId): ClassDef {
  return CLASSES[id];
}

/**
 * Composure cap, scaled by the chosen class's composureCapMult (1 if no
 * class chosen yet) and by the equipped kanzashi's composureCapMult
 * passive, if any (e.g. Tsukikage, +25%).
 */
export function computeComposureCap(classId: ClassId | null, kanzashiEquipped?: string | null): number {
  const classMult = classId ? CLASSES[classId].composureCapMult : 1;
  const kanzashiMult =
    KANZASHI[kanzashiEquipped as KanzashiId]?.passives.find((p) => p.kind === 'composureCapMult')?.mult ?? 1;
  return Math.round(BASE_COMPOSURE_CAP * classMult * kanzashiMult);
}
