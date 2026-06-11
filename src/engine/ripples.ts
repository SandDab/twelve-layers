import type { GossipEntry, RippleEntry, Save } from './types';

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
 */
export function resolveDueGossip(save: Save): Save {
  const due = getDueGossip(save);
  if (due.length === 0) return save;

  const factionReputation = { ...save.factionReputation };
  for (const gossip of due) {
    for (const [faction, delta] of Object.entries(gossip.factionDeltas)) {
      const key = faction as keyof typeof factionReputation;
      factionReputation[key] = factionReputation[key] + (delta ?? 0);
    }
  }

  return {
    ...save,
    factionReputation,
    pendingGossip: save.pendingGossip.filter((g) => !due.includes(g)),
  };
}
