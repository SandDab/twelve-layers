import type { Scene } from '../../engine/scene';

// Behind the Curtain (stage 4) for The Sharp Brush (GAME_DESIGN.md §6).
// The "banter route": Rhetoric-gated, and merciless about a failed
// exchange. A clever win is still a win that gets repeated at other
// people's expense.

export const romanceSharpBrushCurtain: Scene = {
  id: 'romance_sharp_brush_curtain',
  title: 'Behind the Kichō: The Sharp Brush',
  startNode: 'rsb_curtain_00',
  nodes: {
    rsb_curtain_00: {
      id: 'rsb_curtain_00',
      speaker: 'Narrator',
      body:
        'No screen this time, only a curtain of state, half drawn. The Sharp ' +
        'Brush sits with an inkstone already uncapped, as though the conversation ' +
        'were a document she intends to file.',
      next: 'rsb_curtain_01',
    },

    rsb_curtain_01: {
      id: 'rsb_curtain_01',
      speaker: 'The Sharp Brush',
      body:
        'Your last verse borrowed a turn of phrase from the Junior Counselor\'s ' +
        'spring poem, she says, not looking up from the inkstone. Badly. Tell me ' +
        'you knew that, at least.',
      choices: [
        {
          text:
            '[Rhetoric 35] Admit it freely, and note that you improved the line considerably.',
          check: { attr: 'rhetoric', min: 35 },
          effects: [
            { kind: 'resource', res: 'tokimeki', delta: 8 },
            { kind: 'favor', npc: 'sharpBrush', delta: 2 },
            {
              kind: 'gossip',
              tag: 'sharp_brush_favorite',
              factionDeltas: { rivalHouses: -1 },
              delayMonths: 1,
            },
          ],
          goto: 'rsb_curtain_02a',
        },
        {
          text: 'Apologize, and ask which line of the Counselor\'s she would have used instead.',
          effects: [
            { kind: 'resource', res: 'tokimeki', delta: 4 },
            { kind: 'favor', npc: 'sharpBrush', delta: 1 },
          ],
          goto: 'rsb_curtain_02b',
        },
        {
          text: 'Say nothing, and let her enjoy the point a little longer.',
          effects: [{ kind: 'resource', res: 'composure', delta: 5 }],
          goto: 'rsb_curtain_02c',
        },
      ],
    },

    rsb_curtain_02a: {
      id: 'rsb_curtain_02a',
      speaker: 'Narrator',
      body:
        'She sets the brush down, finally, and looks at you properly for the ' +
        'first time. Considerably, she repeats, as though tasting the word. By ' +
        'tomorrow the whole west wing will have heard you say so, and most of ' +
        'them will agree with you out of spite for the Counselor.',
      choices: [
        {
          text: 'Take your leave before she changes her mind.',
          effects: [],
          goto: 'rsb_curtain_end',
        },
      ],
    },

    rsb_curtain_02b: {
      id: 'rsb_curtain_02b',
      speaker: 'Narrator',
      body:
        'She names three lines, picks apart each one, and by the end seems to ' +
        'have forgotten she was ever annoyed. It is, you suspect, the closest ' +
        'thing to forgiveness she offers anyone.',
      choices: [
        {
          text: 'Take your leave while the mood is good.',
          effects: [],
          goto: 'rsb_curtain_end',
        },
      ],
    },

    rsb_curtain_02c: {
      id: 'rsb_curtain_02c',
      speaker: 'Narrator',
      body:
        'She lets the silence sit until it has done its work, then returns to ' +
        'the inkstone without further comment. Whatever she intended to write ' +
        'down, she does not show you.',
      choices: [
        {
          text: 'Take your leave.',
          effects: [],
          goto: 'rsb_curtain_end',
        },
      ],
    },

    rsb_curtain_end: {
      id: 'rsb_curtain_end',
      speaker: 'Narrator',
      body:
        'Outside, the curtain of state swings back into place behind you, and ' +
        'somewhere down the corridor someone is already asking what was said.',
    },
  },
};
