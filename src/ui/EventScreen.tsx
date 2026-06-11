import { getAnchorEvent } from '../content/calendar';
import { getScene } from '../content/scenes';
import { useGameStore } from '../state/gameStore';
import { SceneRunner } from './SceneRunner';

type EventScreenProps = {
  month: number;
};

export function EventScreen({ month }: EventScreenProps) {
  const year = useGameStore((s) => s.year);
  const rippleQueue = useGameStore((s) => s.rippleQueue);
  const consumeRippleAction = useGameStore((s) => s.consumeRipple);
  const anchor = getAnchorEvent(month);

  const dueRipple = rippleQueue.find((r) => r.triggerYear === year && r.triggerMonth === month);
  const rippleScene = dueRipple ? getScene(dueRipple.sceneId) : undefined;

  if (dueRipple && rippleScene) {
    return (
      <SceneRunner
        key={rippleScene.id}
        scene={rippleScene}
        onComplete={() => consumeRippleAction(dueRipple)}
      />
    );
  }

  const anchorScene = anchor?.sceneId ? getScene(anchor.sceneId) : undefined;
  if (anchorScene) {
    return <SceneRunner key={anchorScene.id} scene={anchorScene} />;
  }

  return (
    <section className="card">
      <h2 style={{ marginTop: 0 }}>Anchor Event</h2>
      {anchor ? (
        <>
          <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{anchor.name}</p>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 0 }}>{anchor.focus}</p>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Scene content arrives in a later milestone.
          </p>
        </>
      ) : (
        <p style={{ color: 'var(--color-text-muted)' }}>
          A quiet month at court — no anchor event. Free actions and household
          business arrive in later milestones.
        </p>
      )}
    </section>
  );
}
