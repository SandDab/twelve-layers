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

/** The three v0.1 romance candidates (GAME_DESIGN.md §6). */
export type CandidateId = 'sequesteredHeir' | 'sharpBrush' | 'fadedBranch';

export const CANDIDATE_IDS: CandidateId[] = ['sequesteredHeir', 'sharpBrush', 'fadedBranch'];

/**
 * Romance stages (GAME_DESIGN.md §6). v0.1 content covers 1-4;
 * 5 (Kaimami / meeting) and 6 (Commitment) are post-v0.1.
 */
export type RomanceStage = 1 | 2 | 3 | 4 | 5 | 6;

export type RomanceState = {
  stage: RomanceStage;
  /** Imagery tags from the candidate's most recent reply, for the next poem's callback bonus. */
  receivedImageTags: string[];
  /** Successful Exchange-stage poems sent so far (advances stage 3 -> 4 at the threshold). */
  exchangeCount: number;
  /** Calendar position of the last poem sent, for one-poem-per-month pacing. */
  lastSentYear: number | null;
  lastSentMonth: number | null;
};

export function createInitialRomanceState(): RomanceState {
  return { stage: 1, receivedImageTags: [], exchangeCount: 0, lastSentYear: null, lastSentMonth: null };
}

/** A waka fragment slot (GAME_DESIGN.md §6 poem builder: season-word -> image -> turn). */
export type PoemSlot = 'season' | 'image' | 'turn';

/**
 * A poem fragment, authored with all four language fields at authoring
 * time (CLAUDE.md). `romaji` is the shipped M4 display: the English
 * line with its key Japanese term romanized inline. `jp`/`kana` back
 * Gloss/Immersion modes (M6).
 */
export type PoemFragment = {
  id: string;
  slot: PoemSlot;
  jp: string;
  kana: string;
  romaji: string;
  en: string;
  season: 1 | 2 | 3 | 4;
  tags: string[];
};

/** Poem display modes (GAME_DESIGN.md §6): Romaji is the M4 default; Gloss and Immersion are M6 UI work over the same fragment fields. */
export type PoemDisplayMode = 'romaji' | 'gloss' | 'immersion';

/** Year-end jimoku ending slates (GAME_DESIGN.md §4, §14). */
export type EndingId =
  | 'behind_the_curtain'
  | 'overextended'
  | 'estranged'
  | 'toast_of_the_capital'
  | 'quiet_advancement'
  | 'unremarked_year';

/** Result of the jimoku resolution for the closing year, shown at the next New Year. */
export type JimokuResult = {
  year: number;
  endingId: EndingId;
  rankGain: number;
};

export const CURRENT_SAVE_SCHEMA_VERSION = 7;

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

  // Romance (GAME_DESIGN.md §6): per-candidate stage and exchange state.
  romance: Record<CandidateId, RomanceState>;

  // Poem display mode (GAME_DESIGN.md §6): Romaji/Gloss/Immersion.
  poemDisplayMode: PoemDisplayMode;

  // The most recently resolved jimoku (year-end ending + Rank conversion),
  // shown once at the following New Year, then cleared.
  jimokuResult: JimokuResult | null;

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
    romance: Object.fromEntries(CANDIDATE_IDS.map((id) => [id, createInitialRomanceState()])) as Record<
      CandidateId,
      RomanceState
    >,
    poemDisplayMode: 'romaji',
    jimokuResult: null,
    debug: false,
  };
}
