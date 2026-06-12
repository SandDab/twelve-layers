# STATUS.md — Twelve Layers

## Current accepted milestone

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

## In progress

**M4a — Romance engine** (GAME_DESIGN.md §6/§13/§14), engine half done,
route content pending (see "What's next"). This session added:

- `src/engine/types.ts`: `LoveInterest`/`LoveInterestId`/`LOVE_INTEREST_IDS`
  (the v0.6 eight-route roster), `PassiveModifier` (generalizes
  `KanzashiPassive` to also cover marriage buffs), `Save.themeTagCounts`
  (lifetime per-`ThemeTag` counter feeding intro relevance), and two new
  `Effect` kinds: `romance` (direct stage/interest/closed mutation) and
  `courtshipSignal` (`acclaim`/`deference`, applies ±3 interest to all open
  courtships per each LI's response profile). Schema bumped 9 -> 10
  (`save.ts` migration default-fills `themeTagCounts`).
- `src/content/loveInterests.ts`: all 8 `LOVE_INTEREST` defs (intro
  conditions, acclaim/deference signs, valued tags, kanzashi affinity,
  critical-choice scene id + stage, marriage buffs).
- `src/engine/introDirector.ts`: `runIntroDirector` (annual cap 3, min
  2-month gap, pity timer at month 6, relevance scoring off
  `themeTagCounts`, concurrency cap of 2 with a queue for a 3rd, shuts off
  once `save.married` is set, `introsThisYear` reset at year rollover via
  `tickCalendar`), `recordThemeTags` (accumulates `themeTagCounts` and
  grants `+2` interest to open courtships whose `valuedTags` overlap),
  `applyCourtshipSignal`.
- `src/content/scenes/romanceCriticalStubs.ts`: 8 TODO-stub critical-choice
  scenes (`romance_{id}_critical`), registered and content-lint-validated.
- `src/content/lint.ts`: `lintLoveInterests` validates the roster against
  the scene registry and `ThemeTag` vocabulary.
- `src/ui/DebugPanel.tsx`: Theme tag counts (+1 per tag), Intro director
  status, Romance state list with `+acclaim`/`+deference` signal buttons,
  Tick Month.
- Fixed a latent bug in `gameStore.ts`'s `SAVE_FIELDS` that was dropping
  `kanzashiGifted`, `introDirector`, `married`, `themeTagCounts`,
  `poemDisplayMode`, and `jimokuResult` on every `set()` (so these never
  persisted to `localStorage`).

Verified via `tsc -b`, `eslint`, `vitest` (149/149), `npm run build`, and a
debug-panel playtest at 390x844: bumping `grace` to 3 and ticking the month
fired `climber`'s intro (`stage 1, interest 3, introFired: true`,
`introsThisYear: 1`), and `+acclaim`/`+deference` correctly adjusted
interest per profile.

## What's next

- **M4a route content** (GAME_DESIGN.md §14): poem composer wiring and two
  complete routes (Riverbank Girl + Second Prince recommended), replacing
  their critical-choice stubs with full content.
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
