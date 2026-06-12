// Kanzashi engine logic (GAME_DESIGN.md §8): yearly seeded month
// assignment, theme-tag award detection, and equip-time passive bonuses.

import { KANZASHI, KANZASHI_IDS, type KanzashiId } from '../content/kanzashi';
import { addMonths } from './effects';
import { fnv1a } from './fnv';
import type { Save, ThemeTag } from './types';

/** v0.1 assignment pool: the six anchor-event months (GAME_DESIGN.md §9). */
export const KANZASHI_MONTH_POOL = [1, 3, 4, 7, 8, 11];

function seededShuffle<T>(arr: T[], seed: number, year: number): T[] {
  const result = [...arr];
  let state = fnv1a(`${seed}:${year}`);
  for (let i = result.length - 1; i > 0; i--) {
    state = fnv1a(String(state));
    const j = state % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Deterministically assign each kanzashi to a distinct month from the
 * anchor-event pool, seeded by `seed` and `year` so the assignment is
 * stable but re-rolls every year (including NG+).
 */
export function assignKanzashiMonths(seed: number, year: number): Record<string, number> {
  const months = seededShuffle(KANZASHI_MONTH_POOL, seed, year);
  const assignment: Record<string, number> = {};
  KANZASHI_IDS.forEach((id, i) => {
    assignment[id] = months[i];
  });
  return assignment;
}

/**
 * If the player picked a choice whose themeTags match an as-yet-unowned
 * kanzashi assigned to the current month, queue its delivery ripple for
 * next month. Opportunities are never labeled in dialogue (CLAUDE.md).
 */
export function checkKanzashiAward(save: Save, themeTags: ThemeTag[] | undefined): Save {
  if (!themeTags || themeTags.length === 0) return save;

  let next = save;
  for (const id of KANZASHI_IDS) {
    const def = KANZASHI[id];
    if (!themeTags.includes(def.theme)) continue;
    if (next.kanzashiAssignments[id] !== next.month) continue;
    if (next.kanzashiOwned.includes(id)) continue;
    if (next.rippleQueue.some((r) => r.sceneId === def.deliverySceneId)) continue;

    const { year: triggerYear, month: triggerMonth } = addMonths(next.year, next.month, 1);
    next = {
      ...next,
      rippleQueue: [...next.rippleQueue, { triggerYear, triggerMonth, sceneId: def.deliverySceneId }],
    };
  }
  return next;
}

/** Apply (sign=1) or remove (sign=-1) a kanzashi's flat attrBonus passives. */
export function applyKanzashiAttrBonuses(save: Save, id: string, sign: 1 | -1): Save {
  const def = KANZASHI[id as KanzashiId];
  if (!def) return save;

  let attributes = save.attributes;
  for (const passive of def.passives) {
    if (passive.kind === 'attrBonus') {
      attributes = { ...attributes, [passive.attr]: attributes[passive.attr] + passive.amount * sign };
    }
  }
  return { ...save, attributes };
}
