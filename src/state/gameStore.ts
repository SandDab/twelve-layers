import { create } from 'zustand';
import { tickCalendar } from '../engine/calendar';
import { applyEffects } from '../engine/effects';
import { consumeRipple, resolveDueGossip } from '../engine/ripples';
import { clearSave, loadSave, writeSave } from '../engine/save';
import {
  createInitialSave,
  type AttributeKey,
  type Effect,
  type RippleEntry,
  type Save,
} from '../engine/types';

export interface GameState extends Save {
  tickMonth: () => void;
  setMonthYear: (month: number, year: number) => void;
  setAttribute: (attr: AttributeKey, value: number) => void;
  grantKoku: (delta: number) => void;
  grantTokimeki: (delta: number) => void;
  setComposure: (value: number) => void;
  setDebug: (debug: boolean) => void;
  addRipple: (ripple: RippleEntry) => void;
  consumeRipple: (ripple: RippleEntry) => void;
  applyChoiceEffects: (effects: Effect[]) => void;
  setSceneNode: (sceneId: string, nodeId: string) => void;
  completeScene: (sceneId: string) => void;
  resetSave: () => void;
}

const SAVE_FIELDS = [
  'schemaVersion',
  'year',
  'month',
  'tokimeki',
  'tokimekiHistory',
  'attributes',
  'resources',
  'favors',
  'flags',
  'rippleQueue',
  'pendingGossip',
  'factionReputation',
  'sceneProgress',
  'debug',
] as const;

export function extractSave(state: GameState): Save {
  const save = {} as Record<(typeof SAVE_FIELDS)[number], unknown>;
  for (const key of SAVE_FIELDS) {
    save[key] = state[key];
  }
  return save as unknown as Save;
}

export const useGameStore = create<GameState>((set) => ({
  ...loadSave(),

  tickMonth: () =>
    set((state) => {
      const next = resolveDueGossip(tickCalendar(extractSave(state)));
      writeSave(next);
      return next;
    }),

  setMonthYear: (month, year) =>
    set((state) => {
      const next: Save = {
        ...extractSave(state),
        month: Math.min(12, Math.max(1, Math.round(month))),
        year: Math.max(1, Math.round(year)),
      };
      writeSave(next);
      return next;
    }),

  setAttribute: (attr, value) =>
    set((state) => {
      const next: Save = {
        ...extractSave(state),
        attributes: { ...state.attributes, [attr]: value },
      };
      writeSave(next);
      return next;
    }),

  grantKoku: (delta) =>
    set((state) => {
      const next: Save = {
        ...extractSave(state),
        resources: { ...state.resources, koku: state.resources.koku + delta },
      };
      writeSave(next);
      return next;
    }),

  grantTokimeki: (delta) =>
    set((state) => {
      const next: Save = {
        ...extractSave(state),
        tokimeki: Math.max(0, state.tokimeki + delta),
      };
      writeSave(next);
      return next;
    }),

  setComposure: (value) =>
    set((state) => {
      const next: Save = {
        ...extractSave(state),
        resources: { ...state.resources, composure: Math.max(0, Math.min(100, value)) },
      };
      writeSave(next);
      return next;
    }),

  setDebug: (debug) =>
    set((state) => {
      const next: Save = { ...extractSave(state), debug };
      writeSave(next);
      return next;
    }),

  addRipple: (ripple) =>
    set((state) => {
      const next: Save = {
        ...extractSave(state),
        rippleQueue: [...state.rippleQueue, ripple],
      };
      writeSave(next);
      return next;
    }),

  consumeRipple: (ripple) =>
    set((state) => {
      const next = consumeRipple(extractSave(state), ripple);
      writeSave(next);
      return next;
    }),

  applyChoiceEffects: (effects) =>
    set((state) => {
      const next = applyEffects(effects, extractSave(state));
      writeSave(next);
      return next;
    }),

  setSceneNode: (sceneId, nodeId) =>
    set((state) => {
      const next: Save = {
        ...extractSave(state),
        sceneProgress: {
          ...state.sceneProgress,
          [sceneId]: { currentNode: nodeId, completed: false },
        },
      };
      writeSave(next);
      return next;
    }),

  completeScene: (sceneId) =>
    set((state) => {
      const existing = state.sceneProgress[sceneId];
      const next: Save = {
        ...extractSave(state),
        sceneProgress: {
          ...state.sceneProgress,
          [sceneId]: { currentNode: existing?.currentNode ?? '', completed: true },
        },
      };
      writeSave(next);
      return next;
    }),

  resetSave: () =>
    set(() => {
      clearSave();
      return createInitialSave();
    }),
}));
