import type { Scene } from '../../engine/scene';

// Triggered via ripple once Tokimeki reaches "The Season's Name" tier
// (50+, see src/content/tokimekiTiers.ts and
// src/engine/household.ts: applyTokimekiEnvyTrigger). High Tokimeki is
// high variance by design (GAME_DESIGN.md §4) — this is the v0.1 envy
// event.

export const envyRival: Scene = {
  id: 'envy_rival_01',
  title: "A Rival's Notice",
  startNode: 'envy_rival_00',
  nodes: {
    envy_rival_00: {
      id: 'envy_rival_00',
      speaker: 'Narrator',
      body:
        'Word reaches you sideways, the way court news always does: a lady of one ' +
        'of the great rival houses has begun asking after you — your robes, your ' +
        'verses, who writes to you and how often. Being the season\'s name, it seems, ' +
        'means being studied as well as admired.',
      choices: [
        {
          text: '[Charisma 20] Send a small, gracious gift — acknowledge the attention without inviting more.',
          check: { attr: 'charisma', min: 20 },
          effects: [
            { kind: 'favor', npc: 'rivalHouseLady', delta: 1 },
            { kind: 'resource', res: 'composure', delta: -5 },
          ],
          goto: 'envy_rival_grace',
        },
        {
          text: 'Ignore it. Let them watch — you have nothing to hide.',
          effects: [
            {
              kind: 'gossip',
              tag: 'snubbed_rival_house',
              factionDeltas: { rivalHouses: -3 },
              delayMonths: 2,
            },
          ],
          goto: 'envy_rival_ignore',
        },
      ],
    },

    envy_rival_grace: {
      id: 'envy_rival_grace',
      speaker: 'Narrator',
      body:
        'The gift is accepted with a correctly measured note of thanks. Nothing is ' +
        'settled, but nothing is provoked either — for now.',
      next: 'envy_rival_end',
    },

    envy_rival_ignore: {
      id: 'envy_rival_ignore',
      speaker: 'Narrator',
      body:
        'You let the matter pass without comment. Whether that reads as confidence ' +
        'or contempt is, you suspect, not entirely up to you.',
      next: 'envy_rival_end',
    },

    envy_rival_end: {
      id: 'envy_rival_end',
      speaker: 'Narrator',
      body:
        'Either way, the lady files you away for future reference, the way court ' +
        'ladies file everything away. What she does with it is a question for ' +
        'another season.',
    },
  },
};
