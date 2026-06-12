import { KANZASHI, type KanzashiId } from '../content/kanzashi';
import { LOVE_INTERESTS } from '../content/loveInterests';
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
 * boost) applies the same way.
 */
export function resolveDueGossip(save: Save): Save {
  const due = getDueGossip(save);
  if (due.length === 0) return save;

  const passives = [
    ...(KANZASHI[save.kanzashiEquipped as KanzashiId]?.passives ?? []),
    ...(LOVE_INTERESTS[save.married as LoveInterestId]?.buff ?? []),
  ];

  const factionReputation = { ...save.factionReputation };
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
      }
      factionReputation[key] = factionReputation[key] + Math.round(applied);
    }
  }

  return {
    ...save,
    factionReputation,
    pendingGossip: save.pendingGossip.filter((g) => !due.includes(g)),
  };
}
