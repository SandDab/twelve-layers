import type { Scene } from '../../engine/scene';

// M8 Tsukimi (Moon-Viewing): Taste showcase, GAME_DESIGN.md §9. The
// ikebana performance is the M3 "checked event performance" reference;
// the moongazing mini-scene and full social staging arrive in M5/M6
// alongside the rest of the anchor-event content.

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
          goto: 'm8_tsukimi_end',
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
          goto: 'm8_tsukimi_end',
        },
      ],
    },

    m8_tsukimi_end: {
      id: 'm8_tsukimi_end',
      speaker: 'Narrator',
      body:
        'The moon clears the garden wall, full and a little orange with autumn ' +
        'haze. Conversation softens into the kind that matters less for what is ' +
        'said than for who is near enough to hear it.',
    },
  },
};
