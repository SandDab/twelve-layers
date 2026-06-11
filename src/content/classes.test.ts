import { describe, expect, it } from 'vitest';
import { CLASS_IDS, CLASSES, computeComposureCap } from './classes';

describe('CLASSES', () => {
  it('has exactly the four family backgrounds, each summing attrs to 100', () => {
    expect(CLASS_IDS).toHaveLength(4);
    for (const id of CLASS_IDS) {
      const def = CLASSES[id];
      const sum = def.attrs.charisma + def.attrs.allure + def.attrs.rhetoric + def.attrs.taste;
      expect(sum).toBe(100);
    }
  });
});

describe('computeComposureCap', () => {
  it('returns the base cap with no class chosen', () => {
    expect(computeComposureCap(null)).toBe(100);
  });

  it("applies the Judge's Child +25% Composure cap", () => {
    expect(computeComposureCap('judges_child')).toBe(125);
  });

  it("applies the Salon Child's -25% Composure cap", () => {
    expect(computeComposureCap('salon_child')).toBe(75);
  });

  it('leaves the cap at 100 for classes with no Composure modifier', () => {
    expect(computeComposureCap('governors_heir')).toBe(100);
    expect(computeComposureCap('old_name')).toBe(100);
  });
});
