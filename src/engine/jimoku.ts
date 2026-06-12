import { applyEffects } from './effects';
import type { EndingId, Save } from './types';

/**
 * The year-end jimoku (GAME_DESIGN.md §4, §14): Tokimeki and faction
 * standing convert into permanent Rank, and the year's state resolves
 * into one of the ending slates below. Threshold-deterministic, no RNG,
 * checked in priority order; the first matching ending wins.
 *
 * - Behind the Curtain: a romance reached stage 4+ this year.
 * - Overextended: peak Tokimeki attracted exactly the envy GAME_DESIGN
 *   warns about, the rival houses noticed and said so.
 * - Estranged: standing with some faction soured badly, and no romance
 *   thread offset it. The bittersweet floor (CLAUDE.md tone ceiling).
 * - Toast of the Capital: a strong public year, no faction badly burned.
 * - Quiet Advancement: a modest but real step up.
 * - The Unremarked Year: nothing much happened, which is its own ending.
 */
export function computeEnding(save: Save): EndingId {
  const romanceStages = Object.values(save.romance).map((r) => r.stage);
  const maxRomanceStage = Math.max(...romanceStages);
  const repValues = Object.values(save.factionReputation);
  const minRep = Math.min(...repValues);

  if (maxRomanceStage >= 4) return 'behind_the_curtain';
  if (save.tokimeki >= 50 && save.factionReputation.rivalHouses <= -5) return 'overextended';
  if (minRep <= -10 && maxRomanceStage <= 2) return 'estranged';
  if (save.tokimeki >= 25) return 'toast_of_the_capital';
  if (save.tokimeki >= 10) return 'quiet_advancement';
  return 'unremarked_year';
}

/**
 * Rank gained at the jimoku: the year's Tokimeki and the sum of faction
 * standing both convert, each in steps of 10, floored at zero (a bad
 * year costs no Rank, it simply grants none).
 */
export function computeRankGain(save: Save): number {
  const repSum = Object.values(save.factionReputation).reduce((sum, v) => sum + v, 0);
  return Math.max(0, Math.floor(save.tokimeki / 10) + Math.floor(repSum / 10));
}

/**
 * Resolve the jimoku for the year that is ending: convert Tokimeki and
 * faction standing into permanent Rank, and record the ending slate that
 * applies. Must be called with the closing year's state, before
 * `tickCalendar` resets Tokimeki for the new year.
 */
export function applyJimoku(save: Save): Save {
  const endingId = computeEnding(save);
  const rankGain = computeRankGain(save);

  let next = save;
  if (rankGain > 0) {
    next = applyEffects([{ kind: 'attr', attr: 'rank', delta: rankGain }], next);
  }

  return {
    ...next,
    jimokuResult: { year: save.year, endingId, rankGain },
  };
}
