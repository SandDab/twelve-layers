import type { Scene } from '../../engine/scene';

// M7 Tanabata: the romance spotlight (GAME_DESIGN.md §9). Guests tie
// wishes to the garden bamboo for the one night the weaving star and the
// herdsman star cross the river of heaven. One choice surfaces standing
// gossip directly: it only appears if the player's reputation with the
// old-name houses has already soured.

export const m7Tanabata: Scene = {
  id: 'm7_tanabata_01',
  title: 'Tanabata',
  startNode: 'm7_tanabata_00',
  nodes: {
    m7_tanabata_00: {
      id: 'm7_tanabata_00',
      speaker: 'Narrator',
      body:
        'On the seventh night the household strings the garden bamboo with ' +
        'tanzaku, paper strips in five colors, each carrying a wish for ' +
        'skill in some art. By tradition, the weaving star and the herdsman ' +
        'star cross the river of heaven only this one night a year, and for ' +
        'one evening at least, half the capital writes as though someone ' +
        'might actually be reading.',
      next: 'm7_tanabata_01',
    },

    m7_tanabata_01: {
      id: 'm7_tanabata_01',
      speaker: 'Narrator',
      body:
        'A tray of blank tanzaku is passed to you, the colors already ' +
        'sorted by rank and station, more or less.',
      choices: [
        {
          text:
            '[Rank 15] Tie your tanzaku beside the cluster already hung by the regent\'s household, matching their colors and their height on the branch.',
          check: { attr: 'rank', min: 15 },
          themeTags: ['alignment'],
          effects: [
            { kind: 'resource', res: 'tokimeki', delta: 2 },
            { kind: 'favor', npc: 'regent', delta: 1 },
            {
              kind: 'gossip',
              tag: 'matched_the_regents_colors',
              factionDeltas: { rivalHouses: -1 },
              delayMonths: 1,
            },
          ],
          goto: 'm7_tanabata_02a',
        },
        {
          text: 'Write a private wish, fold it twice, and tie it low among the leaves, where it will not be read aloud.',
          themeTags: ['restraint'],
          effects: [
            { kind: 'resource', res: 'composure', delta: 5 },
            { kind: 'resource', res: 'tokimeki', delta: -2 },
          ],
          goto: 'm7_tanabata_02b',
        },
        {
          text:
            '[Taste 20] Write your wish in the old seven-line form, the one most guests have shortened to a single couplet for fashion\'s sake this year.',
          check: { attr: 'taste', min: 20 },
          themeTags: ['principle'],
          effects: [
            { kind: 'attr', attr: 'taste', delta: 2 },
            { kind: 'resource', res: 'tokimeki', delta: 4 },
            {
              kind: 'gossip',
              tag: 'wrote_the_old_form',
              factionDeltas: { rivalHouses: -1 },
              delayMonths: 1,
            },
          ],
          goto: 'm7_tanabata_02c',
        },
        {
          text:
            '[Charisma 20] A younger guest is struggling to reach the higher branches with her tanzaku. Lift her, robes and all, so she can tie it herself.',
          check: { attr: 'charisma', min: 20 },
          themeTags: ['grace'],
          effects: [
            { kind: 'resource', res: 'tokimeki', delta: 6 },
            { kind: 'resource', res: 'composure', delta: -8 },
          ],
          goto: 'm7_tanabata_02d',
        },
        {
          text:
            'A guest mentions, lightly, that your name has been coming up rather often among the old-name households lately, and not always warmly. Laugh it off before the moment settles.',
          ifFactionRep: { faction: 'rivalHouses', max: -5 },
          effects: [
            { kind: 'resource', res: 'tokimeki', delta: 2 },
            {
              kind: 'gossip',
              tag: 'laughed_off_the_rumor',
              factionDeltas: { rivalHouses: 1 },
              delayMonths: 1,
            },
          ],
          goto: 'm7_tanabata_02e',
        },
      ],
    },

    m7_tanabata_02a: {
      id: 'm7_tanabata_02a',
      speaker: 'Narrator',
      body:
        'Your strip settles among theirs as though it had been planned that ' +
        'way, which, by the time anyone asks, it will have been. The ' +
        'arrangement is noted, the way these things are always noted, by ' +
        'people whose work is noticing.',
      next: 'm7_tanabata_end',
    },

    m7_tanabata_02b: {
      id: 'm7_tanabata_02b',
      speaker: 'Narrator',
      body:
        'No one reads it. No one asks. The wish, whatever it was, stays ' +
        'exactly as private as you meant it to, which is its own kind of ' +
        'festival.',
      next: 'm7_tanabata_end',
    },

    m7_tanabata_02c: {
      id: 'm7_tanabata_02c',
      speaker: 'Narrator',
      body:
        'It takes longer to write, and longer still to read, and by the ' +
        'second line a small knot of younger guests has stopped to watch, ' +
        'with the particular patience of people deciding whether to be ' +
        'impressed or amused. By the seventh line, most of them have ' +
        'decided. Not all of them decided kindly.',
      next: 'm7_tanabata_end',
    },

    m7_tanabata_02d: {
      id: 'm7_tanabata_02d',
      speaker: 'Narrator',
      body:
        'She ties her wish with both hands and a great deal of ' +
        'concentration, and thanks you twice, the second time more quietly ' +
        'than the first. Your sleeves are creased for the rest of the ' +
        'evening, and you find, somewhat to your surprise, that you do not ' +
        'mind.',
      next: 'm7_tanabata_end',
    },

    m7_tanabata_02e: {
      id: 'm7_tanabata_02e',
      speaker: 'Narrator',
      body:
        'Your laugh lands easily enough, and the guest laughs with you, ' +
        'relieved, the way people are when a thing they were not sure how ' +
        'to raise turns out not to matter. Whether it actually stops ' +
        'mattering is a separate question.',
      next: 'm7_tanabata_end',
    },

    m7_tanabata_end: {
      id: 'm7_tanabata_end',
      speaker: 'Narrator',
      body:
        'By full dark the bamboo is heavy with paper, color on color, and ' +
        'somewhere across the river of stars two lovers manage, by ' +
        'tradition, to meet for exactly one night. Down in the garden, ' +
        'rather more letters than usual seem to be changing hands, folded ' +
        'small, addressed in careful brushwork, the kind that takes all ' +
        'week to answer properly.',
    },
  },
};
