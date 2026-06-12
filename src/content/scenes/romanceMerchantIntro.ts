import type { Scene } from '../../engine/scene';

// The Northern Merchant: emergent introduction (GAME_DESIGN.md §6). Fires
// as a ripple the month after the intro director selects him. Unsigned
// and unlabeled (CLAUDE.md): nothing here marks this as the start of a route.

export const romanceMerchantIntro: Scene = {
  id: 'romance_merchant_intro',
  title: 'Goods from the Northern Road',
  startNode: 'romance_merchant_intro_00',
  nodes: {
    romance_merchant_intro_00: {
      id: 'romance_merchant_intro_00',
      speaker: 'Narrator',
      body:
        'A commotion in the eastern market quarter turns out to be a trading party newly ' +
        'arrived down the northern road, unpacking crates of sable pelts and amber under ' +
        'a borrowed awning. The man directing the unpacking is broad-shouldered, ' +
        'sun-darkened in a way no one at court is, and entirely unbothered by the ' +
        'attention his goods are drawing.',
      next: 'romance_merchant_intro_01',
    },
    romance_merchant_intro_01: {
      id: 'romance_merchant_intro_01',
      speaker: 'Narrator',
      body:
        'He catches you looking at the amber and holds a piece up to the light without ' +
        'being asked, turning it so the color shows, sizing you up — not for rank, you ' +
        'realize, but for whether you are likely to buy. When you do not answer at once ' +
        'he only shrugs, unoffended, and sets the piece back among the others.',
      choices: [
        {
          text: 'Ask, plainly, where the amber comes from.',
          effects: [],
          goto: 'romance_merchant_intro_end',
        },
        {
          text: 'Move on, before your attendants start to fuss about the company.',
          effects: [],
          goto: 'romance_merchant_intro_end',
        },
      ],
    },
    romance_merchant_intro_end: {
      id: 'romance_merchant_intro_end',
      speaker: 'Narrator',
      body:
        'Whatever you said, he answers without the careful distances court conversation ' +
        'usually keeps, and for a moment the exchange feels like the first plain talk ' +
        'you have had in weeks. The trading party will be in the city for some time yet, ' +
        'someone mentions, before the caravan moves on.',
    },
  },
};
