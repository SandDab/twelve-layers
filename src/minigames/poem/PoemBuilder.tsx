import { useState } from 'react';
import type { Candidate } from '../../content/npcs';
import { poemFragmentsBySlot } from '../../content/poems';
import { scorePoem, type PoemScoreResult, type PoemSelection } from '../../engine/poems';
import type { Attributes, PoemFragment } from '../../engine/types';

type PoemBuilderProps = {
  candidate: Candidate;
  month: number;
  attributes: Attributes;
  receivedImageTags: string[];
  onSubmit: (selection: PoemSelection, result: PoemScoreResult) => void;
  onCancel?: () => void;
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
 * One-thumb poem composer (GAME_DESIGN.md §6): three taps, season-word
 * -> image -> turn, with a live score preview against the recipient's
 * known tastes, the season, the player's Rhetoric/Taste, and any
 * imagery to call back from their last reply.
 */
export function PoemBuilder({
  candidate,
  month,
  attributes,
  receivedImageTags,
  onSubmit,
  onCancel,
}: PoemBuilderProps) {
  const [seasonId, setSeasonId] = useState(SEASON_FRAGMENTS[0].id);
  const [imageId, setImageId] = useState(IMAGE_FRAGMENTS[0].id);
  const [turnId, setTurnId] = useState(TURN_FRAGMENTS[0].id);

  const selection: PoemSelection = {
    season: SEASON_FRAGMENTS.find((f) => f.id === seasonId)!,
    image: IMAGE_FRAGMENTS.find((f) => f.id === imageId)!,
    turn: TURN_FRAGMENTS.find((f) => f.id === turnId)!,
  };

  const result = scorePoem(selection, candidate.tastes, month, attributes, receivedImageTags);

  return (
    <div className="ikebana-game">
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
        Tap one fragment per line to compose your verse to {candidate.name}.
      </p>

      <p className="poem-preview">
        {selection.season.romaji}, {selection.image.romaji}, {selection.turn.romaji}.
      </p>

      <FragmentTray label="Season-word" fragments={SEASON_FRAGMENTS} selectedId={seasonId} onSelect={setSeasonId} />
      <FragmentTray label="Image" fragments={IMAGE_FRAGMENTS} selectedId={imageId} onSelect={setImageId} />
      <FragmentTray label="Turn" fragments={TURN_FRAGMENTS} selectedId={turnId} onSelect={setTurnId} />

      <div className="stat-grid">
        <div>
          <div className="stat-label">Score</div>
          <div className="stat-value">{result.score} / 60</div>
        </div>
        <div>
          <div className="stat-label">Taste</div>
          <div className="stat-value">{result.breakdown.taste}</div>
        </div>
        <div>
          <div className="stat-label">Season</div>
          <div className="stat-value">{result.breakdown.season}</div>
        </div>
        <div>
          <div className="stat-label">Rhetoric</div>
          <div className="stat-value">{result.breakdown.rhetoric}</div>
        </div>
        <div>
          <div className="stat-label">Callback</div>
          <div className="stat-value">{result.breakdown.callback}</div>
        </div>
      </div>

      <div className="action-grid">
        {onCancel && (
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button className="btn btn-accent" onClick={() => onSubmit(selection, result)}>
          Send Poem
        </button>
      </div>
    </div>
  );
}
