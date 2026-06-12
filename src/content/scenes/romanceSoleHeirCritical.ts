import type { Scene } from '../../engine/scene';

// The Sole Heir: critical choice (GAME_DESIGN.md §6/§13), stage 2 — this
// route's turning point arrives at "first poem," the same early-critical
// pattern as the Northern Merchant. Unmarked: nothing in the text names
// this as the route's turning point. Accepting the overture marries her
// (attrBonus + kasaneProtection marriage buffs activate on marry: true);
// the other paths let the matter pass.

export const romanceSoleHeirCritical: Scene = {
  id: 'romance_sole_heir_critical',
  title: 'An Answer Before the Season Turns',
  startNode: 'romance_sole_heir_critical_00',
  nodes: {
    romance_sole_heir_critical_00: {
      id: 'romance_sole_heir_critical_00',
      speaker: 'Narrator',
      body:
        'A formal messenger arrives from her household — sooner than such things usually ' +
        'move, and with none of the customary throat-clearing exchanges that precede them. ' +
        'Her family, it seems, does not believe in lengthy courtships; with no one left to ' +
        'inherit but her, every season a decision is delayed is a season the house\'s ' +
        'standing is, in their reckoning, merely borrowed.',
      next: 'romance_sole_heir_critical_01',
    },
    romance_sole_heir_critical_01: {
      id: 'romance_sole_heir_critical_01',
      speaker: 'Narrator',
      body:
        'The message itself is plain to the point of bluntness: her elders are prepared ' +
        'to discuss a match, on her recommendation, and would like an answer before the ' +
        'season turns. Tucked inside, in her own hand and addressed to no one but you, is ' +
        'a single line — that whatever you decide, she would rather hear it from you ' +
        'directly than from either household\'s elders.',
      choices: [
        {
          text: 'Send word back yourself: the answer is yes.',
          effects: [
            { kind: 'romance', loveInterestId: 'sole_heir', stage: 3, closed: true, marry: true },
          ],
          goto: 'romance_sole_heir_critical_marry',
        },
        {
          text: 'Let your household\'s elders handle the reply, and make sure word of the offer gets around first.',
          effects: [
            { kind: 'romance', loveInterestId: 'sole_heir', closed: true },
            {
              kind: 'gossip',
              tag: 'let_it_be_known_an_heiress_looked_your_way',
              factionDeltas: { rivalHouses: 1 },
              delayMonths: 1,
            },
          ],
          goto: 'romance_sole_heir_critical_announced',
        },
        {
          text: 'Decline, gently, and ask that the matter be allowed to rest quietly.',
          effects: [{ kind: 'romance', loveInterestId: 'sole_heir', closed: true }],
          goto: 'romance_sole_heir_critical_decline',
        },
      ],
    },
    romance_sole_heir_critical_marry: {
      id: 'romance_sole_heir_critical_marry',
      speaker: 'Narrator',
      body:
        'Your reply reaches her before her elders\' letter does, which — you gather, ' +
        'later — is exactly how she wanted it. The arrangements that follow move with the ' +
        'same brisk precision as the inventory she was taking the day you met her: rooms ' +
        'reassigned, robes for the new season already chosen and laid out before you\'ve ' +
        'thought to ask, her household\'s seamstresses absorbing yours into their own ' +
        'exacting standard as though there had never been two standards at all. Within a ' +
        'season you find you have not worn an ill-matched layering once, and have ' +
        'stopped noticing that you used to.',
    },
    romance_sole_heir_critical_announced: {
      id: 'romance_sole_heir_critical_announced',
      speaker: 'Narrator',
      body:
        'Your elders draft a careful, noncommittal reply — but not before the offer ' +
        'itself has made its way around the right rooms, exactly as you intended. Your ' +
        'house\'s name is, for a season, attached to hers in every conversation that ' +
        'matters, whatever the letter eventually says. She, for her part, says nothing ' +
        'about it at all, which somehow carries further than if she had.',
    },
    romance_sole_heir_critical_decline: {
      id: 'romance_sole_heir_critical_decline',
      speaker: 'Narrator',
      body:
        'The reply you send is gentle, and true to its word, the matter is allowed to ' +
        'rest — no further messengers, no renewed approach, nothing that could be read as ' +
        'pressure from either side. The next time your paths cross, she greets you with ' +
        'exactly the same brisk courtesy as the first time, as if the inventory had ' +
        'simply continued, one line further down the list.',
    },
  },
};
