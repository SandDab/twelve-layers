// Zen garden raking (GAME_DESIGN.md §10): a 5x5 sand field with three
// fixed stones. Threshold-deterministic, no RNG, no timer. Score rewards
// covering the rakeable cells without re-crossing a furrow, plus a bonus
// for furrows that pass alongside a stone (doubled if a gardener is on
// staff).

export const RAKING_GRID_SIZE = 5;

export const RAKING_STONES = [6, 12, 18];

export const RAKING_RAKEABLE_CELLS = Array.from(
  { length: RAKING_GRID_SIZE * RAKING_GRID_SIZE },
  (_, i) => i,
).filter((i) => !RAKING_STONES.includes(i));

export type RakingScoreBreakdown = {
  /** 0-50, ratio of distinct rakeable cells covered. */
  coverage: number;
  /** -50-0, penalty for re-crossing already-raked cells. */
  continuity: number;
  /** 0-20, bonus for furrows passing beside a stone (doubled with a gardener). */
  stones: number;
};

export type RakingScoreResult = {
  /** 0-70, see breakdown for components. */
  score: number;
  /** Composure restored, 5-20, derived from score. */
  composureGain: number;
  breakdown: RakingScoreBreakdown;
};

function stoneNeighbors(stone: number): number[] {
  const row = Math.floor(stone / RAKING_GRID_SIZE);
  const col = stone % RAKING_GRID_SIZE;
  const neighbors: number[] = [];
  if (row > 0) neighbors.push(stone - RAKING_GRID_SIZE);
  if (row < RAKING_GRID_SIZE - 1) neighbors.push(stone + RAKING_GRID_SIZE);
  if (col > 0) neighbors.push(stone - 1);
  if (col < RAKING_GRID_SIZE - 1) neighbors.push(stone + 1);
  return neighbors.filter((n) => !RAKING_STONES.includes(n));
}

/**
 * Score a raked path: an ordered list of rakeable cell indices the player
 * touched. Repeated cells count as crossings.
 */
export function scoreRaking(path: number[], gardenerUpgrade: boolean): RakingScoreResult {
  const raked = path.filter((cell) => RAKING_RAKEABLE_CELLS.includes(cell));
  const uniqueCells = new Set(raked);

  const coverage = Math.round((uniqueCells.size / RAKING_RAKEABLE_CELLS.length) * 50);

  const crossings = raked.length - uniqueCells.size;
  const continuity = crossings === 0 ? 0 : -Math.min(coverage, crossings * 5);

  let adjacentStones = 0;
  for (const stone of RAKING_STONES) {
    if (stoneNeighbors(stone).some((n) => uniqueCells.has(n))) adjacentStones += 1;
  }
  let stones = Math.round((adjacentStones / RAKING_STONES.length) * 20);
  if (gardenerUpgrade) stones = Math.min(20, stones * 2);

  const score = Math.max(0, coverage + continuity + stones);
  const composureGain = 5 + Math.round((score / 70) * 15);

  return { score, composureGain, breakdown: { coverage, continuity, stones } };
}
