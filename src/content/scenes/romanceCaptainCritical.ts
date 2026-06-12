import type { Scene } from '../../engine/scene';

// The Captain: critical choice (GAME_DESIGN.md §6/§13), stage 3. Unmarked:
// nothing in the text names this as the route's turning point. Welcoming
// him plainly, in front of the household, marries him (envyWeaken marriage
// buff activates on marry: true); the showy reward path closes the route
// with a public ceremony instead, and the quiet path closes it with a
// private word of thanks.

export const romanceCaptainCritical: Scene = {
  id: 'romance_captain_critical',
  title: 'The Disturbance on the Avenue',
  startNode: 'romance_captain_critical_00',
  nodes: {
    romance_captain_critical_00: {
      id: 'romance_captain_critical_00',
      speaker: 'Narrator',
      body:
        'A scuffle breaks out after dark on the avenue below your gate — drunken retainers ' +
        'from two rival households, by the sound of it, more noise than danger, but enough ' +
        'to send your own household into a flurry of shutting doors and dousing lamps. By ' +
        'the time anyone thinks to send for the guard, the guard is already there.',
      next: 'romance_captain_critical_01',
    },
    romance_captain_critical_01: {
      id: 'romance_captain_critical_01',
      speaker: 'Narrator',
      body:
        'He has the street cleared in the time it takes your gatekeeper to find the bar ' +
        'for the door, and posts two of his men at your gate afterward without being ' +
        'asked, "until things settle," as he puts it — already moving on to checking the ' +
        'rest of the street, as if it had not occurred to him that this was anything ' +
        'worth remarking on.',
      choices: [
        {
          text: 'Go out yourself and thank him plainly, in front of your own household.',
          effects: [
            { kind: 'romance', loveInterestId: 'captain', stage: 4, closed: true, marry: true },
          ],
          goto: 'romance_captain_critical_marry',
        },
        {
          text: 'Arrange a formal commendation through proper channels — a reward worthy of the occasion.',
          effects: [
            { kind: 'romance', loveInterestId: 'captain', closed: true },
            {
              kind: 'gossip',
              tag: 'made_a_spectacle_of_the_captains_rescue',
              factionDeltas: { rivalHouses: 1 },
              delayMonths: 1,
            },
          ],
          goto: 'romance_captain_critical_commendation',
        },
        {
          text: 'Send a quiet word of thanks the next morning, and leave it there.',
          effects: [{ kind: 'romance', loveInterestId: 'captain', closed: true }],
          goto: 'romance_captain_critical_quiet',
        },
      ],
    },
    romance_captain_critical_marry: {
      id: 'romance_captain_critical_marry',
      speaker: 'Narrator',
      body:
        'You go out in your night robes, with half the household watching from the ' +
        'doorway, and thank him for it directly — no intermediary, no careful phrasing. He ' +
        'looks briefly, genuinely surprised, then grins for the first time since you\'ve ' +
        'known him and says he\'d have done it for anyone, but he\'s glad it was you. Word ' +
        'gets around the quarter fast, as these things do — and afterward, you notice, ' +
        'the kind of gossip that used to find its way to your gate seems to find ' +
        'somewhere else to go instead.',
    },
    romance_captain_critical_commendation: {
      id: 'romance_captain_critical_commendation',
      speaker: 'Narrator',
      body:
        'The commendation is arranged properly — a ceremony, a citation read aloud, your ' +
        'household\'s name attached to his in the official record for everyone to see. He ' +
        'accepts it with the same faint discomfort he seems to feel about any occasion ' +
        'with a script, bows correctly enough, and is gone before the refreshments are ' +
        'served. The story that circulates afterward is, somehow, less about his courage ' +
        'than about how eager your house was to be seen rewarding it.',
    },
    romance_captain_critical_quiet: {
      id: 'romance_captain_critical_quiet',
      speaker: 'Narrator',
      body:
        'The note reaches him the next morning, brief and unremarkable, and he sends back ' +
        'an equally brief acknowledgment — pleased, you think, though it\'s hard to tell ' +
        'through so few words. The two men he posted at your gate are gone by midday, ' +
        'their watch quietly ended along with everyone else\'s interest in the previous ' +
        'night\'s noise.',
    },
  },
};
