import type { Scene } from '../../engine/scene';

// The Young Widow: critical choice (GAME_DESIGN.md §6/§13), stage 4.
// Unmarked: nothing in the text names this as the route's turning point.
// Staying without making a performance of it marries her (rippleIntercept
// marriage buff activates on marry: true); lingering for show closes the
// route with a whiff of scandal, and leaving early closes it cleanly.

export const romanceWidowCritical: Scene = {
  id: 'romance_widow_critical',
  title: 'What the Screen Conceals',
  startNode: 'romance_widow_critical_00',
  nodes: {
    romance_widow_critical_00: {
      id: 'romance_widow_critical_00',
      speaker: 'Narrator',
      body:
        'An evening visit that was meant to be brief runs long, the way conversations ' +
        'with her tend to, until the household lamps are lit and someone has quietly ' +
        'closed the outer shutters without being asked. She does not suggest you leave. ' +
        'She also does not suggest you stay — only continues, as if the hour had not ' +
        'changed at all, in the same unhurried voice.',
      next: 'romance_widow_critical_01',
    },
    romance_widow_critical_01: {
      id: 'romance_widow_critical_01',
      speaker: 'Narrator',
      body:
        '"I\'ve found," she says, choosing the words with the care of someone laying out ' +
        'good cloth, "that most people leave a conversation the moment it becomes worth ' +
        'finishing — out of politeness, or fear, I\'ve never been sure which." She does not ' +
        'look at the shuttered windows, or at the lateness of the hour, or at you ' +
        'directly. The conversation, plainly, is not finished.',
      choices: [
        {
          text: 'Stay, and let the conversation finish — whatever that ends up meaning.',
          effects: [
            { kind: 'romance', loveInterestId: 'widow', stage: 5, closed: true, marry: true },
          ],
          goto: 'romance_widow_critical_marry',
        },
        {
          text: 'Stay a while longer, but make sure your attendants are seen waiting outside.',
          effects: [
            { kind: 'romance', loveInterestId: 'widow', closed: true },
            {
              kind: 'gossip',
              tag: 'lingered_with_the_widow',
              factionDeltas: { rivalHouses: 1 },
              delayMonths: 1,
            },
          ],
          goto: 'romance_widow_critical_lingered',
        },
        {
          text: 'Excuse yourself before the hour can be remarked on by anyone.',
          effects: [{ kind: 'romance', loveInterestId: 'widow', closed: true }],
          goto: 'romance_widow_critical_quiet',
        },
      ],
    },
    romance_widow_critical_marry: {
      id: 'romance_widow_critical_marry',
      speaker: 'Narrator',
      body:
        'Neither of you moves to end it, and the conversation simply continues until it ' +
        'isn\'t, in any way that could be marked by an hour, a conversation anymore. ' +
        'Nothing about it is announced; nothing needs to be. What changes, over the ' +
        'months that follow, is quieter than that — odd pieces of news reach your ' +
        'household a little early now, by way of correspondents you never meet, carried ' +
        'in letters that arrive addressed to her and are read, afterward, with you in mind.',
    },
    romance_widow_critical_lingered: {
      id: 'romance_widow_critical_lingered',
      speaker: 'Narrator',
      body:
        'You stay, and make certain — carefully, deliberately — that your presence ' +
        'outside her gate at this hour is the kind of thing a household\'s attendants ' +
        'notice and remember. She watches you do it with an expression you can\'t quite ' +
        'place, somewhere between amusement and disappointment, and the conversation, ' +
        'after that, does not run long again.',
    },
    romance_widow_critical_quiet: {
      id: 'romance_widow_critical_quiet',
      speaker: 'Narrator',
      body:
        'You make your excuses before the lateness of the hour becomes a thing anyone ' +
        'could comment on, and she lets you go without protest, with the same evenness ' +
        'she greets everything. "Of course," is all she says — and whether that means she ' +
        'expected exactly this, or simply that she has stopped expecting anything in ' +
        'particular, she does not say.',
    },
  },
};
