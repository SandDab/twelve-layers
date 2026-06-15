import { useState } from 'react';
import { useGameStore } from './state/gameStore';
import { useKasanePalette } from './styles/useKasanePalette';
import { getKasanePalette } from './styles/kasanePalettes';
import { CalendarStrip } from './ui/CalendarStrip';
import { ClassPicker } from './ui/ClassPicker';
import { HouseholdScreen } from './ui/HouseholdScreen';
import { EventScreen } from './ui/EventScreen';
import { NewYearScreen } from './ui/NewYearScreen';
import { DebugPanel } from './ui/DebugPanel';

type Screen = 'household' | 'event';

function App() {
  const year = useGameStore((s) => s.year);
  const month = useGameStore((s) => s.month);
  const classId = useGameStore((s) => s.classId);
  const jimokuResult = useGameStore((s) => s.jimokuResult);
  const debug = useGameStore((s) => s.debug);
  const setDebug = useGameStore((s) => s.setDebug);
  const [screen, setScreen] = useState<Screen>('household');

  useKasanePalette(month);
  const palette = getKasanePalette(month);

  return (
    <div className="app-shell">
      <header className="app-stage">
        <p className="month-name-jp">{palette.jp}</p>
        <h1 className="month-name-en">{palette.en}</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Year {year} · Month {month}
        </p>
      </header>

      <main className="app-interactive">
        {classId === null ? (
          <ClassPicker />
        ) : jimokuResult ? (
          <div key={`newyear-${jimokuResult.year}`} className="screen-fade">
            <NewYearScreen />
          </div>
        ) : (
          <>
            <CalendarStrip month={month} />

            <nav className="nav-row" aria-label="Main navigation">
              <button
                className="btn"
                aria-current={screen === 'household'}
                onClick={() => setScreen('household')}
              >
                Household
              </button>
              <button
                className="btn"
                aria-current={screen === 'event'}
                onClick={() => setScreen('event')}
              >
                Event
              </button>
            </nav>

            <div key={`${screen}-${year}-${month}`} className="screen-fade">
              {screen === 'household' && <HouseholdScreen />}
              {screen === 'event' && <EventScreen month={month} />}
            </div>
          </>
        )}

        <label className="btn" style={{ display: 'flex', justifyContent: 'space-between' }}>
          Debug panel
          <input
            type="checkbox"
            checked={debug}
            onChange={(e) => setDebug(e.target.checked)}
          />
        </label>

        {debug && <DebugPanel />}
      </main>
    </div>
  );
}

export default App;
