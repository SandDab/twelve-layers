import { getAnchorEvent } from '../content/calendar';

type EventScreenProps = {
  month: number;
};

export function EventScreen({ month }: EventScreenProps) {
  const anchor = getAnchorEvent(month);

  return (
    <section className="card">
      <h2 style={{ marginTop: 0 }}>Anchor Event</h2>
      {anchor ? (
        <>
          <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{anchor.name}</p>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 0 }}>{anchor.focus}</p>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Scene content arrives in M1. This screen will host the scene runner.
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
