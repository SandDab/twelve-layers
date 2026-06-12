// Romance actions (GAME_DESIGN.md §6/§8): composing a poem for an open
// courtship, and gifting a kanzashi to a love interest. Interest is never
// surfaced to the player; all outcomes are read through prose/ripples.

import { KANZASHI, type KanzashiId } from '../content/kanzashi';
import { addMonths, applyEffects } from './effects';
import { applyKanzashiAttrBonuses } from './kanzashi';
import { scorePoem, type PoemSelection } from './poems';
import type { LoveInterest, Save } from './types';

/** Minimum Interest to accept a gifted kanzashi (GAME_DESIGN.md §8). */
export const GIFT_ACCEPT_THRESHOLD = 5;
/** Threshold reduction when the kanzashi's theme matches the LI's affinity. */
const GIFT_AFFINITY_BONUS = 3;

/**
 * Compose and send a waka to an open courtship (GAME_DESIGN.md §6). A
 * successful poem (score >= POEM_SUCCESS_THRESHOLD) raises Interest and
 * advances the route's stage; one stage short of the critical choice, it
 * instead jumps to the critical stage and queues that scene for next month.
 * A failed poem costs a little Interest and a little gossip. No-op if the
 * courtship isn't open or has already reached its critical stage.
 *
 * Poem "callback" scoring (10/60 points) is intentionally never available
 * here (`receivedImageTags: []`) — the 35-point success threshold is
 * reachable without it, so no save field is needed to track received tags.
 */
export function composeRomancePoem(
  save: Save,
  loveInterestId: string,
  selection: PoemSelection,
  roster: LoveInterest[],
): Save {
  const li = roster.find((l) => l.id === loveInterestId);
  const state = save.romance[loveInterestId];
  if (!li || !state || !state.introFired || state.closed || state.stage >= li.criticalChoice.stage) {
    return save;
  }

  const result = scorePoem(selection, li.tastes, save.month, save.attributes, []);

  if (result.success) {
    const criticalStage = li.criticalChoice.stage;
    if (state.stage < criticalStage - 1) {
      return applyEffects(
        [{ kind: 'romance', loveInterestId, interestDelta: 3, stage: state.stage + 1 }],
        save,
      );
    }

    const next = applyEffects(
      [{ kind: 'romance', loveInterestId, interestDelta: 3, stage: criticalStage }],
      save,
    );
    const { year: triggerYear, month: triggerMonth } = addMonths(save.year, save.month, 1);
    return {
      ...next,
      rippleQueue: [...next.rippleQueue, { triggerYear, triggerMonth, sceneId: li.criticalChoice.sceneId }],
    };
  }

  return applyEffects(
    [
      { kind: 'romance', loveInterestId, interestDelta: -1 },
      {
        kind: 'gossip',
        tag: `fumbled_a_verse_to_${loveInterestId}`,
        factionDeltas: { rivalHouses: -1 },
        delayMonths: 1,
      },
    ],
    save,
  );
}

/**
 * Gift an owned kanzashi to an open courtship (GAME_DESIGN.md §8). Accepted
 * if Interest meets the threshold (lowered when the kanzashi's theme matches
 * the LI's affinity): the kanzashi moves to `kanzashiGifted`, its attribute
 * passives are removed if it was equipped, and Interest rises a little.
 * Refused: the kanzashi stays with the player, but the refusal carries a
 * small gossip risk — the only hard "read" on hidden Interest.
 */
export function giftKanzashi(
  save: Save,
  kanzashiId: string,
  loveInterestId: string,
  roster: LoveInterest[],
): Save {
  const li = roster.find((l) => l.id === loveInterestId);
  const state = save.romance[loveInterestId];
  const def = KANZASHI[kanzashiId as KanzashiId];
  if (!li || !def || !state || !state.introFired || state.closed) return save;
  if (!save.kanzashiOwned.includes(kanzashiId) || save.kanzashiGifted[kanzashiId]) return save;

  const threshold = GIFT_ACCEPT_THRESHOLD - (def.theme === li.kanzashiAffinity ? GIFT_AFFINITY_BONUS : 0);

  if (state.interest >= threshold) {
    let next = save;
    if (next.kanzashiEquipped === kanzashiId) {
      next = applyKanzashiAttrBonuses(next, kanzashiId, -1);
      next = { ...next, kanzashiEquipped: null };
    }
    next = {
      ...next,
      kanzashiOwned: next.kanzashiOwned.filter((id) => id !== kanzashiId),
      kanzashiGifted: { ...next.kanzashiGifted, [kanzashiId]: loveInterestId },
    };
    return applyEffects([{ kind: 'romance', loveInterestId, interestDelta: 2 }], next);
  }

  return applyEffects(
    [
      {
        kind: 'gossip',
        tag: `refused_kanzashi_${kanzashiId}`,
        factionDeltas: { rivalHouses: -1 },
        delayMonths: 1,
      },
    ],
    save,
  );
}
