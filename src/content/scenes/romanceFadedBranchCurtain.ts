import type { Scene } from '../../engine/scene';

// Behind the Curtain (stage 4) for The Faded Branch (GAME_DESIGN.md §6).
// The mono no aware route: low political value, high narrative payoff,
// and a quiet cost to the climb for anyone who lingers here too openly.

export const romanceFadedBranchCurtain: Scene = {
  id: 'romance_faded_branch_curtain',
  title: 'Behind the Kichō: The Faded Branch',
  startNode: 'rfb_curtain_00',
  nodes: {
    rfb_curtain_00: {
      id: 'rfb_curtain_00',
      speaker: 'Narrator',
      body:
        'The room is smaller than the wing around it suggests, and colder. A ' +
        'single brazier does most of the work. The Faded Branch sits with a ' +
        'half-finished sutra copy pushed to one side, as if your visit had ' +
        'interrupted something he was glad to set down.',
      next: 'rfb_curtain_01',
    },

    rfb_curtain_01: {
      id: 'rfb_curtain_01',
      speaker: 'The Faded Branch',
      body:
        'People who visit me usually want something they think I still have, he ' +
        'says, not unkindly. A name to borrow, a connection half-remembered. ' +
        'Your letters never asked for any of that. I have wondered why.',
      choices: [
        {
          text:
            '[Taste 35] Say that his letters were the first in months that read like they were written for you and no one else.',
          check: { attr: 'taste', min: 35 },
          effects: [
            { kind: 'resource', res: 'tokimeki', delta: 8 },
            { kind: 'favor', npc: 'fadedBranch', delta: 2 },
            {
              kind: 'gossip',
              tag: 'lingering_with_the_faded_branch',
              factionDeltas: { regent: -1 },
              delayMonths: 2,
            },
          ],
          goto: 'rfb_curtain_02a',
        },
        {
          text: 'Say only that you enjoyed them, and leave it there.',
          effects: [
            { kind: 'resource', res: 'tokimeki', delta: 4 },
            { kind: 'favor', npc: 'fadedBranch', delta: 1 },
          ],
          goto: 'rfb_curtain_02b',
        },
        {
          text: 'Turn the question back to him: why does he think people stop asking?',
          effects: [{ kind: 'resource', res: 'composure', delta: 5 }],
          goto: 'rfb_curtain_02c',
        },
      ],
    },

    rfb_curtain_02a: {
      id: 'rfb_curtain_02a',
      speaker: 'Narrator',
      body:
        'He is quiet long enough that you wonder if you have overstepped, then ' +
        'he laughs, briefly, at something private. Careless of you, he says, ' +
        'and does not sound as though he minds. People will notice, you know. ' +
        'They notice everything about a name like mine, mostly so they can ' +
        'decide it does not matter.',
      choices: [
        {
          text: 'Say that you noticed too, and that it is too late to take it back.',
          effects: [],
          goto: 'rfb_curtain_end',
        },
      ],
    },

    rfb_curtain_02b: {
      id: 'rfb_curtain_02b',
      speaker: 'Narrator',
      body:
        'He nods, accepting the smaller answer without seeming to need a larger ' +
        'one. The brazier ticks as it cools. For a while neither of you says ' +
        'anything else, and it does not feel like a silence that needs filling.',
      choices: [
        {
          text: 'Take your leave as the hour grows late.',
          effects: [],
          goto: 'rfb_curtain_end',
        },
      ],
    },

    rfb_curtain_02c: {
      id: 'rfb_curtain_02c',
      speaker: 'Narrator',
      body:
        'Because asking costs something, he says, and most people run out of ' +
        'reasons to spend it on a branch this far from the trunk. He says it ' +
        'lightly, the way people say things they have practiced saying lightly.',
      choices: [
        {
          text: 'Take your leave, gently, as if closing a door that should not be slammed.',
          effects: [],
          goto: 'rfb_curtain_end',
        },
      ],
    },

    rfb_curtain_end: {
      id: 'rfb_curtain_end',
      speaker: 'Narrator',
      body:
        'The brazier glows low behind you as you go, and the half-finished sutra ' +
        'copy is still sitting where he left it, unresumed.',
    },
  },
};
