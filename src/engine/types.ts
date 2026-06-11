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
  | { kind: 'resource'; res: 'koku' | 'composure' | 'clout'; delta: number }
  | { kind: 'favor'; npc: string; delta: number }
  | { kind: 'flag'; flag: string; value: boolean }
  | { kind: 'ripple'; triggerMonth: number; sceneId: string; ifFlags?: string[] }
  | { kind: 'gossip'; tag: string; factionDeltas: Partial<Record<FactionId, number>>; delayMonths: 1 | 2 };

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

export const CURRENT_SAVE_SCHEMA_VERSION = 1;

export type Save = {
  schemaVersion: number;
  year: number;
  month: number; // 1-12
  clout: number; // resets to 0 at New Year (month 12 -> 1 rollover)
  cloutHistory: Record<number, number>; // year -> clout at year-end, for jimoku math

  attributes: Attributes;
  resources: Resources;

  favors: Record<string, number>;
  flags: Record<string, boolean>;
  rippleQueue: RippleEntry[];
  pendingGossip: GossipEntry[];
  factionReputation: Record<FactionId, number>;
  sceneProgress: Record<string, SceneProgress>;

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

export function createInitialSave(): Save {
  return {
    schemaVersion: CURRENT_SAVE_SCHEMA_VERSION,
    year: 1,
    month: 1,
    clout: 0,
    cloutHistory: {},
    attributes: { ...DEFAULT_ATTRIBUTES },
    resources: { ...DEFAULT_RESOURCES },
    favors: {},
    flags: {},
    rippleQueue: [],
    pendingGossip: [],
    factionReputation: { ...DEFAULT_FACTION_REPUTATION },
    sceneProgress: {},
    debug: false,
  };
}
