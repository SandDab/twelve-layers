import { describe, expect, it } from 'vitest';
import { RAKING_RAKEABLE_CELLS, scoreRaking } from './raking';

describe('scoreRaking', () => {
  it('scores an untouched garden at zero', () => {
    const result = scoreRaking([], false);
    expect(result.breakdown.coverage).toBe(0);
    expect(result.breakdown.continuity).toBe(0);
    expect(result.breakdown.stones).toBe(0);
    expect(result.score).toBe(0);
    expect(result.composureGain).toBe(5);
  });

  it('rewards full coverage with no crossings and all stones flanked', () => {
    const result = scoreRaking(RAKING_RAKEABLE_CELLS, false);
    expect(result.breakdown.coverage).toBe(50);
    expect(result.breakdown.continuity).toBe(0);
    expect(result.breakdown.stones).toBe(20);
    expect(result.score).toBe(70);
    expect(result.composureGain).toBe(20);
  });

  it('doubles the stone bonus when a gardener is on staff', () => {
    const path = [1, 5]; // both adjacent to the stone at index 6 only
    const withoutGardener = scoreRaking(path, false);
    const withGardener = scoreRaking(path, true);

    expect(withoutGardener.breakdown.stones).toBe(7);
    expect(withGardener.breakdown.stones).toBe(14);
    expect(withGardener.score).toBeGreaterThan(withoutGardener.score);
  });

  it('penalizes re-crossing an already-raked cell', () => {
    const result = scoreRaking([0, 1, 0], false);
    expect(result.breakdown.coverage).toBe(5); // 2 of 22 cells
    expect(result.breakdown.continuity).toBe(-5); // one crossing
    expect(result.breakdown.stones).toBe(7); // cell 1 flanks the stone at 6
    expect(result.score).toBe(7);
  });
});
