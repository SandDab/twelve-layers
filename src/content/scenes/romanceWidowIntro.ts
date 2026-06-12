import type { Scene } from '../../engine/scene';

// The Young Widow: emergent introduction (GAME_DESIGN.md §6). Fires as a
// ripple the month after the intro director selects her. Unsigned and
// unlabeled (CLAUDE.md): nothing here marks this as the start of a route.

export const romanceWidowIntro: Scene = {
  id: 'romance_widow_intro',
  title: 'Mist on the Lower Veranda',
  startNode: 'romance_widow_intro_00',
  nodes: {
    romance_widow_intro_00: {
      id: 'romance_widow_intro_00',
      speaker: 'Narrator',
      body:
        'An early mist has settled low over the garden, thick enough that the far ' +
        'veranda is only a suggestion of itself, and you nearly miss the woman seated ' +
        'there entirely — perfectly still, a half-finished letter weighted down beside ' +
        'her, watching the mist the way some people watch a fire.',
      next: 'romance_widow_intro_01',
    },
    romance_widow_intro_01: {
      id: 'romance_widow_intro_01',
      speaker: 'Narrator',
      body:
        '"It will burn off before midday," she says, without turning, in a voice that ' +
        'suggests she had known you were there for some time. "Most things do, if you let ' +
        'them." She gestures, not quite an invitation, toward the other end of the bench — ' +
        'an offer made so lightly it could be refused without either of you remarking on it.',
      choices: [
        {
          text: 'Sit, and watch the mist with her in silence.',
          effects: [],
          goto: 'romance_widow_intro_end',
        },
        {
          text: 'Remark that the garden looks half-finished in this light, like a sketch.',
          effects: [],
          goto: 'romance_widow_intro_end',
        },
      ],
    },
    romance_widow_intro_end: {
      id: 'romance_widow_intro_end',
      speaker: 'Narrator',
      body:
        'She receives whatever you say with the faint, private agreement of someone who ' +
        'has already thought the same thing and decided not to say it aloud. By the time ' +
        'the mist does burn off, the letter beside her is still unfinished, and she seems, ' +
        'for the moment, in no hurry to return to it.',
    },
  },
};
