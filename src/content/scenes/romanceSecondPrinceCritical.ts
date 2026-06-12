import type { Scene } from '../../engine/scene';

// The Second Prince: critical choice (GAME_DESIGN.md §6/§13), stage 4,
// behind the curtain. Unmarked: nothing in the text names this as the
// route's turning point. The deference-coded path marries him
// (imperialFavor + factionRepMult marriage buff activates on
// marry: true); the presumptuous path closes the route and carries its
// own risk, true to "dangerous to want."

export const romanceSecondPrinceCritical: Scene = {
  id: 'romance_second_prince_critical',
  title: 'Behind the Screen',
  startNode: 'romance_second_prince_critical_00',
  nodes: {
    romance_second_prince_critical_00: {
      id: 'romance_second_prince_critical_00',
      speaker: 'Narrator',
      body:
        'A note arrives through a channel too discreet to question: a screen has been ' +
        'arranged in an antechamber off the palace gardens, and you are to wait behind ' +
        'it. No name is given, but you know whose hand the brushwork belongs to. You go.',
      next: 'romance_second_prince_critical_01',
    },
    romance_second_prince_critical_01: {
      id: 'romance_second_prince_critical_01',
      speaker: 'Narrator',
      body:
        'Footsteps on the other side of the screen, then stillness. He does not announce ' +
        'himself, and for a long moment neither of you speaks. Somewhere beyond the ' +
        'garden wall, the ordinary business of the palace continues, unaware.',
      choices: [
        {
          text: 'Wait. Let him be the one to break the silence.',
          effects: [
            { kind: 'romance', loveInterestId: 'second_prince', stage: 5, closed: true, marry: true },
          ],
          goto: 'romance_second_prince_critical_marry',
        },
        {
          text: 'Speak first, and make sure what you say is memorable.',
          effects: [
            { kind: 'romance', loveInterestId: 'second_prince', closed: true },
            {
              kind: 'gossip',
              tag: 'pursued_the_second_prince',
              factionDeltas: { imperial: -1, rivalHouses: 1 },
              delayMonths: 1,
            },
          ],
          goto: 'romance_second_prince_critical_bold',
        },
        {
          text: 'Slip away before he realizes you came at all.',
          effects: [{ kind: 'romance', loveInterestId: 'second_prince', closed: true }],
          goto: 'romance_second_prince_critical_withdraw',
        },
      ],
    },
    romance_second_prince_critical_marry: {
      id: 'romance_second_prince_critical_marry',
      speaker: 'Narrator',
      body:
        'When he finally speaks, it is quietly, and about nothing of consequence at first, ' +
        'as though testing whether you would still be there to answer. You are. The ' +
        'conversation that follows is careful on both sides, and all the more honest for ' +
        'it. What comes after moves at the court’s own pace, through go-betweens and ' +
        'family elders and a great deal of correspondence that says less than it means, ' +
        'but it does come. Afterward, doors that were merely closed to you before now ' +
        'open a little, unasked, and you learn to recognize the particular quiet that ' +
        'follows wherever he goes.',
    },
    romance_second_prince_critical_bold: {
      id: 'romance_second_prince_critical_bold',
      speaker: 'Narrator',
      body:
        'You speak, and speak well, and for a moment you can feel him listening with real ' +
        'attention. But the antechamber is not as private as the note implied, and by the ' +
        'time you leave, at least two people who were not supposed to know you were ever ' +
        'there clearly do. The prince, when you next see him at a distance, does not look ' +
        'your way again. Whatever this was, it seems, has already been decided for both of you.',
    },
    romance_second_prince_critical_withdraw: {
      id: 'romance_second_prince_critical_withdraw',
      speaker: 'Narrator',
      body:
        'You leave as quietly as you came, before either of you has said a word that ' +
        'could be repeated. It is, you tell yourself, the wiser choice. The screen stands ' +
        'empty in the antechamber for a long while afterward, and then someone comes to ' +
        'fold it away, and that is the end of it.',
    },
  },
};
