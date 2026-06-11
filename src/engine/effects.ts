import type { Effect, GossipEntry, RippleEntry, Save } from './types';

/** Add `delta` months to a year/month pair, rolling over at 12. */
function addMonths(year: number, month: number, delta: number): { year: number; month: number } {
  const total = (month - 1) + delta;
  return { year: year + Math.floor(total / 12), month: (total % 12) + 1 };
}

function applyEffect(effect: Effect, save: Save): Save {
  switch (effect.kind) {
    case 'attr':
      return {
        ...save,
        attributes: {
          ...save.attributes,
          [effect.attr]: save.attributes[effect.attr] + effect.delta,
        },
      };

    case 'resource':
      if (effect.res === 'clout') {
        return { ...save, clout: Math.max(0, save.clout + effect.delta) };
      }
      return {
        ...save,
        resources: {
          ...save.resources,
          [effect.res]: save.resources[effect.res] + effect.delta,
        },
      };

    case 'favor':
      return {
        ...save,
        favors: {
          ...save.favors,
          [effect.npc]: (save.favors[effect.npc] ?? 0) + effect.delta,
        },
      };

    case 'flag':
      return { ...save, flags: { ...save.flags, [effect.flag]: effect.value } };

    case 'ripple': {
      // Ripples target a month later in the calendar; if that month has
      // already passed this year, it lands in the following year.
      const triggerYear = effect.triggerMonth >= save.month ? save.year : save.year + 1;
      const ripple: RippleEntry = {
        triggerYear,
        triggerMonth: effect.triggerMonth,
        sceneId: effect.sceneId,
        ifFlags: effect.ifFlags,
      };
      return { ...save, rippleQueue: [...save.rippleQueue, ripple] };
    }

    case 'gossip': {
      const { year: triggerYear, month: triggerMonth } = addMonths(
        save.year,
        save.month,
        effect.delayMonths,
      );
      const gossip: GossipEntry = {
        triggerYear,
        triggerMonth,
        tag: effect.tag,
        factionDeltas: effect.factionDeltas,
      };
      return { ...save, pendingGossip: [...save.pendingGossip, gossip] };
    }
  }
}

/** Apply a sequence of effects in order, threading the save through each. */
export function applyEffects(effects: Effect[], save: Save): Save {
  return effects.reduce((acc, effect) => applyEffect(effect, acc), save);
}
