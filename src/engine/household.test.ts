import { describe, expect, it } from 'vitest';
import { createInitialSave } from './types';
import {
  ENVY_RIPPLE_FLAG,
  ENVY_SCENE_ID,
  applyMonthEnd,
  applyTokimekiEnvyTrigger,
  applyWardrobeEffects,
  computeFreeActions,
  computeIncome,
  computeRestGain,
  computeTrainGain,
  seasonOfMonth,
} from './household';

describe('seasonOfMonth', () => {
  it('maps months to the four Heian seasons', () => {
    expect(seasonOfMonth(1)).toBe(1);
    expect(seasonOfMonth(3)).toBe(1);
    expect(seasonOfMonth(4)).toBe(2);
    expect(seasonOfMonth(6)).toBe(2);
    expect(seasonOfMonth(7)).toBe(3);
    expect(seasonOfMonth(9)).toBe(3);
    expect(seasonOfMonth(10)).toBe(4);
    expect(seasonOfMonth(12)).toBe(4);
  });
});

describe('computeIncome', () => {
  it('returns the base income with no staff and low Tokimeki', () => {
    const save = createInitialSave();
    expect(computeIncome(save.staff, save.tokimeki)).toBe(20);
  });

  it('adds the steward bonus', () => {
    const save = { ...createInitialSave(), staff: { ...createInitialSave().staff, steward: true } };
    expect(computeIncome(save.staff, save.tokimeki)).toBe(35);
  });

  it('adds the Sought After Tokimeki tier income bonus', () => {
    const save = createInitialSave();
    expect(computeIncome(save.staff, 25)).toBe(30);
  });

  it("applies the Governor's Heir +25% estate income multiplier", () => {
    const save = createInitialSave();
    expect(computeIncome(save.staff, save.tokimeki, 'governors_heir')).toBe(25); // 20 * 1.25
  });

  it("applies the Old Name's reduced estate income multiplier", () => {
    const save = createInitialSave();
    expect(computeIncome(save.staff, save.tokimeki, 'old_name')).toBe(15); // 20 * 0.75
  });

  it("adds Sango's flat Koku stipend while equipped", () => {
    const save = createInitialSave();
    expect(computeIncome(save.staff, save.tokimeki, null, 'sango')).toBe(23); // 20 + 3
  });
});

describe('computeFreeActions / Tokimeki tiers', () => {
  it('grants the base 3 actions at zero Tokimeki', () => {
    expect(computeFreeActions(0)).toBe(3);
  });

  it('grants +1 action at the Noticed tier (10)', () => {
    expect(computeFreeActions(10)).toBe(4);
  });

  it('grants +2 actions at the top tier (50)', () => {
    expect(computeFreeActions(50)).toBe(5);
  });
});

describe('computeRestGain / computeTrainGain', () => {
  it('rest restores 15 Composure without a gardener, 30 with one', () => {
    const save = createInitialSave();
    expect(computeRestGain(save.staff)).toBe(15);
    expect(computeRestGain({ ...save.staff, gardener: true })).toBe(30);
  });

  it('training gives +2 normally, +4 Rhetoric with a poet-tutor', () => {
    const save = createInitialSave();
    expect(computeTrainGain('rhetoric', save.staff)).toBe(2);
    expect(computeTrainGain('rhetoric', { ...save.staff, poetTutor: true })).toBe(4);
    expect(computeTrainGain('charisma', { ...save.staff, poetTutor: true })).toBe(2);
  });
});

describe('applyWardrobeEffects', () => {
  it('does nothing when no robe is equipped', () => {
    const save = createInitialSave();
    expect(applyWardrobeEffects(save)).toEqual(save);
  });

  it('applies a bonus and Tokimeki gain for an in-season robe', () => {
    const save = {
      ...createInitialSave(),
      month: 2, // spring (season 1) — sakura_gasane is season 1
      wardrobe: { owned: ['sakura_gasane'], equipped: 'sakura_gasane' },
    };
    const next = applyWardrobeEffects(save);
    expect(next.attributes.allure).toBe(save.attributes.allure + 4);
    expect(next.attributes.taste).toBe(save.attributes.taste + 3);
    expect(next.tokimeki).toBe(2);
    expect(next.pendingGossip).toEqual([]);
  });

  it('applies a penalty and queues gossip for an out-of-season robe', () => {
    const save = {
      ...createInitialSave(),
      month: 2, // spring — momiji_gasane is season 3 (autumn)
      wardrobe: { owned: ['momiji_gasane'], equipped: 'momiji_gasane' },
    };
    const next = applyWardrobeEffects(save);
    expect(next.attributes.allure).toBe(save.attributes.allure - 2);
    expect(next.attributes.taste).toBe(save.attributes.taste - 2);
    expect(next.tokimeki).toBe(0); // floored at zero
    expect(next.pendingGossip).toHaveLength(1);
    expect(next.pendingGossip[0]).toMatchObject({ tag: 'wore_offseason_robe' });
  });

  it("suppresses the off-season penalty entirely while married to the Sole Heir", () => {
    const save = {
      ...createInitialSave(),
      month: 2, // spring — momiji_gasane is season 3 (autumn)
      wardrobe: { owned: ['momiji_gasane'], equipped: 'momiji_gasane' },
      married: 'sole_heir',
    };
    expect(applyWardrobeEffects(save)).toEqual(save);
  });
});

describe('applyTokimekiEnvyTrigger', () => {
  it('does nothing below the envy tier', () => {
    const save = { ...createInitialSave(), tokimeki: 49 };
    expect(applyTokimekiEnvyTrigger(save)).toEqual(save);
  });

  it('queues the envy ripple two months out at the top tier, once', () => {
    const save = { ...createInitialSave(), year: 1, month: 11, tokimeki: 50 };
    const next = applyTokimekiEnvyTrigger(save);

    expect(next.flags[ENVY_RIPPLE_FLAG]).toBe(true);
    expect(next.rippleQueue).toEqual([{ triggerYear: 2, triggerMonth: 1, sceneId: ENVY_SCENE_ID }]);

    // Already flagged — does not queue a second time.
    const again = applyTokimekiEnvyTrigger(next);
    expect(again).toEqual(next);
  });
});

describe('applyMonthEnd', () => {
  it('applies wardrobe effects, income, calendar tick, and next month\'s actions', () => {
    const save = createInitialSave();
    const next = applyMonthEnd(save);

    expect(next.month).toBe(2);
    expect(next.resources.koku).toBe(120); // 100 + base income 20
    expect(next.actionsRemaining).toBe(3);
  });

  it('resets Tokimeki and recomputes actions across a year rollover', () => {
    const save = { ...createInitialSave(), month: 12, tokimeki: 10 };
    const next = applyMonthEnd(save);

    expect(next.year).toBe(2);
    expect(next.month).toBe(1);
    expect(next.tokimeki).toBe(0);
    expect(next.tokimekiHistory[1]).toBe(10);
    // Income for the closing month still used the pre-reset Tokimeki tier (10 -> +0 koku),
    // but actionsRemaining for the new month reflects the reset Tokimeki (0 -> base 3).
    expect(next.actionsRemaining).toBe(3);
  });
});
