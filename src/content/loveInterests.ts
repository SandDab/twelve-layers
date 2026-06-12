// The v0.6 eight-love-interest roster (GAME_DESIGN.md §6, §13). All eight
// are missable and available to either PC. `criticalChoice.sceneId` points
// at a TODO-stub scene (registered in src/content/scenes/index.ts) until
// the M4a/M4b route content is authored. `buff` fields are typed per §13
// but not yet mechanically wired (M4b: marriage buff activation).

import { LOVE_INTEREST_IDS, type LoveInterest, type LoveInterestId } from '../engine/types';

export const LOVE_INTERESTS: Record<LoveInterestId, LoveInterest> = {
  climber: {
    id: 'climber',
    name: 'The Social Climber',
    archetype: 'A lady-in-waiting burning to rise, sharp-tongued, ambitious.',
    introConditions: { tags: ['grace'], minAttrs: { charisma: 25 } },
    caresAboutStyle: true,
    acclaim: 1,
    deference: -1,
    criticalChoice: { sceneId: 'romance_climber_critical', stage: 3 },
    valuedTags: ['alignment', 'grace'],
    kanzashiAffinity: 'grace',
    buff: [{ kind: 'tokimekiMult', mult: 1.25 }],
  },

  widow: {
    id: 'widow',
    name: 'The Young Widow',
    archetype: 'Quiet, observant, has already survived the court once.',
    introConditions: { tags: ['restraint'], minAttrs: { taste: 20 } },
    caresAboutStyle: false,
    acclaim: 0,
    deference: 1,
    criticalChoice: { sceneId: 'romance_widow_critical', stage: 4 },
    valuedTags: ['restraint', 'principle'],
    kanzashiAffinity: 'restraint',
    buff: [{ kind: 'rippleIntercept', perSeason: 1 }],
  },

  sole_heir: {
    id: 'sole_heir',
    name: 'The Sole Heir',
    archetype: 'Last of her line; marrying her is uxorilocal marriage into a superior household.',
    introConditions: { tags: ['principle'], minAttrs: { rhetoric: 25 } },
    caresAboutStyle: true,
    acclaim: 0,
    deference: 1,
    criticalChoice: { sceneId: 'romance_sole_heir_critical', stage: 2 },
    valuedTags: ['principle', 'grace'],
    kanzashiAffinity: 'principle',
    buff: [{ kind: 'attrBonus', attr: 'taste', amount: 5 }, { kind: 'kasaneProtection' }],
  },

  riverbank: {
    id: 'riverbank',
    name: 'The Girl from the Riverbank',
    archetype: 'Boyish governor’s daughter raised half-wild by the Kamo; fishes, climbs, hopeless at kasane.',
    introConditions: { tags: ['restraint'], minAttrs: { taste: 15 } },
    caresAboutStyle: false,
    acclaim: -1,
    deference: 0,
    criticalChoice: { sceneId: 'romance_riverbank_critical', stage: 5 },
    valuedTags: ['restraint', 'grace'],
    kanzashiAffinity: 'restraint',
    buff: [{ kind: 'kokuStipend', amount: 5 }, { kind: 'composureRegen', amount: 5 }],
  },

  captain: {
    id: 'captain',
    name: 'The Captain',
    archetype: 'War hero returned from pacifying an eastern rebellion; useful and slightly alarming.',
    introConditions: { tags: ['alignment'], minAttrs: { charisma: 20 } },
    caresAboutStyle: false,
    acclaim: 1,
    deference: 0,
    criticalChoice: { sceneId: 'romance_captain_critical', stage: 3 },
    valuedTags: ['alignment', 'principle'],
    kanzashiAffinity: 'alignment',
    buff: [{ kind: 'envyWeaken', mult: 0.5 }],
  },

  devotee: {
    id: 'devotee',
    name: 'The Devotee',
    archetype: 'A landholding farmer who idolizes Shinto masters; purity, simplicity, the turning seasons.',
    introConditions: { tags: ['restraint'], minAttrs: { taste: 15 } },
    caresAboutStyle: false,
    acclaim: -1,
    deference: 1,
    criticalChoice: { sceneId: 'romance_devotee_critical', stage: 4 },
    valuedTags: ['restraint', 'principle'],
    kanzashiAffinity: 'restraint',
    buff: [{ kind: 'composureRegen', amount: 5 }, { kind: 'factionRepMult', faction: 'clergy', mult: 1.5 }],
  },

  second_prince: {
    id: 'second_prince',
    name: 'The Second Prince',
    archetype: 'Younger brother of the imperial heir; charming, watched, dangerous to want.',
    introConditions: { tags: ['principle'], minAttrs: { rank: 10, rhetoric: 25 } },
    caresAboutStyle: true,
    acclaim: -1,
    deference: 1,
    criticalChoice: { sceneId: 'romance_second_prince_critical', stage: 5 },
    valuedTags: ['principle', 'grace'],
    kanzashiAffinity: 'grace',
    buff: [{ kind: 'imperialFavor', tier: 1 }, { kind: 'factionRepMult', faction: 'imperial', mult: 1.5 }],
  },

  merchant: {
    id: 'merchant',
    name: 'The Northern Merchant',
    archetype: 'Foreign trader of the far northern routes (sable, amber, arriving via the continental chain).',
    introConditions: { tags: ['alignment'], minAttrs: { charisma: 20 } },
    caresAboutStyle: false,
    acclaim: 1,
    deference: -1,
    criticalChoice: { sceneId: 'romance_merchant_critical', stage: 2 },
    valuedTags: ['alignment', 'grace'],
    kanzashiAffinity: 'alignment',
    buff: [{ kind: 'kokuStipend', amount: 8 }],
  },
};

export function getLoveInterest(id: string): LoveInterest | undefined {
  return LOVE_INTERESTS[id as LoveInterestId];
}

export { LOVE_INTEREST_IDS };
