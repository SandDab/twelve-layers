import { describe, expect, it } from 'vitest';
import { applyEffects } from './effects';
import { createInitialSave } from './types';

describe('applyEffects', () => {
  it('applies an attr effect', () => {
    const save = applyEffects([{ kind: 'attr', attr: 'rhetoric', delta: 5 }], createInitialSave());
    expect(save.attributes.rhetoric).toBe(15);
  });

  it('applies a koku/composure resource effect', () => {
    const save = applyEffects(
      [
        { kind: 'resource', res: 'koku', delta: -20 },
        { kind: 'resource', res: 'composure', delta: -10 },
      ],
      createInitialSave(),
    );
    expect(save.resources.koku).toBe(80);
    expect(save.resources.composure).toBe(90);
  });

  it('applies a tokimeki resource effect, floored at zero', () => {
    const base = { ...createInitialSave(), tokimeki: 5 };
    const save = applyEffects([{ kind: 'resource', res: 'tokimeki', delta: -20 }], base);
    expect(save.tokimeki).toBe(0);
  });

  it("multiplies positive tokimeki gains by 1.25 while married to the Social Climber", () => {
    const base = { ...createInitialSave(), married: 'climber' };
    const save = applyEffects([{ kind: 'resource', res: 'tokimeki', delta: 4 }], base);
    expect(save.tokimeki).toBe(5); // 4 * 1.25 = 5

    const negative = applyEffects([{ kind: 'resource', res: 'tokimeki', delta: -4 }], { ...base, tokimeki: 10 });
    expect(negative.tokimeki).toBe(6); // negative deltas unaffected

    const unmarried = applyEffects([{ kind: 'resource', res: 'tokimeki', delta: 4 }], createInitialSave());
    expect(unmarried.tokimeki).toBe(4); // no buff without the marriage
  });

  it('applies a favor effect, accumulating per-npc', () => {
    let save = applyEffects([{ kind: 'favor', npc: 'sharpBrush', delta: 1 }], createInitialSave());
    save = applyEffects([{ kind: 'favor', npc: 'sharpBrush', delta: 2 }], save);
    expect(save.favors.sharpBrush).toBe(3);
  });

  it('applies a flag effect', () => {
    const save = applyEffects([{ kind: 'flag', flag: 'wore_kobai', value: true }], createInitialSave());
    expect(save.flags.wore_kobai).toBe(true);
  });

  it('queues a ripple for later this year when the target month is ahead', () => {
    const base = { ...createInitialSave(), year: 1, month: 1 };
    const save = applyEffects(
      [{ kind: 'ripple', triggerMonth: 4, sceneId: 'm4_newyear_echo_01' }],
      base,
    );
    expect(save.rippleQueue).toEqual([
      { triggerYear: 1, triggerMonth: 4, sceneId: 'm4_newyear_echo_01', ifFlags: undefined },
    ]);
  });

  it('queues a ripple for next year when the target month has already passed', () => {
    const base = { ...createInitialSave(), year: 1, month: 8 };
    const save = applyEffects(
      [{ kind: 'ripple', triggerMonth: 3, sceneId: 'm3_echo' }],
      base,
    );
    expect(save.rippleQueue[0]).toMatchObject({ triggerYear: 2, triggerMonth: 3 });
  });

  it('queues delayed gossip with rollover into the next year', () => {
    const base = { ...createInitialSave(), year: 1, month: 12 };
    const save = applyEffects(
      [{ kind: 'gossip', tag: 'wore_autumn_in_spring', factionDeltas: { rivalHouses: -2 }, delayMonths: 2 }],
      base,
    );
    expect(save.pendingGossip).toEqual([
      { triggerYear: 2, triggerMonth: 2, tag: 'wore_autumn_in_spring', factionDeltas: { rivalHouses: -2 } },
    ]);
  });

  it('applies a kanzashi effect, granting ownership once', () => {
    let save = applyEffects([{ kind: 'kanzashi', id: 'kobai' }], createInitialSave());
    expect(save.kanzashiOwned).toEqual(['kobai']);

    save = applyEffects([{ kind: 'kanzashi', id: 'kobai' }], save);
    expect(save.kanzashiOwned).toEqual(['kobai']);
  });

  it('applies a romance effect, creating the record on first contact', () => {
    const save = applyEffects(
      [{ kind: 'romance', loveInterestId: 'riverbank', stage: 1, interestDelta: 4 }],
      createInitialSave(),
    );
    expect(save.romance.riverbank).toEqual({ stage: 1, interest: 4, closed: false, introFired: false });
  });

  it('applies a romance effect, accumulating interest and overriding stage/closed on an existing record', () => {
    const base = {
      ...createInitialSave(),
      romance: { riverbank: { stage: 2, interest: 6, closed: false, introFired: true } },
    };
    const save = applyEffects(
      [{ kind: 'romance', loveInterestId: 'riverbank', stage: 3, interestDelta: -2, closed: true }],
      base,
    );
    expect(save.romance.riverbank).toEqual({ stage: 3, interest: 4, closed: true, introFired: true });
  });

  it('applies a romance effect with marry: true, setting save.married', () => {
    const base = {
      ...createInitialSave(),
      romance: { riverbank: { stage: 5, interest: 10, closed: false, introFired: true } },
    };
    const save = applyEffects(
      [{ kind: 'romance', loveInterestId: 'riverbank', stage: 6, closed: true, marry: true }],
      base,
    );
    expect(save.married).toBe('riverbank');
    expect(save.romance.riverbank).toEqual({ stage: 6, interest: 10, closed: true, introFired: true });
  });

  it("applies the Sole Heir's +5 Taste attrBonus once, on marriage", () => {
    const base = {
      ...createInitialSave(),
      romance: { sole_heir: { stage: 2, interest: 8, closed: false, introFired: true } },
    };
    const save = applyEffects(
      [{ kind: 'romance', loveInterestId: 'sole_heir', stage: 3, closed: true, marry: true }],
      base,
    );
    expect(save.married).toBe('sole_heir');
    expect(save.attributes.taste).toBe(base.attributes.taste + 5);
  });

  it('applies a courtshipSignal effect to open courtships per their acclaim/deference profile', () => {
    // The Riverbank Girl dislikes acclaim (acclaim: -1) and the Devotee
    // welcomes deference (deference: 1); the Captain (acclaim: 1) is not
    // yet introduced and should be untouched.
    const base = {
      ...createInitialSave(),
      romance: {
        riverbank: { stage: 1, interest: 0, closed: false, introFired: true },
        devotee: { stage: 1, interest: 0, closed: false, introFired: true },
        captain: { stage: 0, interest: 0, closed: false, introFired: false },
      },
    };

    const afterAcclaim = applyEffects([{ kind: 'courtshipSignal', signal: 'acclaim' }], base);
    expect(afterAcclaim.romance.riverbank.interest).toBe(-3);
    expect(afterAcclaim.romance.devotee.interest).toBe(-3);
    expect(afterAcclaim.romance.captain.interest).toBe(0);

    const afterDeference = applyEffects([{ kind: 'courtshipSignal', signal: 'deference' }], base);
    expect(afterDeference.romance.devotee.interest).toBe(3);
    expect(afterDeference.romance.riverbank.interest).toBe(0);
  });

  it('threads multiple effects through in order', () => {
    const save = applyEffects(
      [
        { kind: 'attr', attr: 'charisma', delta: 2 },
        { kind: 'resource', res: 'tokimeki', delta: 5 },
        { kind: 'flag', flag: 'greeted_chamberlain', value: true },
      ],
      createInitialSave(),
    );
    expect(save.attributes.charisma).toBe(12);
    expect(save.tokimeki).toBe(5);
    expect(save.flags.greeted_chamberlain).toBe(true);
  });
});
