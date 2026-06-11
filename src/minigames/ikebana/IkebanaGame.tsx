import { useState } from 'react';
import { STEMS } from '../../content/ikebana';
import { IKEBANA_SLOTS, scoreArrangement, type IkebanaScoreResult } from '../../engine/ikebana';

type IkebanaGameProps = {
  month: number;
  onSubmit: (result: IkebanaScoreResult) => void;
  onCancel?: () => void;
};

/**
 * One-thumb ikebana mini-game (GAME_DESIGN.md §10): tap a stem from the
 * tray to place it in the next empty vase slot, tap a filled slot to
 * remove it. Score updates live; Confirm finalizes the arrangement.
 */
export function IkebanaGame({ month, onSubmit, onCancel }: IkebanaGameProps) {
  const [slots, setSlots] = useState<(string | null)[]>(() => Array(IKEBANA_SLOTS).fill(null));

  const result = scoreArrangement(slots, month);

  function placeStem(stemId: string) {
    const emptyIndex = slots.indexOf(null);
    if (emptyIndex === -1) return;
    const next = [...slots];
    next[emptyIndex] = stemId;
    setSlots(next);
  }

  function removeStem(slotIndex: number) {
    if (slots[slotIndex] === null) return;
    const next = [...slots];
    next[slotIndex] = null;
    setSlots(next);
  }

  function clear() {
    setSlots(Array(IKEBANA_SLOTS).fill(null));
  }

  return (
    <div className="ikebana-game">
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
        Tap a stem to place it; tap a placed stem to remove it.
      </p>

      <div className="ikebana-vase">
        {slots.map((stemId, i) => {
          const stem = stemId ? STEMS.find((s) => s.id === stemId) : undefined;
          return (
            <button
              key={i}
              className={`btn ikebana-slot${stem ? ' ikebana-slot-filled' : ''}`}
              onClick={() => removeStem(i)}
              disabled={!stem}
            >
              {stem ? stem.name : ''}
            </button>
          );
        })}
      </div>

      <div className="ikebana-tray">
        {STEMS.map((stem) => (
          <button
            key={stem.id}
            className="btn ikebana-stem"
            onClick={() => placeStem(stem.id)}
            disabled={!slots.includes(null)}
          >
            {stem.name}
          </button>
        ))}
      </div>

      <div className="stat-grid">
        <div>
          <div className="stat-label">Score</div>
          <div className="stat-value">{result.score}</div>
        </div>
        <div>
          <div className="stat-label">Taste gain</div>
          <div className="stat-value">+{result.tasteDelta}</div>
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
        <button className="btn btn-accent" onClick={() => onSubmit(result)}>
          Confirm Arrangement
        </button>
      </div>
    </div>
  );
}
