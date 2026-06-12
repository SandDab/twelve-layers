import { describe, expect, it } from 'vitest';
import { applyJimoku, computeEnding, computeRankGain } from './jimoku';
import { createInitialSave, DEFAULT_FACTION_REPUTATION, type Save } from './types';

function saveWith(overrides: Partial<Save>): Save {
  return { ...createInitialSave(), ...overrides };
}

describe('computeEnding', () => {
  it('returns Behind the Curtain when any romance reaches stage 4+', () => {
    const save = saveWith({
      romance: {
        ...createInitialSave().romance,
        sequesteredHeir: { ...createInitialSave().romance.sequesteredHeir, stage: 4 },
      },
    });
    expect(computeEnding(save)).toBe('behind_the_curtain');
  });

  it('returns Overextended at top Tokimeki tier with soured rival-house standing', () => {
    const save = saveWith({
      tokimeki: 50,
      factionReputation: { ...DEFAULT_FACTION_REPUTATION, rivalHouses: -5 },
    });
    expect(computeEnding(save)).toBe('overextended');
  });

  it('returns Estranged when a faction soured badly and no romance progressed', () => {
    const save = saveWith({
      factionReputation: { ...DEFAULT_FACTION_REPUTATION, clergy: -10 },
    });
    expect(computeEnding(save)).toBe('estranged');
  });

  it('returns Toast of the Capital for a strong public year without a burned faction', () => {
    const save = saveWith({ tokimeki: 25 });
    expect(computeEnding(save)).toBe('toast_of_the_capital');
  });

  it('returns Quiet Advancement for a modest Tokimeki year', () => {
    const save = saveWith({ tokimeki: 10 });
    expect(computeEnding(save)).toBe('quiet_advancement');
  });

  it('returns the Unremarked Year by default', () => {
    const save = saveWith({});
    expect(computeEnding(save)).toBe('unremarked_year');
  });

  it('prioritizes Behind the Curtain over a soured faction', () => {
    const save = saveWith({
      factionReputation: { ...DEFAULT_FACTION_REPUTATION, clergy: -10 },
      romance: {
        ...createInitialSave().romance,
        sharpBrush: { ...createInitialSave().romance.sharpBrush, stage: 4 },
      },
    });
    expect(computeEnding(save)).toBe('behind_the_curtain');
  });
});

describe('computeRankGain', () => {
  it('is zero for a flat year', () => {
    expect(computeRankGain(saveWith({}))).toBe(0);
  });

  it('converts Tokimeki in steps of 10', () => {
    expect(computeRankGain(saveWith({ tokimeki: 25 }))).toBe(2);
  });

  it('adds floored faction-reputation sum in steps of 10', () => {
    const save = saveWith({
      tokimeki: 10,
      factionReputation: { regent: 12, rivalHouses: 0, imperial: 0, clergy: 0 },
    });
    // tokimeki 10 -> 1, repSum 12 -> floor(12/10) = 1
    expect(computeRankGain(save)).toBe(2);
  });

  it('floors a negative faction-reputation sum at zero overall gain', () => {
    const save = saveWith({
      tokimeki: 0,
      factionReputation: { regent: -20, rivalHouses: 0, imperial: 0, clergy: 0 },
    });
    expect(computeRankGain(save)).toBe(0);
  });
});

describe('applyJimoku', () => {
  it('records the ending and grants no Rank for a flat year', () => {
    const save = saveWith({});
    const next = applyJimoku(save);
    expect(next.jimokuResult).toEqual({ year: save.year, endingId: 'unremarked_year', rankGain: 0 });
    expect(next.attributes.rank).toBe(save.attributes.rank);
  });

  it('grants Rank and records the ending for a strong year', () => {
    const save = saveWith({ tokimeki: 25 });
    const next = applyJimoku(save);
    expect(next.jimokuResult).toEqual({ year: save.year, endingId: 'toast_of_the_capital', rankGain: 2 });
    expect(next.attributes.rank).toBe(save.attributes.rank + 2);
  });
});
