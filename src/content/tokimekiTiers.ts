// Tokimeki benefit tiers, GAME_DESIGN.md §4. Benefits scale through the
// year as Tokimeki accrues from public effects; the top tier is also the
// target on your back — it queues the envy-rival ripple (see
// src/engine/household.ts: applyTokimekiEnvyTrigger).

export type TokimekiTier = {
  threshold: number;
  name: string;
  description: string;
  actionsBonus: number; // added to the base free actions per month
  incomeBonus: number; // added to monthly koku income
  envy: boolean; // queues the envy-rival ripple once
};

export const TOKIMEKI_TIERS: TokimekiTier[] = [
  {
    threshold: 0,
    name: 'Unremarked',
    description: 'No one at court is watching you yet.',
    actionsBonus: 0,
    incomeBonus: 0,
    envy: false,
  },
  {
    threshold: 10,
    name: 'Noticed',
    description: 'Invitations arrive a little more readily. (+1 free action/month)',
    actionsBonus: 1,
    incomeBonus: 0,
    envy: false,
  },
  {
    threshold: 25,
    name: 'Sought After',
    description: 'Gifts and small favors flow your way. (+10 koku/month)',
    actionsBonus: 1,
    incomeBonus: 10,
    envy: false,
  },
  {
    threshold: 50,
    name: "The Season's Name",
    description: "You are this year's person — and someone has noticed.",
    actionsBonus: 2,
    incomeBonus: 10,
    envy: true,
  },
];

/** The highest tier whose threshold the given Tokimeki value meets or exceeds. */
export function getTokimekiTier(tokimeki: number): TokimekiTier {
  let current = TOKIMEKI_TIERS[0];
  for (const tier of TOKIMEKI_TIERS) {
    if (tokimeki >= tier.threshold) {
      current = tier;
    }
  }
  return current;
}
