import { describe, expect, it } from 'vitest';
import { getPoemFragment } from '../content/poems';
import { CURRENT_SAVE_SCHEMA_VERSION, createInitialSave } from './types';
import type { PoemSelection } from './poems';
import { canSendPoem, EXCHANGE_STAGE_TARGET, sendPoem } from './romance';

function frag(id: string) {
  const f = getPoemFragment(id);
  if (!f) throw new Error(`missing fragment ${id}`);
  return f;
}

const weakPoem: PoemSelection = {
  season: frag('winter_season_1'), // snow, winter
  image: frag('winter_image_2'), // snow, winter
  turn: frag('winter_turn_1'), // pine, winter
};

const summerPoem: PoemSelection = {
  season: frag('summer_season_1'), // cuckoo, summer
  image: frag('summer_image_2'), // cuckoo, summer
  turn: frag('summer_turn_1'), // iris, summer
};

const autumnPoem: PoemSelection = {
  season: frag('autumn_season_1'), // moon, autumn
  image: frag('autumn_image_2'), // moon, autumn
  turn: frag('autumn_turn_1'), // maple, autumn
};

describe('sendPoem / canSendPoem (Sharp Brush exchange)', () => {
  it('walks a full exchange from Rumor to Behind the Curtain across months', () => {
    let save = createInitialSave();
    save.year = 1;
    save.month = 4; // summer

    expect(save.romance.sharpBrush.stage).toBe(1);

    // First contact: a weak, off-season poem fails, but stage 1 -> 2 regardless.
    const first = sendPoem(save, 'sharpBrush', weakPoem);
    expect(first.result.success).toBe(false);
    save = first.save;
    expect(save.romance.sharpBrush.stage).toBe(2);
    expect(save.romance.sharpBrush.exchangeCount).toBe(0);

    // Failure queues gossip against the candidate's faction (imperial).
    expect(save.pendingGossip).toEqual([
      { triggerYear: 1, triggerMonth: 5, tag: 'bad_poem_sharpBrush', factionDeltas: { imperial: -1 } },
    ]);

    // Pacing: no second poem this month.
    expect(canSendPoem(save, 'sharpBrush')).toBe(false);

    // Next month, with strong Rhetoric + Taste, a well-matched poem succeeds.
    save = { ...save, month: 5, attributes: { ...save.attributes, rhetoric: 30 } };
    expect(canSendPoem(save, 'sharpBrush')).toBe(true);

    const second = sendPoem(save, 'sharpBrush', summerPoem);
    expect(second.result.success).toBe(true);
    save = second.save;
    expect(save.romance.sharpBrush.stage).toBe(3);
    expect(save.romance.sharpBrush.exchangeCount).toBe(0);
    expect(save.tokimeki).toBe(5);
    expect(save.favors.sharpBrush).toBe(1);

    // Stage 3, first Exchange success.
    save = { ...save, month: 6 };
    const third = sendPoem(save, 'sharpBrush', summerPoem);
    expect(third.result.success).toBe(true);
    save = third.save;
    expect(save.romance.sharpBrush.stage).toBe(3);
    expect(save.romance.sharpBrush.exchangeCount).toBe(1);
    expect(save.romance.sharpBrush.exchangeCount).toBeLessThan(EXCHANGE_STAGE_TARGET);

    // Stage 3, second Exchange success advances to Behind the Curtain.
    save = { ...save, month: 7 };
    const fourth = sendPoem(save, 'sharpBrush', autumnPoem);
    expect(fourth.result.success).toBe(true);
    save = fourth.save;
    expect(save.romance.sharpBrush.stage).toBe(4);
    expect(save.romance.sharpBrush.exchangeCount).toBe(EXCHANGE_STAGE_TARGET);

    // Stage 4+ has no further poems to send.
    expect(canSendPoem(save, 'sharpBrush')).toBe(false);

    // Other candidates are untouched.
    expect(save.romance.sequesteredHeir.stage).toBe(1);
    expect(save.romance.fadedBranch.stage).toBe(1);
    expect(save.schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
  });

  it('derives receivedImageTags deterministically from the candidate\'s tastes', () => {
    let save = createInitialSave();
    save.year = 1;
    save.month = 4;

    const result = sendPoem(save, 'sharpBrush', weakPoem);
    save = result.save;
    expect(save.romance.sharpBrush.receivedImageTags).toHaveLength(1);
    expect(['cuckoo', 'plover']).toContain(save.romance.sharpBrush.receivedImageTags[0]);

    // Re-running the same send from the same starting state is deterministic.
    const repeatSave = createInitialSave();
    repeatSave.year = 1;
    repeatSave.month = 4;
    const repeat = sendPoem(repeatSave, 'sharpBrush', weakPoem);
    expect(repeat.save.romance.sharpBrush.receivedImageTags).toEqual(save.romance.sharpBrush.receivedImageTags);
  });
});
