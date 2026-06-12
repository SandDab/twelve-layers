import type { Attributes, PoemFragment } from './types';
import { seasonOfMonth } from './household';

export type PoemSelection = {
  season: PoemFragment;
  image: PoemFragment;
  turn: PoemFragment;
};

export type PoemScoreBreakdown = {
  taste: number;
  season: number;
  rhetoric: number;
  callback: number;
};

export type PoemScoreResult = {
  /** 0-60, see breakdown for components. */
  score: number;
  success: boolean;
  breakdown: PoemScoreBreakdown;
};

/** A poem succeeds at this score or higher (out of a 60-point max). */
export const POEM_SUCCESS_THRESHOLD = 35;

/** Combined Rhetoric + Taste needed for the composition bonus. */
export const POEM_RHETORIC_TASTE_THRESHOLD = 40;

/**
 * Score a composed waka (GAME_DESIGN.md §6 poem builder), threshold-deterministic:
 *
 * - Taste match (0-15): +5 per fragment whose imagery tags overlap the
 *   recipient's known tastes.
 * - Season correctness (0-20): +10 if the season-word fragment matches
 *   the current month's season, +5 each for the image/turn fragments.
 * - Composition (0 or 15): the player's Rhetoric + Taste meets the threshold.
 * - Callback (0 or 10): the image fragment's tags overlap imagery the
 *   recipient used in their last reply.
 */
export function scorePoem(
  selection: PoemSelection,
  recipientTastes: string[],
  month: number,
  attributes: Attributes,
  receivedImageTags: string[],
): PoemScoreResult {
  const fragments = [selection.season, selection.image, selection.turn];

  const taste = fragments.reduce(
    (sum, f) => sum + (f.tags.some((t) => recipientTastes.includes(t)) ? 5 : 0),
    0,
  );

  const season = seasonOfMonth(month);
  const seasonScore =
    (selection.season.season === season ? 10 : 0) +
    (selection.image.season === season ? 5 : 0) +
    (selection.turn.season === season ? 5 : 0);

  const rhetoric = attributes.rhetoric + attributes.taste >= POEM_RHETORIC_TASTE_THRESHOLD ? 15 : 0;

  const callback = selection.image.tags.some((t) => receivedImageTags.includes(t)) ? 10 : 0;

  const score = taste + seasonScore + rhetoric + callback;

  return {
    score,
    success: score >= POEM_SUCCESS_THRESHOLD,
    breakdown: { taste, season: seasonScore, rhetoric, callback },
  };
}
