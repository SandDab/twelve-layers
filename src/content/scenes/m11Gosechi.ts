import type { Scene } from '../../engine/scene';

// M11 Gosechi Dances: the year's last anchor event before the jimoku
// (GAME_DESIGN.md §9). Four young women of good family dance before the
// throne over three nights; a seat in the line is itself a kind of
// announcement. The choices here carry the full kanzashi theme-tag
// coverage for the year's final anchor event.

export const m11Gosechi: Scene = {
  id: 'm11_gosechi_01',
  title: 'Gosechi Dances',
  startNode: 'm11_gosechi_00',
  nodes: {
    m11_gosechi_00: {
      id: 'm11_gosechi_00',
      speaker: 'Narrator',
      body:
        'For three nights at the end of the year, four young women of good ' +
        'family dance before the throne, the Gosechi performers, chosen ' +
        'months in advance and rehearsed since. A seat has opened in the ' +
        'line, late, the way these things sometimes do, and it has been ' +
        'offered to you.',
      next: 'm11_gosechi_01',
    },

    m11_gosechi_01: {
      id: 'm11_gosechi_01',
      speaker: 'Narrator',
      body:
        'The other three dancers are already paired off by family connection, ' +
        'rank, or both. How you carry the fourth place is, by the time the ' +
        'dance ends, going to be the most-discussed thing about it.',
      choices: [
        {
          text:
            '[Rank 15] Take the position the choreographer assigns without comment, the one that keeps you a half-step behind the others all evening.',
          check: { attr: 'rank', min: 15 },
          themeTags: ['alignment'],
          effects: [
            { kind: 'resource', res: 'tokimeki', delta: 2 },
            { kind: 'favor', npc: 'regent', delta: 1 },
            {
              kind: 'gossip',
              tag: 'danced_the_assigned_place',
              factionDeltas: { rivalHouses: -1 },
              delayMonths: 1,
            },
          ],
          goto: 'm11_gosechi_02a',
        },
        {
          text:
            'Dance the steps exactly as rehearsed, no more and no less, and let the evening belong to the three who expected it to.',
          themeTags: ['restraint'],
          effects: [
            { kind: 'resource', res: 'composure', delta: 5 },
            { kind: 'resource', res: 'tokimeki', delta: -2 },
          ],
          goto: 'm11_gosechi_02b',
        },
        {
          text:
            '[Taste 20] Adjust your sleeve-timing on the final turn, half a beat off the others, in the older style the choreographer only mentioned once and assumed no one would remember.',
          check: { attr: 'taste', min: 20 },
          themeTags: ['principle'],
          effects: [
            { kind: 'attr', attr: 'taste', delta: 2 },
            { kind: 'resource', res: 'tokimeki', delta: 4 },
            {
              kind: 'gossip',
              tag: 'danced_the_older_form',
              factionDeltas: { rivalHouses: -1 },
              delayMonths: 1,
            },
          ],
          goto: 'm11_gosechi_02c',
        },
        {
          text:
            '[Charisma 20] One of the other dancers misses her cue and freezes. Step into the gap a beat early, so the line never visibly breaks.',
          check: { attr: 'charisma', min: 20 },
          themeTags: ['grace'],
          effects: [
            { kind: 'resource', res: 'tokimeki', delta: 6 },
            { kind: 'resource', res: 'composure', delta: -8 },
          ],
          goto: 'm11_gosechi_02d',
        },
      ],
    },

    m11_gosechi_02a: {
      id: 'm11_gosechi_02a',
      speaker: 'Narrator',
      body:
        'The dance reads, from the dais, as exactly what it was rehearsed to ' +
        'be, four places in their expected order. Afterward, the regent\'s ' +
        'household sends the customary note of thanks, addressed correctly, ' +
        'which this year feels like more than custom.',
      next: 'm11_gosechi_end',
    },

    m11_gosechi_02b: {
      id: 'm11_gosechi_02b',
      speaker: 'Narrator',
      body:
        'Nothing about your dancing is mentioned afterward, by anyone, which ' +
        'after three nights of being watched is its own kind of relief. The ' +
        'other three dancers, whose evenings were rather more discussed, do ' +
        'not seem to begrudge you the quiet.',
      next: 'm11_gosechi_end',
    },

    m11_gosechi_02c: {
      id: 'm11_gosechi_02c',
      speaker: 'Narrator',
      body:
        'The half-beat lands exactly where you placed it, and exactly one ' +
        'person in the hall, an elderly attendant near the dais, turns to ' +
        'look at you directly for the rest of the dance. Whoever taught her ' +
        'the older form taught it to you as well, it seems, and she has ' +
        'noticed.',
      next: 'm11_gosechi_end',
    },

    m11_gosechi_02d: {
      id: 'm11_gosechi_02d',
      speaker: 'Narrator',
      body:
        'The line does not break. The dancer beside you recovers two beats ' +
        'later and finishes pale but upright, and says nothing about it ' +
        'afterward except, quietly, near the door, where only you hear it, ' +
        'thank you.',
      next: 'm11_gosechi_end',
    },

    m11_gosechi_end: {
      id: 'm11_gosechi_end',
      speaker: 'Narrator',
      body:
        'The dances end, the dais empties, and the year, for all practical ' +
        'purposes, ends with them. What remains is the promotions list, ' +
        'already drafted, already mostly decided, waiting for the New Year ' +
        'to be read aloud.',
    },
  },
};
