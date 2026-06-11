import { CURRENT_SAVE_SCHEMA_VERSION, createInitialSave, type Save } from './types';

export const SAVE_KEY = 'twelvelayers.save.v1';

/**
 * Migrate a parsed save of any prior schema version up to the
 * current shape. Each step should be a pure, additive transform.
 * No versions below 1 exist yet, so this is currently a passthrough.
 */
function migrate(raw: unknown): Save {
  let save = raw as Save & { clout?: number; cloutHistory?: Record<number, number> };

  if (save.schemaVersion < 1) {
    // placeholder for future migrations
    save = { ...save, schemaVersion: 1 };
  }

  if (save.schemaVersion < 2) {
    const { clout, cloutHistory, ...rest } = save;
    save = {
      ...rest,
      schemaVersion: 2,
      tokimeki: clout ?? 0,
      tokimekiHistory: cloutHistory ?? {},
    };
  }

  return { ...createInitialSave(), ...save, schemaVersion: CURRENT_SAVE_SCHEMA_VERSION };
}

export function loadSave(): Save {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return createInitialSave();

  try {
    const parsed = JSON.parse(raw);
    return migrate(parsed);
  } catch {
    return createInitialSave();
  }
}

export function writeSave(save: Save): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}
