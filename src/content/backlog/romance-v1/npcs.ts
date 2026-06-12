import type { CandidateId, FactionId } from '../engine/types';

/**
 * The three v0.1 romance candidates (GAME_DESIGN.md §6). `tastes` are
 * imagery tags (see src/content/poems.ts) that match against poem
 * fragments for the poem builder's taste-match scoring.
 */
export type Candidate = {
  id: CandidateId;
  name: string;
  faction: FactionId;
  blurb: string;
  tastes: string[];
  /** Stage-4 "behind the curtain" scene id (GAME_DESIGN.md §6). */
  curtainSceneId: string;
};

export const CANDIDATES: Record<CandidateId, Candidate> = {
  sequesteredHeir: {
    id: 'sequesteredHeir',
    name: 'The Sequestered Heir',
    faction: 'regent',
    blurb:
      'A Fujiwara daughter or son being groomed for palace placement. Highest ' +
      'ceiling, highest political risk, courting them is courting the regent.',
    tastes: ['moon', 'pine'],
    curtainSceneId: 'romance_sequestered_heir_curtain',
  },
  sharpBrush: {
    id: 'sharpBrush',
    name: 'The Sharp Brush',
    faction: 'imperial',
    blurb:
      'A celebrated lady-in-waiting and court poet. Rhetoric-gated, and merciless ' +
      'about a failed verse. The banter route.',
    tastes: ['cuckoo', 'plover'],
    curtainSceneId: 'romance_sharp_brush_curtain',
  },
  fadedBranch: {
    id: 'fadedBranch',
    name: 'The Faded Branch',
    faction: 'clergy',
    blurb:
      'A widowed princeling of a sidelined imperial line. Low political value, ' +
      'high narrative payoff, the mono no aware route.',
    tastes: ['cherry_blossom', 'snow'],
    curtainSceneId: 'romance_faded_branch_curtain',
  },
};

export const CANDIDATE_LIST: Candidate[] = Object.values(CANDIDATES);
