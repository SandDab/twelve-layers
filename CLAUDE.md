# CLAUDE.md — Twelve Layers

Heian-court dating sim / household tycoon. Mobile web, portrait, one-thumb. The full spec is in `GAME_DESIGN.md` — read it before any milestone work. This file is operating instructions.

## Stack & commands
- Vite + React + TypeScript, Zustand for state, vanilla CSS with tokens (no Tailwind — the kasane palette system is custom).
- `npm run dev` / `npm run build` / `npm run test` (Vitest).
- No backend. Saves to localStorage under key `twelvelayers.save.v1` with a schema version field; write a migration stub from day one.

## Non-negotiable constraints
1. **Content is data, engine is code.** All scenes, NPCs, events, poems, robes, and ripples are typed JSON in `src/content/`. If you find yourself writing story text in a `.tsx` file, stop and move it to content. Engine changes and content changes should never be the same commit.
2. **One-thumb, bottom 60%.** Every interactive element sits in the lower 60% of the viewport. Verbs are tap and short-drag only. Test at 390×844 (iPhone-ish portrait) as the primary target.
3. **Checks are threshold-deterministic** (FNV-style, no dice). The drama lives in delayed consequences (ripple queue), not RNG.
4. **Success ≠ safe.** When writing content, every checked option that "wins" the moment should be capable of costing something later. The Aoi Matsuri carriage scene is the reference standard.
5. **The kasane palette drives all UI color.** No hardcoded hex in components — everything flows from the current month's palette tokens in `src/styles/`.
6. **Multi-year from day one.** The save schema carries a year index; everything persists across years except Tokimeki, which zeroes at each New Year. No engine code may assume a single-year game, even though v0.1 ships year-1 content only.
7. **Poem fragments carry all four language fields** (`jp`, `kana`, `romaji`, `en`) at authoring time, no exceptions. Romaji mode ships in M4a; Gloss/Immersion modes in M6 are UI-only work because the content is already layered.
8. **Tone ceiling (confirmed).** Lighthearted overall; player choices steer threads toward satire or melancholy. Worst allowable outcomes are bittersweet (exile, estrangement, unconsummated longing) — no on-screen death or cruelty.

## Build order
Work milestones M0→M6 (including M1.5, the class picker) exactly as specified in GAME_DESIGN.md §14, one milestone per session unless told otherwise. Each milestone has acceptance criteria — demo them (dev server + a written checklist of criteria met) before moving on. Do not pull future-milestone features forward.

## Testing
- Vitest unit tests required for: check resolver, effects pipeline, ripple queue, calendar tick (including year rollover + Tokimeki reset), save/load round-trip across a year boundary, kasane season lookup, Tokimeki benefit tiers. These are the engine's spine; UI can be eyeballed, the engine cannot.
- Add a `debug` flag in the store that exposes a dev panel: set month/year, set attributes, fire ripples, grant koku/Tokimeki. Build this in M0 — it pays for itself immediately.

## Content authoring conventions
- Scene IDs: `m{month}_{event}_{node}` (e.g., `m4_aoi_carriage_03`).
- Every `ripple` effect must reference a scene that exists or a TODO stub scene — never a dangling ID. Add a content-lint script (M1) that validates all `goto`/`sceneId` references, check attribute names, that every poem fragment has all four language fields populated, and that every ClassDef's attributes sum to exactly 100.
- Classes are content (`src/content/classes/`), not code. Balance invariants that must never break: equal 100-point attribute totals, exactly one strong lane per class, exactly one liability per class, no class locks a romance route. Numbers (Koku multipliers, Composure caps, gossip multipliers, debt size) are tunables — change freely in playtest; invariants are not.
- `[Background: X]` dialogue options: max ~2 per anchor event, never the only good option in a scene, and they should color outcomes rather than trivially win them.
- Kanzashi theme tags (`principle`, `restraint`, `alignment`, `grace`) are invisible metadata on existing choices — never surfaced in choice text, never a labeled "item opportunity." Tag honestly: the choice must genuinely embody the theme on its own terms, including its costs (a `restraint` choice should still cost something to choose). Every anchor event needs at least one choice per tag; content-lint should verify this. Kanzashi are never purchasable — no shop, no Koku path, no exceptions.
- Romance: introduction triggers, critical choices, and marriage buffs are **never labeled, hinted at, or surfaced in UI** — no meters, no tooltips, no "[Route: Widow]" markers. Interest is read through prose only. Each route's critical choice sits at a different stage. Surprise is the design pillar here; any UI affordance that telegraphs romance mechanics is a bug.
- Dynamic dialogue nodes (`kind: 'dynamic'`): always author the `fallbackBody` to full quality — it is the shipped v0.1 content, not a placeholder. Dynamic nodes may never gate progression or mutate state (GAME_DESIGN.md §17).
- Poem fragments carry `season`, `imagery` tags; recipient NPC `tastes` arrays match against those tags.
- Writing register: restrained, concrete, period-flavored but readable. No "thee/thou." Emotion through gesture and object (sleeves, screens, ink quality), not stated feelings. Baseline is light court comedy; satire and melancholy enter through the *player's chosen options*, not the narration — write choice sets so both flavors are usually on the menu. The Social Climber skews witty, the Young Widow skews wistful, the Riverbank Girl skews disarming, but the player picks the register.
- All court figures are fictional. Period-realistic names and offices; no historical persons.

## Visual direction (summary — full version in GAME_DESIGN.md §12)
Yamato-e: roofless oblique interiors, hikime-kagibana stylized faces, washi texture, mincho display type, restrained motion. Placeholder art is fine through M5 — but placeholders must already respect the palette tokens and layout so the art pass is a swap, not a refactor.

## When in doubt
Prefer the smaller, period-accurate mechanic over the bigger generic one. Cut scope from content count (fewer events, fewer robes) before cutting depth from systems (ripples, gossip, kasane).
