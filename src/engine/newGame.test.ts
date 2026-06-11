import { describe, expect, it } from 'vitest';
import { assignKanzashiMonths } from './kanzashi';
import { applyClass } from './newGame';
import { createInitialSave } from './types';

describe('applyClass', () => {
  it("applies the Governor's Heir perk and liability", () => {
    const save = applyClass(createInitialSave(), 'governors_heir');

    expect(save.classId).toBe('governors_heir');
    expect(save.attributes).toMatchObject({ charisma: 30, allure: 25, rhetoric: 25, taste: 20 });
    expect(save.resources.koku).toBe(300); // 3x starting Koku
    expect(save.resources.composure).toBe(100); // no Composure modifier
    expect(save.flags.smells_of_the_provinces).toBe(true);
    expect(save.factionReputation.rivalHouses).toBe(-10);
  });

  it('assigns the year-1 kanzashi months from the seed', () => {
    const save = applyClass(createInitialSave(), 'governors_heir');
    expect(save.kanzashiAssignments).toEqual(assignKanzashiMonths(save.kanzashiSeed, save.year));
  });

  it("applies the Judge's Child Composure cap and starting wardrobe", () => {
    const save = applyClass(createInitialSave(), 'judges_child');

    expect(save.attributes).toMatchObject({ charisma: 25, allure: 25, rhetoric: 35, taste: 15 });
    expect(save.resources.composure).toBe(125); // +25% Composure cap, starts full
    expect(save.wardrobe.owned).toContain('plain_robe');
  });

  it('applies the Salon Child starting Favor and reduced Composure cap', () => {
    const save = applyClass(createInitialSave(), 'salon_child');

    expect(save.resources.composure).toBe(75); // -25% Composure cap, starts full
    expect(save.favors.sharpBrush).toBe(2);
  });

  it("queues the Old Name's family-debt ripple for month 6 at game start", () => {
    const save = applyClass(createInitialSave(), 'old_name');

    expect(save.resources.koku).toBe(50); // lowest starting Koku
    expect(save.wardrobe.owned).toContain('heirloom_robe');
    expect(save.factionReputation.rivalHouses).toBe(10);
    expect(save.rippleQueue).toEqual([
      { triggerYear: 1, triggerMonth: 6, sceneId: 'old_name_debt_01' },
    ]);
  });
});
