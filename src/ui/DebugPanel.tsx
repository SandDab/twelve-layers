import { useState } from 'react';
import { useGameStore } from '../state/gameStore';
import type { AttributeKey, ThemeTag } from '../engine/types';

const ATTRIBUTE_KEYS: AttributeKey[] = ['rank', 'charisma', 'allure', 'rhetoric', 'taste'];
const THEME_TAGS: ThemeTag[] = ['principle', 'restraint', 'alignment', 'grace'];

export function DebugPanel() {
  const year = useGameStore((s) => s.year);
  const month = useGameStore((s) => s.month);
  const classId = useGameStore((s) => s.classId);
  const pcGender = useGameStore((s) => s.pcGender);
  const attributes = useGameStore((s) => s.attributes);
  const tokimekiHistory = useGameStore((s) => s.tokimekiHistory);
  const rippleQueue = useGameStore((s) => s.rippleQueue);
  const romance = useGameStore((s) => s.romance);
  const introDirector = useGameStore((s) => s.introDirector);
  const themeTagCounts = useGameStore((s) => s.themeTagCounts);
  const setMonthYear = useGameStore((s) => s.setMonthYear);
  const setAttribute = useGameStore((s) => s.setAttribute);
  const grantKoku = useGameStore((s) => s.grantKoku);
  const grantTokimeki = useGameStore((s) => s.grantTokimeki);
  const addRipple = useGameStore((s) => s.addRipple);
  const checkKanzashiAward = useGameStore((s) => s.checkKanzashiAward);
  const applyChoiceEffects = useGameStore((s) => s.applyChoiceEffects);
  const tickMonth = useGameStore((s) => s.tickMonth);
  const resetSave = useGameStore((s) => s.resetSave);

  const [rippleScene, setRippleScene] = useState('m4_aoi_carriage_03');
  const [rippleMonth, setRippleMonth] = useState(month);

  return (
    <section className="debug-panel">
      <h2>Debug Panel</h2>

      <div className="debug-row">
        <label>Class</label>
        <span>{classId ?? '(none yet)'}</span>
      </div>

      <div className="debug-row">
        <label>Gender</label>
        <span>{pcGender ?? '(none yet)'}</span>
      </div>

      <div className="debug-row">
        <label htmlFor="dbg-year">Year</label>
        <input
          id="dbg-year"
          type="number"
          min={1}
          value={year}
          onChange={(e) => setMonthYear(month, Number(e.target.value))}
        />
        <label htmlFor="dbg-month">Month</label>
        <input
          id="dbg-month"
          type="number"
          min={1}
          max={12}
          value={month}
          onChange={(e) => setMonthYear(Number(e.target.value), year)}
        />
      </div>

      {ATTRIBUTE_KEYS.map((attr) => (
        <div className="debug-row" key={attr}>
          <label htmlFor={`dbg-attr-${attr}`}>{attr}</label>
          <input
            id={`dbg-attr-${attr}`}
            type="number"
            min={0}
            max={100}
            value={attributes[attr]}
            onChange={(e) => setAttribute(attr, Number(e.target.value))}
          />
        </div>
      ))}

      <div className="debug-row">
        <label>Koku</label>
        <button className="btn" onClick={() => grantKoku(50)}>+50</button>
        <button className="btn" onClick={() => grantKoku(-50)}>-50</button>
      </div>

      <div className="debug-row">
        <label>Tokimeki</label>
        <button className="btn" onClick={() => grantTokimeki(10)}>+10</button>
        <button className="btn" onClick={() => grantTokimeki(-10)}>-10</button>
      </div>

      <div className="debug-row">
        <label htmlFor="dbg-ripple-month">Ripple @</label>
        <input
          id="dbg-ripple-month"
          type="number"
          min={1}
          max={12}
          value={rippleMonth}
          onChange={(e) => setRippleMonth(Number(e.target.value))}
        />
        <input
          id="dbg-ripple-scene"
          type="text"
          value={rippleScene}
          onChange={(e) => setRippleScene(e.target.value)}
        />
        <button
          className="btn"
          onClick={() =>
            addRipple({ triggerYear: year, triggerMonth: rippleMonth, sceneId: rippleScene })
          }
        >
          Queue
        </button>
      </div>

      {rippleQueue.length > 0 && (
        <div className="debug-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <label>Ripple queue</label>
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {rippleQueue.map((r, i) => (
              <li key={i}>
                Y{r.triggerYear} M{r.triggerMonth}: {r.sceneId}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="debug-row">
        <label>Romance</label>
        <button className="btn" onClick={tickMonth}>Tick Month</button>
      </div>

      <div className="debug-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <label>Theme tag counts</label>
        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
          {THEME_TAGS.map((tag) => (
            <li key={tag}>
              {tag}: {themeTagCounts[tag]}{' '}
              <button className="btn" onClick={() => checkKanzashiAward([tag])}>+1</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="debug-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <label>Intro director</label>
        <span>
          intros this year: {introDirector.introsThisYear}
          {introDirector.lastIntroMonth !== undefined && `, last intro month: ${introDirector.lastIntroMonth}`}
          {introDirector.queued && `, queued: ${introDirector.queued}`}
        </span>
      </div>

      {Object.keys(romance).length > 0 && (
        <div className="debug-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <label>Romance state</label>
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {Object.entries(romance).map(([id, state]) => (
              <li key={id}>
                {id}: stage {state.stage}, interest {state.interest}
                {state.closed ? ', closed' : ''}
                {' '}
                <button className="btn" onClick={() => applyChoiceEffects([{ kind: 'courtshipSignal', signal: 'acclaim' }])}>
                  +acclaim
                </button>
                <button className="btn" onClick={() => applyChoiceEffects([{ kind: 'courtshipSignal', signal: 'deference' }])}>
                  +deference
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {Object.keys(tokimekiHistory).length > 0 && (
        <div className="debug-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <label>Tokimeki history</label>
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {Object.entries(tokimekiHistory).map(([y, c]) => (
              <li key={y}>Year {y}: {c}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="debug-row">
        <button className="btn" onClick={resetSave}>Reset Save</button>
      </div>
    </section>
  );
}
