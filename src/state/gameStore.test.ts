import { beforeEach, describe, expect, it } from 'vitest';
import { ENVY_RIPPLE_FLAG, ENVY_SCENE_ID } from '../engine/household';
import { createInitialSave } from '../engine/types';
import { useGameStore } from './gameStore';

// M2 acceptance checks (REALIGNMENT.md / GAME_DESIGN.md §14): each test
// below exercises one acceptance criterion through the real store actions
// (not just the underlying engine functions in isolation), so a wiring gap
// between engine and store would show up here even if the engine-level
// unit tests pass.

beforeEach(() => {
  localStorage.clear();
  useGameStore.setState(createInitialSave());
});

describe('M2 acceptance', () => {
  it('trains Rhetoric, spending Composure and gaining the attribute', () => {
    useGameStore.getState().chooseClass('old_name', 'female');

    const before = useGameStore.getState();
    const rhetoricBefore = before.attributes.rhetoric;
    const composureBefore = before.resources.composure;

    useGameStore.getState().trainAttribute('rhetoric');

    const after = useGameStore.getState();
    expect(after.attributes.rhetoric).toBe(rhetoricBefore + 2);
    expect(after.resources.composure).toBe(composureBefore - 10);
    expect(after.actionsRemaining).toBe(before.actionsRemaining - 1);
  });

  it('goes broke hiring staff and cannot afford another hire afterward', () => {
    // The Old Name starts with the lowest Koku (50), exactly the
    // Gardener's cost (50) - the intended early squeeze.
    useGameStore.getState().chooseClass('old_name', 'female');
    expect(useGameStore.getState().resources.koku).toBe(50);

    useGameStore.getState().hireStaff('gardener');
    expect(useGameStore.getState().resources.koku).toBe(0);
    expect(useGameStore.getState().staff.gardener).toBe(true);

    useGameStore.getState().hireStaff('steward');
    const state = useGameStore.getState();
    expect(state.resources.koku).toBe(0);
    expect(state.staff.steward).toBe(false);
  });

  it('gossips about an out-of-season robe and applies the rivalHouses penalty by month end', () => {
    // The Judge's Child starts with the plain robe (season 1).
    useGameStore.getState().chooseClass('judges_child', 'female');
    useGameStore.getState().hireStaff('seamstress');
    useGameStore.getState().equipRobe('plain_robe');

    // Move to month 7 (season 3) so the equipped season-1 robe is out of season.
    useGameStore.getState().setMonthYear(7, 1);

    const before = useGameStore.getState();
    const allureBefore = before.attributes.allure;
    const tasteBefore = before.attributes.taste;

    useGameStore.getState().tickMonth();

    const after = useGameStore.getState();
    expect(after.attributes.allure).toBe(allureBefore - 2);
    expect(after.attributes.taste).toBe(tasteBefore - 2);
    // The penalty's gossip is queued for next month and resolved by the
    // same applyMonthEnd call, once the calendar has ticked into it.
    expect(after.factionReputation.rivalHouses).toBe(-2);
    expect(after.pendingGossip).toEqual([]);
  });

  it('triggers the envy-rival ripple once Tokimeki reaches the top tier', () => {
    useGameStore.getState().chooseClass('governors_heir', 'female');
    useGameStore.getState().grantTokimeki(50);

    useGameStore.getState().tickMonth();

    const after = useGameStore.getState();
    expect(after.flags[ENVY_RIPPLE_FLAG]).toBe(true);
    expect(after.rippleQueue).toContainEqual(
      expect.objectContaining({ triggerYear: 1, triggerMonth: 3, sceneId: ENVY_SCENE_ID }),
    );
  });

  it('earns the Kobai via a principle-tagged choice in its assigned month, delivered the following month', () => {
    // The Old Name's Taste (35) clears the [Taste 15] principle-tagged
    // choice in the New Year scene (m1NewYear, m1_newyear_01).
    useGameStore.getState().chooseClass('old_name', 'female');
    useGameStore.setState({
      year: 1,
      month: 1,
      kanzashiAssignments: { kobai: 1, tsukikage: 4, fuji: 7, sango: 3 },
    });

    // SceneRunner calls checkKanzashiAward with the chosen choice's themeTags.
    useGameStore.getState().checkKanzashiAward(['principle']);

    let state = useGameStore.getState();
    expect(state.rippleQueue).toContainEqual({
      triggerYear: 1,
      triggerMonth: 2,
      sceneId: 'kanzashi_kobai_delivery',
    });
    expect(state.kanzashiOwned).not.toContain('kobai');

    // End the month so the calendar reaches the delivery's trigger month.
    useGameStore.getState().tickMonth();
    state = useGameStore.getState();
    expect(state.month).toBe(2);
    const delivery = state.rippleQueue.find((r) => r.sceneId === 'kanzashi_kobai_delivery');
    expect(delivery).toBeDefined();

    // Play the delivery scene's single choice: "Pin the plum into your hair."
    useGameStore.getState().applyChoiceEffects([{ kind: 'kanzashi', id: 'kobai' }]);
    useGameStore.getState().consumeRipple(delivery!);

    state = useGameStore.getState();
    expect(state.kanzashiOwned).toContain('kobai');
    expect(state.rippleQueue).not.toContainEqual(
      expect.objectContaining({ sceneId: 'kanzashi_kobai_delivery' }),
    );
  });
});
