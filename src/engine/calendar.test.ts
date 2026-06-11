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

  it('rolls over to the next year at month 12, resetting Clout', () => {
    const save = { ...createInitialSave(), month: 12, year: 1, clout: 42 };
    const next = tickCalendar(save);

    expect(next.year).toBe(2);
    expect(next.month).toBe(1);
    expect(next.clout).toBe(0);
    expect(next.cloutHistory[1]).toBe(42);
  });

  it('preserves attributes, resources, favors, flags, and ripple queue across rollover', () => {
    const save = {
      ...createInitialSave(),
      month: 12,
      year: 1,
      clout: 15,
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

  it('accumulates a multi-year clout history', () => {
    let save = { ...createInitialSave(), month: 12, year: 1, clout: 10 };
    save = tickCalendar(save); // -> year 2, history[1] = 10

    save = { ...save, month: 12, clout: 30 };
    save = tickCalendar(save); // -> year 3, history[2] = 30

    expect(save.year).toBe(3);
    expect(save.clout).toBe(0);
    expect(save.cloutHistory).toEqual({ 1: 10, 2: 30 });
  });
});
