import type { Scene } from '../../engine/scene';

// Kanzashi delivery scenes (GAME_DESIGN.md §8). Each fires the month
// after the player's themed choice during a kanzashi's assigned month —
// "a messenger, a wrapped gift, sometimes an anonymous sender." The
// kanzashi effect is applied on acceptance; ownership persists across
// years, the equip slot is in the Household screen.

export const kanzashiKobaiDelivery: Scene = {
  id: 'kanzashi_kobai_delivery',
  title: 'A Sprig of Red Plum',
  startNode: 'kanzashi_kobai_00',
  nodes: {
    kanzashi_kobai_00: {
      id: 'kanzashi_kobai_00',
      speaker: 'Narrator',
      body:
        'A page leaves a folded paper at your gate before dawn — no crest, no name. ' +
        'Inside, wrapped in plain washi, lies a hairpin: a sprig of red plum worked ' +
        'in crimson lacquer, the petals still sharp at the edges as though newly cast.',
      next: 'kanzashi_kobai_01',
    },
    kanzashi_kobai_01: {
      id: 'kanzashi_kobai_01',
      speaker: 'Narrator',
      body:
        'There is no verse, no signature — only the plum itself, the flower that ' +
        'opens while snow is still on the branch. Someone, it seems, was watching ' +
        'when you said nothing at all.',
      choices: [
        {
          text: 'Pin the plum into your hair.',
          effects: [{ kind: 'kanzashi', id: 'kobai' }],
          goto: 'kanzashi_kobai_end',
        },
      ],
    },
    kanzashi_kobai_end: {
      id: 'kanzashi_kobai_end',
      speaker: 'Narrator',
      body: 'The lacquer catches the light, cold and bright. You keep the wrapping, just in case.',
    },
  },
};

export const kanzashiTsukikageDelivery: Scene = {
  id: 'kanzashi_tsukikage_delivery',
  title: 'A Pin of Moonlight',
  startNode: 'kanzashi_tsukikage_00',
  nodes: {
    kanzashi_tsukikage_00: {
      id: 'kanzashi_tsukikage_00',
      speaker: 'Narrator',
      body:
        'An attendant from another household passes you in a corridor and presses ' +
        'a small lacquer box into your sleeve without breaking stride. Inside: a ' +
        'hairpin of silver and pearl, cool as the moon on water.',
      next: 'kanzashi_tsukikage_01',
    },
    kanzashi_tsukikage_01: {
      id: 'kanzashi_tsukikage_01',
      speaker: 'Narrator',
      body:
        'No note accompanies it — only the memory of the moment everyone else leaned ' +
        'forward, and you alone did not. Whoever sent this noticed the stillness, ' +
        'not the silence.',
      choices: [
        {
          text: 'Wear the moonlight pin.',
          effects: [{ kind: 'kanzashi', id: 'tsukikage' }],
          goto: 'kanzashi_tsukikage_end',
        },
      ],
    },
    kanzashi_tsukikage_end: {
      id: 'kanzashi_tsukikage_end',
      speaker: 'Narrator',
      body: 'It sits light against your hair, barely there until the light turns.',
    },
  },
};

export const kanzashiFujiDelivery: Scene = {
  id: 'kanzashi_fuji_delivery',
  title: 'A Spray of Wisteria',
  startNode: 'kanzashi_fuji_00',
  nodes: {
    kanzashi_fuji_00: {
      id: 'kanzashi_fuji_00',
      speaker: 'Narrator',
      body:
        'A liveried servant in violet and gold delivers a lacquered case to your ' +
        'household, bowing rather lower than your rank strictly requires. Within: a ' +
        'kanzashi shaped as a spray of wisteria, gold wire threaded through violet enamel.',
      next: 'kanzashi_fuji_01',
    },
    kanzashi_fuji_01: {
      id: 'kanzashi_fuji_01',
      speaker: 'Narrator',
      body:
        'The card bears no name, only a house mon you recognize at once — one of the ' +
        'great old families. It seems your alignments have been noted, and approved.',
      choices: [
        {
          text: 'Accept the wisteria.',
          effects: [{ kind: 'kanzashi', id: 'fuji' }],
          goto: 'kanzashi_fuji_end',
        },
      ],
    },
    kanzashi_fuji_end: {
      id: 'kanzashi_fuji_end',
      speaker: 'Narrator',
      body: 'You send the servant back with the customary thanks, and nothing more.',
    },
  },
};

export const kanzashiSangoDelivery: Scene = {
  id: 'kanzashi_sango_delivery',
  title: 'A Comb of Coral',
  startNode: 'kanzashi_sango_00',
  nodes: {
    kanzashi_sango_00: {
      id: 'kanzashi_sango_00',
      speaker: 'Narrator',
      body:
        'A folded letter arrives, unsigned, tucked around a hairpin tipped in coral — ' +
        'red as a winter sunrise. The hand is careful, a little uneven, as though ' +
        'written and rewritten before it was sent.',
      next: 'kanzashi_sango_01',
    },
    kanzashi_sango_01: {
      id: 'kanzashi_sango_01',
      speaker: 'Narrator',
      body:
        'The letter says only that the sender admired how gracefully you let the ' +
        'moment pass without reaching for it — and that they hoped you would accept ' +
        'this, and ask for nothing in return.',
      choices: [
        {
          text: 'Keep the coral comb.',
          effects: [{ kind: 'kanzashi', id: 'sango' }],
          goto: 'kanzashi_sango_end',
        },
      ],
    },
    kanzashi_sango_end: {
      id: 'kanzashi_sango_end',
      speaker: 'Narrator',
      body: 'You write no reply. Somehow, that feels like the correct answer.',
    },
  },
};
