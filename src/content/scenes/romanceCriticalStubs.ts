import type { Scene } from '../../engine/scene';
import { LOVE_INTERESTS } from '../loveInterests';

// TODO-stub critical-choice scenes for the eight love interests
// (GAME_DESIGN.md §6/§13): each route's single unmarked critical choice,
// at the stage recorded in LOVE_INTERESTS[id].criticalChoice.stage. These
// keep `lintScenes`'s ripple-reference check satisfied and let the intro
// director / romance engine be exercised end-to-end before the M4b route
// content (the real scene, with checks and stage-appropriate framing)
// replaces each stub.

function stub(id: string, title: string): Scene {
  return {
    id,
    title,
    startNode: `${id}_00`,
    nodes: {
      [`${id}_00`]: {
        id: `${id}_00`,
        speaker: 'Narrator',
        body: `(TODO: ${title} critical-choice scene, M4b content.)`,
      },
    },
  };
}

export const romanceClimberCritical = stub(
  LOVE_INTERESTS.climber.criticalChoice.sceneId,
  'The Social Climber',
);
export const romanceWidowCritical = stub(LOVE_INTERESTS.widow.criticalChoice.sceneId, 'The Young Widow');
export const romanceSoleHeirCritical = stub(LOVE_INTERESTS.sole_heir.criticalChoice.sceneId, 'The Sole Heir');
export const romanceCaptainCritical = stub(LOVE_INTERESTS.captain.criticalChoice.sceneId, 'The Captain');
export const romanceDevoteeCritical = stub(LOVE_INTERESTS.devotee.criticalChoice.sceneId, 'The Devotee');
export const romanceMerchantCritical = stub(
  LOVE_INTERESTS.merchant.criticalChoice.sceneId,
  'The Northern Merchant',
);
