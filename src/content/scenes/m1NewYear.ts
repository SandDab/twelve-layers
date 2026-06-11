import type { Scene } from '../../engine/scene';

// M1 test content: the New Year Court Audience (GAME_DESIGN.md §9).
// Tutorial scene — introduces checks, Rank gates, and first faction
// contacts. The Taste option seeds a ripple that echoes at the Aoi
// Matsuri (month 4).

export const m1NewYear: Scene = {
  id: 'm1_new_year',
  title: 'New Year Court Audience',
  startNode: 'm1_newyear_00',
  nodes: {
    m1_newyear_00: {
      id: 'm1_newyear_00',
      speaker: 'Narrator',
      body:
        'The Demon Gate stands open before dawn, lanterns guttering in the cold. ' +
        'Carriages of the great houses crowd the avenue; yours is plainer than most, ' +
        'but it is yours. Inside, the assembled court waits to be seen — and to see ' +
        'who, this year, is worth watching.',
      next: 'm1_newyear_01',
    },

    m1_newyear_01: {
      id: 'm1_newyear_01',
      speaker: 'Chamberlain',
      body:
        'A chamberlain reads the roll of provincial families. Your name is called ' +
        'a beat late, as though he had to find it on the page. Every eye that bothers ' +
        'to look, looks now.',
      choices: [
        {
          text: '[Charisma 15] Step forward smiling, and greet the chamberlain by name.',
          check: { attr: 'charisma', min: 15 },
          effects: [
            { kind: 'attr', attr: 'charisma', delta: 2 },
            { kind: 'resource', res: 'tokimeki', delta: 5 },
          ],
          goto: 'm1_newyear_02a',
        },
        {
          text: '[Rhetoric 15] Recite your father’s titles and provinces in full, precisely as protocol demands.',
          check: { attr: 'rhetoric', min: 15 },
          effects: [
            { kind: 'attr', attr: 'rhetoric', delta: 2 },
            { kind: 'favor', npc: 'regent', delta: 1 },
          ],
          goto: 'm1_newyear_02b',
        },
        {
          text: '[Taste 15] Say nothing. Let the layered colors at your collar speak for you.',
          check: { attr: 'taste', min: 15 },
          effects: [
            { kind: 'attr', attr: 'taste', delta: 2 },
            { kind: 'resource', res: 'tokimeki', delta: 3 },
            { kind: 'flag', flag: 'wore_kobai_at_new_year', value: true },
            { kind: 'ripple', triggerMonth: 4, sceneId: 'm4_newyear_echo_01' },
          ],
          goto: 'm1_newyear_02c',
        },
        {
          text: 'Bow quietly and take your place. No one expects much from a governor’s child.',
          effects: [{ kind: 'resource', res: 'composure', delta: 5 }],
          goto: 'm1_newyear_02d',
        },
        {
          text:
            '[Background: The Old Name] Say nothing of titles. Let the chamberlain place the name himself.',
          ifClass: 'old_name',
          effects: [
            { kind: 'attr', attr: 'allure', delta: 1 },
            { kind: 'favor', npc: 'chamberlain', delta: 1 },
          ],
          goto: 'm1_newyear_02e',
        },
      ],
    },

    m1_newyear_02a: {
      id: 'm1_newyear_02a',
      speaker: 'Narrator',
      body:
        'The chamberlain blinks, then inclines his head — a fraction more than ' +
        'protocol requires. A ripple of murmurs follows you to your place. ' +
        'Being noticed is not the same as being approved of, but it is a start.',
      next: 'm1_newyear_03',
    },

    m1_newyear_02b: {
      id: 'm1_newyear_02b',
      speaker: 'Narrator',
      body:
        'You deliver the litany of titles without a stumble. A secretary near the ' +
        'regent’s dais glances up, marks something on a tablet, and does not look ' +
        'at you again. Whatever it was, it has been recorded.',
      next: 'm1_newyear_03',
    },

    m1_newyear_02c: {
      id: 'm1_newyear_02c',
      speaker: 'Narrator',
      body:
        'You say nothing at all. The kōbai layering at your sleeve catches the ' +
        'lamplight as you bow — red plum over deep crimson, correct to the day. ' +
        'Someone in the second row leans toward a companion and whispers behind a fan.',
      next: 'm1_newyear_03',
    },

    m1_newyear_02d: {
      id: 'm1_newyear_02d',
      speaker: 'Narrator',
      body:
        'You bow and step back into the crowd, unremarkable. No one whispers about ' +
        'you. There are worse ways to begin a year — and worse ways to end one.',
      next: 'm1_newyear_03',
    },

    m1_newyear_02e: {
      id: 'm1_newyear_02e',
      speaker: 'Narrator',
      body:
        'You say nothing. The chamberlain, gray-haired and slow to read the roll these ' +
        'days, looks up at the crest on your sleeve before he reaches your name — and ' +
        'his pause is not the pause of a man placing a stranger. Whatever else has ' +
        'changed, the name is still read in this room.',
      next: 'm1_newyear_03',
    },

    m1_newyear_03: {
      id: 'm1_newyear_03',
      speaker: 'Master of Ceremonies',
      body:
        'As the audience closes, the Master of Ceremonies invites any newcomer ' +
        'who wishes it to offer a verse for the New Year scroll — read aloud, and ' +
        'kept.',
      choices: [
        {
          text: '[Rhetoric 40] Step forward and offer a verse for the scroll.',
          check: { attr: 'rhetoric', min: 40 },
          effects: [
            { kind: 'attr', attr: 'rhetoric', delta: 3 },
            { kind: 'resource', res: 'tokimeki', delta: 8 },
            { kind: 'favor', npc: 'sharpBrush', delta: 1 },
          ],
          goto: 'm1_newyear_end',
        },
        {
          text: 'Decline with a bow. There will be other scrolls.',
          effects: [{ kind: 'resource', res: 'composure', delta: 5 }],
          goto: 'm1_newyear_end',
        },
      ],
    },

    m1_newyear_end: {
      id: 'm1_newyear_end',
      speaker: 'Narrator',
      body:
        'The first audience of the year ends as it began: with a great deal of ' +
        'silk, and very little said directly. Outside, your carriage waits in the ' +
        'cold. The year has properly begun.',
    },
  },
};
