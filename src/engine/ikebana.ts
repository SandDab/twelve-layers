import { getStem, type StemDef } from '../content/ikebana';
import { seasonOfMonth } from './household';

/** Vase has 7 placement slots; empty slots ("ma", negative space) can be correct. */
export const IKEBANA_SLOTS = 7;

/** The number of placed stems judged most balanced, leaving two empty slots. */
export const IKEBANA_IDEAL_STEMS = 5;

export type IkebanaScoreBreakdown = {
  triad: number;
  season: number;
  space: number;
};

export type IkebanaScoreResult = {
  /** 0-80, see breakdown for components. */
  score: number;
  /** Taste attribute gain, 0-5, derived from score. */
  tasteDelta: number;
  breakdown: IkebanaScoreBreakdown;
};

/**
 * Score a vase arrangement: a fixed-length array of slots, each either
 * a stem id or null (empty). Threshold-deterministic, no RNG.
 *
 * - Triad (0-30): +10 for each of heaven/earth/human represented at least once.
 * - Season (-3 per stem to +6 per stem): stems matching the current
 *   month's season score positive, mismatched stems score negative.
 * - Space (0-20): peaks when exactly IKEBANA_IDEAL_STEMS slots are filled,
 *   tapering off as the arrangement is over- or under-filled.
 */
export function scoreArrangement(slots: (string | null)[], month: number): IkebanaScoreResult {
  const season = seasonOfMonth(month);
  const stems = slots
    .filter((id): id is string => id !== null)
    .map((id) => getStem(id))
    .filter((s): s is StemDef => s !== undefined);

  const tiers = new Set(stems.map((s) => s.tier));
  const triad = tiers.size * 10;

  const seasonScore = stems.reduce((sum, s) => sum + (s.season === season ? 6 : -3), 0);

  const diff = Math.abs(stems.length - IKEBANA_IDEAL_STEMS);
  const space = Math.max(0, 20 - diff * 7);

  const score = Math.max(0, triad + seasonScore + space);
  const tasteDelta = Math.max(0, Math.min(5, Math.round(score / 16)));

  return { score, tasteDelta, breakdown: { triad, season: seasonScore, space } };
}
