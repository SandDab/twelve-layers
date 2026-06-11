import { KANZASHI, KANZASHI_IDS } from '../content/kanzashi';
import { ROBES } from '../content/robes';
import { STAFF_DEFINITIONS } from '../content/staff';
import { getTokimekiTier } from '../content/tokimekiTiers';
import { computeRestGain, computeTrainGain, seasonOfMonth, TRAIN_COMPOSURE_COST } from '../engine/household';
import { STAFF_ROLES, type AttributeKey } from '../engine/types';
import { useGameStore } from '../state/gameStore';

const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  rank: 'Rank',
  charisma: 'Charisma',
  allure: 'Allure',
  rhetoric: 'Rhetoric',
  taste: 'Taste',
};

const SEASON_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: 'Spring',
  2: 'Summer',
  3: 'Autumn',
  4: 'Winter',
};

export function HouseholdScreen() {
  const month = useGameStore((s) => s.month);
  const attributes = useGameStore((s) => s.attributes);
  const resources = useGameStore((s) => s.resources);
  const tokimeki = useGameStore((s) => s.tokimeki);
  const staff = useGameStore((s) => s.staff);
  const wardrobe = useGameStore((s) => s.wardrobe);
  const kanzashiOwned = useGameStore((s) => s.kanzashiOwned);
  const kanzashiEquipped = useGameStore((s) => s.kanzashiEquipped);
  const equipKanzashi = useGameStore((s) => s.equipKanzashi);
  const actionsRemaining = useGameStore((s) => s.actionsRemaining);
  const tickMonth = useGameStore((s) => s.tickMonth);
  const hireStaff = useGameStore((s) => s.hireStaff);
  const trainAttribute = useGameStore((s) => s.trainAttribute);
  const rest = useGameStore((s) => s.rest);
  const buyRobe = useGameStore((s) => s.buyRobe);
  const equipRobe = useGameStore((s) => s.equipRobe);

  const tier = getTokimekiTier(tokimeki);
  const currentSeason = seasonOfMonth(month);
  const canTrain = actionsRemaining > 0 && resources.composure >= TRAIN_COMPOSURE_COST;
  const canRest = actionsRemaining > 0;

  return (
    <>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Household</h2>

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
            <div className="stat-label">Tokimeki (this year)</div>
            <div className="stat-value">{tokimeki}</div>
          </div>
          <div>
            <div className="stat-label">Standing</div>
            <div className="stat-value">{tier.name}</div>
          </div>
          {Object.entries(attributes).map(([key, value]) => (
            <div key={key}>
              <div className="stat-label">{ATTRIBUTE_LABELS[key as AttributeKey] ?? key}</div>
              <div className="stat-value">{value}</div>
            </div>
          ))}
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{tier.description}</p>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0 }}>Free Actions ({actionsRemaining} left)</h2>
        <div className="action-grid">
          {(Object.keys(ATTRIBUTE_LABELS) as AttributeKey[]).map((attr) => (
            <button
              key={attr}
              className="btn"
              disabled={!canTrain}
              onClick={() => trainAttribute(attr)}
            >
              Train {ATTRIBUTE_LABELS[attr]} (+{computeTrainGain(attr, staff)})
            </button>
          ))}
          <button className="btn" disabled={!canRest} onClick={() => rest()}>
            Rest (+{computeRestGain(staff)} Composure)
          </button>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
          Training costs {TRAIN_COMPOSURE_COST} Composure.
        </p>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0 }}>Staff</h2>
        {STAFF_ROLES.map((role) => {
          const def = STAFF_DEFINITIONS[role];
          const hired = staff[role];
          return (
            <div className="list-row" key={role}>
              <div className="list-row-info">
                <span className="list-row-title">{def.name}</span>
                <span className="list-row-desc">{def.description}</span>
              </div>
              {hired ? (
                <span className="list-row-status">Hired</span>
              ) : (
                <button
                  className="btn"
                  disabled={resources.koku < def.cost}
                  onClick={() => hireStaff(role)}
                >
                  Hire ({def.cost} koku)
                </button>
              )}
            </div>
          );
        })}
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0 }}>Wardrobe</h2>
        {!staff.seamstress && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            Hire a Seamstress to equip robes.
          </p>
        )}
        {ROBES.map((robe) => {
          const owned = wardrobe.owned.includes(robe.id);
          const equipped = wardrobe.equipped === robe.id;
          const inSeason = robe.season === currentSeason;
          return (
            <div className="list-row" key={robe.id}>
              <div className="list-row-info">
                <span className="list-row-title">{robe.name}</span>
                <span className="list-row-desc">
                  {SEASON_LABELS[robe.season]} · {robe.kasane[0]} / {robe.kasane[1]}
                  {inSeason ? ' · in season' : ' · out of season'}
                </span>
              </div>
              {!owned ? (
                <button className="btn" disabled={resources.koku < robe.cost} onClick={() => buyRobe(robe.id)}>
                  Buy ({robe.cost} koku)
                </button>
              ) : equipped ? (
                <button className="btn" disabled={!staff.seamstress} onClick={() => equipRobe(null)}>
                  Unequip
                </button>
              ) : (
                <button className="btn" disabled={!staff.seamstress} onClick={() => equipRobe(robe.id)}>
                  Equip
                </button>
              )}
            </div>
          );
        })}
      </section>

      {kanzashiOwned.length > 0 && (
        <section className="card">
          <h2 style={{ marginTop: 0 }}>Kanzashi</h2>
          {KANZASHI_IDS.filter((id) => kanzashiOwned.includes(id)).map((id) => {
            const def = KANZASHI[id];
            const equipped = kanzashiEquipped === id;
            return (
              <div className="list-row" key={id}>
                <div className="list-row-info">
                  <span className="list-row-title">{def.name}</span>
                  <span className="list-row-desc">
                    {def.color} · {def.passiveSummary}
                  </span>
                </div>
                {equipped ? (
                  <button className="btn" onClick={() => equipKanzashi(null)}>
                    Unequip
                  </button>
                ) : (
                  <button className="btn" onClick={() => equipKanzashi(id)}>
                    Equip
                  </button>
                )}
              </div>
            );
          })}
        </section>
      )}

      <button className="btn btn-accent" style={{ width: '100%' }} onClick={tickMonth}>
        End Month
      </button>
    </>
  );
}
