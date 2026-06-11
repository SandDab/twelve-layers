import { describe, expect, it } from 'vitest';
import { IKEBANA_SLOTS, scoreArrangement } from './ikebana';

describe('scoreArrangement', () => {
  it('scores an empty vase at zero', () => {
    const slots = Array<string | null>(IKEBANA_SLOTS).fill(null);
    const result = scoreArrangement(slots, 1);
    expect(result.score).toBe(0);
    expect(result.tasteDelta).toBe(0);
  });

  it('rewards a balanced, in-season, ideally-filled spring arrangement', () => {
    const slots: (string | null)[] = [
      'plum_branch', // heaven, spring
      'cherry_spray', // human, spring
      'violet', // earth, spring
      'plum_branch',
      'cherry_spray',
      null,
      null,
    ];
    const result = scoreArrangement(slots, 1); // month 1 -> spring

    expect(result.breakdown.triad).toBe(30); // all three tiers represented
    expect(result.breakdown.season).toBe(30); // 5 in-season stems x +6
    expect(result.breakdown.space).toBe(20); // exactly 5 stems placed
    expect(result.score).toBe(80);
    expect(result.tasteDelta).toBe(5);
  });

  it('penalizes an off-season, single-tier, overfull arrangement', () => {
    const slots = Array<string | null>(IKEBANA_SLOTS).fill('pine_branch'); // heaven, winter
    const result = scoreArrangement(slots, 1); // month 1 -> spring

    expect(result.breakdown.triad).toBe(10); // only one tier
    expect(result.breakdown.season).toBe(-21); // 7 off-season stems x -3
    expect(result.breakdown.space).toBe(6); // overfull by 2
    expect(result.score).toBe(0); // floored at zero
    expect(result.tasteDelta).toBe(0);
  });

  it('ignores unknown stem ids', () => {
    const slots: (string | null)[] = ['not_a_stem', null, null, null, null, null, null];
    const result = scoreArrangement(slots, 1);
    expect(result.breakdown.triad).toBe(0);
    expect(result.breakdown.season).toBe(0);
  });
});
