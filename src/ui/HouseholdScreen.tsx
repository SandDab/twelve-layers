import { useGameStore } from '../state/gameStore';

const ATTRIBUTE_LABELS: Record<string, string> = {
  rank: 'Rank',
  charisma: 'Charisma',
  allure: 'Allure',
  rhetoric: 'Rhetoric',
  taste: 'Taste',
};

export function HouseholdScreen() {
  const attributes = useGameStore((s) => s.attributes);
  const resources = useGameStore((s) => s.resources);
  const clout = useGameStore((s) => s.clout);
  const tickMonth = useGameStore((s) => s.tickMonth);

  return (
    <section className="card">
      <h2 style={{ marginTop: 0 }}>Household</h2>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 0 }}>
        Estate income, staff, and training arrive in M2. For now, take stock and
        pass the month.
      </p>

      <div className="stat-grid">
        <div>
          <div className="stat-label">Koku</div>
          <div className="stat-value">{resources.koku}</div>
        </div>
        <div>
          <div className="stat-label">Composure</div>
          <div className="stat-value">{resources.composure}</div>
        </div>
        <div>
          <div className="stat-label">Clout (this year)</div>
          <div className="stat-value">{clout}</div>
        </div>
        {Object.entries(attributes).map(([key, value]) => (
          <div key={key}>
            <div className="stat-label">{ATTRIBUTE_LABELS[key] ?? key}</div>
            <div className="stat-value">{value}</div>
          </div>
        ))}
      </div>

      <button className="btn btn-accent" style={{ marginTop: '1rem', width: '100%' }} onClick={tickMonth}>
        End Month
      </button>
    </section>
  );
}
