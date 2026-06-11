import { CLASSES, CLASS_IDS } from '../content/classes';
import { useGameStore } from '../state/gameStore';

const ATTR_LABELS = {
  charisma: 'Cha',
  allure: 'All',
  rhetoric: 'Rhe',
  taste: 'Taste',
} as const;

export function ClassPicker() {
  const chooseClass = useGameStore((s) => s.chooseClass);

  return (
    <section className="card">
      <h2 style={{ marginTop: 0 }}>Choose Your House</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
        Your family&rsquo;s standing shapes how the year begins, and what it owes. This choice is
        permanent.
      </p>

      {CLASS_IDS.map((id) => {
        const def = CLASSES[id];
        return (
          <div className="card class-card" key={id}>
            <h3 style={{ margin: '0 0 0.25rem' }}>{def.name}</h3>
            <p style={{ margin: '0 0 0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              {def.blurb}
            </p>

            <div className="stat-grid" style={{ marginBottom: '0.5rem' }}>
              {(Object.keys(ATTR_LABELS) as (keyof typeof ATTR_LABELS)[]).map((attr) => (
                <div key={attr}>
                  <div className="stat-label">{ATTR_LABELS[attr]}</div>
                  <div className="stat-value">{def.attrs[attr]}</div>
                </div>
              ))}
            </div>

            <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem' }}>
              <strong>Perk:</strong> {def.perkSummary}
            </p>
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              <strong>Liability:</strong> {def.liabilitySummary}
            </p>

            <button className="btn btn-accent" style={{ width: '100%' }} onClick={() => chooseClass(id)}>
              Choose {def.name}
            </button>
          </div>
        );
      })}
    </section>
  );
}
