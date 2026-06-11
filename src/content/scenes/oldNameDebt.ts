import type { Scene } from '../../engine/scene';

// The Old Name's scheduled month-6 ripple (GAME_DESIGN.md §2): the family's
// quietly-carried debts come due. Liability for the Old Name's perks
// (heirloom robe, recognized on sight, +10 old-houses reputation).

export const oldNameDebt: Scene = {
  id: 'old_name_debt_01',
  title: 'A Quiet Reckoning',
  startNode: 'old_name_debt_00',
  nodes: {
    old_name_debt_00: {
      id: 'old_name_debt_00',
      speaker: 'Household Steward',
      body:
        'A creditor\'s agent calls at the gate, ledger in hand — debts your family carried ' +
        'quietly for a generation, now politely, insistently due. He bows as if delivering ' +
        'good news.',
      choices: [
        {
          text: 'Settle the debt outright, however much it costs.',
          effects: [{ kind: 'resource', res: 'koku', delta: -40 }],
          goto: 'old_name_debt_end',
        },
        {
          text: 'Offer partial payment and ask for time.',
          effects: [
            { kind: 'resource', res: 'koku', delta: -15 },
            { kind: 'resource', res: 'composure', delta: -10 },
            {
              kind: 'gossip',
              tag: 'old_name_debt_unpaid',
              factionDeltas: { rivalHouses: -2 },
              delayMonths: 2,
            },
          ],
          goto: 'old_name_debt_end',
        },
      ],
    },

    old_name_debt_end: {
      id: 'old_name_debt_end',
      speaker: 'Narrator',
      body:
        'The agent bows and withdraws. The matter is, for now, closed — though closed ' +
        'matters have a way of resurfacing, in this house more than most.',
    },
  },
};
