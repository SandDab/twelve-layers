# TWELVE LAYERS (working title)
### A Heian court dating sim / household tycoon for mobile web
*Design document v0.3 — all decisions confirmed, build-ready*

Working title refers to the jūnihitoe, the twelve-layered court robe — status, concealment, and seasonal taste in one garment. Alternates: "Cloistered Moon," "The Vermilion Gate," "Kasane."

---

## 1. Pitch

Heian-kyō, ~1005 CE. The regency is at its zenith. You are a newcomer to serious court life — which kind is your first choice: a provincial governor's moneyed heir, a legal scholar's brilliant unfashionable child, the last of a great name with empty storehouses, or a palace insider's well-connected daughter or son. Over the court calendar year, you attend festivals, banquets, and contests; solve other people's problems; connect people who need connecting; and decide who you'll love and what you'll trade for rank.

The court runs on poetry, taste, and rumor. Every visible win can be a hidden loss. Skill checks are shown Fallout: New Vegas style — pass/fail is transparent, but *consequences are not*.

- **Genre:** Dating sim × household tycoon, with FNV-style checked dialogue
- **Tone:** lighthearted court comedy at baseline. Player choices pull individual threads toward Pillow-Book satire or Genji melancholy — the dial is in the player's hands, not the script's. Confirmed floor: bittersweet at worst — exile, estrangement, a love kept as longing. Never grim; no on-screen death or cruelty.
- **Platform:** Mobile web (portrait), one-thumb controls, no backend
- **Session shape:** 5–15 min sessions. Year 1 is the v0.1 campaign (~3–5 hours); the architecture is multi-year from day one (NG+, §4)
- **Fantasy:** Climb from "rich nobody" to a real player in the world's most refined social arena, without becoming someone you despise — or while becoming exactly that, eyes open.

## 2. Player character & world

- Gender selectable; all romance routes available regardless (archetypes written gender-flexible).
- Starting court rank: none (rank is earned in-game; see §4).
- **The court is fictional but period-realistic.** Invented names, recognizable silhouettes — a regent at his zenith, a sidelined imperial branch, a celebrated literary salon — but no real historical figures. Frees the writing; keeps the texture.

### Class picker: four family backgrounds
**New-game flow (fixed order):** title screen → New Game → class picker (one screen, four cards) → name & gender → class effects applied (attributes, Koku, robes, gossip tags, faction rep, scheduled ripples) → year 1, month 1 tutorial event. The class is chosen before any gameplay and is permanent for the save; Continue bypasses all of this and loads directly.
New game opens with a one-screen class choice. All classes total **100 attribute points** — balance comes from shape and economy, not size. Each is strong in exactly one of the game's four lanes, and each carries one perk and one liability enforced by existing systems (gossip, ripples, factions, wardrobe). No class is an easy button; no class locks a romance route — every gate is reachable by training.

| Class | Family background | Cha | All | Rhe | Taste | Lane |
|---|---|---|---|---|---|---|
| **The Governor's Heir** | zuryō — provincial governor, new money | 30 | 25 | 25 | 20 | Wealth / tycoon |
| **The Judge's Child** | myōbō legal-scholar house | 25 | 25 | 35 | 15 | Checks / rhetoric |
| **The Old Name** | declined great house | 20 | 30 | 15 | 35 | Aesthetics / romance |
| **The Salon Child** | palace-service family (parent a famed lady-in-waiting) | 35 | 25 | 20 | 20 | Connections |

**Perks & liabilities:**
- **Governor's Heir** — Perk: 3× starting Koku, +25% estate income; Liability: "smells of the provinces" gossip tag at start, −10 reputation with the old-houses faction. Money opens problems, not arms.
- **Judge's Child** — Perk: +25% Composure cap; poem builder shows one structural hint per composition. Liability: Taste 15 and a bare starting wardrobe (one plain robe) — early kasane mistakes near-guaranteed, by design. (The court's view of legal scholars: brilliant, badly dressed.)
- **The Old Name** — Perk: heirloom kasane robe set (best-in-slot for two seasons), +10 old-houses reputation, recognized on sight by senior NPCs. Liability: lowest starting Koku, weakest estate income, and a scheduled family-debt ripple that fires in month 6.
- **The Salon Child** — Perk: starts with 2 Favor tokens and a *gossip ear* (one hidden-consequence hint revealed per anchor event). Liability: −25% Composure cap, and gossip against them spreads at ×1.5 — raised in the spotlight, watched in it.

**Background dialogue options:** each class unlocks FNV-style `[Background: X]` choices in scenes — the Judge's Child cites precedent at the carriage dispute, the Old Name is remembered by an aging chamberlain. Content budget: max ~2 per anchor event, not required in every event.

**Balance tunables (expect playtest adjustment):** attribute spreads, Koku multipliers, Composure cap modifiers, gossip multiplier, and the month-6 debt size. The invariants that should *not* change: equal point totals, one-lane-strength per class, one liability per class, no route locks.

## 3. Core loops

**Macro (the year):** A 12-month social calendar. Each month has one anchor event (festival, contest, ceremony) plus free actions. Year ends with the New Year promotions list (jimoku) — the campaign scorecard.

**Mid (between events):** Household phase. Collect estate income, assign staff, train attributes, commission robes, send letters/poems, host gatherings, tend the garden (mini games live here too).

**Micro (at events):** Visual-novel scenes with branching dialogue, visible skill checks, social puzzles ("X needs an introduction to Y, but Y is feuding with your patron"), and trade-offs whose fallout lands 1–3 months later via the ripple system (§7).

```
┌─────────────────────────────────────────────┐
│  MONTH N                                    │
│  ┌──────────────┐      ┌─────────────────┐  │
│  │ HOUSEHOLD    │ ───▶ │ ANCHOR EVENT    │  │
│  │ income tick  │      │ scenes + checks │  │
│  │ 3 free       │      │ mini game(s)    │  │
│  │ actions      │      │ ripples queued  │  │
│  └──────────────┘      └─────────────────┘  │
│         ▲                      │            │
│         └──── MONTH N+1 ◀──────┘            │
└─────────────────────────────────────────────┘
```

## 4. Attributes, resources, progression

### Attributes (0–100, checked in dialogue)
| Attribute | What it gates | Trained by |
|---|---|---|
| **Rank** (social status) | Access: which events/rooms/people you can even approach | Not trained — *awarded* (patronage, jimoku, marriage). The hard gate. |
| **Charisma** | General social checks, first impressions, smoothing conflicts | Hosting, attending, certain staff |
| **Allure** | Romance checks, being noticed, kaimami moments | Wardrobe quality, certain events |
| **Rhetoric** | Persuasion, debate, poetry composition power | Poet-tutor staff, utaawase practice |
| **Taste** (miyabi) | Aesthetic judgment: ikebana, incense, robe color matching, gift selection | Mini games, garden, connoisseur NPCs |

Taste is the fifth attribute added to the brief's four — the Heian court judged people on aesthetic discernment above almost everything, and it gives the mini games a progression hook.

### Resources
- **Koku** (wealth): estate income, spent on staff, robes, gifts, hosting. The zuryō's one advantage — start rich-ish.
- **Composure**: mental stamina. Spent on free actions and risky dialogue options; restored by garden raking, moongazing, downtime. Prevents action-spam, makes raking *mechanically* restorative.
- **Favor tokens**: per-NPC/per-faction. Earned by solving problems and making introductions; spent to call in help. The "connector" fantasy made legible.

### Tokimeki (the year's reputation — resets every New Year)
The one stat that does *not* carry over. **Tokimeki** (時めき, from *tokimeku*, "to flourish in one's moment / be the person of the hour") is the period term for exactly this: favor that is of its season. The opening of *Genji* uses it for Kiritsubo — modest rank, exceptional favor, destroyed by the envy that favor attracted — which is this stat's entire design in one sentence. (The modern reading of tokimeki as "heart-flutter" — *Tokimeki Memorial*, Marie Kondo — is a free bonus for a dating sim.)

- **Earned by:** public wins — utaawase victories, well-received poems, hosting, festival moments, visible problem-solving. Public, not private: a favor done quietly earns Favor; a favor done where everyone can see earns Tokimeki.
- **Benefits (scale through the year):** invitation tier (high-Tokimeki players get pulled into events above their Rank gate), Favor-gain multiplier, situational Charisma/Allure bonuses ("everyone wants to be seen with you"). By the 11th month, peak Tokimeki means you're the season's name.
- **The target on your back:** above thresholds, envy events spawn — rivals scheme against you specifically, gossip about you spreads faster and stings harder, you become the subject of other people's ripples. High Tokimeki is high variance by design.
- **Year-end conversion:** at the jimoku (New Year promotions), Tokimeki + faction standing convert into permanent Rank and rewards. Then Tokimeki resets to zero. The annual loop: build it all year, cash it at the promotions list, start the new year as last year's news.

### Multi-year / NG+ (architecture now, content later)
The campaign continues year over year. **Carries over:** attributes, Rank, relationships and romance states, NPC attitudes, faction reputation, household (staff, upgrades, wardrobe), Koku. **Resets annually:** Tokimeki. Save schema must support this from M0 — year index, per-year Tokimeki ledger, persistent everything else. v0.1 ships year 1 only; year-2+ content (higher-rank events, marriage consequences, rival arcs maturing) is post-v0.1, but nothing in the engine may assume a single year.

### Reputation (partially hidden, persists across years)
Faction standing with four blocs: **the Regent's house**, **rival noble houses**, **the imperial household**, **the clergy** (all fictional, per §2). The player sees vibes ("The Minister's salon has gone quiet toward you"), not numbers, until late-game Taste/Charisma thresholds reveal more.

## 5. Skill-check dialogue (the FNV layer)

- Choices display the check inline: `[Rhetoric 40] Suggest the Captain misremembers the precedent.`
- Checks are **deterministic at threshold** (you have it or you don't) — FNV-style, not dice. Keeps one-thumb play snappy and makes builds matter.
- **Success ≠ safe.** Passing a check executes your intent competently; whether your intent was wise is a different question. A passed `[Charisma 50]` charm of the wrong patron's rival should be one of the first lessons.
- Some options show a check the player *can't see the consequence axis of*: `[Taste 30] Compliment the layering of her sleeves.` (Reads as flavor; actually opens a romance route or insults her, depending on season-color correctness the player may not know yet.)
- Failed-check options are visible but greyed with the requirement shown — build-planning fuel.

## 6. Romance

Courtship is conducted the Heian way: **almost entirely through poetry and screens** before anyone sees a face.

### Stages (per candidate)
1. **Rumor** — you hear of them; they may hear of you (gossip system feeds this)
2. **First poem** — you initiate or receive a waka; quality and *appropriateness* judged
3. **Exchange** — multi-poem correspondence over weeks (calendar-paced, anticipation is the point)
4. **Behind the curtain** — conversation through a kichō screen; dialogue scenes with checks
5. **Kaimami / meeting** — a glimpse, then visits
6. **Commitment** — Heian marriage is uxorilocal and political; endings range from love match to alliance to deliberately keeping it as longing (the most Heian ending available)

### The poem builder (one-thumb mini-mechanic)
Compose a waka from three taps: **season-word → image → turn** (pivot/allusion). Scored against (a) recipient's known tastes, (b) season correctness, (c) your Rhetoric + Taste, (d) callback bonuses if you reuse imagery *they* used earlier. Bad poems are not neutral — they generate gossip.

### Poem language modes (settings toggle; content carries all layers from day one)
Every poem fragment is authored with four fields: `{ jp (kanji), kana, romaji, en }`. Display modes:

1. **Romaji (default):** English poem text with romanized Japanese season-words and key images inline — *"the hototogisu calls once and is gone."*
2. **Gloss:** full Japanese (kanji + kana) as the primary text, with kana reading above and English gloss below. Reading practice without gameplay risk.
3. **Immersion:** poetry gameplay entirely in Japanese — fragment selection, recipient reactions, scoring feedback all JP-only. The poetic layer becomes a language drill; the rest of the game stays English.

This is a content-schema decision, not a feature to retrofit: M4 authors all fragments with all four fields; modes 2–3 are then UI work, not content work.

**Calligraphy mode (v0.2 backlog, schema-supported now):** trace the stroke paths of a finished poem's key kanji with the thumb; scored on stroke order and smoothness; boosts the poem's delivered quality (the Heian court judged hand as much as verse). Fragments carry kanji stroke data references so this drops in later without touching content.

### v0.1 candidates (3; archetypes, gender-flexible)
1. **The Sequestered Heir** — a Fujiwara daughter/son being groomed for palace placement. Highest ceiling, highest political risk; courting them is courting the regent's attention, good and bad.
2. **The Sharp Brush** — a celebrated lady-in-waiting / court poet (Sei Shōnagon energy). Rhetoric-gated, roasts you when you fail checks, the "banter route."
3. **The Faded Branch** — widowed princeling of a sidelined imperial line. Mono no aware route; low political value, high narrative payoff, conflicts directly with the climb.

## 7. Consequences: the ripple system

Every significant choice enqueues **ripples**: `{trigger_month, condition_flags, payload_scene_or_effect}`. The carriage you displaced at the festival belongs to someone whose brother sits on the promotions board — you find out in month 11. Implementation is a simple priority queue checked at each month tick; content authors (us) write ripples alongside choices. Gossip is the v0.1-simplified transport: choices emit rumor tags that shift faction reputation after a 1–2 month delay, occasionally surfacing as scene callbacks.

## 8. Household tycoon layer

- **Estate ledger:** monthly koku income from the family shōen; events and bad gossip can tax it (a governor father can be recalled — late-game risk event).
- **Staff slots (4 in v0.1):** Steward (income +), Poet-tutor (Rhetoric training + poem hints), Gardener (unlocks/upgrades raking, Composure regen), Seamstress (wardrobe access).
- **Residence upgrades:** garden → raking mini game; moon-viewing pavilion → moongazing + hosting Tsukimi; reception wing → host your own banquets (late-game reputation engine, the tycoon payoff: you stop attending the calendar and start *being* the calendar).
- **Wardrobe (kasane no irome):** robes are equipment defined by layered color combinations that must match the current season/occasion. Correct kasane = Allure/Taste bonuses; out-of-season combos = penalties + gossip. Cheap to implement (data + palette swatches), deeply period-accurate, and it makes the calendar legible through color.
- **Kanzashi (hairpins):** a second wardrobe slot for precious ornaments (period anchor: the *saishi* worn with formal jūnihitoe). Exactly **four exist per year**, each unique in color and small passive benefit. They cannot be bought — each is *awarded* for making a choice that fits its theme:
  - At year start, the four kanzashi are secretly assigned to four distinct random months (seeded RNG; re-rolled each NG+ year, so missed ones can be caught later). In v0.1 the assignment pool is the six anchor-event months, so every kanzashi is reachable; when later versions add household-phase theme choices, the pool can widen to all twelve.
  - Content choices carry invisible `themeTags`. If the player picks a matching-theme choice during a kanzashi's assigned month, a delivery ripple fires after the event — a messenger, a wrapped gift, sometimes an anonymous sender. **Opportunities are never labeled in dialogue**; the Salon Child's gossip ear is the only hint channel.
  - One equipped at a time; swap freely in the household phase.

  | Kanzashi | Color | Theme (earns it) | Passive benefit | Patches / stacks |
  |---|---|---|---|---|
  | **Kōbai** (red plum) | crimson lacquer | principle in adversity — the scholar's flower, blooming in snow | +5 Taste; kasane-mistake gossip halved | Judge's Child / Old Name |
  | **Tsukikage** (moonlight) | silver & pearl | restraint — declining an available provocation | +25% Composure cap | Salon Child / Judge's Child |
  | **Fuji** (wisteria) | violet & gold | alignment — visibly binding yourself to the great | suppresses "provincial" gossip tag; old-houses rep gains ×1.5 | Governor's Heir / Salon Child |
  | **Sango** (coral) | coral red | grace without grasping — refusing a reward beautifully | admirers' gifts: small monthly Koku stipend while worn | Old Name / Governor's Heir |

  Each kanzashi complements one class's liability while reinforcing another's strength — any class can earn any of them. Benefits are deliberately small (a lane-lean, not a power spike); the chase and the story of *how you got it* are the reward. Tunables: benefit magnitudes, stipend size. Invariants: four per year, theme-earned only, never purchasable, never labeled.

## 9. The social calendar (v0.1 ships 6 anchor events)

| Month | Event | Design focus |
|---|---|---|
| 1 | **New Year court audience** | Tutorial: checks, Rank gates, first faction contacts |
| 3 | **Cherry-blossom banquet + utaawase** (poetry contest) | Poem builder debut; public win/lose with gossip stakes |
| 4 | **Aoi Matsuri** | The carriage-place dispute (kuruma arasoi, straight from Genji): the game's signature trade-off scene — every option passes, every option costs someone |
| 7 | **Tanabata** | Romance spotlight; poem exchanges accelerate |
| 8 | **Tsukimi moon-viewing** | Taste showcase; host it yourself if pavilion is built; moongazing mini-scene |
| 11 | **Gosechi dances → New Year jimoku** | Finale: promotions list resolves the year; endings slate |

Backlog for later versions: incense competition (kōawase), chrysanthemum festival (Chōyō), kemari timing game, Kamo purification.

## 10. Mini games (one-thumb)

### Ikebana
Vase with 5–7 placement slots; a tray of seasonal stems cycles at the thumb arc. Tap to place, tap placed stem to remove. Score on the heaven–earth–human height triad, seasonal correctness, and negative space (empty slots can be correct). 30–60 seconds. Feeds Taste; used at events as a checked performance ("arrange for the Empress's alcove").

### Zen garden raking
Thumb-drag draws rake furrows around fixed stones on a sand field. No timer. Score on line continuity, coverage ratio, and not crossing your own furrows; generous thresholds — it's a restoration verb, not a test. Restores Composure; gardener staff upgrades pattern options (ripples around stones score bonus).

### Moongazing (lightweight, with Tsukimi)
Hold-and-release timing: hold as clouds pass, release when the moon clears, paired with a poem prompt. More scene than game.

## 11. Controls & UI

- Portrait only. **All interactive elements live in the bottom ~60%** of the viewport; the top is stage/scene.
- Verbs: tap, and short drag (raking, stem placement). No pinch, no long-press requirements, no top-corner buttons.
- Dialogue choices render as a card fan in the thumb arc, max 4 visible, swipe-up for overflow.
- Month/calendar as a horizontal scroll strip; household as a single screen of large tap targets.

## 12. Visual direction

- **Yamato-e as the rendering answer:** fukinuki yatai (roofless, oblique interiors) for scene backgrounds; hikime kagibana ("line eyes, hook nose") stylization for faces — period-correct *and* dramatically cheaper to draw/generate consistently than expressive portraits. Emotion is carried by posture, fans, sleeves, and text.
- **Signature element — the living kasane palette:** the entire UI chrome (backgrounds, card edges, accents) derives from the current month's kasane no irome color pairing, shifting as the calendar advances. The interface itself observes the seasons; the wardrobe system teaches the player to read it.
- Texture: washi paper grain on panels; vertical text used as accent (titles, chapter cards), horizontal for all reading text.
- Type: a mincho-style display face (e.g., Shippori Mincho on Google Fonts) for titles, a clean humanist body face for dialogue; both must hold up at mobile sizes.
- Motion: restrained — sleeve/curtain transitions between scenes, drifting blossom or snow particles per season, nothing bouncy.

## 13. Tech spec

- **Stack:** Vite + React + TypeScript. Zustand for game state. No backend. localStorage for saves (fine here — this builds and deploys as a real site, not a claude.ai artifact). Optional PWA manifest for home-screen install.
- **Determinism:** seeded RNG (seed in save) so checks/outcomes are replay-consistent; checks themselves are threshold-deterministic anyway.
- **Content is data, engine is code.** All scenes, NPCs, events, poems, robes, ripples live in typed JSON under `/src/content`. The engine never hardcodes story. This is the single most important constraint for letting Claude Code iterate on content cheaply.

### Proposed structure
```
src/
  engine/        # scene runner, check resolver, ripple queue, calendar, save
  state/         # zustand stores: player, household, world, romance
  content/       # JSON: events/, npcs/, poems/, robes/, ripples/
  minigames/     # ikebana/, raking/, moongazing/
  ui/            # scene stage, card fan, household screen, calendar strip
  styles/        # kasane palette tokens per month
```

### Core schemas (abbreviated)
```ts
type Check = { attr: 'rank'|'charisma'|'allure'|'rhetoric'|'taste'; min: number };
type Effect =
  | { kind: 'attr'; attr: string; delta: number }
  | { kind: 'resource'; res: 'koku'|'composure'|'tokimeki'; delta: number }
  | { kind: 'favor'; npc: string; delta: number }
  | { kind: 'flag'; flag: string; value: boolean }
  | { kind: 'ripple'; triggerMonth: number; sceneId: string; ifFlags?: string[] }
  | { kind: 'gossip'; tag: string; factionDeltas: Record<string, number>; delayMonths: 1|2 };

type Choice = { text: string; check?: Check; ifClass?: ClassId; themeTags?: ThemeTag[]; effects: Effect[]; goto: NodeId };
type SceneNode = { id: NodeId; speaker?: string; body: string; choices?: Choice[]; next?: NodeId };
type NPC = { id: string; name: string; faction: string; tastes: string[]; romance?: RomanceTrack };
type Robe = { id: string; season: 1|2|3|4; kasane: [string, string]; allure: number; taste: number };

type ClassId = 'governors_heir' | 'judges_child' | 'old_name' | 'salon_child';
type ClassDef = {
  id: ClassId; name: string; blurb: string;
  attrs: { charisma: number; allure: number; rhetoric: number; taste: number }; // must sum to 100 (lint this)
  startKoku: number; incomeMult: number; composureCapMult: number;
  startRobes: string[]; startFavors?: { npc: string; count: number }[];
  startGossipTags?: string[]; startFactionRep?: Record<string, number>;
  perks: string[];            // engine-known perk ids: 'poem_hint', 'gossip_ear', etc.
  scheduledRipples?: { triggerMonth: number; sceneId: string }[];  // e.g. old_name debt, month 6
};

type ThemeTag = 'principle' | 'restraint' | 'alignment' | 'grace';
type KanzashiDef = {
  id: 'kobai' | 'tsukikage' | 'fuji' | 'sango';
  name: string; color: string; theme: ThemeTag;
  passives: Effect[] | PassiveModifier[];   // small, always-on while equipped
  deliverySceneId: string;                  // the messenger/gift scene
};

type PoemFragment = {
  id: string; slot: 'season'|'image'|'turn';
  jp: string; kana: string; romaji: string; en: string;   // all four required at authoring time
  season: 1|2|3|4; tags: string[];
  strokesRef?: string;                                     // calligraphy mode, v0.2
};

type Save = {
  schemaVersion: number;
  classId: ClassId;                                        // chosen at new game, permanent
  year: number; month: number;                             // multi-year from day one
  tokimeki: number;                                           // resets at New Year
  tokimekiHistory: Record<number, number>;                    // per-year ledger (jimoku math, flavor)
  kanzashiOwned: string[]; kanzashiEquipped?: string;         // owned persists across years
  kanzashiAssignments: Record<string, number>;                // kanzashiId -> month, re-rolled each year (seeded)
  // attributes, rank, koku, household, romance states, NPC attitudes,
  // faction rep, flags, ripple queue — all persist across years
};
```

## 14. Build order for Claude Code (milestones with acceptance criteria)

**M0 — Skeleton.** Vite/React/TS scaffold, Zustand stores, save/load to localStorage **with the multi-year save shape (year index, tokimeki ledger) from the start**, calendar tick, navigation shell (household ⇄ event), kasane palette tokens wired to month. Placeholder art throughout (locked decision) — placeholders must respect palette tokens and layout. *Done when: a year can be clicked through with state persisting across reload, and ticking past month 12 rolls to year 2 with Tokimeki zeroed and everything else intact.*

**M1 — Scene engine + checks.** JSON scene runner, card-fan choice UI, check resolver, effects pipeline, ripple queue. Ship the Month 1 New Year event as the test content. *Done when: the tutorial event plays start-to-finish from JSON with at least 3 working checks and 1 ripple that fires in a later month.*

**M1.5 — Class picker.** New-game class selection screen (one screen, four cards, thumb zone); ClassDef content JSON for all four classes; class application on new game (attrs, Koku, income/Composure multipliers, starting robes/favors/gossip tags/faction rep, scheduled ripples); `ifClass` choice gating in the scene engine; `classId` in the save with schema migration. *Done when: each class starts a measurably different game (verify via debug panel), the Old Name's debt ripple is queued for month 6 at game start, and a `[Background]` option appears for at least one class in the tutorial event.*

**M2 — Household layer + Tokimeki + kanzashi.** Income tick (class income multiplier applied), free actions, staff hiring, attribute training, Composure economy (class cap multiplier applied), wardrobe equip with seasonal bonus/penalty, Tokimeki accrual from public effects with benefit tiers and at least one envy-event trigger. Kanzashi system: KanzashiDef content for all four, yearly seeded month assignment at year start, themeTag award detection in the scene engine, delivery ripple, equip slot with passive modifiers, NG+ re-roll. *Done when: a player can grind Rhetoric, go broke hiring staff, get gossiped about for wearing autumn colors in spring, attract a rival's attention by winning too publicly, and (via debug month-set) earn the Kōbai by picking a principle-tagged choice in its assigned month.*

**M3 — Ikebana.** Full mini game with scoring, integrated as a checked event performance and a free action. *Done when: playable one-thumb, score feeds Taste.*

**M4 — Romance + poem builder.** Romance stage machine, poem composer, exchange pacing across months, all 3 candidates' tracks for stages 1–4. All poem fragments authored with all four language fields; **Romaji mode** is the shipped display. *Done when: a full poem exchange with The Sharp Brush can succeed or fail with gossip consequences.*

**M5 — Raking + gossip surfacing.** Raking mini game with Composure restoration; faction reputation surfacing lines in scenes; events for months 4, 7, 8 content-complete, with every anchor event carrying at least one choice per theme tag so kanzashi are earnable regardless of month assignment. *Done when: the Aoi Matsuri carriage dispute plays with all options viable and all options costly.*

**M6 — Finale + polish.** Months 11→jimoku ending logic (Tokimeki + faction standing + romance state + rank → 4–6 ending slates, then Tokimeki reset into year 2), **Gloss and Immersion poem modes** (UI work over existing content fields), audio pass (koto/shō ambience), transitions, PWA manifest. *Done when: a full year is completable with at least 3 meaningfully different endings reachable, and year 2 starts cleanly with carried-over state.*

**Post-v0.1 backlog:** calligraphy mode, year-2 content (higher-rank events, marriage consequences, maturing rival arcs), incense competition, chrysanthemum festival, kemari.

## 15. v0.1 content scope (hard limits, resist expansion)

- 1 year of *content*, multi-year *architecture*: year 2 must start cleanly (carryover + Tokimeki reset) even though it has no bespoke events yet
- 6 anchor events, ~12 named NPCs, 3 romance candidates (stages 1–5; stage 6 epilogue text only)
- 4 classes with full perk/liability implementation; ~8–12 `[Background]` dialogue options across all events (max ~2 per event, not required in every event)
- 4 kanzashi with delivery scenes; every anchor event carries at least one choice per theme tag (tags are metadata on existing choices, not extra branches)
- 2.5 mini games (ikebana, raking, moongazing-lite)
- ~16 robes, ~40 poem fragments (each authored in all four language layers — budget the writing time), ~20 ripples
- 4–6 endings

## 16. Decisions confirmed (v0.3 — nothing outstanding)

1. **Tone:** lighthearted fun overall; satire/melancholy balance is steered by player choices per-thread, not fixed per-route. Confirmed ceiling: bittersweet at worst — exile, estrangement, unconsummated longing; no on-screen death or cruelty.
2. **Multi-year NG+:** yes. Attributes, Rank, relationships, attitudes, reputation, household, and Koku all persist; **Tokimeki** resets each New Year, converting (with faction standing) into permanent Rank at the jimoku first — confirmed. Architecture supports this from M0.
3. **Historicity:** fully fictional court, rigorously period-realistic in texture. No real figures.
4. **Poem language:** three display modes (Romaji default → Gloss → Immersion), all content authored with jp/kana/romaji/en from day one (§6). Calligraphy mode planned for v0.2 with schema support now.
5. **Art:** placeholder-first; gameplay before asset pipeline. Placeholders must respect palette tokens and layout so the eventual art pass is a swap, not a refactor.

Non-blocking items deferred to during/after the build: final title (Twelve Layers is the working name), deployment target, audio sourcing.
