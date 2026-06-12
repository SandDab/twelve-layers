import { useState } from 'react';
import { RAKING_GRID_SIZE, RAKING_RAKEABLE_CELLS, RAKING_STONES, scoreRaking } from '../../engine/raking';

type RakingGameProps = {
  gardenerUpgrade: boolean;
  onSubmit: (composureGain: number) => void;
  onCancel?: () => void;
};

/**
 * One-thumb raking mini-game (GAME_DESIGN.md §10): tap rakeable cells to
 * draw furrows around the fixed stones. No timer. Score updates live;
 * Confirm restores Composure.
 */
export function RakingGame({ gardenerUpgrade, onSubmit, onCancel }: RakingGameProps) {
  const [path, setPath] = useState<number[]>([]);

  const result = scoreRaking(path, gardenerUpgrade);
  const cells = Array.from({ length: RAKING_GRID_SIZE * RAKING_GRID_SIZE }, (_, i) => i);
  const raked = new Set(path);

  function rakeCell(cell: number) {
    if (!RAKING_RAKEABLE_CELLS.includes(cell)) return;
    setPath([...path, cell]);
  }

  function clear() {
    setPath([]);
  }

  return (
    <div className="raking-game">
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
        Tap a cell to draw a furrow. Crossing a furrow you have already drawn costs continuity.
      </p>

      <div className="raking-grid">
        {cells.map((cell) => {
          const isStone = RAKING_STONES.includes(cell);
          const isRaked = raked.has(cell);
          const classes = ['btn', 'raking-cell'];
          if (isStone) classes.push('raking-cell-stone');
          if (isRaked) classes.push('raking-cell-raked');
          return (
            <button
              key={cell}
              className={classes.join(' ')}
              onClick={() => rakeCell(cell)}
              disabled={isStone}
            >
              {isStone ? '●' : ''}
            </button>
          );
        })}
      </div>

      <div className="stat-grid">
        <div>
          <div className="stat-label">Score</div>
          <div className="stat-value">{result.score} / 70</div>
        </div>
        <div>
          <div className="stat-label">Composure gain</div>
          <div className="stat-value">+{result.composureGain}</div>
        </div>
      </div>

      <div className="action-grid">
        <button className="btn" onClick={clear}>
          Clear
        </button>
        {onCancel && (
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button className="btn btn-accent" onClick={() => onSubmit(result.composureGain)}>
          Finish Raking
        </button>
      </div>
    </div>
  );
}
