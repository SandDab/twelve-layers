import type { Scene } from '../../engine/scene';

// The Girl from the Riverbank: emergent introduction (GAME_DESIGN.md §6).
// Fires as a ripple the month after the intro director selects her.
// Unsigned and unlabeled, as romance introductions must be (CLAUDE.md):
// nothing here marks this as the start of a route.

export const romanceRiverbankIntro: Scene = {
  id: 'romance_riverbank_intro',
  title: 'A Delay at the Ford',
  startNode: 'romance_riverbank_intro_00',
  nodes: {
    romance_riverbank_intro_00: {
      id: 'romance_riverbank_intro_00',
      speaker: 'Narrator',
      body:
        'A washed-out plank at the river crossing holds your palanquin bearers up longer than ' +
        'anyone planned for, and for once there is nothing to do but sit with the curtain ' +
        'raised an inch against the heat.',
      next: 'romance_riverbank_intro_01',
    },
    romance_riverbank_intro_01: {
      id: 'romance_riverbank_intro_01',
      speaker: 'Narrator',
      body:
        'Downstream, a girl in a rough-dyed robe stands knee deep in the current, skirts ' +
        'knotted up out of the way, hauling a net hand over hand. A servant murmurs that ' +
        'she is the governor’s daughter, raised half-wild on this stretch of the Kamo ' +
        'since her mother died. The girl glances up, catches you watching, and does not ' +
        'look away first.',
      choices: [
        {
          text: 'Hold her gaze a moment before the bearers move on.',
          effects: [],
          goto: 'romance_riverbank_intro_end',
        },
        {
          text: 'Let the curtain fall, as manners require.',
          effects: [],
          goto: 'romance_riverbank_intro_end',
        },
      ],
    },
    romance_riverbank_intro_end: {
      id: 'romance_riverbank_intro_end',
      speaker: 'Narrator',
      body:
        'The plank is righted, the bearers lift, and the moment is gone. You find, ' +
        'somewhat to your surprise, that you remember her face for the rest of the day.',
    },
  },
};
