import { describe, expect, it } from 'vitest';
import { tickCalendar } from './calendar';
import { createInitialSave } from './types';

describe('tickCalendar', () => {
  it('advances the month within a year', () => {
    const save = { ...createInitialSave(), month: 1, year: 1 };
    const next = tickCalendar(save);
    expect(next.month).toBe(2);
    expect(next.year).toBe(1);
  });

  it('rolls over to the next year at month 12, resetting Tokimeki', () => {
    const save = { ...createInitialSave(), month: 12, year: 1, tokimeki: 42 };
    const next = tickCalendar(save);

    expect(next.year).toBe(2);
    expect(next.month).toBe(1);
    expect(next.tokimeki).toBe(0);
    expect(next.tokimekiHistory[1]).toBe(42);
  });

  it('preserves attributes, resources, favors, flags, and ripple queue across rollover', () => {
    const save = {
      ...createInitialSave(),
      month: 12,
      year: 1,
      tokimeki: 15,
      attributes: { rank: 5, charisma: 20, allure: 30, rhetoric: 40, taste: 50 },
      resources: { koku: 250, composure: 80 },
      favors: { sharpBrush: 3 },
      flags: { metRegent: true },
      rippleQueue: [{ triggerYear: 1, triggerMonth: 11, sceneId: 'm11_test' }],
    };

    const next = tickCalendar(save);

    expect(next.attributes).toEqual(save.attributes);
    expect(next.resources).toEqual(save.resources);
    expect(next.favors).toEqual(save.favors);
    expect(next.flags).toEqual(save.flags);
    expect(next.rippleQueue).toEqual(save.rippleQueue);
  });

  it('resets introDirector.introsThisYear at year rollover, preserving lastIntroMonth and queued', () => {
    const save = {
      ...createInitialSave(),
      month: 12,
      year: 1,
      introDirector: { introsThisYear: 2, lastIntroMonth: 10, queued: 'merchant' },
    };

    const next = tickCalendar(save);

    expect(next.introDirector).toEqual({ introsThisYear: 0, lastIntroMonth: 10, queued: 'merchant' });
  });

  it('accumulates a multi-year tokimeki history', () => {
    let save = { ...createInitialSave(), month: 12, year: 1, tokimeki: 10 };
    save = tickCalendar(save); // -> year 2, history[1] = 10

    save = { ...save, month: 12, tokimeki: 30 };
    save = tickCalendar(save); // -> year 3, history[2] = 30

    expect(save.year).toBe(3);
    expect(save.tokimeki).toBe(0);
    expect(save.tokimekiHistory).toEqual({ 1: 10, 2: 30 });
  });
});
