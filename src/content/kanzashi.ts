// Kanzashi (GAME_DESIGN.md §8): four hairpins, one per year, each awarded
// for a choice matching its theme during its (secret) assigned month.
// Never purchasable — see CLAUDE.md content-authoring conventions.

import type { AttributeKey, FactionId, ThemeTag } from '../engine/types';

export type KanzashiId = 'kobai' | 'tsukikage' | 'fuji' | 'sango';

export const KANZASHI_IDS: KanzashiId[] = ['kobai', 'tsukikage', 'fuji', 'sango'];

export type KanzashiPassive =
  | { kind: 'attrBonus'; attr: AttributeKey; amount: number }
  | { kind: 'composureCapMult'; mult: number }
  | { kind: 'gossipMultiplier'; tag: string; mult: number }
  | { kind: 'factionRepMult'; faction: FactionId; mult: number }
  | { kind: 'kokuStipend'; amount: number };

export type KanzashiDef = {
  id: KanzashiId;
  name: string;
  color: string;
  theme: ThemeTag;
  passiveSummary: string;
  passives: KanzashiPassive[];
  deliverySceneId: string;
};

export const KANZASHI: Record<KanzashiId, KanzashiDef> = {
  kobai: {
    id: 'kobai',
    name: 'Kōbai',
    color: 'crimson lacquer',
    theme: 'principle',
    passiveSummary: '+5 Taste; gossip from kasane mistakes is halved.',
    passives: [
      { kind: 'attrBonus', attr: 'taste', amount: 5 },
      { kind: 'gossipMultiplier', tag: 'wore_offseason_robe', mult: 0.5 },
    ],
    deliverySceneId: 'kanzashi_kobai_delivery',
  },

  tsukikage: {
    id: 'tsukikage',
    name: 'Tsukikage',
    color: 'silver and pearl',
    theme: 'restraint',
    passiveSummary: '+25% Composure cap.',
    passives: [{ kind: 'composureCapMult', mult: 1.25 }],
    deliverySceneId: 'kanzashi_tsukikage_delivery',
  },

  fuji: {
    id: 'fuji',
    name: 'Fuji',
    color: 'violet and gold',
    theme: 'alignment',
    passiveSummary: 'Old-houses reputation gains are increased by 50%.',
    passives: [{ kind: 'factionRepMult', faction: 'rivalHouses', mult: 1.5 }],
    deliverySceneId: 'kanzashi_fuji_delivery',
  },

  sango: {
    id: 'sango',
    name: 'Sango',
    color: 'coral red',
    theme: 'grace',
    passiveSummary: "Admirers' gifts: +3 Koku each month while worn.",
    passives: [{ kind: 'kokuStipend', amount: 3 }],
    deliverySceneId: 'kanzashi_sango_delivery',
  },
};

export function getKanzashi(id: string): KanzashiDef | undefined {
  return KANZASHI[id as KanzashiId];
}
