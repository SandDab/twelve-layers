import type { Scene } from '../../engine/scene';

// M4 Aoi Matsuri: the carriage-place dispute (GAME_DESIGN.md §9, CLAUDE.md
// reference scene). Every option here is viable, and every option costs
// someone, including the player. The four themeTag choices each genuinely
// embody their kanzashi theme and pay for it in their own way; the two
// [Background] options color the outcome without trivially winning it.

export const m4AoiCarriage: Scene = {
  id: 'm4_aoi_carriage_01',
  title: 'Aoi Matsuri: The Carriage-Place Dispute',
  startNode: 'm4_aoi_carriage_00',
  nodes: {
    m4_aoi_carriage_00: {
      id: 'm4_aoi_carriage_00',
      speaker: 'Narrator',
      body:
        'The Kamo procession crawls past Ichijo Avenue under banners of aoi ' +
        'leaves, and every carriage along the route staked its claim to a ' +
        'viewing place days ago. Yours, modest and well placed near a stand ' +
        'of willows, draws a second carriage alongside it: black lacquer, ' +
        'violet cording, a crest from the regent\'s retinue. An attendant ' +
        'steps down, bows, and explains, with great courtesy, that this spot ' +
        'was promised to his mistress last year, and every year before that.',
      next: 'm4_aoi_carriage_01',
    },

    m4_aoi_carriage_01: {
      id: 'm4_aoi_carriage_01',
      speaker: 'Narrator',
      body: 'The attendant waits, politely, for your answer.',
      choices: [
        {
          text:
            '[Rank 20] Recognize the claim. Draw your carriage back, and send word that you yield the place gladly to a household whose precedence is beyond question.',
          check: { attr: 'rank', min: 20 },
          themeTags: ['alignment'],
          effects: [
            { kind: 'resource', res: 'tokimeki', delta: 2 },
            { kind: 'favor', npc: 'regent', delta: 1 },
            {
              kind: 'gossip',
              tag: 'yielded_to_the_regents_house',
              factionDeltas: { rivalHouses: -1 },
              delayMonths: 1,
            },
          ],
          goto: 'm4_aoi_carriage_02a',
        },
        {
          text:
            'You could press the matter. Your party\'s seal is on the placement roll, and you arrived first. Let it go instead, and have the cushions moved without a word.',
          themeTags: ['restraint'],
          effects: [
            { kind: 'resource', res: 'composure', delta: 5 },
            { kind: 'resource', res: 'tokimeki', delta: -2 },
          ],
          goto: 'm4_aoi_carriage_02b',
        },
        {
          text:
            '[Taste 25] Note, mildly, that the willows are this year\'s correct viewing point precisely because the place was set by seasonal precedent, not by retinue, and that the roll reflects this.',
          check: { attr: 'taste', min: 25 },
          themeTags: ['principle'],
          effects: [
            { kind: 'attr', attr: 'taste', delta: 2 },
            { kind: 'resource', res: 'tokimeki', delta: 4 },
            {
              kind: 'gossip',
              tag: 'corrected_the_regents_house',
              factionDeltas: { regent: -1 },
              delayMonths: 2,
            },
          ],
          goto: 'm4_aoi_carriage_02c',
        },
        {
          text:
            '[Charisma 25] Before the attendant finishes speaking, offer the place yourself, warmly, and admire the lacquer of his mistress\'s carriage as you step down.',
          check: { attr: 'charisma', min: 25 },
          themeTags: ['grace'],
          effects: [
            { kind: 'resource', res: 'tokimeki', delta: 6 },
            { kind: 'favor', npc: 'regent', delta: 1 },
            { kind: 'resource', res: 'koku', delta: -15 },
          ],
          goto: 'm4_aoi_carriage_02d',
        },
        {
          text:
            '[Background: The Old Name] Say only your family name, and wait. You do not need to raise your voice for a name like yours along the Kamo road.',
          ifClass: 'old_name',
          effects: [
            { kind: 'resource', res: 'tokimeki', delta: 3 },
            {
              kind: 'gossip',
              tag: 'traded_on_the_old_name',
              factionDeltas: { imperial: -1 },
              delayMonths: 2,
            },
          ],
          goto: 'm4_aoi_carriage_02e',
        },
        {
          text:
            '[Background: The Governor\'s Heir] Offer, quietly, to cover the cost of moving both parties further down the avenue, at your household\'s expense.',
          ifClass: 'governors_heir',
          effects: [
            { kind: 'resource', res: 'koku', delta: -30 },
            { kind: 'favor', npc: 'regent', delta: 1 },
            {
              kind: 'gossip',
              tag: 'bought_the_peace_at_aoi',
              factionDeltas: { rivalHouses: -1 },
              delayMonths: 1,
            },
          ],
          goto: 'm4_aoi_carriage_02f',
        },
      ],
    },

    m4_aoi_carriage_02a: {
      id: 'm4_aoi_carriage_02a',
      speaker: 'Narrator',
      body:
        'Your driver backs the ox without complaint, and the violet-corded ' +
        'carriage takes the willows as though it had always been there. ' +
        'Word of the exchange travels faster than the procession itself: by ' +
        'evening, the provincial families along the avenue have decided, ' +
        'collectively, that you know which way the wind blows, and like you ' +
        'rather less for it.',
      next: 'm4_aoi_carriage_end',
    },

    m4_aoi_carriage_02b: {
      id: 'm4_aoi_carriage_02b',
      speaker: 'Narrator',
      body:
        'Your attendants fold the cushions and step back without complaint, ' +
        'and the matter ends before it properly begins. No one raises an ' +
        'eyebrow. No one, for that matter, raises anything else either, and ' +
        'by the time the procession passes, no one quite remembers you were ' +
        'there at all.',
      next: 'm4_aoi_carriage_end',
    },

    m4_aoi_carriage_02c: {
      id: 'm4_aoi_carriage_02c',
      speaker: 'Narrator',
      body:
        'The attendant\'s bow does not change, but something behind his eyes ' +
        'does. He withdraws to confer, and after a long minute the ' +
        'violet-corded carriage is drawn to the next place down, with as ' +
        'much dignity as a retreat can manage. You have won the willows, and ' +
        'you have also, you suspect, been noted by someone who does not ' +
        'forget being corrected.',
      next: 'm4_aoi_carriage_end',
    },

    m4_aoi_carriage_02d: {
      id: 'm4_aoi_carriage_02d',
      speaker: 'Narrator',
      body:
        'Your grace costs you a small selection of incense, sent ahead that ' +
        'evening as a parting courtesy, the kind of gesture that is never ' +
        'quite required and never quite optional either. The regent\'s lady, ' +
        'for her part, sends back a note remarking on your manners, in the ' +
        'sort of handwriting that gets shown to other people.',
      next: 'm4_aoi_carriage_end',
    },

    m4_aoi_carriage_02e: {
      id: 'm4_aoi_carriage_02e',
      speaker: 'Narrator',
      body:
        'You say only your family name. The attendant\'s bow deepens by a ' +
        'fraction, an old reflex from an older education, and he withdraws ' +
        'without further argument. It costs you nothing today. Whether it ' +
        'costs you anything tomorrow depends on who else heard it, and how ' +
        'they felt about hearing it.',
      next: 'm4_aoi_carriage_end',
    },

    m4_aoi_carriage_02f: {
      id: 'm4_aoi_carriage_02f',
      speaker: 'Narrator',
      body:
        'Koku changes hands, discreetly, through an intermediary who makes it ' +
        'look like nothing at all. Both parties move, the matter dissolves, ' +
        'and you have spent enough silver that several people along the ' +
        'avenue could probably guess at the amount, and will, before the day ' +
        'is out, guess rather higher.',
      next: 'm4_aoi_carriage_end',
    },

    m4_aoi_carriage_end: {
      id: 'm4_aoi_carriage_end',
      speaker: 'Narrator',
      body:
        'The procession passes at last, aoi leaves and ox-drawn lacquer and ' +
        'the long unhurried rhythm of a festival that has not changed its ' +
        'order of march in two hundred years. Whatever was decided at the ' +
        'railing this morning, it was decided quietly, the way most things ' +
        'are, and it will be remembered for exactly as long as it is useful ' +
        'to someone.',
    },
  },
};
