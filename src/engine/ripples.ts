import { KANZASHI, type KanzashiId } from '../content/kanzashi';
import { LOVE_INTERESTS } from '../content/loveInterests';
import { getMarriedBuff } from './marriage';
import type { GossipEntry, LoveInterestId, RippleEntry, Save } from './types';

/** Ripples whose trigger year/month matches the save's current calendar position. */
export function getDueRipples(save: Save): RippleEntry[] {
  return save.rippleQueue.filter(
    (r) => r.triggerYear === save.year && r.triggerMonth === save.month,
  );
}

/** Remove a single ripple from the queue (e.g. once its scene has played). */
export function consumeRipple(save: Save, ripple: RippleEntry): Save {
  return { ...save, rippleQueue: save.rippleQueue.filter((r) => r !== ripple) };
}

/** Gossip entries whose delayed trigger has arrived. */
export function getDueGossip(save: Save): GossipEntry[] {
  return save.pendingGossip.filter(
    (g) => g.triggerYear === save.year && g.triggerMonth === save.month,
  );
}

/**
 * Apply due gossip to faction reputation and remove it from the
 * pending queue. Pure — returns the updated save.
 *
 * An equipped kanzashi can dampen or amplify the result: Kōbai halves
 * the faction impact of "wore_offseason_robe" gossip, and Fuji
 * multiplies positive rivalHouses (old-houses) gains by 1.5. The married
 * love interest's marriage buff (e.g. the Second Prince's imperial-rep
 * boost, or the Captain's `envyWeaken` halving negative faction deltas)
 * applies the same way.
 *
 * The Young Widow's `rippleIntercept` buff first removes one due gossip
 * entry with a net-negative faction impact per season, before the rest
 * resolve normally — her quiet correspondents catch one piece of trouble
 * before it spreads.
 */
export function resolveDueGossip(save: Save): Save {
  let working = save;

  if (getMarriedBuff(working, 'rippleIntercept')) {
    const season = Math.floor((working.month - 1) / 3) + 1;
    const flag = `rippleIntercept_used_y${working.year}_s${season}`;
    if (!working.flags[flag]) {
      const dueNow = getDueGossip(working);
      const worst = dueNow.find((g) =>
        Object.values(g.factionDeltas).reduce((sum, d) => sum + (d ?? 0), 0) < 0,
      );
      if (worst) {
        working = {
          ...working,
          flags: { ...working.flags, [flag]: true },
          pendingGossip: working.pendingGossip.filter((g) => g !== worst),
        };
      }
    }
  }

  const due = getDueGossip(working);
  if (due.length === 0) return working;

  const passives = [
    ...(KANZASHI[working.kanzashiEquipped as KanzashiId]?.passives ?? []),
    ...(LOVE_INTERESTS[working.married as LoveInterestId]?.buff ?? []),
  ];

  const factionReputation = { ...working.factionReputation };
  for (const gossip of due) {
    const tagMult =
      passives.find((p): p is Extract<typeof p, { kind: 'gossipMultiplier' }> =>
        p.kind === 'gossipMultiplier' && p.tag === gossip.tag,
      )?.mult ?? 1;
    for (const [faction, delta] of Object.entries(gossip.factionDeltas)) {
      const key = faction as keyof typeof factionReputation;
      let applied = (delta ?? 0) * tagMult;
      if (applied > 0) {
        const repMult =
          passives.find((p): p is Extract<typeof p, { kind: 'factionRepMult' }> =>
            p.kind === 'factionRepMult' && p.faction === key,
          )?.mult ?? 1;
        applied *= repMult;
      } else if (applied < 0) {
        const weakenMult =
          passives.find((p): p is Extract<typeof p, { kind: 'envyWeaken' }> =>
            p.kind === 'envyWeaken',
          )?.mult ?? 1;
        applied *= weakenMult;
      }
      factionReputation[key] = factionReputation[key] + Math.round(applied);
    }
  }

  return {
    ...working,
    factionReputation,
    pendingGossip: working.pendingGossip.filter((g) => !due.includes(g)),
  };
}
