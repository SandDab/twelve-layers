# STATUS.md — Twelve Layers

## Current accepted milestone

**M4b (chunk 1) — Devotee + Northern Merchant routes**, accepted
(GAME_DESIGN.md §6/§13/§14). Content-only, against the frozen M4a engine:

- **The Devotee** (`romance_devotee_intro`/`romance_devotee_critical`,
  critical at stage 4): a landholding Shinto devotee, met sweeping a wayside
  shrine in the snow. The critical scene ("The Night Purification") is a
  three-branch choice at a private winter rite — the quiet, form-keeping
  path marries him (`stage 5, closed: true, marry: true`), activating his
  `composureRegen +5` and `factionRepMult` (clergy x1.5) marriage buffs; a
  showy-donation path closes the route with `made_a_show_at_the_shrine`
  gossip (clergy -1, rivalHouses +1, 1-month delay); a quiet path closes
  with no gossip.
- **The Northern Merchant** (`romance_merchant_intro`/
  `romance_merchant_critical`, critical at stage 2 — "first poem"): a
  continental trader met unpacking sable and amber. The critical scene
  ("The Caravan at the West Gate") fires the month after the first
  successful poem, before his caravan departs — going to the gate in person
  marries him (`stage 3, closed: true, marry: true`), activating his
  `kokuStipend +8` marriage buff; sending him off with a retinue closes the
  route with `entertained_a_foreign_trader` gossip (rivalHouses +1,
  1-month delay); letting the caravan leave quietly closes with no gossip.
- `src/content/scenes/romanceIntroStubs.ts`/`romanceCriticalStubs.ts`: removed
  the Devotee/Merchant stub exports (now real content); `index.ts` registers
  the four new scene IDs.

Verified via `tsc -b`, `eslint`, `vitest` (163/163), `npm run build`, and a
debug-panel playtest at 390x844 from two clean saves: drove the intro
director to fire Riverbank then Devotee (Taste 15 + a `restraint` tag,
isolating Devotee as the next unique `restraint` candidate once Riverbank's
intro had fired), played both intro scenes, composed three winter-matching
poems to reach Devotee's critical stage, and took the marriage path
(`romance.devotee` -> `stage 5, closed: true`, `save.married = 'devotee'`),
then confirmed Composure +5/month (90 -> 95) on the next month-end.
Separately, from a fresh save, fired Captain then Merchant (Charisma 20 + an
`alignment` tag, isolating Merchant once Captain's intro had fired), played
Merchant's intro, sent one matching poem (Rhetoric/Taste bumped to 20 each
for the composition bonus) to jump straight to his stage-2 critical scene,
and took the marriage path (`romance.merchant` -> `stage 3, closed: true`,
`save.married = 'merchant'`), then confirmed Koku +33 vs. the usual +25 on
the next month-end (the +8 stipend). The `factionRepMult` clergy x1.5
multiplier was confirmed via a temporary unit test against
`resolveDueGossip` with `save.married = 'devotee'`.

## Previously accepted milestones

**M4a — Romance engine + route content**, accepted (GAME_DESIGN.md §6/§13/§14).
This session shipped the remaining M4a scope on top of the prior session's
engine half (intro director, romance schema, courtship signals, theme-tag
tracking):

- `src/engine/romance.ts` (+ tests): `composeRomancePoem` (scores via
  `scorePoem`; success advances stage and Interest, or at one stage short of
  the critical stage jumps straight to it and queues a ripple to
  `criticalChoice.sceneId` next month; failure drops Interest and queues
  `fumbled_a_verse_to_{id}` gossip) and `giftKanzashi` (Interest-checked
  acceptance with a kanzashi-affinity threshold discount; acceptance moves
  the kanzashi to `kanzashiGifted` and unequips/reverses its attribute
  passives if worn; refusal queues `refused_kanzashi_{id}` gossip).
- `src/engine/introDirector.ts`: `fireIntro` now also queues a ripple to
  `li.introScene.sceneId` for the following month, so every introduction is
  an actual scene.
- Marriage buffs wired end-to-end: `computeIncome` adds the married LI's
  `kokuStipend`, `applyMonthEnd` applies `composureRegen` (capped), and
  `resolveDueGossip` applies the married LI's passives (e.g. Second Prince's
  `factionRepMult`) the same way kanzashi passives do.
- Two complete routes: **The Girl from the Riverbank** (scandal route,
  `romance_riverbank_intro`/`romance_riverbank_critical` at stage 5 -
  marriage activates the fishing-themed Koku stipend + Composure regen buff)
  and **the Second Prince** (political route,
  `romance_second_prince_intro`/`romance_second_prince_critical` at stage 4 -
  marriage activates the imperial-favor/faction-rep buff). The other six love
  interests get TODO-stub intro scenes (`romanceIntroStubs.ts`) alongside
  their existing critical-choice stubs, so M4b is pure content work.
- `src/content/lint.ts`: `lintLoveInterests` now also validates
  `introScene.sceneId` is registered.
- `src/ui/PoemComposer.tsx` (new) + `src/state/gameStore.ts`
  (`composeRomancePoem`, `giftKanzashi` actions) + `src/ui/HouseholdScreen.tsx`
  ("Correspondence" section: per open courtship, a poem-composer button below
  the critical stage, and a gift button per owned/ungifted kanzashi). No
  Interest/score numbers are ever shown - outcomes are read through prose and
  gossip only, per CLAUDE.md.

Verified via `tsc -b`, `eslint`, `vitest` (163/163), `npm run build`, and a
debug-panel playtest at 390x844: bumped Taste/`restraint` to fire Riverbank's
intro, played the intro ripple, composed four matching-season poems to reach
stage 5 (Interest 12) and trigger the critical-stage ripple, took the marriage
choice in "The Shallows at Dusk" (`romance.riverbank` -> `stage 6, closed:
true`, `save.married = 'riverbank'`), and confirmed the marriage buff
numerically on the next month-end (Koku +30 vs. the usual +25 income, and
Composure +5 on top of the normal change). Separately sent a mismatched
(spring-tagged) poem in month 5, confirming the fumble path (`interest: -1`,
stage unchanged, `fumbled_a_verse_to_riverbank` gossip queued).

**M3 — Ikebana**, accepted. The mini game (`src/minigames/ikebana/IkebanaGame.tsx`),
scoring engine (`src/engine/ikebana.ts`, fully unit-tested), and content
(`src/content/ikebana.ts`) were already built in a prior session, ahead of
order. This session verified the acceptance criteria: a store-level test
(`src/state/gameStore.test.ts`, "M3 acceptance") confirms the free action
("Arrange Ikebana" in HouseholdScreen) feeds the arrangement score into
Taste and spends an action; a component test
(`src/minigames/ikebana/IkebanaGame.test.tsx`) confirms it's playable with
tap-only placement/removal and a live score. The "checked event
performance" integration (`node.ikebana` in the scene engine, `SceneRunner`)
is also wired and exercised by the month-8 Tsukimi content (pending
re-verification with the rest of months 7/8/11, see below).

M0, M1, M1.5, and M2 are also accepted.

## What's next

- **M4b (chunk 2)**: route content for the remaining four love interests
  (`climber`, `widow`, `sole_heir`, `captain`) — each currently has
  TODO-stub intro and critical-choice scenes
  (`romanceIntroStubs.ts`/`romanceCriticalStubs.ts`), registered and
  content-lint-validated. Unlike chunk 1 (Devotee/Merchant), each of these
  routes' marriage buffs needs a *new* engine mechanic wired before its
  content can be authored: Climber's `tokimekiMult`, Widow's
  `rippleIntercept`, Sole Heir's `attrBonus`-on-marry + `kasaneProtection`,
  and Captain's `envyWeaken` are all currently unread by any engine code.
  M4b is "done" per GAME_DESIGN.md §14 once all eight routes are completable
  and all eight marriage buffs verify via debug.
- Note: `src/minigames/raking/RakingGame.tsx` (M5's mini game) is also
  already built and wired into HouseholdScreen, ahead of order — same
  "leave in place, verify later" treatment as months 7/8/11 below.
- Month 3's anchor event (Cherry-Blossom Banquet & Utaawase) has no
  `sceneId` yet — it's the first piece of M3/M4a content.

## Content already authored, pending verification at proper milestone order

Months 7 (Tanabata), 8 (Tsukimi), and 11 (Gosechi), plus the `envyRival`
ripple scene, were authored ahead of milestone order in a prior session
(~573 lines). Per REALIGNMENT.md, **this content is being left in place**
rather than backlogged: it was checked during Phase 4 and found to have no
code dependency on the romance-v1 system being triaged below, so leaving
it in place does not block the romance triage. It still needs to be
re-verified against v0.6 (theme-tag coverage, ripple delays, writing
register, content-lint) when M5/M6 are reached in proper milestone order.
Do not build on top of it or treat it as "done" until then.

## `src/content/backlog/`

### `romance-v1/`

The old fixed 3-candidate romance system (Sequestered Heir, Sharp Brush,
Faded Branch), built against a pre-v0.6 spec. Moved here whole rather than
deleted, in case any prose is salvageable for the v0.6 eight-love-interest
roster (`climber`, `widow`, `sole_heir`, `riverbank`, `captain`, `devotee`,
`second_prince`, `merchant`) when M4a is built:

- `npcs.ts` — the 3-candidate roster and their `tastes`/`curtainSceneId`.
- `romance.ts`, `romance.test.ts` — `sendPoem`/`canSendPoem` against the
  old `RomanceState` shape (`stage`/`receivedImageTags`/`exchangeCount`/
  `lastSent*`).
- `RomanceScreen.tsx`, `PoemBuilder.tsx` — UI wired to the old cast.
- `romanceSequesteredHeirCurtain.ts`, `romanceSharpBrushCurtain.ts`,
  `romanceFadedBranchCurtain.ts` — the three candidates' curtain scenes.

This directory is excluded from `tsc -b`, `eslint`, and `vitest` (it
references types removed from `src/engine/types.ts` in the v9 schema
migration) and is not part of the build.

**Kept in place, not backlogged:** `src/content/poems.ts` and
`src/engine/poems.ts` (+ `poems.test.ts`). These are general M3/M4a poem-
builder infrastructure per GAME_DESIGN.md §6/§13 — `POEM_FRAGMENTS` already
carries all four language fields, and `scorePoem`/`PoemSelection` don't
depend on the old candidate cast. They're ready to be wired into the v0.6
roster at M4a.

## Engine changes from the romance-v1 triage

- `src/engine/types.ts`: removed `CandidateId`, `CANDIDATE_IDS`,
  `RomanceStage`, the old `RomanceState`, and `createInitialRomanceState`.
  Added the §13-shaped `RomanceState = { stage, interest, closed,
  introFired }`. `Save.romance` is now `Record<string, RomanceState>`
  (keyed by future `loveInterestId`), defaulting to `{}`.
- `CURRENT_SAVE_SCHEMA_VERSION` bumped 8 -> 9. The v9 migration drops any
  old-shape `romance` field from pre-v9 saves (the old cast's progress
  doesn't map to the new roster).
- `src/state/gameStore.ts`: removed the `sendPoem` action and its old
  romance/poems imports.
- `src/App.tsx`: removed the Romance nav tab and screen.
- `src/content/scenes/index.ts`: removed the three curtain-scene
  registrations.

## Known loose end

`src/content/classes.ts` (Salon Child's `startFavors`) and
`src/content/scenes/m1NewYear.ts` (an M1 choice's `favor` effect) both
reference the npc id `sharpBrush` as a key into the generic
`favors: Record<string, number>` map. This is not type- or lint-checked
against any roster, so it doesn't break the build, but it's a dangling
reference to the old "Sharp Brush" candidate concept. When the v0.6 roster
lands at M4a, decide whether to repoint these at one of the eight new
love-interest ids or repurpose `sharpBrush` as a non-romance NPC (a
celebrated court poet/lady-in-waiting), and update both references then.
