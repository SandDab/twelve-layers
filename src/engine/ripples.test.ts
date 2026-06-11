import { describe, expect, it } from 'vitest';
import { consumeRipple, getDueGossip, getDueRipples, resolveDueGossip } from './ripples';
import { createInitialSave } from './types';

describe('getDueRipples', () => {
  it('returns ripples matching the current year and month', () => {
    const save = {
      ...createInitialSave(),
      year: 1,
      month: 4,
      rippleQueue: [
        { triggerYear: 1, triggerMonth: 4, sceneId: 'm4_newyear_echo_01' },
        { triggerYear: 1, triggerMonth: 11, sceneId: 'm11_other' },
      ],
    };

    expect(getDueRipples(save)).toEqual([
      { triggerYear: 1, triggerMonth: 4, sceneId: 'm4_newyear_echo_01' },
    ]);
  });

  it('returns nothing when no ripple matches', () => {
    const save = {
      ...createInitialSave(),
      year: 1,
      month: 2,
      rippleQueue: [{ triggerYear: 1, triggerMonth: 4, sceneId: 'm4_newyear_echo_01' }],
    };

    expect(getDueRipples(save)).toEqual([]);
  });
});

describe('consumeRipple', () => {
  it('removes the given ripple from the queue', () => {
    const ripple = { triggerYear: 1, triggerMonth: 4, sceneId: 'm4_newyear_echo_01' };
    const save = { ...createInitialSave(), rippleQueue: [ripple] };

    expect(consumeRipple(save, ripple).rippleQueue).toEqual([]);
  });
});

describe('gossip queue', () => {
  it('finds due gossip and applies faction deltas', () => {
    const save = {
      ...createInitialSave(),
      year: 1,
      month: 6,
      pendingGossip: [
        { triggerYear: 1, triggerMonth: 6, tag: 'wore_autumn_in_spring', factionDeltas: { rivalHouses: -2, regent: 1 } },
        { triggerYear: 1, triggerMonth: 9, tag: 'later', factionDeltas: { clergy: 1 } },
      ],
    };

    expect(getDueGossip(save)).toHaveLength(1);

    const resolved = resolveDueGossip(save);
    expect(resolved.factionReputation.rivalHouses).toBe(-2);
    expect(resolved.factionReputation.regent).toBe(1);
    expect(resolved.pendingGossip).toEqual([
      { triggerYear: 1, triggerMonth: 9, tag: 'later', factionDeltas: { clergy: 1 } },
    ]);
  });

  it('is a no-op when nothing is due', () => {
    const save = { ...createInitialSave(), year: 1, month: 1 };
    expect(resolveDueGossip(save)).toEqual(save);
  });

  it("halves wore_offseason_robe gossip impact while Kōbai is equipped", () => {
    const save = {
      ...createInitialSave(),
      year: 1,
      month: 6,
      kanzashiEquipped: 'kobai',
      pendingGossip: [
        { triggerYear: 1, triggerMonth: 6, tag: 'wore_offseason_robe', factionDeltas: { rivalHouses: -2 } },
      ],
    };

    expect(resolveDueGossip(save).factionReputation.rivalHouses).toBe(-1);
  });

  it('multiplies positive rivalHouses gossip gains by 1.5 while Fuji is equipped', () => {
    const save = {
      ...createInitialSave(),
      year: 1,
      month: 6,
      kanzashiEquipped: 'fuji',
      pendingGossip: [
        { triggerYear: 1, triggerMonth: 6, tag: 'praised_old_houses', factionDeltas: { rivalHouses: 2 } },
      ],
    };

    expect(resolveDueGossip(save).factionReputation.rivalHouses).toBe(3);
  });
});
