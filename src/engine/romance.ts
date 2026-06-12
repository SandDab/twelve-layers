import { CANDIDATES } from '../content/npcs';
import { applyEffects } from './effects';
import { fnv1a } from './fnv';
import { scorePoem, type PoemSelection, type PoemScoreResult } from './poems';
import type { CandidateId, Save } from './types';

/** Successful Exchange-stage (3) poems needed to reach Behind the Curtain (4). */
export const EXCHANGE_STAGE_TARGET = 2;

export type SendPoemResult = {
  save: Save;
  result: PoemScoreResult;
};

/**
 * Compose and send a poem to a candidate (GAME_DESIGN.md §6). Pure —
 * returns the updated save and the score result. The caller (the
 * store) is responsible for checking pacing (one poem per month) and
 * romance stage (1-3 only; stage 4+ proceeds via the curtain scene)
 * before calling this.
 *
 * - Stage 1 (Rumor) -> 2 (First poem) on first contact, regardless of score.
 * - Stage 2 -> 3 (Exchange) only if the first poem succeeds; a failed
 *   first poem can be retried next month.
 * - Stage 3: each success increments exchangeCount; at
 *   EXCHANGE_STAGE_TARGET successes, advances to 4 (Behind the curtain).
 * - Success grants Tokimeki and Favor; failure queues gossip against the
 *   candidate's faction (bad poems are not neutral).
 * - The candidate's "reply" imagery (for the next poem's callback bonus)
 *   is drawn deterministically from their known tastes, seeded by the
 *   calendar position.
 */
export function sendPoem(save: Save, candidateId: CandidateId, selection: PoemSelection): SendPoemResult {
  const candidate = CANDIDATES[candidateId];
  const romance = save.romance[candidateId];
  const result = scorePoem(selection, candidate.tastes, save.month, save.attributes, romance.receivedImageTags);

  let stage = romance.stage;
  let exchangeCount = romance.exchangeCount;

  if (stage === 1) {
    stage = 2;
  } else if (stage === 2 && result.success) {
    stage = 3;
    exchangeCount = 0;
  } else if (stage === 3 && result.success) {
    exchangeCount += 1;
    if (exchangeCount >= EXCHANGE_STAGE_TARGET) {
      stage = 4;
    }
  }

  const replyTagIndex = fnv1a(`${candidateId}:${save.year}:${save.month}`) % candidate.tastes.length;
  const receivedImageTags = [candidate.tastes[replyTagIndex]];

  let next: Save = {
    ...save,
    romance: {
      ...save.romance,
      [candidateId]: {
        stage,
        exchangeCount,
        receivedImageTags,
        lastSentYear: save.year,
        lastSentMonth: save.month,
      },
    },
  };

  if (result.success) {
    next = applyEffects(
      [
        { kind: 'resource', res: 'tokimeki', delta: 5 },
        { kind: 'favor', npc: candidateId, delta: 1 },
      ],
      next,
    );
  } else {
    next = applyEffects(
      [
        {
          kind: 'gossip',
          tag: `bad_poem_${candidateId}`,
          factionDeltas: { [candidate.faction]: -1 },
          delayMonths: 1,
        },
      ],
      next,
    );
  }

  return { save: next, result };
}

/** True if a poem can be sent this month (one per candidate per month, stages 1-3 only). */
export function canSendPoem(save: Save, candidateId: CandidateId): boolean {
  const romance = save.romance[candidateId];
  if (romance.stage >= 4) return false;
  return romance.lastSentYear !== save.year || romance.lastSentMonth !== save.month;
}
