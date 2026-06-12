import { create } from 'zustand';
import { computeComposureCap } from '../content/classes';
import { LOVE_INTERESTS } from '../content/loveInterests';
import { getRobe } from '../content/robes';
import { STAFF_DEFINITIONS } from '../content/staff';
import { applyEffects } from '../engine/effects';
import {
  applyMonthEnd,
  computeRestGain,
  computeTrainGain,
  TRAIN_COMPOSURE_COST,
} from '../engine/household';
import { recordThemeTags } from '../engine/introDirector';
import { applyKanzashiAttrBonuses, checkKanzashiAward } from '../engine/kanzashi';
import { applyClass } from '../engine/newGame';
import { consumeRipple } from '../engine/ripples';
import { clearSave, loadSave, writeSave } from '../engine/save';
import {
  createInitialSave,
  type AttributeKey,
  type ClassId,
  type Effect,
  type PcGender,
  type RippleEntry,
  type Save,
  type StaffRole,
  type ThemeTag,
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
  checkKanzashiAward: (themeTags?: ThemeTag[]) => void;
  setSceneNode: (sceneId: string, nodeId: string) => void;
  completeScene: (sceneId: string) => void;
  hireStaff: (role: StaffRole) => void;
  trainAttribute: (attr: AttributeKey) => void;
  practiceIkebana: (tasteDelta: number) => void;
  practiceRaking: (composureGain: number) => void;
  rest: () => void;
  buyRobe: (robeId: string) => void;
  equipRobe: (robeId: string | null) => void;
  equipKanzashi: (kanzashiId: string | null) => void;
  chooseClass: (classId: ClassId, pcGender: PcGender) => void;
  resetSave: () => void;
}

const SAVE_FIELDS = [
  'schemaVersion',
  'classId',
  'pcGender',
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
  'staff',
  'wardrobe',
  'actionsRemaining',
  'kanzashiOwned',
  'kanzashiEquipped',
  'kanzashiAssignments',
  'kanzashiSeed',
  'kanzashiGifted',
  'romance',
  'introDirector',
  'married',
  'themeTagCounts',
  'poemDisplayMode',
  'jimokuResult',
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
      const next = applyMonthEnd(extractSave(state));
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
      const cap = computeComposureCap(state.classId, state.kanzashiEquipped);
      const next: Save = {
        ...extractSave(state),
        resources: { ...state.resources, composure: Math.max(0, Math.min(cap, value)) },
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

  checkKanzashiAward: (themeTags) =>
    set((state) => {
      const save = extractSave(state);
      let next = checkKanzashiAward(save, themeTags);
      next = recordThemeTags(next, themeTags, Object.values(LOVE_INTERESTS));
      if (next === save) return state;
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

  hireStaff: (role) =>
    set((state) => {
      if (state.staff[role] || state.resources.koku < STAFF_DEFINITIONS[role].cost) return state;
      const next: Save = {
        ...extractSave(state),
        resources: { ...state.resources, koku: state.resources.koku - STAFF_DEFINITIONS[role].cost },
        staff: { ...state.staff, [role]: true },
      };
      writeSave(next);
      return next;
    }),

  trainAttribute: (attr) =>
    set((state) => {
      if (state.actionsRemaining <= 0 || state.resources.composure < TRAIN_COMPOSURE_COST) return state;
      const save = extractSave(state);
      const gain = computeTrainGain(attr, save.staff);
      const next: Save = {
        ...applyEffects(
          [
            { kind: 'attr', attr, delta: gain },
            { kind: 'resource', res: 'composure', delta: -TRAIN_COMPOSURE_COST },
          ],
          save,
        ),
        actionsRemaining: state.actionsRemaining - 1,
      };
      writeSave(next);
      return next;
    }),

  practiceIkebana: (tasteDelta) =>
    set((state) => {
      if (state.actionsRemaining <= 0) return state;
      const next: Save = {
        ...applyEffects([{ kind: 'attr', attr: 'taste', delta: tasteDelta }], extractSave(state)),
        actionsRemaining: state.actionsRemaining - 1,
      };
      writeSave(next);
      return next;
    }),

  practiceRaking: (composureGain) =>
    set((state) => {
      if (state.actionsRemaining <= 0) return state;
      const next: Save = {
        ...applyEffects([{ kind: 'resource', res: 'composure', delta: composureGain }], extractSave(state)),
        actionsRemaining: state.actionsRemaining - 1,
      };
      writeSave(next);
      return next;
    }),

  rest: () =>
    set((state) => {
      if (state.actionsRemaining <= 0) return state;
      const save = extractSave(state);
      const gain = computeRestGain(save.staff);
      const cap = computeComposureCap(save.classId, save.kanzashiEquipped);
      const next: Save = {
        ...save,
        resources: { ...save.resources, composure: Math.min(cap, save.resources.composure + gain) },
        actionsRemaining: state.actionsRemaining - 1,
      };
      writeSave(next);
      return next;
    }),

  buyRobe: (robeId) =>
    set((state) => {
      const robe = getRobe(robeId);
      if (!robe || state.wardrobe.owned.includes(robeId) || state.resources.koku < robe.cost) {
        return state;
      }
      const next: Save = {
        ...extractSave(state),
        resources: { ...state.resources, koku: state.resources.koku - robe.cost },
        wardrobe: { ...state.wardrobe, owned: [...state.wardrobe.owned, robeId] },
      };
      writeSave(next);
      return next;
    }),

  equipRobe: (robeId) =>
    set((state) => {
      if (!state.staff.seamstress) return state;
      if (robeId !== null && !state.wardrobe.owned.includes(robeId)) return state;
      const next: Save = {
        ...extractSave(state),
        wardrobe: { ...state.wardrobe, equipped: robeId },
      };
      writeSave(next);
      return next;
    }),

  equipKanzashi: (kanzashiId) =>
    set((state) => {
      if (kanzashiId !== null && !state.kanzashiOwned.includes(kanzashiId)) return state;
      if (kanzashiId === state.kanzashiEquipped) return state;

      let next = extractSave(state);
      if (next.kanzashiEquipped) {
        next = applyKanzashiAttrBonuses(next, next.kanzashiEquipped, -1);
      }
      if (kanzashiId) {
        next = applyKanzashiAttrBonuses(next, kanzashiId, 1);
      }
      next = { ...next, kanzashiEquipped: kanzashiId };

      const cap = computeComposureCap(next.classId, next.kanzashiEquipped);
      next = {
        ...next,
        resources: { ...next.resources, composure: Math.min(cap, next.resources.composure) },
      };

      writeSave(next);
      return next;
    }),

  chooseClass: (classId, pcGender) =>
    set((state) => {
      if (state.classId !== null) return state;
      const next = { ...applyClass(extractSave(state), classId), pcGender };
      writeSave(next);
      return next;
    }),

  resetSave: () =>
    set(() => {
      clearSave();
      return createInitialSave();
    }),
}));
