import type { Scene } from '../../engine/scene';

// The Northern Merchant: critical choice (GAME_DESIGN.md §6/§13), stage 2
// — this route's turning point arrives at "first poem," before the
// caravan that brought him moves on. Unmarked: nothing in the text names
// this as the route's turning point. The path that goes to him in person
// marries him (kokuStipend marriage buff activates on marry: true); the
// others let the caravan leave.

export const romanceMerchantCritical: Scene = {
  id: 'romance_merchant_critical',
  title: 'The Caravan at the West Gate',
  startNode: 'romance_merchant_critical_00',
  nodes: {
    romance_merchant_critical_00: {
      id: 'romance_merchant_critical_00',
      speaker: 'Narrator',
      body:
        'A runner brings word, almost as an afterthought, that the northern trading party ' +
        'is loading its carts at the west gate and will be on the road north again by ' +
        'evening. Among the bundles already lashed down, one of your attendants notices, ' +
        'is a small flat parcel addressed to no one, set conspicuously on top where it ' +
        'will be seen.',
      next: 'romance_merchant_critical_01',
    },
    romance_merchant_critical_01: {
      id: 'romance_merchant_critical_01',
      speaker: 'Narrator',
      body:
        'He is at the gate himself, checking lashings, when you arrive — or do not. ' +
        'Either way, the carts will move with or without anything more being said. He ' +
        'glances toward your part of the city exactly once, the way a man checks the sky ' +
        'before deciding whether to bring an umbrella.',
      choices: [
        {
          text: 'Go to the gate yourself, and tell him plainly you would rather he stayed.',
          effects: [
            { kind: 'romance', loveInterestId: 'merchant', stage: 3, closed: true, marry: true },
          ],
          goto: 'romance_merchant_critical_marry',
        },
        {
          text: 'Send a retinue to see the caravan off with gifts, in your name.',
          effects: [
            { kind: 'romance', loveInterestId: 'merchant', closed: true },
            {
              kind: 'gossip',
              tag: 'entertained_a_foreign_trader',
              factionDeltas: { rivalHouses: 1 },
              delayMonths: 1,
            },
          ],
          goto: 'romance_merchant_critical_send_off',
        },
        {
          text: 'Let the carts leave without you.',
          effects: [{ kind: 'romance', loveInterestId: 'merchant', closed: true }],
          goto: 'romance_merchant_critical_quiet',
        },
      ],
    },
    romance_merchant_critical_marry: {
      id: 'romance_merchant_critical_marry',
      speaker: 'Narrator',
      body:
        'He looks faintly surprised that you came at all, and more surprised still when ' +
        'you say it without dressing it up. He thinks about it for exactly as long as it ' +
        'takes to look once at the loaded carts and once at you, then calls over his ' +
        'foreman and starts giving orders to unload half of them. The caravan goes north ' +
        'without him this time. In its place, over the following months, a standing ' +
        'arrangement takes shape — goods coming down the northern road on a schedule now, ' +
        'addressed to your household by name, with him there to see them priced fairly. ' +
        'He never quite learns to bow correctly, and stops apologizing for it within a season.',
    },
    romance_merchant_critical_send_off: {
      id: 'romance_merchant_critical_send_off',
      speaker: 'Narrator',
      body:
        'Your retainers do the thing properly — parting gifts, formal thanks, a small ' +
        'crowd gathered to see the foreign trading party off in style. He accepts it all ' +
        'with the same even good humor he shows for everything, bows in his own ' +
        'fashion, and the carts roll north on schedule. By the time anyone in your ' +
        'household thinks to mention it again, the story making the rounds is less about ' +
        'the trader than about your house’s sudden taste for entertaining foreigners.',
    },
    romance_merchant_critical_quiet: {
      id: 'romance_merchant_critical_quiet',
      speaker: 'Narrator',
      body:
        'The carts roll out at evening as planned, the small flat parcel still lashed on ' +
        'top, unclaimed. Within a few days the gate is just a gate again, and the matter ' +
        'settles into the kind of thing that, a year from now, you may or may not still ' +
        'remember to mention to anyone.',
    },
  },
};
