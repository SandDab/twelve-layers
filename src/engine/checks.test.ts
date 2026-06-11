import { describe, expect, it } from 'vitest';
import { resolveCheck } from './checks';
import { DEFAULT_ATTRIBUTES } from './types';

describe('resolveCheck', () => {
  it('passes when the attribute meets the minimum', () => {
    expect(resolveCheck({ attr: 'rhetoric', min: 10 }, DEFAULT_ATTRIBUTES)).toBe(true);
  });

  it('passes when the attribute exceeds the minimum', () => {
    expect(resolveCheck({ attr: 'taste', min: 5 }, DEFAULT_ATTRIBUTES)).toBe(true);
  });

  it('fails when the attribute is below the minimum', () => {
    expect(resolveCheck({ attr: 'rhetoric', min: 40 }, DEFAULT_ATTRIBUTES)).toBe(false);
  });

  it('is deterministic — repeated calls give the same result', () => {
    const check = { attr: 'charisma' as const, min: 10 };
    expect(resolveCheck(check, DEFAULT_ATTRIBUTES)).toBe(
      resolveCheck(check, DEFAULT_ATTRIBUTES),
    );
  });
});
