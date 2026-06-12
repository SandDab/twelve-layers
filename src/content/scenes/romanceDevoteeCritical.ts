import type { Scene } from '../../engine/scene';

// The Devotee: critical choice (GAME_DESIGN.md §6/§13), stage 4, behind
// the curtain. Unmarked: nothing in the text names this as the route's
// turning point. The quiet, form-keeping path marries him
// (composureRegen + factionRepMult clergy marriage buff activates on
// marry: true); the showy path closes the route and costs standing with
// the shrine itself.

export const romanceDevoteeCritical: Scene = {
  id: 'romance_devotee_critical',
  title: 'The Night Purification',
  startNode: 'romance_devotee_critical_00',
  nodes: {
    romance_devotee_critical_00: {
      id: 'romance_devotee_critical_00',
      speaker: 'Narrator',
      body:
        'A message comes by way of no one in particular: the shrine is holding its winter ' +
        'purification after dark tonight, and you would be permitted to attend the inner ' +
        'rite — a thing ordinarily closed to anyone outside the handful of families who ' +
        'maintain the place. No reason is given for the invitation. None is needed.',
      next: 'romance_devotee_critical_01',
    },
    romance_devotee_critical_01: {
      id: 'romance_devotee_critical_01',
      speaker: 'Narrator',
      body:
        'By torchlight the precinct looks larger than it did under snow, swept bare and ' +
        'salted, and he is there among the others in plain robes, indistinguishable at a ' +
        'glance from the shrine’s own attendants. He does not single you out. The rite ' +
        'has its own order, and it is the only thing here that seems to matter tonight.',
      choices: [
        {
          text: 'Follow the rite exactly as the others do, and ask for nothing afterward.',
          effects: [
            { kind: 'romance', loveInterestId: 'devotee', stage: 5, closed: true, marry: true },
          ],
          goto: 'romance_devotee_critical_marry',
        },
        {
          text: 'Have your attendants present a donation worthy of the occasion, in your name.',
          effects: [
            { kind: 'romance', loveInterestId: 'devotee', closed: true },
            {
              kind: 'gossip',
              tag: 'made_a_show_at_the_shrine',
              factionDeltas: { clergy: -1, rivalHouses: 1 },
              delayMonths: 1,
            },
          ],
          goto: 'romance_devotee_critical_donation',
        },
        {
          text: 'Watch from the edge of the firelight, and leave when it ends.',
          effects: [{ kind: 'romance', loveInterestId: 'devotee', closed: true }],
          goto: 'romance_devotee_critical_quiet',
        },
      ],
    },
    romance_devotee_critical_marry: {
      id: 'romance_devotee_critical_marry',
      speaker: 'Narrator',
      body:
        'You bow when the others bow, stand when they stand, and say nothing through the ' +
        'whole of it, and somewhere in the middle of all that stillness he glances over, ' +
        'just once, and something in his face settles, as if a question had been answered ' +
        'that he had not quite asked aloud. Afterward there is no grand announcement — ' +
        'only, over the following months, a quiet rearrangement of the household’s ' +
        'calendar around the shrine’s own: offerings sent on the right days, a corner of ' +
        'the garden given over to plantings he chose. The priests there have started, ' +
        'without anyone deciding it formally, to speak of your house as one of their own.',
    },
    romance_devotee_critical_donation: {
      id: 'romance_devotee_critical_donation',
      speaker: 'Narrator',
      body:
        'Your attendants do it beautifully — lacquered boxes, a retainer reciting your ' +
        'house’s name and titles in full at the gate, exactly as such things are done. ' +
        'The rite does not pause, but afterward the head priest thanks you with a ' +
        'formality that feels like a closed door, and the man in plain robes is nowhere ' +
        'to be found among those filing out. Word that your house made a generous showing ' +
        'at a minor shrine travels faster, and stranger, than you expected.',
    },
    romance_devotee_critical_quiet: {
      id: 'romance_devotee_critical_quiet',
      speaker: 'Narrator',
      body:
        'The rite finishes as quietly as it began, the torches put out one by one, and ' +
        'you slip away with the rest of the crowd before anyone thinks to mark who came ' +
        'and went. From across the precinct he inclines his head once more, the same ' +
        'small gesture as the first time, and that, it seems, is where this ends — ' +
        'unspoken, and not unkindly.',
    },
  },
};
