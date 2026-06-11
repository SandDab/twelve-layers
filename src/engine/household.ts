import { getRobe } from '../content/robes';
import { STAFF_DEFINITIONS } from '../content/staff';
import { getTokimekiTier } from '../content/tokimekiTiers';
import { tickCalendar } from './calendar';
import { addMonths, applyEffects } from './effects';
import { resolveDueGossip } from './ripples';
import { BASE_FREE_ACTIONS, type AttributeKey, type Save, type StaffRole } from './types';

export const BASE_INCOME = 20;
export const TRAIN_COMPOSURE_COST = 10;
export const TRAIN_ATTR_GAIN = 2;
export const REST_COMPOSURE_GAIN = 15;

export const ENVY_RIPPLE_FLAG = 'envy_rival_attention_queued';
export const ENVY_SCENE_ID = 'envy_rival_01';
export const ENVY_DELAY_MONTHS = 2;

/** Heian-calendar season for a given month: 1 (1-3) through 4 (10-12). */
export function seasonOfMonth(month: number): 1 | 2 | 3 | 4 {
  return (Math.floor((month - 1) / 3) + 1) as 1 | 2 | 3 | 4;
}

/** Monthly koku income: base + steward bonus + Tokimeki tier bonus. */
export function computeIncome(staff: Record<StaffRole, boolean>, tokimeki: number): number {
  let income = BASE_INCOME;
  if (staff.steward) income += STAFF_DEFINITIONS.steward.incomeBonus;
  income += getTokimekiTier(tokimeki).incomeBonus;
  return income;
}

/** Free actions granted for the coming month, including Tokimeki tier bonuses. */
export function computeFreeActions(tokimeki: number): number {
  return BASE_FREE_ACTIONS + getTokimekiTier(tokimeki).actionsBonus;
}

/** Composure restored by the Rest action, doubled with a gardener. */
export function computeRestGain(staff: Record<StaffRole, boolean>): number {
  return staff.gardener ? STAFF_DEFINITIONS.gardener.restBonus : REST_COMPOSURE_GAIN;
}

/** Attribute gain from the Train action; poet-tutor boosts Rhetoric specifically. */
export function computeTrainGain(attr: AttributeKey, staff: Record<StaffRole, boolean>): number {
  if (attr === 'rhetoric' && staff.poetTutor) {
    return STAFF_DEFINITIONS.poetTutor.trainBonus;
  }
  return TRAIN_ATTR_GAIN;
}

/**
 * Apply the equipped robe's effect for the month that's ending: a bonus
 * if its season matches the current month, a penalty plus delayed gossip
 * if it doesn't (GAME_DESIGN.md §8 — wardrobe teaches the calendar).
 */
export function applyWardrobeEffects(save: Save): Save {
  if (!save.wardrobe.equipped) return save;
  const robe = getRobe(save.wardrobe.equipped);
  if (!robe) return save;

  if (robe.season === seasonOfMonth(save.month)) {
    return applyEffects(
      [
        { kind: 'attr', attr: 'allure', delta: robe.allure },
        { kind: 'attr', attr: 'taste', delta: robe.taste },
        { kind: 'resource', res: 'tokimeki', delta: 2 },
      ],
      save,
    );
  }

  return applyEffects(
    [
      { kind: 'attr', attr: 'allure', delta: -2 },
      { kind: 'attr', attr: 'taste', delta: -2 },
      { kind: 'resource', res: 'tokimeki', delta: -2 },
      {
        kind: 'gossip',
        tag: 'wore_offseason_robe',
        factionDeltas: { rivalHouses: -2 },
        delayMonths: 1,
      },
    ],
    save,
  );
}

/**
 * Once Tokimeki reaches the top tier, queue the envy-rival ripple a
 * couple of months out. Fires exactly once per game (flag-gated).
 */
export function applyTokimekiEnvyTrigger(save: Save): Save {
  const tier = getTokimekiTier(save.tokimeki);
  if (!tier.envy || save.flags[ENVY_RIPPLE_FLAG]) return save;

  const { year: triggerYear, month: triggerMonth } = addMonths(save.year, save.month, ENVY_DELAY_MONTHS);

  return {
    ...save,
    flags: { ...save.flags, [ENVY_RIPPLE_FLAG]: true },
    rippleQueue: [...save.rippleQueue, { triggerYear, triggerMonth, sceneId: ENVY_SCENE_ID }],
  };
}

/**
 * Composed end-of-month step: wardrobe effects for the closing month,
 * the envy-tier check, income, the calendar tick (incl. year rollover
 * and Tokimeki reset), due gossip resolution, and next month's free
 * action allowance.
 */
export function applyMonthEnd(save: Save): Save {
  let next = applyWardrobeEffects(save);
  next = applyTokimekiEnvyTrigger(next);
  next = {
    ...next,
    resources: { ...next.resources, koku: next.resources.koku + computeIncome(next.staff, next.tokimeki) },
  };
  next = tickCalendar(next);
  next = resolveDueGossip(next);
  next = { ...next, actionsRemaining: computeFreeActions(next.tokimeki) };
  return next;
}
