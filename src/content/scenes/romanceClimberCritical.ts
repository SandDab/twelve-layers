import type { Scene } from '../../engine/scene';

// The Social Climber: critical choice (GAME_DESIGN.md §6/§13), stage 3.
// Unmarked: nothing in the text names this as the route's turning point.
// Accepting her terms outright marries her (tokimekiMult marriage buff
// activates on marry: true); the showy path closes the route and trades on
// her maneuvering without her; the quiet path declines and closes cleanly.

export const romanceClimberCritical: Scene = {
  id: 'romance_climber_critical',
  title: 'Names for the New Appointments',
  startNode: 'romance_climber_critical_00',
  nodes: {
    romance_climber_critical_00: {
      id: 'romance_climber_critical_00',
      speaker: 'Narrator',
      body:
        'A round of household appointments is being quietly settled before the season ' +
        'turns, the kind of reshuffling that happens in corridors rather than in any ' +
        'formal announcement. She finds you before the corridors have finished deciding ' +
        'anything, and gets straight to it: there is a posting that would suit her very ' +
        'well, and your name carries exactly the weight needed to put it within reach.',
      next: 'romance_climber_critical_01',
    },
    romance_climber_critical_01: {
      id: 'romance_climber_critical_01',
      speaker: 'Narrator',
      body:
        '"I\'m not going to pretend this is only about you," she says, with the particular ' +
        'relief of someone who has decided honesty will work better than flattery. "But it ' +
        'isn\'t only about me either. Put your name behind mine, openly, and I will spend ' +
        'the rest of this year making sure your name is the one people remember to say."',
      choices: [
        {
          text: 'Agree — and let it be known, plainly, that you stand together now.',
          effects: [
            { kind: 'romance', loveInterestId: 'climber', stage: 4, closed: true, marry: true },
          ],
          goto: 'romance_climber_critical_marry',
        },
        {
          text: 'Lend your name to the appointment, but keep your own dealings with her unremarked.',
          effects: [
            { kind: 'romance', loveInterestId: 'climber', closed: true },
            {
              kind: 'gossip',
              tag: 'tied_your_name_to_a_climber',
              factionDeltas: { rivalHouses: 1 },
              delayMonths: 1,
            },
          ],
          goto: 'romance_climber_critical_lent',
        },
        {
          text: 'Decline. Whatever she\'s aiming for, you would rather not be the ladder.',
          effects: [{ kind: 'romance', loveInterestId: 'climber', closed: true }],
          goto: 'romance_climber_critical_decline',
        },
      ],
    },
    romance_climber_critical_marry: {
      id: 'romance_climber_critical_marry',
      speaker: 'Narrator',
      body:
        'She does not so much as blink before turning the agreement into something ' +
        'public, introducing the two of you together at the very next opportunity with a ' +
        'confidence that makes the arrangement feel decided rather than proposed. The ' +
        'posting goes through within the week. So, it turns out, does a great deal else — ' +
        'over the months that follow she is tireless, and not at all subtle, about making ' +
        'sure your household is seen, talked about, and invited everywhere worth being ' +
        'invited. You suspect she would call this a wedding gift, if anyone asked her to ' +
        'name it.',
    },
    romance_climber_critical_lent: {
      id: 'romance_climber_critical_lent',
      speaker: 'Narrator',
      body:
        'You let your name do the work she asked of it, and nothing more. The posting ' +
        'goes through; she thanks you with exactly the warmth the arrangement calls for, ' +
        'no more and no less. Within the month, though, someone has noticed how cleanly ' +
        'the appointment went through, and has begun to wonder, out loud, just how close ' +
        'an arrangement it really was.',
    },
    romance_climber_critical_decline: {
      id: 'romance_climber_critical_decline',
      speaker: 'Narrator',
      body:
        'She takes the refusal with remarkable grace — no visible disappointment, no ' +
        'argument, just a small recalibration, as though crossing one name off a list and ' +
        'moving briskly to the next. The posting is settled some other way, by someone ' +
        'else\'s name, and within a season she has, very visibly, stopped including you in ' +
        'her calculations at all.',
    },
  },
};
