import type { Scene } from '../../engine/scene';

// The Second Prince: emergent introduction (GAME_DESIGN.md §6). Fires as
// a ripple the month after the intro director selects him. Unsigned and
// unlabeled (CLAUDE.md): nothing here marks this as the start of a route,
// and the danger of the attention is left to the reader to notice.

export const romanceSecondPrinceIntro: Scene = {
  id: 'romance_second_prince_intro',
  title: 'A Glance Across the Hall',
  startNode: 'romance_second_prince_intro_00',
  nodes: {
    romance_second_prince_intro_00: {
      id: 'romance_second_prince_intro_00',
      speaker: 'Narrator',
      body:
        'At a palace function you are not important enough to be seated near the dais, ' +
        'which suits you well enough until you realize someone near the dais keeps ' +
        'looking your way. It takes a moment to place him: the Emperor’s second son, ' +
        'younger than you expected, dressed with the kind of restraint that costs more ' +
        'than ostentation does.',
      next: 'romance_second_prince_intro_01',
    },
    romance_second_prince_intro_01: {
      id: 'romance_second_prince_intro_01',
      speaker: 'Narrator',
      body:
        'When the music ends he does not approach, only inclines his head a fraction in ' +
        'your direction, the gesture so slight that anyone not watching for it would miss ' +
        'it entirely. Several people nearby, you notice, were watching for it.',
      choices: [
        {
          text: 'Return the nod, exactly as small.',
          effects: [],
          goto: 'romance_second_prince_intro_end',
        },
        {
          text: 'Pretend you did not notice.',
          effects: [],
          goto: 'romance_second_prince_intro_end',
        },
      ],
    },
    romance_second_prince_intro_end: {
      id: 'romance_second_prince_intro_end',
      speaker: 'Narrator',
      body:
        'Nothing more comes of it that evening. But for days afterward you catch yourself ' +
        'replaying the gesture, turning it over, trying to decide whether it meant ' +
        'anything at all.',
    },
  },
};
