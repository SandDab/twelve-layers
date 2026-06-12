import { useState } from 'react';
import { poemFragmentsBySlot } from '../content/poems';
import type { PoemSelection } from '../engine/poems';
import type { PoemFragment } from '../engine/types';

type PoemComposerProps = {
  recipientName: string;
  onCancel: () => void;
  onSubmit: (selection: PoemSelection) => void;
};

const SEASON_FRAGMENTS = poemFragmentsBySlot('season');
const IMAGE_FRAGMENTS = poemFragmentsBySlot('image');
const TURN_FRAGMENTS = poemFragmentsBySlot('turn');

function FragmentTray({
  label,
  fragments,
  selectedId,
  onSelect,
}: {
  label: string;
  fragments: PoemFragment[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <p className="stat-label" style={{ margin: '0 0 0.25rem' }}>{label}</p>
      <div className="ikebana-tray">
        {fragments.map((fragment) => (
          <button
            key={fragment.id}
            className={`btn ikebana-stem${fragment.id === selectedId ? ' ikebana-slot-filled' : ''}`}
            onClick={() => onSelect(fragment.id)}
          >
            {fragment.romaji}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * One-thumb poem composer (GAME_DESIGN.md §6): three taps, season-word ->
 * image -> turn. The result is never scored on screen (CLAUDE.md: romance
 * mechanics are read through prose only) - the recipient's reaction
 * carries the outcome.
 */
export function PoemComposer({ recipientName, onCancel, onSubmit }: PoemComposerProps) {
  const [seasonId, setSeasonId] = useState(SEASON_FRAGMENTS[0].id);
  const [imageId, setImageId] = useState(IMAGE_FRAGMENTS[0].id);
  const [turnId, setTurnId] = useState(TURN_FRAGMENTS[0].id);

  const selection: PoemSelection = {
    season: SEASON_FRAGMENTS.find((f) => f.id === seasonId)!,
    image: IMAGE_FRAGMENTS.find((f) => f.id === imageId)!,
    turn: TURN_FRAGMENTS.find((f) => f.id === turnId)!,
  };

  return (
    <div className="ikebana-game">
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
        Tap one fragment per line to compose your verse to {recipientName}.
      </p>

      <p className="poem-preview">
        {selection.season.romaji}, {selection.image.romaji}, {selection.turn.romaji}.
      </p>

      <FragmentTray label="Season-word" fragments={SEASON_FRAGMENTS} selectedId={seasonId} onSelect={setSeasonId} />
      <FragmentTray label="Image" fragments={IMAGE_FRAGMENTS} selectedId={imageId} onSelect={setImageId} />
      <FragmentTray label="Turn" fragments={TURN_FRAGMENTS} selectedId={turnId} onSelect={setTurnId} />

      <div className="action-grid">
        <button className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-accent" onClick={() => onSubmit(selection)}>
          Send Poem
        </button>
      </div>
    </div>
  );
}
