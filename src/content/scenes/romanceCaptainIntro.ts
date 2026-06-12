import type { Scene } from '../../engine/scene';

// The Captain: emergent introduction (GAME_DESIGN.md §6). Fires as a
// ripple the month after the intro director selects him. Unsigned and
// unlabeled (CLAUDE.md): nothing here marks this as the start of a route.

export const romanceCaptainIntro: Scene = {
  id: 'romance_captain_intro',
  title: 'Drill Ground at the Garden Wall',
  startNode: 'romance_captain_intro_00',
  nodes: {
    romance_captain_intro_00: {
      id: 'romance_captain_intro_00',
      speaker: 'Narrator',
      body:
        'A unit of palace guard is drilling in the open ground beyond the garden wall — ' +
        'too far off for the noise to be more than a rhythmic shuffle and the occasional ' +
        'barked correction, but close enough that you can make out the man giving the ' +
        'corrections, who looks considerably less interested in the drill than in finishing ' +
        'it quickly and going somewhere quieter.',
      next: 'romance_captain_intro_01',
    },
    romance_captain_intro_01: {
      id: 'romance_captain_intro_01',
      speaker: 'Narrator',
      body:
        'He calls a halt earlier than the drill schedule would suggest, dismisses the unit ' +
        'with a wave rather than the expected formal close, and — catching sight of you at ' +
        'the wall — approaches without any of the hesitation court manners would normally ' +
        'require. "You\'re allowed to watch," he says, by way of greeting, as though that ' +
        'had been in doubt. "Most people pretend they\'re not."',
      choices: [
        {
          text: 'Admit you were watching, and ask why he ended the drill early.',
          effects: [],
          goto: 'romance_captain_intro_end',
        },
        {
          text: 'Say nothing about the drill, and ask instead how he finds the capital, after the east.',
          effects: [],
          goto: 'romance_captain_intro_end',
        },
      ],
    },
    romance_captain_intro_end: {
      id: 'romance_captain_intro_end',
      speaker: 'Narrator',
      body:
        'He answers plainly, without the usual court hedging about postings and honors, ' +
        'and seems faintly relieved not to have to perform modesty about either. By the ' +
        'time he excuses himself — abruptly, as he seems to do most things — you have the ' +
        'sense of a man who has not yet decided whether the capital is a place he intends ' +
        'to stay.',
    },
  },
};
