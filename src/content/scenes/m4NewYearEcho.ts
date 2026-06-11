import type { Scene } from '../../engine/scene';

// TODO stub: full Aoi Matsuri content (carriage-place dispute, m4_aoi_carriage_*)
// ships in M5. This scene is the M1 New Year ripple's payload — proof that a
// choice made in month 1 is remembered in month 4 — and will be folded into
// the larger Aoi Matsuri scene when it's authored.

export const m4NewYearEcho: Scene = {
  id: 'm4_newyear_echo_01',
  title: 'A Familiar Pattern',
  startNode: 'm4_newyear_echo_00',
  nodes: {
    m4_newyear_echo_00: {
      id: 'm4_newyear_echo_00',
      speaker: 'Narrator',
      body:
        'At the Kamo riverbank, a lady-in-waiting catches sight of your sleeve and ' +
        'pauses. "Kōbai, in the New Year hall — I remember. You wore it correctly, ' +
        'which is rarer than you might think." She does not say more, but she ' +
        'remembers your name now.',
    },
  },
};
