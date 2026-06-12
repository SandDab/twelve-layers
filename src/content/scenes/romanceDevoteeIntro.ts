import type { Scene } from '../../engine/scene';

// The Devotee: emergent introduction (GAME_DESIGN.md §6). Fires as a
// ripple the month after the intro director selects him. Unsigned and
// unlabeled (CLAUDE.md): nothing here marks this as the start of a route.

export const romanceDevoteeIntro: Scene = {
  id: 'romance_devotee_intro',
  title: 'Snow at the Shrine Gate',
  startNode: 'romance_devotee_intro_00',
  nodes: {
    romance_devotee_intro_00: {
      id: 'romance_devotee_intro_00',
      speaker: 'Narrator',
      body:
        'The road home is slow with the first real snow of the year, and your bearers ' +
        'stop to rest at a wayside shrine no grander than a woodshed, its thatch sagging ' +
        'under the white. A man is at work in the precinct, broom in hand, clearing the ' +
        'approach stone by stone though the snow keeps undoing him as fast as he clears it.',
      next: 'romance_devotee_intro_01',
    },
    romance_devotee_intro_01: {
      id: 'romance_devotee_intro_01',
      speaker: 'Narrator',
      body:
        'He does not stop to bow, or even to look up properly — only inclines his head a ' +
        'fraction, the way one might to a fellow traveler rather than to rank, and goes ' +
        'back to the broom. Behind him, someone has set out a small offering of winter ' +
        'greens, perfectly square to the shrine’s post, as if it mattered to no one ' +
        'whether anyone of consequence ever saw it.',
      choices: [
        {
          text: 'Step down and leave a coin at the shrine yourself, without ceremony.',
          effects: [],
          goto: 'romance_devotee_intro_end',
        },
        {
          text: 'Stay in the palanquin and let the bearers rest a moment longer.',
          effects: [],
          goto: 'romance_devotee_intro_end',
        },
      ],
    },
    romance_devotee_intro_end: {
      id: 'romance_devotee_intro_end',
      speaker: 'Narrator',
      body:
        'The bearers lift again before the snow has settled on your sleeve. The man at ' +
        'the shrine never does look up to see who passed — and you find that, oddly, ' +
        'this is the thing you keep returning to.',
    },
  },
};
