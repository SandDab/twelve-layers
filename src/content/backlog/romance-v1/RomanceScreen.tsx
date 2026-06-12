import { useState } from 'react';
import { CANDIDATE_LIST } from '../content/npcs';
import { getScene } from '../content/scenes';
import type { PoemScoreResult, PoemSelection } from '../engine/poems';
import type { CandidateId, RomanceStage } from '../engine/types';
import { PoemBuilder } from '../minigames/poem/PoemBuilder';
import { useGameStore } from '../state/gameStore';
import { SceneRunner } from './SceneRunner';

const STAGE_LABELS: Record<RomanceStage, string> = {
  1: 'Rumor',
  2: 'First poem',
  3: 'Exchange',
  4: 'Behind the curtain',
  5: 'Kaimami',
  6: 'Commitment',
};

export function RomanceScreen() {
  const month = useGameStore((s) => s.month);
  const year = useGameStore((s) => s.year);
  const attributes = useGameStore((s) => s.attributes);
  const romance = useGameStore((s) => s.romance);
  const favors = useGameStore((s) => s.favors);
  const sendPoem = useGameStore((s) => s.sendPoem);

  const [composingId, setComposingId] = useState<CandidateId | null>(null);
  const [lastResult, setLastResult] = useState<{ candidateId: CandidateId; result: PoemScoreResult } | null>(null);

  const composing = composingId ? CANDIDATE_LIST.find((c) => c.id === composingId) : undefined;

  if (composing) {
    const state = romance[composing.id];
    return (
      <section className="card">
        <h2 style={{ marginTop: 0 }}>{composing.name}</h2>
        <PoemBuilder
          candidate={composing}
          month={month}
          attributes={attributes}
          receivedImageTags={state.receivedImageTags}
          onCancel={() => setComposingId(null)}
          onSubmit={(selection: PoemSelection) => {
            const result = sendPoem(composing.id, selection);
            if (result) {
              setLastResult({ candidateId: composing.id, result });
            }
            setComposingId(null);
          }}
        />
      </section>
    );
  }

  return (
    <>
      {CANDIDATE_LIST.map((candidate) => {
        const state = romance[candidate.id];
        const stageLabel = STAGE_LABELS[state.stage];
        const canSend = state.stage < 4 && (state.lastSentYear !== year || state.lastSentMonth !== month);
        const showResult = lastResult?.candidateId === candidate.id;
        const curtainScene = state.stage >= 4 ? getScene(candidate.curtainSceneId) : undefined;

        return (
          <section className="card" key={candidate.id}>
            <h2 style={{ marginTop: 0 }}>{candidate.name}</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: 0 }}>{candidate.blurb}</p>

            <div className="stat-grid">
              <div>
                <div className="stat-label">Stage</div>
                <div className="stat-value">{stageLabel}</div>
              </div>
              <div>
                <div className="stat-label">Favor</div>
                <div className="stat-value">{favors[candidate.id] ?? 0}</div>
              </div>
            </div>

            {showResult && (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {lastResult.result.success
                  ? 'Your verse was well received.'
                  : 'Your verse missed its mark, and word of it will travel.'}{' '}
                (score {lastResult.result.score} / 60)
              </p>
            )}

            {state.stage < 4 && (
              <button className="btn btn-accent" disabled={!canSend} onClick={() => setComposingId(candidate.id)}>
                {canSend ? 'Compose poem' : 'Already sent a poem this month'}
              </button>
            )}

            {curtainScene && <SceneRunner key={curtainScene.id} scene={curtainScene} />}
          </section>
        );
      })}
    </>
  );
}
