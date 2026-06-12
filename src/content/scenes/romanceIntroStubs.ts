import type { Scene } from '../../engine/scene';
import { LOVE_INTERESTS } from '../loveInterests';

// TODO-stub introduction scenes for the six love interests whose routes
// aren't yet authored (GAME_DESIGN.md §6): each fires as a ripple the
// month after the intro director selects that love interest, the same
// "ripple next month" pattern as kanzashi delivery. These keep
// `lintScenes`'s ripple-reference check satisfied and let the intro
// director be exercised end-to-end before the M4b route content (the
// real introduction scene) replaces each stub.

function stub(id: string, title: string): Scene {
  return {
    id,
    title,
    startNode: `${id}_00`,
    nodes: {
      [`${id}_00`]: {
        id: `${id}_00`,
        speaker: 'Narrator',
        body: `(TODO: ${title} introduction scene, M4b content.)`,
      },
    },
  };
}

export const romanceClimberIntro = stub(LOVE_INTERESTS.climber.introScene.sceneId, 'The Social Climber');
export const romanceWidowIntro = stub(LOVE_INTERESTS.widow.introScene.sceneId, 'The Young Widow');
export const romanceSoleHeirIntro = stub(LOVE_INTERESTS.sole_heir.introScene.sceneId, 'The Sole Heir');
export const romanceCaptainIntro = stub(LOVE_INTERESTS.captain.introScene.sceneId, 'The Captain');
