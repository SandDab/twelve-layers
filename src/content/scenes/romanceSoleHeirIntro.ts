import type { Scene } from '../../engine/scene';

// The Sole Heir: emergent introduction (GAME_DESIGN.md §6). Fires as a
// ripple the month after the intro director selects her. Unsigned and
// unlabeled (CLAUDE.md): nothing here marks this as the start of a route.

export const romanceSoleHeirIntro: Scene = {
  id: 'romance_sole_heir_intro',
  title: 'The Last Inventory',
  startNode: 'romance_sole_heir_intro_00',
  nodes: {
    romance_sole_heir_intro_00: {
      id: 'romance_sole_heir_intro_00',
      speaker: 'Narrator',
      body:
        'A young woman is walking the storerooms of a neighboring residence with a ' +
        'steward two steps behind her, naming things off a list in a flat, precise voice ' +
        '— this lacquerware, that screen, the robes in the third chest — the way someone ' +
        'recites the contents of a house they expect, one day, to be entirely ' +
        'responsible for. There is no one left above her to do it instead.',
      next: 'romance_sole_heir_intro_01',
    },
    romance_sole_heir_intro_01: {
      id: 'romance_sole_heir_intro_01',
      speaker: 'Narrator',
      body:
        'She glances up when your party passes, takes you in with the same brisk ' +
        'precision she was just applying to the lacquerware, and — apparently satisfied ' +
        'by whatever she sees — says, without preamble: "You have good taste in robes, for ' +
        'someone whose house doesn\'t make their own dyes." It is not entirely clear ' +
        'whether this is a compliment.',
      choices: [
        {
          text: 'Ask her, just as bluntly, what her house\'s dyes look like.',
          effects: [],
          goto: 'romance_sole_heir_intro_end',
        },
        {
          text: 'Take it as a compliment, and say so.',
          effects: [],
          goto: 'romance_sole_heir_intro_end',
        },
      ],
    },
    romance_sole_heir_intro_end: {
      id: 'romance_sole_heir_intro_end',
      speaker: 'Narrator',
      body:
        'Whatever you say, she considers it for a moment with the same flat attention she ' +
        'gave the inventory, then nods once, as if a small but real question has been ' +
        'settled, and returns to the storerooms without another word. The steward, ' +
        'trailing after her, gives you a look you can\'t quite read.',
    },
  },
};
