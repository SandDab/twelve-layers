import type { Scene } from '../../engine/scene';

// The Girl from the Riverbank: critical choice (GAME_DESIGN.md §6/§13),
// stage 5, kaimami/meeting. Unmarked: nothing in the text names this as
// the route's turning point. One path marries her (kokuStipend +
// composureRegen marriage buff, "she fishes," activates on marry: true);
// the others close the route for the year.

export const romanceRiverbankCritical: Scene = {
  id: 'romance_riverbank_critical',
  title: 'The Shallows at Dusk',
  startNode: 'romance_riverbank_critical_00',
  nodes: {
    romance_riverbank_critical_00: {
      id: 'romance_riverbank_critical_00',
      speaker: 'Narrator',
      body:
        'Your escort stops again at the same ford, this time by design, and there she is, ' +
        'wading out with the evening catch slung over one shoulder, soaked to the thigh, ' +
        'laughing at something one of the fishermen has said. She sees you, and instead ' +
        'of bowing, holds up a fish by the gills for your inspection, grinning.',
      next: 'romance_riverbank_critical_01',
    },
    romance_riverbank_critical_01: {
      id: 'romance_riverbank_critical_01',
      speaker: 'Narrator',
      body:
        'Your attendants go very still. A few of the fishermen straighten up, suddenly ' +
        'aware of who is watching. She does not straighten up at all, only waits, the ' +
        'fish still dangling, to see what you will do.',
      choices: [
        {
          text: 'Step down into the shallows yourself, sandals and all.',
          effects: [
            { kind: 'romance', loveInterestId: 'riverbank', stage: 6, closed: true, marry: true },
          ],
          goto: 'romance_riverbank_critical_marry',
        },
        {
          text: 'Send a retainer to present her to your household with full ceremony.',
          effects: [
            { kind: 'romance', loveInterestId: 'riverbank', closed: true },
            {
              kind: 'gossip',
              tag: 'made_a_show_of_the_riverbank_girl',
              factionDeltas: { rivalHouses: 1 },
              delayMonths: 1,
            },
          ],
          goto: 'romance_riverbank_critical_ceremony',
        },
        {
          text: 'Incline your head, as you did before, and say nothing.',
          effects: [{ kind: 'romance', loveInterestId: 'riverbank', closed: true }],
          goto: 'romance_riverbank_critical_quiet',
        },
      ],
    },
    romance_riverbank_critical_marry: {
      id: 'romance_riverbank_critical_marry',
      speaker: 'Narrator',
      body:
        'The water is colder than it looks and your hem is ruined within a step, but she ' +
        'laughs outright this time, delighted, and wades over to show you the fish ' +
        'properly. Your attendants exchange glances they think you cannot see. ' +
        'By the time the betrothal is settled, the household has stopped pretending to ' +
        'be surprised: she comes and goes from the kitchens with the morning catch as ' +
        'though she had always lived here, and the cooks have learned not to argue ' +
        'about it. The river, it turns out, follows her indoors. Some evenings you find ' +
        'yourself sitting on the edge of the garden stream with her, saying very little, ' +
        'and somehow that is enough to leave the day behind.',
    },
    romance_riverbank_critical_ceremony: {
      id: 'romance_riverbank_critical_ceremony',
      speaker: 'Narrator',
      body:
        'The retainer bows low and delivers the courtesies beautifully. The girl looks ' +
        'from him to you, the fish still in her hand, and something in her face closes ' +
        'over like a shutter. She thanks him with perfect, distant politeness, hands the ' +
        'fish to one of her companions, and wades back upstream without a backward ' +
        'glance. Word of your gracious attention to the governor’s daughter makes its ' +
        'way through the old houses within the week, which is, you gather, rather the point.',
    },
    romance_riverbank_critical_quiet: {
      id: 'romance_riverbank_critical_quiet',
      speaker: 'Narrator',
      body:
        'You incline your head, the smallest possible courtesy, and after a moment she ' +
        'returns it, just as small, before turning back to the net with her companions. ' +
        'The curtain comes down. Whatever passed between you on the riverbank stays ' +
        'there, unclaimed by either of you, and the season moves on without it.',
    },
  },
};
