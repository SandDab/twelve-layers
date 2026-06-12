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
  | { kind: 'kanzashi'; id: string }
  | { kind: 'romance'; loveInterestId: string; interestDelta?: number; stage?: number; closed?: boolean }
  | { kind: 'courtshipSignal'; signal: 'acclaim' | 'deference' };

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

/**
 * PC gender, chosen at the class picker (GAME_DESIGN.md §2). Either PC
 * gender romances any love interest with identical mechanics; gender is
 * flavor and kanzashi-gifting framing only, never a mechanical gate.
 * Null until the M1.5 gender select is wired up; new-game flow sets it.
 */
export type PcGender = 'male' | 'female';

/**
 * Intro director state (GAME_DESIGN.md §6 "Introduction pacing"). Stubbed
 * with a sensible empty default until the M4a intro director is built.
 */
export type IntroDirectorState = {
  introsThisYear: number;
  lastIntroMonth?: number;
  queued?: string;
};

/** Kanzashi theme tags (GAME_DESIGN.md §8) — metadata on existing choices. */
export type ThemeTag = 'principle' | 'restraint' | 'alignment' | 'grace';

/**
 * A small, always-on benefit (GAME_DESIGN.md §13). Used by kanzashi
 * (dormant until gifted/equipped) and by love-interest marriage buffs
 * (household-wide, never surfaced in UI).
 */
export type PassiveModifier =
  | { kind: 'attrBonus'; attr: AttributeKey; amount: number }
  | { kind: 'composureCapMult'; mult: number }
  | { kind: 'gossipMultiplier'; tag: string; mult: number }
  | { kind: 'factionRepMult'; faction: FactionId; mult: number }
  | { kind: 'kokuStipend'; amount: number }
  | { kind: 'tokimekiMult'; mult: number }
  | { kind: 'rippleIntercept'; perSeason: number }
  | { kind: 'composureRegen'; amount: number }
  | { kind: 'kasaneProtection' }
  | { kind: 'envyWeaken'; mult: number }
  | { kind: 'imperialFavor'; tier: number };

/** The v0.6 eight-love-interest roster (GAME_DESIGN.md §6). All missable, all available to either PC. */
export type LoveInterestId =
  | 'climber'
  | 'widow'
  | 'sole_heir'
  | 'riverbank'
  | 'captain'
  | 'devotee'
  | 'second_prince'
  | 'merchant';

export const LOVE_INTEREST_IDS: LoveInterestId[] = [
  'climber',
  'widow',
  'sole_heir',
  'riverbank',
  'captain',
  'devotee',
  'second_prince',
  'merchant',
];

/**
 * A love interest's definition (GAME_DESIGN.md §13/§6). `introConditions`
 * feeds the intro director's relevance scoring; `criticalChoice` is the
 * unmarked route-defining scene, placed at a different stage per route;
 * `buff` activates household-wide on marriage and is never surfaced in UI.
 */
export type LoveInterest = {
  id: LoveInterestId;
  name: string;
  archetype: string;
  introConditions: { tags?: ThemeTag[]; minAttrs?: Partial<Record<AttributeKey, number>>; flags?: string[] };
  caresAboutStyle: boolean;
  acclaim: -1 | 0 | 1;
  deference: -1 | 0 | 1;
  criticalChoice: { sceneId: string; stage: 2 | 3 | 4 | 5 };
  valuedTags: ThemeTag[];
  kanzashiAffinity: ThemeTag;
  buff: PassiveModifier[];
};

/**
 * Per-love-interest romance progress (GAME_DESIGN.md §13), keyed by
 * loveInterestId. Empty until the v0.6 8-LI roster and intro director
 * are built (M4a+).
 */
export type RomanceState = {
  stage: number;
  interest: number;
  closed: boolean;
  introFired: boolean;
};

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

export const CURRENT_SAVE_SCHEMA_VERSION = 10;

export type Save = {
  schemaVersion: number;
  // null until the new-game class picker is completed; permanent thereafter.
  classId: ClassId | null;
  // null until the M1.5 gender select is completed; permanent thereafter.
  pcGender: PcGender | null;
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
  // kanzashiId -> loveInterestId, once gifted and accepted (M4a+). Stubbed
  // empty until kanzashi gifting is built.
  kanzashiGifted: Record<string, string>;

  // Romance (GAME_DESIGN.md §13): per-love-interest stage and interest
  // state, keyed by loveInterestId. Empty until the v0.6 roster (M4a+).
  romance: Record<string, RomanceState>;

  // Intro director pacing state (GAME_DESIGN.md §6). Stubbed until M4a.
  introDirector: IntroDirectorState;

  // Lifetime counts of themeTags on chosen choices (GAME_DESIGN.md §6):
  // feeds the intro director's relevance scoring. Persists across years
  // (it is a behavior record, not a per-year tally).
  themeTagCounts: Record<ThemeTag, number>;

  // loveInterestId once married (M4a+), activating their household buff.
  // Stubbed null until romance reaches Commitment.
  married: string | null;

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
    pcGender: null,
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
    kanzashiGifted: {},
    romance: {},
    introDirector: { introsThisYear: 0 },
    themeTagCounts: { principle: 0, restraint: 0, alignment: 0, grace: 0 },
    married: null,
    poemDisplayMode: 'romaji',
    jimokuResult: null,
    debug: false,
  };
}
