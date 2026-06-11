import { beforeEach, describe, expect, it } from 'vitest';
import { tickCalendar } from './calendar';
import { clearSave, loadSave, SAVE_KEY, writeSave } from './save';
import { CURRENT_SAVE_SCHEMA_VERSION, createInitialSave } from './types';

beforeEach(() => {
  localStorage.clear();
});

describe('loadSave / writeSave', () => {
  it('returns a fresh initial save when nothing is stored', () => {
    const save = loadSave();
    expect(save).toEqual(createInitialSave());
  });

  it('round-trips a save through localStorage', () => {
    const save = {
      ...createInitialSave(),
      year: 2,
      month: 5,
      clout: 33,
      attributes: { rank: 10, charisma: 25, allure: 25, rhetoric: 25, taste: 25 },
    };

    writeSave(save);
    expect(loadSave()).toEqual(save);
  });

  it('stores under the documented save key with a schema version field', () => {
    writeSave(createInitialSave());
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY)!);
    expect(raw.schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
  });

  it('falls back to an initial save on corrupted JSON', () => {
    localStorage.setItem(SAVE_KEY, '{ not valid json');
    expect(loadSave()).toEqual(createInitialSave());
  });

  it('clears the save', () => {
    writeSave(createInitialSave());
    clearSave();
    expect(localStorage.getItem(SAVE_KEY)).toBeNull();
  });
});

describe('save/load round-trip across a year boundary', () => {
  it('persists year rollover and clout reset through localStorage', () => {
    const beforeRollover = {
      ...createInitialSave(),
      year: 1,
      month: 12,
      clout: 77,
      resources: { koku: 500, composure: 60 },
    };
    writeSave(beforeRollover);

    // Simulate a reload, then tick into the new year.
    const loaded = loadSave();
    const afterRollover = tickCalendar(loaded);
    writeSave(afterRollover);

    // Simulate a second reload.
    const reloaded = loadSave();
    expect(reloaded.year).toBe(2);
    expect(reloaded.month).toBe(1);
    expect(reloaded.clout).toBe(0);
    expect(reloaded.cloutHistory[1]).toBe(77);
    expect(reloaded.resources).toEqual({ koku: 500, composure: 60 });
  });
});
