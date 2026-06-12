import type { Scene } from '../../engine/scene';

// Behind the Curtain (stage 4) for The Sequestered Heir (GAME_DESIGN.md
// §6). A kichō screen still separates you, but the correspondence has
// earned a private audience. Courting the regent's circle is its own
// kind of exposure.

export const romanceSequesteredHeirCurtain: Scene = {
  id: 'romance_sequestered_heir_curtain',
  title: 'Behind the Kichō: The Sequestered Heir',
  startNode: 'rsh_curtain_00',
  nodes: {
    rsh_curtain_00: {
      id: 'rsh_curtain_00',
      speaker: 'Narrator',
      body:
        'A standing screen divides the room exactly in half, fine enough that ' +
        'shapes pass through it but nothing more. An attendant withdraws to the ' +
        'far corner and becomes very interested in a lacquer box. On the other ' +
        'side, a sleeve shifts, settles, and does not shift again.',
      next: 'rsh_curtain_01',
    },

    rsh_curtain_01: {
      id: 'rsh_curtain_01',
      speaker: 'The Sequestered Heir',
      body:
        'Your poems read like someone who has read the regent\'s correspondence ' +
        'as closely as the season calendar, the voice says, mild and unhurried. ' +
        'I wonder which of the two interests you more.',
      choices: [
        {
          text:
            '[Rank 20] Answer plainly: both interest you, and you see no shame in saying so.',
          check: { attr: 'rank', min: 20 },
          effects: [
            { kind: 'resource', res: 'tokimeki', delta: 8 },
            { kind: 'favor', npc: 'sequesteredHeir', delta: 2 },
            {
              kind: 'gossip',
              tag: 'courting_the_heir',
              factionDeltas: { rivalHouses: -1 },
              delayMonths: 2,
            },
          ],
          goto: 'rsh_curtain_02a',
        },
        {
          text: 'Say only that the season calendar is the safer of the two to admire aloud.',
          effects: [
            { kind: 'resource', res: 'tokimeki', delta: 4 },
            { kind: 'favor', npc: 'sequesteredHeir', delta: 1 },
          ],
          goto: 'rsh_curtain_02b',
        },
        {
          text: 'Let the silence answer for you, and study the screen\'s grain instead.',
          effects: [{ kind: 'resource', res: 'composure', delta: 5 }],
          goto: 'rsh_curtain_02c',
        },
      ],
    },

    rsh_curtain_02a: {
      id: 'rsh_curtain_02a',
      speaker: 'Narrator',
      body:
        'A pause, then something close to a laugh, quickly smoothed over. Careful ' +
        'words travel further in this house than honest ones, the voice says, but ' +
        'I find I prefer yours. The attendant in the corner has stopped pretending ' +
        'to examine the lacquer box.',
      choices: [
        {
          text: 'Take your leave with a bow toward the screen.',
          effects: [],
          goto: 'rsh_curtain_end',
        },
      ],
    },

    rsh_curtain_02b: {
      id: 'rsh_curtain_02b',
      speaker: 'Narrator',
      body:
        'A quiet sound of agreement, neither warm nor cold. Sensible, the voice ' +
        'says. The conversation continues a little longer, in the unhurried way ' +
        'of people who expect to speak again.',
      choices: [
        {
          text: 'Take your leave with a bow toward the screen.',
          effects: [],
          goto: 'rsh_curtain_end',
        },
      ],
    },

    rsh_curtain_02c: {
      id: 'rsh_curtain_02c',
      speaker: 'Narrator',
      body:
        'The silence stretches, comfortable rather than awkward. Eventually the ' +
        'voice speaks again, of nothing in particular, releasing you from having ' +
        'to have answered at all.',
      choices: [
        {
          text: 'Take your leave with a bow toward the screen.',
          effects: [],
          goto: 'rsh_curtain_end',
        },
      ],
    },

    rsh_curtain_end: {
      id: 'rsh_curtain_end',
      speaker: 'Narrator',
      body:
        'The screen does not move as you go, but you carry the sense of having ' +
        'been looked at directly, just once, through cloth thin enough to allow it.',
    },
  },
};
