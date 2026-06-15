import { useState } from 'react';
import { poemFragmentsBySlot } from '../content/poems';
import type { PoemSelection } from '../engine/poems';
import type { PoemDisplayMode, PoemFragment } from '../engine/types';
import { useGameStore } from '../state/gameStore';

type PoemComposerProps = {
  recipientName: string;
  onCancel: () => void;
  onSubmit: (selection: PoemSelection) => void;
};

const DISPLAY_MODE_LABELS: Record<PoemDisplayMode, string> = {
  romaji: 'Romaji',
  gloss: 'Gloss',
  immersion: 'Immersion',
};

const DISPLAY_MODES: PoemDisplayMode[] = ['romaji', 'gloss', 'immersion'];

function fragmentLabel(fragment: PoemFragment, mode: PoemDisplayMode): string {
  if (mode === 'immersion') return `${fragment.jp} (${fragment.kana})`;
  return fragment.romaji;
}

const SEASON_FRAGMENTS = poemFragmentsBySlot('season');
const IMAGE_FRAGMENTS = poemFragmentsBySlot('image');
const TURN_FRAGMENTS = poemFragmentsBySlot('turn');

function FragmentTray({
  label,
  fragments,
  selectedId,
  mode,
  onSelect,
}: {
  label: string;
  fragments: PoemFragment[];
  selectedId: string;
  mode: PoemDisplayMode;
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
            {fragmentLabel(fragment, mode)}
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
  const displayMode = useGameStore((s) => s.poemDisplayMode);
  const setPoemDisplayMode = useGameStore((s) => s.setPoemDisplayMode);

  const selection: PoemSelection = {
    season: SEASON_FRAGMENTS.find((f) => f.id === seasonId)!,
    image: IMAGE_FRAGMENTS.find((f) => f.id === imageId)!,
    turn: TURN_FRAGMENTS.find((f) => f.id === turnId)!,
  };

  function cycleDisplayMode() {
    const next = DISPLAY_MODES[(DISPLAY_MODES.indexOf(displayMode) + 1) % DISPLAY_MODES.length];
    setPoemDisplayMode(next);
  }

  return (
    <div className="ikebana-game">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
          Tap one fragment per line to compose your verse to {recipientName}.
        </p>
        <button className="btn" onClick={cycleDisplayMode} style={{ flex: '0 0 auto', padding: '0.35rem 0.6rem' }}>
          {DISPLAY_MODE_LABELS[displayMode]}
        </button>
      </div>

      {displayMode === 'gloss' ? (
        <div className="poem-preview">
          <p style={{ margin: 0 }}>
            {selection.season.jp}{'　'}{selection.image.jp}{'　'}{selection.turn.jp}
          </p>
          <p style={{ margin: 0 }}>
            {selection.season.romaji}, {selection.image.romaji}, {selection.turn.romaji}.
          </p>
          <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
            {selection.season.en}, {selection.image.en}, {selection.turn.en}.
          </p>
        </div>
      ) : displayMode === 'immersion' ? (
        <p className="poem-preview">
          {selection.season.jp}{'　'}{selection.image.jp}{'　'}{selection.turn.jp}
        </p>
      ) : (
        <p className="poem-preview">
          {selection.season.romaji}, {selection.image.romaji}, {selection.turn.romaji}.
        </p>
      )}

      <FragmentTray label="Season-word" fragments={SEASON_FRAGMENTS} selectedId={seasonId} mode={displayMode} onSelect={setSeasonId} />
      <FragmentTray label="Image" fragments={IMAGE_FRAGMENTS} selectedId={imageId} mode={displayMode} onSelect={setImageId} />
      <FragmentTray label="Turn" fragments={TURN_FRAGMENTS} selectedId={turnId} mode={displayMode} onSelect={setTurnId} />

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
