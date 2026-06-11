import { describe, expect, it } from 'vitest';
import { applyKanzashiAttrBonuses, assignKanzashiMonths, checkKanzashiAward } from './kanzashi';
import { createInitialSave } from './types';

describe('assignKanzashiMonths', () => {
  it('is deterministic for a given seed and year', () => {
    expect(assignKanzashiMonths(1, 1)).toEqual(assignKanzashiMonths(1, 1));
  });

  it('assigns each kanzashi a distinct month from the anchor-event pool', () => {
    const assignment = assignKanzashiMonths(1, 1);
    const months = Object.values(assignment);
    expect(new Set(months).size).toBe(4);
    for (const month of months) {
      expect([1, 3, 4, 7, 8, 11]).toContain(month);
    }
  });

  it('re-rolls to a different assignment for a new year (NG+)', () => {
    const year1 = assignKanzashiMonths(1, 1);
    const year3 = assignKanzashiMonths(1, 3);
    expect(year3).not.toEqual(year1);
  });
});

describe('checkKanzashiAward', () => {
  it('queues a delivery ripple next month when a matching theme tag is picked in the assigned month', () => {
    const save = {
      ...createInitialSave(),
      year: 1,
      month: 1,
      kanzashiAssignments: { kobai: 1, tsukikage: 4, fuji: 7, sango: 3 },
    };

    const next = checkKanzashiAward(save, ['principle']);

    expect(next.rippleQueue).toEqual([
      { triggerYear: 1, triggerMonth: 2, sceneId: 'kanzashi_kobai_delivery' },
    ]);
  });

  it('does nothing if the theme tag does not match the assigned month', () => {
    const save = {
      ...createInitialSave(),
      year: 1,
      month: 2,
      kanzashiAssignments: { kobai: 1, tsukikage: 4, fuji: 7, sango: 3 },
    };

    expect(checkKanzashiAward(save, ['principle'])).toEqual(save);
  });

  it('does nothing if the kanzashi is already owned', () => {
    const save = {
      ...createInitialSave(),
      year: 1,
      month: 1,
      kanzashiAssignments: { kobai: 1, tsukikage: 4, fuji: 7, sango: 3 },
      kanzashiOwned: ['kobai'],
    };

    expect(checkKanzashiAward(save, ['principle'])).toEqual(save);
  });

  it('does not queue the same delivery twice', () => {
    const save = {
      ...createInitialSave(),
      year: 1,
      month: 1,
      kanzashiAssignments: { kobai: 1, tsukikage: 4, fuji: 7, sango: 3 },
      rippleQueue: [{ triggerYear: 1, triggerMonth: 2, sceneId: 'kanzashi_kobai_delivery' }],
    };

    expect(checkKanzashiAward(save, ['principle'])).toEqual(save);
  });
});

describe('applyKanzashiAttrBonuses', () => {
  it("applies Kōbai's +5 Taste bonus when equipped, and removes it on unequip", () => {
    const save = createInitialSave();
    const equipped = applyKanzashiAttrBonuses(save, 'kobai', 1);
    expect(equipped.attributes.taste).toBe(save.attributes.taste + 5);

    const unequipped = applyKanzashiAttrBonuses(equipped, 'kobai', -1);
    expect(unequipped.attributes.taste).toBe(save.attributes.taste);
  });

  it('is a no-op for kanzashi with no attrBonus passives', () => {
    const save = createInitialSave();
    expect(applyKanzashiAttrBonuses(save, 'tsukikage', 1)).toEqual(save);
  });
});
