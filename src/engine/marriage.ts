// Marriage-buff helpers (GAME_DESIGN.md §13): reading a passive off the
// married love interest's buff list, and applying one-shot attribute
// bonuses at the moment of marriage.

import { LOVE_INTERESTS } from '../content/loveInterests';
import type { LoveInterestId, PassiveModifier, Save } from './types';

/** The married love interest's passive of a given kind, if any. */
export function getMarriedBuff<K extends PassiveModifier['kind']>(
  save: Save,
  kind: K,
): Extract<PassiveModifier, { kind: K }> | undefined {
  return LOVE_INTERESTS[save.married as LoveInterestId]?.buff.find(
    (p): p is Extract<PassiveModifier, { kind: K }> => p.kind === kind,
  );
}

/** Apply a newly-married love interest's flat attrBonus passives, once, at marriage. */
export function applyMarriageAttrBonuses(save: Save, loveInterestId: string): Save {
  const li = LOVE_INTERESTS[loveInterestId as LoveInterestId];
  if (!li) return save;

  let attributes = save.attributes;
  for (const passive of li.buff) {
    if (passive.kind === 'attrBonus') {
      attributes = { ...attributes, [passive.attr]: attributes[passive.attr] + passive.amount };
    }
  }
  return { ...save, attributes };
}
