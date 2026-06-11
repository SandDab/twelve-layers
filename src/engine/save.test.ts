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
      tokimeki: 33,
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
  it('persists year rollover and tokimeki reset through localStorage', () => {
    const beforeRollover = {
      ...createInitialSave(),
      year: 1,
      month: 12,
      tokimeki: 77,
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
    expect(reloaded.tokimeki).toBe(0);
    expect(reloaded.tokimekiHistory[1]).toBe(77);
    expect(reloaded.resources).toEqual({ koku: 500, composure: 60 });
  });
});

describe('schema migration', () => {
  it('migrates a v1 save with clout fields to v2 tokimeki fields', () => {
    const v1Save = {
      schemaVersion: 1,
      year: 2,
      month: 5,
      clout: 42,
      cloutHistory: { 1: 99 },
      attributes: { rank: 0, charisma: 10, allure: 10, rhetoric: 10, taste: 10 },
      resources: { koku: 100, composure: 100 },
      favors: {},
      flags: {},
      rippleQueue: [],
      pendingGossip: [],
      factionReputation: { regent: 0, rivalHouses: 0, imperial: 0, clergy: 0 },
      sceneProgress: {},
      debug: false,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(v1Save));

    const loaded = loadSave();
    expect(loaded.schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
    expect(loaded.tokimeki).toBe(42);
    expect(loaded.tokimekiHistory).toEqual({ 1: 99 });
    expect((loaded as unknown as { clout?: number }).clout).toBeUndefined();
  });

  it('migrates a v2 save (no staff/wardrobe/actionsRemaining) to v3 with M2 defaults', () => {
    const v2Save = {
      schemaVersion: 2,
      year: 1,
      month: 5,
      tokimeki: 12,
      tokimekiHistory: {},
      attributes: { rank: 0, charisma: 10, allure: 10, rhetoric: 10, taste: 10 },
      resources: { koku: 100, composure: 100 },
      favors: {},
      flags: {},
      rippleQueue: [],
      pendingGossip: [],
      factionReputation: { regent: 0, rivalHouses: 0, imperial: 0, clergy: 0 },
      sceneProgress: {},
      debug: false,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(v2Save));

    const loaded = loadSave();
    expect(loaded.schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
    expect(loaded.tokimeki).toBe(12);
    expect(loaded.staff).toEqual({ steward: false, poetTutor: false, gardener: false, seamstress: false });
    expect(loaded.wardrobe).toEqual({ owned: [], equipped: null });
    expect(loaded.actionsRemaining).toBe(3);
  });

  it('migrates a v3 save (no classId) to v4, defaulting to the Governor\'s Heir', () => {
    const v3Save = {
      schemaVersion: 3,
      year: 1,
      month: 5,
      tokimeki: 12,
      tokimekiHistory: {},
      attributes: { rank: 0, charisma: 10, allure: 10, rhetoric: 10, taste: 10 },
      resources: { koku: 100, composure: 100 },
      favors: {},
      flags: {},
      rippleQueue: [],
      pendingGossip: [],
      factionReputation: { regent: 0, rivalHouses: 0, imperial: 0, clergy: 0 },
      sceneProgress: {},
      staff: { steward: false, poetTutor: false, gardener: false, seamstress: false },
      wardrobe: { owned: [], equipped: null },
      actionsRemaining: 3,
      debug: false,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(v3Save));

    const loaded = loadSave();
    expect(loaded.schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
    expect(loaded.classId).toBe('governors_heir');
  });
});
