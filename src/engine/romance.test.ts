import { describe, expect, it } from 'vitest';
import { getPoemFragment } from '../content/poems';
import { addMonths } from './effects';
import type { PoemSelection } from './poems';
import { composeRomancePoem, giftKanzashi, GIFT_ACCEPT_THRESHOLD } from './romance';
import { createInitialSave, type LoveInterest, type RomanceState } from './types';

function li(overrides: Partial<LoveInterest> & { id: LoveInterest['id'] }): LoveInterest {
  return {
    name: overrides.id,
    archetype: 'test',
    introConditions: {},
    caresAboutStyle: false,
    acclaim: 0,
    deference: 0,
    introScene: { sceneId: `romance_${overrides.id}_intro` },
    criticalChoice: { sceneId: `romance_${overrides.id}_critical`, stage: 3 },
    valuedTags: [],
    tastes: ['iris', 'firefly'],
    kanzashiAffinity: 'restraint',
    buff: [],
    ...overrides,
  };
}

const open: RomanceState = { stage: 1, interest: 0, closed: false, introFired: true };

// Both fragments match the test LI's tastes (iris, firefly) and the
// month-5 (summer) season: taste 15 + season 20 = 35, the success threshold.
const successSelection: PoemSelection = {
  season: getPoemFragment('summer_season_2')!,
  image: getPoemFragment('summer_image_1')!,
  turn: getPoemFragment('summer_turn_1')!,
};

// Spring fragments: no taste overlap, wrong season for month 5.
const failSelection: PoemSelection = {
  season: getPoemFragment('spring_season_1')!,
  image: getPoemFragment('spring_image_1')!,
  turn: getPoemFragment('spring_turn_1')!,
};

describe('composeRomancePoem', () => {
  it('advances stage and raises interest on a successful poem, below the critical stage', () => {
    const roster = [li({ id: 'riverbank', criticalChoice: { sceneId: 'romance_riverbank_critical', stage: 3 } })];
    const save = {
      ...createInitialSave(),
      month: 5,
      romance: { riverbank: { ...open, stage: 1 } },
    };

    const next = composeRomancePoem(save, 'riverbank', successSelection, roster);

    expect(next.romance.riverbank).toEqual({ stage: 2, interest: 3, closed: false, introFired: true });
    expect(next.rippleQueue).toEqual([]);
  });

  it('jumps to the critical stage and queues its scene one stage short of it', () => {
    const roster = [li({ id: 'riverbank', criticalChoice: { sceneId: 'romance_riverbank_critical', stage: 3 } })];
    const save = {
      ...createInitialSave(),
      year: 1,
      month: 5,
      romance: { riverbank: { ...open, stage: 2 } },
    };

    const next = composeRomancePoem(save, 'riverbank', successSelection, roster);

    expect(next.romance.riverbank).toEqual({ stage: 3, interest: 3, closed: false, introFired: true });
    const { year: triggerYear, month: triggerMonth } = addMonths(save.year, save.month, 1);
    expect(next.rippleQueue).toEqual([{ triggerYear, triggerMonth, sceneId: 'romance_riverbank_critical' }]);
  });

  it('lowers interest and queues fumble gossip on a failed poem', () => {
    const roster = [li({ id: 'riverbank' })];
    const save = {
      ...createInitialSave(),
      year: 1,
      month: 5,
      romance: { riverbank: { ...open, stage: 1, interest: 5 } },
    };

    const next = composeRomancePoem(save, 'riverbank', failSelection, roster);

    expect(next.romance.riverbank).toEqual({ stage: 1, interest: 4, closed: false, introFired: true });
    const { year: triggerYear, month: triggerMonth } = addMonths(save.year, save.month, 1);
    expect(next.pendingGossip).toEqual([
      { triggerYear, triggerMonth, tag: 'fumbled_a_verse_to_riverbank', factionDeltas: { rivalHouses: -1 } },
    ]);
  });

  it('is a no-op if the courtship is not open', () => {
    const roster = [li({ id: 'riverbank' })];
    const save = { ...createInitialSave(), month: 5 };

    expect(composeRomancePoem(save, 'riverbank', successSelection, roster)).toBe(save);
  });

  it('is a no-op if the courtship is closed', () => {
    const roster = [li({ id: 'riverbank' })];
    const save = {
      ...createInitialSave(),
      month: 5,
      romance: { riverbank: { ...open, stage: 1, closed: true } },
    };

    expect(composeRomancePoem(save, 'riverbank', successSelection, roster)).toBe(save);
  });

  it('is a no-op once the courtship has reached its critical stage', () => {
    const roster = [li({ id: 'riverbank', criticalChoice: { sceneId: 'romance_riverbank_critical', stage: 3 } })];
    const save = {
      ...createInitialSave(),
      month: 5,
      romance: { riverbank: { ...open, stage: 3 } },
    };

    expect(composeRomancePoem(save, 'riverbank', successSelection, roster)).toBe(save);
  });
});

describe('giftKanzashi', () => {
  it('accepts when Interest meets the threshold, moving the kanzashi to kanzashiGifted', () => {
    const roster = [li({ id: 'riverbank', kanzashiAffinity: 'grace' })];
    const save = {
      ...createInitialSave(),
      kanzashiOwned: ['kobai'],
      romance: { riverbank: { ...open, interest: GIFT_ACCEPT_THRESHOLD } },
    };

    const next = giftKanzashi(save, 'kobai', 'riverbank', roster);

    expect(next.kanzashiOwned).toEqual([]);
    expect(next.kanzashiGifted).toEqual({ kobai: 'riverbank' });
    expect(next.romance.riverbank.interest).toBe(GIFT_ACCEPT_THRESHOLD + 2);
  });

  it('accepts below the base threshold when the kanzashi matches the affinity bonus', () => {
    // tsukikage's theme is 'restraint', matching the test LI's kanzashiAffinity.
    const roster = [li({ id: 'riverbank', kanzashiAffinity: 'restraint' })];
    const save = {
      ...createInitialSave(),
      kanzashiOwned: ['tsukikage'],
      romance: { riverbank: { ...open, interest: GIFT_ACCEPT_THRESHOLD - 3 } },
    };

    const next = giftKanzashi(save, 'tsukikage', 'riverbank', roster);

    expect(next.kanzashiGifted).toEqual({ tsukikage: 'riverbank' });
  });

  it('unequips and reverses attribute passives if the gifted kanzashi was equipped', () => {
    const roster = [li({ id: 'riverbank', kanzashiAffinity: 'grace' })];
    const save = {
      ...createInitialSave(),
      kanzashiOwned: ['kobai'],
      kanzashiEquipped: 'kobai',
      attributes: { ...createInitialSave().attributes, taste: 15 },
      romance: { riverbank: { ...open, interest: GIFT_ACCEPT_THRESHOLD } },
    };

    const next = giftKanzashi(save, 'kobai', 'riverbank', roster);

    expect(next.kanzashiEquipped).toBeNull();
    expect(next.attributes.taste).toBe(10);
  });

  it('refuses below the threshold, leaving the kanzashi owned and queuing gossip', () => {
    const roster = [li({ id: 'riverbank', kanzashiAffinity: 'grace' })];
    const save = {
      ...createInitialSave(),
      year: 1,
      month: 5,
      kanzashiOwned: ['kobai'],
      romance: { riverbank: { ...open, interest: GIFT_ACCEPT_THRESHOLD - 1 } },
    };

    const next = giftKanzashi(save, 'kobai', 'riverbank', roster);

    expect(next.kanzashiOwned).toEqual(['kobai']);
    expect(next.kanzashiGifted).toEqual({});
    const { year: triggerYear, month: triggerMonth } = addMonths(save.year, save.month, 1);
    expect(next.pendingGossip).toEqual([
      { triggerYear, triggerMonth, tag: 'refused_kanzashi_kobai', factionDeltas: { rivalHouses: -1 } },
    ]);
  });

  it('is a no-op if the kanzashi is not owned', () => {
    const roster = [li({ id: 'riverbank' })];
    const save = {
      ...createInitialSave(),
      romance: { riverbank: { ...open, interest: GIFT_ACCEPT_THRESHOLD } },
    };

    expect(giftKanzashi(save, 'kobai', 'riverbank', roster)).toBe(save);
  });
});
