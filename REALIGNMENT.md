# REALIGNMENT.md — Getting back on track

Context: a previous session ran ahead of milestone order and built content through month 6, likely against an outdated spec. GAME_DESIGN.md and CLAUDE.md are now at **v0.6** and are the sole source of truth. Work through the phases below **strictly in order**. Do not skip the audit. Do not delete content — triage it.

Kickoff prompt for the session:
> Read REALIGNMENT.md, then GAME_DESIGN.md and CLAUDE.md in full (v0.6). Execute Phase 0 and STOP — report your audit findings before making any changes.

---

## Phase 0 — Audit (read-only; no code changes; report before proceeding)

Produce a written audit covering:

1. **Repo state:** uncommitted work? Test suite passing? Content-lint exists and passes?
2. **Milestone status:** for M0, M1, M1.5, M2 — which acceptance criteria (GAME_DESIGN.md §14) actually pass *right now*? "Code exists" ≠ "criteria pass."
3. **Spec drift checklist** — for each, answer matches-v0.6 / predates-spec / missing:
   - `clout` vs `tokimeki` naming (rename was instructed; verify it happened everywhere including tests)
   - Save schema vs §13 `Save` type: `classId`, `pcGender`, `tokimekiHistory`, `kanzashiOwned/Equipped/Assignments/Gifted`, `romance`, `introDirector`, `married`
   - Class picker: exists? gender select? `ifClass` gating? ClassDef as content JSON?
   - Romance code: built against the old 3-candidate cast or the v0.6 eight-interest system (intro director, hidden Interest, acclaim/deference, critical choices)?
   - Choice schema: supports `check`, `ifClass`, `themeTags`, full `Effect` union including `ripple` and `gossip`?
   - `DynamicNode` type present (renders `fallbackBody`)?
   - Kanzashi system: any of it built?
4. **Content inventory:** list every event/scene file with its month. Flag: (a) events in months 2, 5, 6 — **these are not v0.1 anchor months** (anchors are 1, 3, 4, 7, 8, 11 only); (b) any romance content referencing the retired candidates (Sharp Brush, Sequestered Heir, Faded Branch); (c) poem fragments missing any of the four language fields (`jp`, `kana`, `romaji`, `en`); (d) story text hardcoded in `.tsx` files.

**STOP after Phase 0. Report findings and wait for approval.**

## Phase 1 — Stabilize

1. Commit current state as-is to a branch: `pre-realign-snapshot`. Nothing is lost after this.
2. On main/working branch: fix only what's broken — tests green, build clean. No feature work.

## Phase 2 — Schema & engine reconciliation (engine commits only; no content)

In order:
1. Complete the `tokimeki` rename if the audit found stragglers.
2. Bring `Save` to exact §13 shape. Stub unbuilt systems with sensible defaults (`romance: {}`, `introDirector: { introsThisYear: 0 }`, `kanzashiOwned: []`, etc.). Bump `schemaVersion`; write the migration; round-trip test across the year boundary.
3. Scene engine: ensure `Choice` carries `check`, `ifClass`, `themeTags`, full `Effect` union. Add the `dynamic` node kind rendering `fallbackBody` (GAME_DESIGN.md §17 — fallback is shipped content, not placeholder).
4. Content-lint to full CLAUDE.md spec: validate all `goto`/`sceneId` references, attribute names, ClassDef 100-point sums, poem four-field completeness, and per-event theme-tag coverage (warn-level until M5, error-level at M5).

## Phase 3 — Milestone gap-fill, strictly in order

Complete whichever of these the audit showed unfinished, one at a time, demoing acceptance criteria before moving on:

1. **M1.5 — Class picker** per §2 and §14, *including the v0.6 gender select* (male/female on the picker screen; `pcGender` in save; no mechanical differences). Acceptance: each class starts a measurably different game via debug panel; Old Name debt ripple queued for month 6 at game start; a `[Background]` option live in the tutorial event.
2. **M2 — Household + Tokimeki + kanzashi** per §14. Acceptance: train Rhetoric, go broke on staff, get gossiped about for out-of-season kasane, trigger an envy event by winning publicly, earn the Kōbai via debug month-set on a principle-tagged choice.

**Do not start M3 or M4a in this session.** If M2 won't finish cleanly, stop at a committed, working boundary (e.g., household screen + income tick) and say so.

## Phase 4 — Content triage (after Phase 3, or as a separate session)

Nothing gets deleted; everything gets sorted:

1. **Months 2, 5, 6 events** → move to `src/content/backlog/`. They are out of v0.1 scope. Some may later convert to household-phase free-action scenes — do not do that conversion now.
2. **Months 1, 3, 4 events** → keep if they match their spec'd festivals (m1 New Year audience, m3 cherry-blossom utaawase, m4 Aoi Matsuri carriage dispute). For each kept event: add `themeTags` to qualifying choices (tag honestly per CLAUDE.md), confirm at least one ripple with delayed consequence, check the writing register, run content-lint.
3. **Old-cast romance content** → `src/content/backlog/romance-v1/`. Salvage poem fragments only if they can be completed to all four language fields; otherwise backlog them too.
4. Update or create `STATUS.md` at repo root: current accepted milestone, what's in backlog and why, what's next (M3 ikebana, then M4a).

## Standing rules going forward (also in CLAUDE.md — repeated because they were violated)

- One milestone per session. Demo acceptance criteria before the next.
- Never author events for non-anchor months in v0.1.
- Never pull future-milestone features forward.
- If a task seems to require expanding scope, stop and ask instead.
