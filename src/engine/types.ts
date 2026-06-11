// Core save/data shapes shared by the engine and state stores.
// See GAME_DESIGN.md §13 for the schema this implements.

export type AttributeKey = 'rank' | 'charisma' | 'allure' | 'rhetoric' | 'taste';

export type Attributes = Record<AttributeKey, number>;

export type Resources = {
  koku: number;
  composure: number;
};

export type Check = { attr: AttributeKey; min: number };

export type FactionId = 'regent' | 'rivalHouses' | 'imperial' | 'clergy';

export type Effect =
  | { kind: 'attr'; attr: AttributeKey; delta: number }
  | { kind: 'resource'; res: 'koku' | 'composure' | 'tokimeki'; delta: number }
  | { kind: 'favor'; npc: string; delta: number }
  | { kind: 'flag'; flag: string; value: boolean }
  | { kind: 'ripple'; triggerMonth: number; sceneId: string; ifFlags?: string[] }
  | { kind: 'gossip'; tag: string; factionDeltas: Partial<Record<FactionId, number>>; delayMonths: 1 | 2 }
  | { kind: 'kanzashi'; id: string };

export type RippleEntry = {
  triggerYear: number;
  triggerMonth: number;
  sceneId: string;
  ifFlags?: string[];
};

export type GossipEntry = {
  triggerYear: number;
  triggerMonth: number;
  tag: string;
  factionDeltas: Partial<Record<FactionId, number>>;
};

export type SceneProgress = {
  currentNode: string;
  completed: boolean;
};

export type StaffRole = 'steward' | 'poetTutor' | 'gardener' | 'seamstress';

export const STAFF_ROLES: StaffRole[] = ['steward', 'poetTutor', 'gardener', 'seamstress'];

export type WardrobeState = {
  owned: string[];
  equipped: string | null;
};

/** The four family-background classes (GAME_DESIGN.md §2). */
export type ClassId = 'governors_heir' | 'judges_child' | 'old_name' | 'salon_child';

/** Kanzashi theme tags (GAME_DESIGN.md §8) — metadata on existing choices. */
export type ThemeTag = 'principle' | 'restraint' | 'alignment' | 'grace';

export const CURRENT_SAVE_SCHEMA_VERSION = 5;

export type Save = {
  schemaVersion: number;
  // null until the new-game class picker is completed; permanent thereafter.
  classId: ClassId | null;
  year: number;
  month: number; // 1-12
  tokimeki: number; // resets to 0 at New Year (month 12 -> 1 rollover)
  tokimekiHistory: Record<number, number>; // year -> tokimeki at year-end, for jimoku math

  attributes: Attributes;
  resources: Resources;

  favors: Record<string, number>;
  flags: Record<string, boolean>;
  rippleQueue: RippleEntry[];
  pendingGossip: GossipEntry[];
  factionReputation: Record<FactionId, number>;
  sceneProgress: Record<string, SceneProgress>;

  staff: Record<StaffRole, boolean>;
  wardrobe: WardrobeState;
  actionsRemaining: number; // free actions left this month, reset at month tick

  // Kanzashi (GAME_DESIGN.md §8): owned/equipped persist across years;
  // assignments are re-rolled each year from kanzashiSeed.
  kanzashiOwned: string[];
  kanzashiEquipped: string | null;
  kanzashiAssignments: Record<string, number>; // kanzashiId -> assigned month this year
  kanzashiSeed: number;

  debug: boolean;
};

export const DEFAULT_FACTION_REPUTATION: Record<FactionId, number> = {
  regent: 0,
  rivalHouses: 0,
  imperial: 0,
  clergy: 0,
};

export const DEFAULT_ATTRIBUTES: Attributes = {
  rank: 0,
  charisma: 10,
  allure: 10,
  rhetoric: 10,
  taste: 10,
};

export const DEFAULT_RESOURCES: Resources = {
  koku: 100,
  composure: 100,
};

export const DEFAULT_STAFF: Record<StaffRole, boolean> = {
  steward: false,
  poetTutor: false,
  gardener: false,
  seamstress: false,
};

export const BASE_FREE_ACTIONS = 3;

export function createInitialSave(): Save {
  return {
    schemaVersion: CURRENT_SAVE_SCHEMA_VERSION,
    classId: null,
    year: 1,
    month: 1,
    tokimeki: 0,
    tokimekiHistory: {},
    attributes: { ...DEFAULT_ATTRIBUTES },
    resources: { ...DEFAULT_RESOURCES },
    favors: {},
    flags: {},
    rippleQueue: [],
    pendingGossip: [],
    factionReputation: { ...DEFAULT_FACTION_REPUTATION },
    sceneProgress: {},
    staff: { ...DEFAULT_STAFF },
    wardrobe: { owned: [], equipped: null },
    actionsRemaining: BASE_FREE_ACTIONS,
    kanzashiOwned: [],
    kanzashiEquipped: null,
    kanzashiAssignments: {},
    kanzashiSeed: 1,
    debug: false,
  };
}
