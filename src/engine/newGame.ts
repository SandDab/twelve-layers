import { CLASSES, computeComposureCap } from '../content/classes';
import { assignKanzashiMonths } from './kanzashi';
import type { ClassId, FactionId, Save } from './types';

/**
 * Apply a chosen class's starting attrs, Koku, Composure, robes, favors,
 * gossip tags, faction reputation, and scheduled ripples (GAME_DESIGN.md
 * §2). Called once, from the new-game class picker; classId is permanent
 * thereafter.
 */
export function applyClass(save: Save, classId: ClassId): Save {
  const def = CLASSES[classId];

  let next: Save = {
    ...save,
    classId,
    attributes: {
      ...save.attributes,
      charisma: def.attrs.charisma,
      allure: def.attrs.allure,
      rhetoric: def.attrs.rhetoric,
      taste: def.attrs.taste,
    },
    resources: {
      ...save.resources,
      koku: def.startKoku,
      composure: computeComposureCap(classId),
    },
    wardrobe: {
      ...save.wardrobe,
      owned: [...save.wardrobe.owned, ...def.startRobes],
    },
    kanzashiAssignments: assignKanzashiMonths(save.kanzashiSeed, save.year),
  };

  for (const tag of def.startGossipTags ?? []) {
    next = { ...next, flags: { ...next.flags, [tag]: true } };
  }

  for (const { npc, count } of def.startFavors ?? []) {
    next = { ...next, favors: { ...next.favors, [npc]: (next.favors[npc] ?? 0) + count } };
  }

  if (def.startFactionRep) {
    const factionReputation = { ...next.factionReputation };
    for (const [faction, delta] of Object.entries(def.startFactionRep) as [FactionId, number][]) {
      factionReputation[faction] += delta;
    }
    next = { ...next, factionReputation };
  }

  for (const { triggerMonth, sceneId } of def.scheduledRipples ?? []) {
    const triggerYear = triggerMonth >= next.month ? next.year : next.year + 1;
    next = { ...next, rippleQueue: [...next.rippleQueue, { triggerYear, triggerMonth, sceneId }] };
  }

  return next;
}
