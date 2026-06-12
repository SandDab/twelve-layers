import { describe, expect, it } from 'vitest';
import {
  INTRO_ANNUAL_CAP,
  INTRO_MIN_GAP_MONTHS,
  INTRO_PITY_MONTH,
  applyCourtshipSignal,
  recordThemeTags,
  runIntroDirector,
} from './introDirector';
import { createInitialSave, type LoveInterest } from './types';

function li(overrides: Partial<LoveInterest> & { id: LoveInterest['id'] }): LoveInterest {
  return {
    name: overrides.id,
    archetype: 'test',
    introConditions: {},
    caresAboutStyle: false,
    acclaim: 0,
    deference: 0,
    introScene: { sceneId: `romance_${overrides.id}_intro` },
    criticalChoice: { sceneId: `romance_${overrides.id}_critical`, stage: 2 },
    valuedTags: [],
    tastes: [],
    kanzashiAffinity: 'grace',
    buff: [],
    ...overrides,
  };
}

describe('runIntroDirector', () => {
  it('does not fire when no candidate meets its intro conditions and the pity timer has not elapsed', () => {
    const roster = [li({ id: 'climber', introConditions: { tags: ['grace'] } })];
    const save = { ...createInitialSave(), month: 1 };

    const next = runIntroDirector(save, roster);

    expect(next.romance).toEqual({});
    expect(next.introDirector.introsThisYear).toBe(0);
  });

  it('fires the highest-relevance candidate that meets its intro conditions', () => {
    const roster = [
      li({ id: 'climber', introConditions: { tags: ['grace'] } }),
      li({ id: 'widow', introConditions: { tags: ['restraint'] } }),
    ];
    const save = {
      ...createInitialSave(),
      month: 1,
      themeTagCounts: { principle: 0, restraint: 3, alignment: 0, grace: 1 },
    };

    const next = runIntroDirector(save, roster);

    expect(next.romance.widow).toEqual({ stage: 1, interest: 0, closed: false, introFired: true });
    expect(next.romance.climber).toBeUndefined();
    expect(next.introDirector).toEqual({ introsThisYear: 1, lastIntroMonth: 1, queued: undefined });
  });

  it('queues a ripple to the fired love interest\'s intro scene for next month', () => {
    const roster = [li({ id: 'widow', introConditions: { tags: ['restraint'] } })];
    const save = {
      ...createInitialSave(),
      year: 1,
      month: 1,
      themeTagCounts: { principle: 0, restraint: 3, alignment: 0, grace: 0 },
    };

    const next = runIntroDirector(save, roster);

    expect(next.rippleQueue).toEqual([
      { triggerYear: 1, triggerMonth: 2, sceneId: 'romance_widow_intro' },
    ]);
  });

  it('respects the minimum gap between intros', () => {
    const roster = [
      li({ id: 'climber', introConditions: { tags: ['grace'] } }),
      li({ id: 'widow', introConditions: { tags: ['restraint'] } }),
    ];
    const save = {
      ...createInitialSave(),
      month: 1 + INTRO_MIN_GAP_MONTHS - 1,
      themeTagCounts: { principle: 0, restraint: 1, alignment: 0, grace: 0 },
      introDirector: { introsThisYear: 1, lastIntroMonth: 1 },
    };

    const next = runIntroDirector(save, roster);

    expect(next.romance).toEqual({});
    expect(next.introDirector.introsThisYear).toBe(1);
  });

  it('respects the annual cap', () => {
    const roster = [li({ id: 'climber', introConditions: { tags: ['grace'] } })];
    const save = {
      ...createInitialSave(),
      month: 12,
      themeTagCounts: { principle: 0, restraint: 0, alignment: 0, grace: 5 },
      introDirector: { introsThisYear: INTRO_ANNUAL_CAP, lastIntroMonth: 1 },
    };

    const next = runIntroDirector(save, roster);

    expect(next.romance).toEqual({});
  });

  it('pity timer: fires the closest match by the pity month even if no candidate meets its conditions', () => {
    const roster = [
      li({ id: 'climber', introConditions: { tags: ['grace'] } }),
      li({ id: 'widow', introConditions: { tags: ['restraint'] } }),
    ];
    // A fresh save has all themeTagCounts at zero, so neither candidate's
    // tag condition is met; the pity timer should fire one anyway.
    const save = { ...createInitialSave(), month: INTRO_PITY_MONTH };

    const next = runIntroDirector(save, roster);

    const fired = Object.values(next.romance).filter((r) => r.introFired);
    expect(fired).toHaveLength(1);
    expect(next.introDirector.introsThisYear).toBe(1);
  });

  it('queues a third intro when two courtships are already open, then fires it once a slot frees', () => {
    const roster = [
      li({ id: 'climber', introConditions: { tags: ['grace'] } }),
      li({ id: 'widow', introConditions: {} }),
      li({ id: 'sole_heir', introConditions: {} }),
    ];
    const save = {
      ...createInitialSave(),
      month: 1,
      themeTagCounts: { principle: 0, restraint: 0, alignment: 0, grace: 1 },
      romance: {
        widow: { stage: 1, interest: 0, closed: false, introFired: true },
        sole_heir: { stage: 1, interest: 0, closed: false, introFired: true },
      },
    };

    const queued = runIntroDirector(save, roster);
    expect(queued.romance.climber).toBeUndefined();
    expect(queued.introDirector.queued).toBe('climber');
    expect(queued.introDirector.introsThisYear).toBe(0);

    // A slot frees: widow's route closes.
    const freed = {
      ...queued,
      romance: { ...queued.romance, widow: { ...queued.romance.widow, closed: true } },
      month: 1 + INTRO_MIN_GAP_MONTHS,
    };
    const fired = runIntroDirector(freed, roster);

    expect(fired.romance.climber).toEqual({ stage: 1, interest: 0, closed: false, introFired: true });
    expect(fired.introDirector.queued).toBeUndefined();
    expect(fired.introDirector.introsThisYear).toBe(1);
  });

  it('shuts off once the PC is married', () => {
    const roster = [li({ id: 'climber', introConditions: {} })];
    const save = { ...createInitialSave(), month: INTRO_PITY_MONTH, married: 'widow' };

    const next = runIntroDirector(save, roster);

    expect(next.romance).toEqual({});
    expect(next.introDirector.introsThisYear).toBe(0);
  });
});

describe('recordThemeTags', () => {
  it('accumulates lifetime theme tag counts', () => {
    let save = createInitialSave();
    save = recordThemeTags(save, ['restraint', 'grace'], []);
    save = recordThemeTags(save, ['restraint'], []);

    expect(save.themeTagCounts).toEqual({ principle: 0, restraint: 2, alignment: 0, grace: 1 });
  });

  it('grants interest to an open courtship whose valuedTags overlap with the chosen tags', () => {
    const roster = [li({ id: 'widow', valuedTags: ['restraint', 'principle'] })];
    const save = {
      ...createInitialSave(),
      romance: { widow: { stage: 1, interest: 0, closed: false, introFired: true } },
    };

    const next = recordThemeTags(save, ['restraint', 'grace'], roster);

    // One overlapping tag (restraint) -> +VALUED_TAG_INTEREST_GAIN.
    expect(next.romance.widow.interest).toBe(2);
  });

  it('does not grant interest to a courtship that has not been introduced or is closed', () => {
    const roster = [
      li({ id: 'widow', valuedTags: ['restraint'] }),
      li({ id: 'climber', valuedTags: ['restraint'] }),
    ];
    const save = {
      ...createInitialSave(),
      romance: {
        widow: { stage: 0, interest: 0, closed: false, introFired: false },
        climber: { stage: 1, interest: 0, closed: true, introFired: true },
      },
    };

    const next = recordThemeTags(save, ['restraint'], roster);

    expect(next.romance.widow.interest).toBe(0);
    expect(next.romance.climber.interest).toBe(0);
  });
});

describe('applyCourtshipSignal', () => {
  it('is a no-op when no courtships are open', () => {
    const roster = [li({ id: 'climber', acclaim: 1 })];
    const save = createInitialSave();

    expect(applyCourtshipSignal(save, 'acclaim', roster)).toBe(save);
  });
});
