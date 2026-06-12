import { describe, expect, it } from 'vitest';
import { getPoemFragment } from '../content/poems';
import { DEFAULT_ATTRIBUTES } from './types';
import { POEM_SUCCESS_THRESHOLD, scorePoem } from './poems';

function frag(id: string) {
  const f = getPoemFragment(id);
  if (!f) throw new Error(`missing fragment ${id}`);
  return f;
}

describe('scorePoem', () => {
  it('scores a poem matching tastes, season, composition, and callback at the maximum', () => {
    // Sharp Brush tastes: cuckoo, plover.
    const selection = {
      season: frag('summer_season_1'), // cuckoo, summer
      image: frag('summer_image_2'), // cuckoo, summer
      turn: frag('summer_turn_1'), // iris, summer
    };
    const attributes = { ...DEFAULT_ATTRIBUTES, rhetoric: 25, taste: 20 }; // sums to 45 >= 40

    const result = scorePoem(selection, ['cuckoo', 'plover'], 4, attributes, ['cuckoo']);

    expect(result.breakdown.taste).toBe(10); // season + image fragments tagged cuckoo
    expect(result.breakdown.season).toBe(20); // all three fragments are summer, month 4 -> summer
    expect(result.breakdown.rhetoric).toBe(15);
    expect(result.breakdown.callback).toBe(10); // image fragment tagged cuckoo, recipient last used cuckoo
    expect(result.score).toBe(55);
    expect(result.success).toBe(true);
  });

  it('fails a mismatched, off-season poem with no composition bonus', () => {
    const selection = {
      season: frag('winter_season_1'), // snow, winter
      image: frag('winter_image_1'), // plover, winter
      turn: frag('winter_turn_1'), // pine, winter
    };
    const attributes = { ...DEFAULT_ATTRIBUTES }; // rhetoric+taste = 20, below threshold

    // Faded Branch tastes: cherry_blossom, snow. Sent in summer (month 5).
    const result = scorePoem(selection, ['cherry_blossom', 'snow'], 5, attributes, []);

    expect(result.breakdown.season).toBe(0); // winter fragments, summer month
    expect(result.breakdown.rhetoric).toBe(0);
    expect(result.breakdown.callback).toBe(0);
    expect(result.score).toBeLessThan(POEM_SUCCESS_THRESHOLD);
    expect(result.success).toBe(false);
  });
});
