# TWELVE LAYERS (working title)
### A Heian court dating sim / household tycoon for mobile web
*Design document v0.6 — intro director pacing added. All decisions confirmed.*

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

- **Gender selectable (male or female) at the class picker.** Either PC can romance any of the eight love interests, and courtship functions identically regardless of PC gender — same stages, same mechanics, same poem exchange. In-world, the court gossips about *who* you court (a farmer! a foreigner!), never about gender.
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
1. **Rumor / introduction** — the route opens via an emergent introduction trigger (see below); you hear of her, or she has already heard of you
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

This is a content-schema decision, not a feature to retrofit: M4a authors all fragments with all four fields; modes 2–3 are then UI work, not content work.

**Calligraphy mode (v0.2 backlog, schema-supported now):** trace the stroke paths of a finished poem's key kanji with the thumb; scored on stroke order and smoothness; boosts the poem's delivered quality (the Heian court judged hand as much as verse). Fragments carry kanji stroke data references so this drops in later without touching content.

### How routes open: emergent introductions (all eight missable)
There is no romance menu. Each love interest *watches* for a pattern of behavior — accumulated choice tags, attribute thresholds, public actions — and when their conditions are met, an **introduction opportunity** fires as a ripple in a later month: an unsigned poem arrives, a glimpse through a carriage blind at a festival, a mutual acquaintance passes along a request. Trigger conditions are never labeled or hinted in dialogue; the player should not know which behavior opened which door. Decline or ignore the opportunity and it lapses.

Post-introduction, every route contains **one unmarked critical choice** — placed at a *different stage* per route, so the pattern can't be learned once and reused. Misplay it and the route closes for the year. In NG+ years, unclosed routes can re-trigger (an unmarried interest may reappear; a married PC's other routes stay closed).

### Introduction pacing: the intro director
Eight love interests must not mean eight introductions in year one. A small director runs at each month tick and enforces pacing:

- **Annual cap:** max 2–3 intro opportunities per year (tunable), with a minimum 2-month gap between them. Meeting the full cast is naturally a multi-year affair.
- **Relevance selection:** when several LIs' conditions are met simultaneously, only the *strongest* match fires — greatest overlap between their conditions and the player's actual behavior record, with never-before-met interests preferred. Which people you meet is itself emergent: a deference-playing Judge's Child encounters the Devotee and the Sole Heir; an acclaim-chasing Governor's Heir draws the Climber and the Captain. Playstyle is the matchmaker.
- **Pity timer:** if no intro has fired by month 6, the closest available match fires anyway — no dead romance years.
- **Concurrency:** max 2 open courtships at once (a third intro queues until one resolves or closes); marriage shuts the director off.
- **Across years:** unmet and unclosed interests carry forward as candidates; the director's year-over-year job is making each year feel like *this year's* social season, not a checklist.

### Interest (hidden, per love interest)
Driven by poem quality, choices they value, attribute thresholds, and kasane correctness *if they care about such things*. Never shown as a meter — read it through prose tone, reply speed, whether their poems use your imagery back. Interest gates the critical choice's outcomes, marriage availability, and kanzashi acceptance (§8). A refused kanzashi is the only hard read on this stat the game ever gives.

### Acclaim vs. deference (per-interest response profile)
Two ambient courtship signals run alongside poems and choices: **acclaim** (contest wins, public Tokimeki moments — being *seen* succeeding) and **deference** (yielding gracefully, restraint-coded and tasteful-submission choices). Every love interest responds to each signal positively, neutrally, or negatively. The Social Climber and the Captain are drawn to acclaim; the Second Prince and the Devotee read presumption into anything but deference; the Riverbank Girl dislikes acclaim outright. Never explained in-game — learned by watching reply tone.

### v0.1 love interests (8; all available to either PC, all missable)
| | Archetype | What they reward | Style? | Household buff after marriage | Class resonance |
|---|---|---|---|---|---|
| 1 | **The Social Climber** — a lady-in-waiting burning to rise, sharp-tongued, ambitious | ambition, acclaim, public wins, Charisma | judges it hard — kasane mistakes cost interest | **Tokimeki gains ×1.25** — she curates your reputation | Governor's Heir |
| 2 | **The Young Widow** — quiet, observant, has already survived the court once (mono no aware) | restraint, sincerity, deference over flash | indifferent — substance over surface | **once per season, quietly intercepts one incoming negative ripple or envy event** | Salon Child |
| 3 | **The Sole Heir** — last of her line; marrying her is uxorilocal marriage *into* a superior household | principle, propriety, deference, formal Rhetoric | yes — her house's dignity is at stake | **household Taste aura** — kasane penalties prevented, Taste training faster, heirloom wardrobe | Judge's Child |
| 4 | **The Girl from the Riverbank** — boyish governor's daughter raised half-wild by the Kamo; fishes, climbs, hopeless at kasane | authenticity, curiosity, low artifice; *dislikes acclaim and preening* | actively unimpressed | **she fishes** — upkeep reduced, monthly surplus, Composure regen | Old Name |
| 5 | **The Captain** — war hero returned from pacifying an eastern rebellion; the court finds him useful and slightly alarming | acclaim, contest wins, directness, courage-coded choices | indifferent | **rivals reconsider** — envy events weakened or deterred | Salon Child |
| 6 | **The Devotee** — a landholding farmer who idolizes Shinto masters; purity, simplicity, the turning seasons | deference, authenticity, restraint; *dislikes ostentation* | dislikes it | **stillness** — Composure regen up, clergy rep gains, tends your garden (gardener synergy) | Judge's Child |
| 7 | **The Second Prince** — younger brother of the imperial heir; charming, watched, dangerous to want | flawless tasteful deference, propriety | absolutely — imperial formality | **imperial favor** — invitation tier +1, provincial stigma erased, imperial rep gains | Governor's Heir |
| 8 | **The Northern Merchant** — foreign trader of the far northern routes (sable, amber, arriving via the continental chain); the court gawks | acclaim, shrewdness, results | foreign indifference to court style | **trade wealth** — monthly Koku income, occasional rare goods | Old Name |

Marrying the Devotee, the Merchant, or the Riverbank Girl is a court scandal in itself — the "love vs. climb" routes. Marrying the Second Prince or the Sole Heir is a political event with relatives attached. Buffs are **undocumented in-game** — no tooltip ever explains what a spouse brings. The surprise of the introduction, the uncertainty of courtship, and discovering what each marriage *does* are the content. The resonance column gives every class one resonant route per cast, mirroring the kanzashi matrix: by year's end, marriage, kanzashi, and training are three paths to resolving (or pointedly not resolving) your class's weakness — the endgame is the household you composed.

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

  **Gifting:** a **female PC** wears kanzashi directly — passives active immediately on equip. A **male PC** acquires them *dormant*: passives only activate once gifted to a love interest during courtship (stage 3+); female recipients wear them, male recipients keep them as treasured tokens (ornament-as-keepsake was real courtship currency) — same rules either way. Acceptance is an Interest check, with an affinity bonus when the kanzashi's theme matches what they value (the Widow or the Devotee and Tsukikage's restraint; the Climber or the Captain and Fuji's alignment; the Heir or the Prince and Kōbai's principle; the Riverbank Girl or the Merchant and Sango's ungrasping grace) — affinities are bonuses, never locks. **Accepted:** the passive activates for the household, plus an Interest bump. **Refused:** it's returned with a small gossip risk — but refusal is the only hard read on hidden Interest the game provides, so even the sting carries information. Refused pins can be re-gifted later, or to someone else. Once accepted, it is *theirs*: if that courtship later collapses, the kanzashi leaves with them. Give carefully.

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
  passives: Effect[] | PassiveModifier[];   // small, always-on — DORMANT until gifted & accepted (male PC)
  deliverySceneId: string;                  // the messenger/gift scene
};

type LoveInterest = {
  id: 'climber' | 'widow' | 'sole_heir' | 'riverbank'
    | 'captain' | 'devotee' | 'second_prince' | 'merchant';
  name: string; archetype: string;
  introConditions: { tags?: ThemeTag[]; minAttrs?: Partial<Record<string, number>>; flags?: string[] };
  caresAboutStyle: boolean;                 // kasane correctness affects interest
  acclaim: -1 | 0 | 1;                      // response to contest wins / public Tokimeki moments
  deference: -1 | 0 | 1;                    // response to yielding / restraint-coded choices
  criticalChoice: { sceneId: string; stage: 2|3|4|5 };  // unmarked, different stage per route
  valuedTags: ThemeTag[];                   // choice themes that build interest
  kanzashiAffinity: ThemeTag;               // acceptance bonus, never a lock
  buff: PassiveModifier[];                  // household-wide after marriage; NEVER surfaced in UI
};

// scene engine: dynamic dialogue socket (renders fallbackBody in v0.1; see §17)
type DynamicNode = { id: NodeId; kind: 'dynamic'; promptId: string; fallbackBody: string; next?: NodeId };

type PoemFragment = {
  id: string; slot: 'season'|'image'|'turn';
  jp: string; kana: string; romaji: string; en: string;   // all four required at authoring time
  season: 1|2|3|4; tags: string[];
  strokesRef?: string;                                     // calligraphy mode, v0.2
};

type Save = {
  schemaVersion: number;
  classId: ClassId;                                        // chosen at new game, permanent
  pcGender: 'male' | 'female';                             // chosen at new game; courtship mechanics identical
  year: number; month: number;                             // multi-year from day one
  tokimeki: number;                                           // resets at New Year
  tokimekiHistory: Record<number, number>;                    // per-year ledger (jimoku math, flavor)
  kanzashiOwned: string[]; kanzashiEquipped?: string;         // owned persists across years
  kanzashiAssignments: Record<string, number>;                // kanzashiId -> month, re-rolled each year (seeded)
  kanzashiGifted: Record<string, string>;                     // kanzashiId -> loveInterestId (hers now)
  romance: Record<string, { stage: number; interest: number; closed: boolean; introFired: boolean }>;
  introDirector: { introsThisYear: number; lastIntroMonth?: number; queued?: string };
  married?: string;                                           // loveInterestId; activates their buff
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

**M4a — Romance engine + first routes.** Romance stage machine with **emergent introduction triggers** governed by the intro director (condition watcher → relevance scoring → caps/gap/pity-timer → intro ripple), hidden Interest stat, acclaim/deference signal emission and per-LI response profiles, per-route unmarked critical choices, route closure/missability; poem composer; exchange pacing across months; kanzashi gifting with Interest-checked acceptance, affinity bonuses, dormant-until-accepted passives (female PC wears directly), and loss-on-route-collapse. All poem fragments authored with all four language fields; **Romaji mode** is the shipped display. Scene engine gains the `dynamic` node type rendering `fallbackBody` (§17). Ship **two complete routes** (recommend Riverbank Girl + Second Prince — one scandal route, one political route, opposite response profiles). *Done when: the Riverbank Girl's route can be triggered, courted, married, and her fishing buff verified active — or her critical choice fumbled and the route confirmed closed; and a refused kanzashi returns with its gossip risk applied.*

**M4b — Remaining routes (content sessions, engine frozen).** The other six love interests' full tracks: intro conditions, poems, critical choices, marriage scenes, buffs. Pure content work against the M4a engine — may split across multiple sessions. *Done when: all eight routes are completable and all eight buffs verify via debug.*

**M5 — Raking + gossip surfacing.** Raking mini game with Composure restoration; faction reputation surfacing lines in scenes; events for months 4, 7, 8 content-complete, with every anchor event carrying at least one choice per theme tag so kanzashi are earnable regardless of month assignment. *Done when: the Aoi Matsuri carriage dispute plays with all options viable and all options costly.*

**M6 — Finale + polish.** Months 11→jimoku ending logic (Tokimeki + faction standing + romance state + rank → 4–6 ending slates, then Tokimeki reset into year 2), **Gloss and Immersion poem modes** (UI work over existing content fields), audio pass (koto/shō ambience), transitions, PWA manifest. *Done when: a full year is completable with at least 3 meaningfully different endings reachable, and year 2 starts cleanly with carried-over state.*

**Post-v0.1 backlog:** calligraphy mode, year-2 content (higher-rank events, marriage consequences, maturing rival arcs), incense competition, chrysanthemum festival, kemari.

## 15. v0.1 content scope (hard limits, resist expansion)

- 1 year of *content*, multi-year *architecture*: year 2 must start cleanly (carryover + Tokimeki reset) even though it has no bespoke events yet
- 6 anchor events, ~12 named NPCs plus **8 love interests** (intro → critical choice → courtship → marriage + buff for all eight; this is the project's largest content lift — see M4a/M4b)
- 4 classes with full perk/liability implementation; ~8–12 `[Background]` dialogue options across all events (max ~2 per event, not required in every event)
- 4 kanzashi with delivery scenes; every anchor event carries at least one choice per theme tag (tags are metadata on existing choices, not extra branches)
- 2.5 mini games (ikebana, raking, moongazing-lite)
- ~16 robes, ~40 poem fragments (each authored in all four language layers — budget the writing time), ~20 ripples
- 4–6 endings

## 16. Decisions log (all confirmed)

1. **Tone:** lighthearted fun overall; satire/melancholy balance is steered by player choices per-thread, not fixed per-route. Confirmed ceiling: bittersweet at worst — exile, estrangement, unconsummated longing; no on-screen death or cruelty.
2. **Multi-year NG+:** yes. Attributes, Rank, relationships, attitudes, reputation, household, and Koku all persist; **Tokimeki** resets each New Year, converting (with faction standing) into permanent Rank at the jimoku first — confirmed. Architecture supports this from M0.
3. **Historicity:** fully fictional court, rigorously period-realistic in texture. No real figures.
4. **Poem language:** three display modes (Romaji default → Gloss → Immersion), all content authored with jp/kana/romaji/en from day one (§6). Calligraphy mode planned for v0.2 with schema support now.
5. **Art:** placeholder-first; gameplay before asset pipeline. Placeholders must respect palette tokens and layout so the eventual art pass is a swap, not a refactor.
6. **Romance (confirmed):** PC gender selectable at the class picker; either PC romances any of the **eight** love interests with identical courtship mechanics. Emergent introductions, hidden Interest, acclaim/deference response profiles, unmarked critical choices, undocumented marriage buffs, kanzashi gifting (§6, §8). Same-gender courtship is unremarkable in-world. The Merchant is written as a far-northern-routes trader (Rus'-adjacent goods via the continental chain) for period plausibility.
7. **Dynamic dialogue (confirmed):** optional deferred feature, socket built in M4a; never gates progression, never mutates state; hard rules and publishing safety in §17.

Non-blocking items deferred to during/after the build: final title (Twelve Layers is the working name), deployment target, audio sourcing.

## 17. Dynamic dialogue via Claude API (deferred feature, socket built now)

Post-v0.1 feature: selected dialogue generated live by a Claude model — best suited to **love-interest poem replies** (judging the player's waka and answering in her voice) and **ambient gossip flavor**. Deferred, but the scene engine ships the socket in M4: a `dynamic` node type `{ promptId, fallbackBody }` that simply renders the authored fallback until the feature exists.

**Hard rules (permanent, not v0.1 limitations):**
1. Dynamic dialogue **never gates progression** — every dynamic node has a fully playable authored fallback.
2. Dynamic output **never mutates game state.** Flavor only; if structured output is ever needed, it passes through a strict constrained-JSON validator and touches nothing mechanical.
3. The game must be 100% completable with the feature off.

**Publishing safety (when implemented):**
- The API key lives **server-side only** — a minimal serverless proxy (Cloudflare Worker / Vercel function). A key shipped in client code will be extracted and the prepay drained, independent of actual players.
- Proxy enforces: per-session rate caps, per-day global budget ceiling with a hard cutoff to fallback mode, response caching (identical poem inputs reuse replies), small max_tokens, cheapest adequate model tier (Haiku-class). Check current models/pricing at https://docs.claude.com when building.
- Budget exhaustion is silent and graceful: players on fallback content should not be able to tell.
