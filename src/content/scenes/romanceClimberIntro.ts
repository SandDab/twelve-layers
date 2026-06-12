import type { Scene } from '../../engine/scene';

// The Social Climber: emergent introduction (GAME_DESIGN.md §6). Fires as a
// ripple the month after the intro director selects her. Unsigned and
// unlabeled (CLAUDE.md): nothing here marks this as the start of a route.

export const romanceClimberIntro: Scene = {
  id: 'romance_climber_intro',
  title: 'A Word in Passing',
  startNode: 'romance_climber_intro_00',
  nodes: {
    romance_climber_intro_00: {
      id: 'romance_climber_intro_00',
      speaker: 'Narrator',
      body:
        'At a gathering thick with people angling for the same handful of good seats, one ' +
        'woman has clearly already won — she is exactly where she means to be, half a step ' +
        'from the most important conversation in the room, listening with the kind of ' +
        'attentiveness that looks like deference and is not. When she notices you noticing, ' +
        'she does not look away.',
      next: 'romance_climber_intro_01',
    },
    romance_climber_intro_01: {
      id: 'romance_climber_intro_01',
      speaker: 'Narrator',
      body:
        'She drifts over before you can decide whether to drift away, and dispenses with ' +
        'the usual three exchanges of nothing. "You\'re worth more attention than you\'re ' +
        'getting tonight," she says, pleasantly, as if remarking on the weather, and lets ' +
        'her eyes move once around the room — cataloguing, you realize, exactly who else ' +
        'has noticed you and who has not.',
      choices: [
        {
          text: 'Ask her, just as plainly, what she gets out of saying so.',
          effects: [],
          goto: 'romance_climber_intro_end',
        },
        {
          text: 'Let the remark pass, and watch where she goes next.',
          effects: [],
          goto: 'romance_climber_intro_end',
        },
      ],
    },
    romance_climber_intro_end: {
      id: 'romance_climber_intro_end',
      speaker: 'Narrator',
      body:
        'Whatever you say, she takes it as an answer worth having, files it away with the ' +
        'rest of the evening\'s information, and moves on to her next conversation without ' +
        'any visible hurry. You have the distinct sense of having been added to a list.',
    },
  },
};
