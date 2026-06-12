import type { Scene } from '../../engine/scene';

// M8 Tsukimi (Moon-Viewing): Taste showcase, GAME_DESIGN.md §9. The
// ikebana performance is the M3 "checked event performance" reference;
// the moongazing beat below (GAME_DESIGN.md §10: "more scene than game")
// carries the four kanzashi themeTags for this anchor event.

export const m8Tsukimi: Scene = {
  id: 'm8_tsukimi_01',
  title: 'Tsukimi Moon-Viewing',
  startNode: 'm8_tsukimi_00',
  nodes: {
    m8_tsukimi_00: {
      id: 'm8_tsukimi_00',
      speaker: 'Narrator',
      body:
        'Lanterns are unlit tonight, by custom, the better to see the moon rise ' +
        'over the garden lake. The hostess asks you to set an arrangement for ' +
        'the alcove before the other guests arrive, a small thing, and a ' +
        'public one.',
      next: 'm8_tsukimi_01',
    },

    m8_tsukimi_01: {
      id: 'm8_tsukimi_01',
      speaker: 'Narrator',
      body: 'Choose your stems for the alcove arrangement.',
      ikebana: { threshold: 50, successNode: 'm8_tsukimi_02a', failNode: 'm8_tsukimi_02b' },
    },

    m8_tsukimi_02a: {
      id: 'm8_tsukimi_02a',
      speaker: 'Narrator',
      body:
        'A guest pauses at the alcove on her way to the veranda, then a second, ' +
        'then a third. By the time the moon clears the pines, your arrangement ' +
        'has become part of the evening’s conversation, and so, by extension, ' +
        'have you.',
      choices: [
        {
          text: 'Take your place among the guests.',
          effects: [{ kind: 'resource', res: 'tokimeki', delta: 4 }],
          goto: 'm8_tsukimi_03',
        },
      ],
    },

    m8_tsukimi_02b: {
      id: 'm8_tsukimi_02b',
      speaker: 'Narrator',
      body:
        'The arrangement leans, slightly, and no one mentions it, which is how ' +
        'you know it has been noticed. A lady near the door murmurs something ' +
        'about provincial gardens to her companion, behind a fan that does not ' +
        'quite hide her smile.',
      choices: [
        {
          text: 'Take your place among the guests.',
          effects: [
            {
              kind: 'gossip',
              tag: 'clumsy_ikebana',
              factionDeltas: { rivalHouses: -1 },
              delayMonths: 1,
            },
          ],
          goto: 'm8_tsukimi_03',
        },
      ],
    },

    m8_tsukimi_03: {
      id: 'm8_tsukimi_03',
      speaker: 'Narrator',
      body:
        'For a while no one says anything. The moon climbs clear of the ' +
        'garden wall, full and a little orange with the last of the autumn ' +
        'haze, and the whole veranda watches it without quite admitting to ' +
        'watching.',
      choices: [
        {
          text:
            '[Rank 15] Murmur agreement with a senior lady\'s remark that this is the finest viewing in three years.',
          check: { attr: 'rank', min: 15 },
          themeTags: ['alignment'],
          effects: [
            { kind: 'resource', res: 'tokimeki', delta: 2 },
            { kind: 'favor', npc: 'regent', delta: 1 },
            {
              kind: 'gossip',
              tag: 'seconded_the_seniors_taste',
              factionDeltas: { rivalHouses: -1 },
              delayMonths: 1,
            },
          ],
          goto: 'm8_tsukimi_04a',
        },
        {
          text: 'Say nothing. Let the silence stand; not everything beautiful needs a caption.',
          themeTags: ['restraint'],
          effects: [
            { kind: 'resource', res: 'composure', delta: 5 },
            { kind: 'resource', res: 'tokimeki', delta: -2 },
          ],
          goto: 'm8_tsukimi_04b',
        },
        {
          text:
            '[Taste 20] Note, when someone asks, that the moon is in fact one night past full, and that tonight\'s date was chosen for convenience rather than astronomy.',
          check: { attr: 'taste', min: 20 },
          themeTags: ['principle'],
          effects: [
            { kind: 'attr', attr: 'taste', delta: 2 },
            { kind: 'resource', res: 'tokimeki', delta: 4 },
            {
              kind: 'gossip',
              tag: 'corrected_the_viewing_date',
              factionDeltas: { regent: -1 },
              delayMonths: 2,
            },
          ],
          goto: 'm8_tsukimi_04c',
        },
        {
          text: '[Charisma 20] Offer your seat on the veranda to a guest still standing at the rail.',
          check: { attr: 'charisma', min: 20 },
          themeTags: ['grace'],
          effects: [
            { kind: 'resource', res: 'tokimeki', delta: 6 },
            { kind: 'resource', res: 'composure', delta: -8 },
          ],
          goto: 'm8_tsukimi_04d',
        },
      ],
    },

    m8_tsukimi_04a: {
      id: 'm8_tsukimi_04a',
      speaker: 'Narrator',
      body:
        'The senior lady glances toward you, faintly pleased to have her ' +
        'taste seconded by someone whose own taste was, until tonight, ' +
        'unverified. Elsewhere on the veranda, a younger guest notes the ' +
        'exchange and files it away.',
      next: 'm8_tsukimi_end',
    },

    m8_tsukimi_04b: {
      id: 'm8_tsukimi_04b',
      speaker: 'Narrator',
      body:
        'The quiet holds. Somewhere below, water moves over the rocks in ' +
        'the garden stream, and for a while that is the only conversation ' +
        'anyone needs.',
      next: 'm8_tsukimi_end',
    },

    m8_tsukimi_04c: {
      id: 'm8_tsukimi_04c',
      speaker: 'Narrator',
      body:
        'A ripple of soft laughter goes around the veranda, the kind that ' +
        'means you are right and everyone half wishes you had not said so. ' +
        'The hostess\'s smile does not move, which is its own kind of answer.',
      next: 'm8_tsukimi_end',
    },

    m8_tsukimi_04d: {
      id: 'm8_tsukimi_04d',
      speaker: 'Narrator',
      body:
        'The guest startles, then bows, then takes the seat with the ' +
        'particular care of someone deciding not to make a fuss about being ' +
        'grateful. You stand at the rail for the rest of the viewing, and ' +
        'the night air is colder than you expected.',
      next: 'm8_tsukimi_end',
    },

    m8_tsukimi_end: {
      id: 'm8_tsukimi_end',
      speaker: 'Narrator',
      body:
        'Conversation softens into the kind that matters less for what is ' +
        'said than for who is near enough to hear it. By the time the moon ' +
        'is well clear of the wall, most of the garden has stopped looking ' +
        'at it directly, and started, instead, watching each other watch.',
    },
  },
};
