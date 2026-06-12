// The intro director (GAME_DESIGN.md §6 "Introduction pacing") and the
// courtship interest signals that feed it and the open romance tracks:
// theme-tag accumulation for relevance scoring, valued-tag interest gain,
// and the acclaim/deference response profiles.

import { addMonths } from './effects';
import type { AttributeKey, LoveInterest, RomanceState, Save, ThemeTag } from './types';

/** Max introduction opportunities per year (GAME_DESIGN.md §6, tunable). */
export const INTRO_ANNUAL_CAP = 3;
/** Minimum gap, in months, between two introductions. */
export const INTRO_MIN_GAP_MONTHS = 2;
/** If no intro has fired by this in-year month, the closest match fires anyway. */
export const INTRO_PITY_MONTH = 6;
/** Max simultaneously open (introduced, unclosed, unmarried) courtships. */
export const MAX_CONCURRENT_COURTSHIPS = 2;

/** Interest gained per overlapping valued tag when a themed choice is made. */
export const VALUED_TAG_INTEREST_GAIN = 2;
/** Interest delta magnitude from an acclaim/deference courtship signal. */
export const COURTSHIP_SIGNAL_MAGNITUDE = 3;

function absoluteMonth(save: Pick<Save, 'year' | 'month'>): number {
  return (save.year - 1) * 12 + save.month;
}

function meetsIntroConditions(save: Save, li: LoveInterest): boolean {
  const { tags, minAttrs, flags } = li.introConditions;

  if (flags?.some((flag) => !save.flags[flag])) return false;

  if (minAttrs) {
    for (const [attr, min] of Object.entries(minAttrs) as [AttributeKey, number][]) {
      if (save.attributes[attr] < min) return false;
    }
  }

  if (tags && tags.length > 0 && !tags.some((tag) => (save.themeTagCounts[tag] ?? 0) > 0)) {
    return false;
  }

  return true;
}

/** Greatest overlap between a LI's intro-relevant tags and the player's behavior record. */
function relevanceScore(save: Save, li: LoveInterest): number {
  return (li.introConditions.tags ?? []).reduce((sum, tag) => sum + (save.themeTagCounts[tag] ?? 0), 0);
}

function openRomanceCount(save: Save): number {
  return Object.values(save.romance).filter((r) => r.introFired && !r.closed).length;
}

function fireIntro(save: Save, li: LoveInterest, nowMonth: number): Save {
  const fired: RomanceState = { stage: 1, interest: 0, closed: false, introFired: true };
  const { year: triggerYear, month: triggerMonth } = addMonths(save.year, save.month, 1);
  return {
    ...save,
    romance: { ...save.romance, [li.id]: fired },
    rippleQueue: [...save.rippleQueue, { triggerYear, triggerMonth, sceneId: li.introScene.sceneId }],
    introDirector: {
      introsThisYear: save.introDirector.introsThisYear + 1,
      lastIntroMonth: nowMonth,
      queued: save.introDirector.queued === li.id ? undefined : save.introDirector.queued,
    },
  };
}

/**
 * Run the intro director for the current month (GAME_DESIGN.md §6): a
 * previously queued intro takes priority once a courtship slot frees;
 * otherwise the highest-relevance candidate meeting its intro conditions
 * fires, subject to the annual cap, minimum gap, and concurrency limit. If
 * no candidate meets its conditions but the pity-timer month has passed
 * with no intro this year, the closest match fires regardless. The
 * director shuts off once the PC is married.
 */
export function runIntroDirector(save: Save, roster: LoveInterest[]): Save {
  if (save.married) return save;

  const candidates = roster.filter((li) => !save.romance[li.id]?.introFired);
  if (candidates.length === 0) return save;

  const { introDirector } = save;
  const openCourtships = openRomanceCount(save);

  if (introDirector.queued && openCourtships < MAX_CONCURRENT_COURTSHIPS) {
    const queuedLi = candidates.find((li) => li.id === introDirector.queued);
    if (queuedLi) return fireIntro(save, queuedLi, absoluteMonth(save));
  }

  if (introDirector.introsThisYear >= INTRO_ANNUAL_CAP) return save;

  const nowMonth = absoluteMonth(save);
  if (
    introDirector.lastIntroMonth !== undefined &&
    nowMonth - introDirector.lastIntroMonth < INTRO_MIN_GAP_MONTHS
  ) {
    return save;
  }

  let eligible = candidates.filter((li) => meetsIntroConditions(save, li));
  const pity = introDirector.introsThisYear === 0 && save.month >= INTRO_PITY_MONTH;
  if (eligible.length === 0) {
    if (!pity) return save;
    eligible = candidates;
  }

  const chosen = eligible.reduce((best, li) =>
    relevanceScore(save, li) > relevanceScore(save, best) ? li : best,
  );

  if (openCourtships >= MAX_CONCURRENT_COURTSHIPS) {
    if (introDirector.queued === chosen.id) return save;
    return { ...save, introDirector: { ...introDirector, queued: chosen.id } };
  }

  return fireIntro(save, chosen, nowMonth);
}

/**
 * Record a chosen choice's themeTags into the lifetime behavior record
 * (feeds intro-director relevance scoring), and grant interest to any open
 * courtship whose valuedTags overlap with the chosen tags (GAME_DESIGN.md
 * §6 "Interest").
 */
export function recordThemeTags(save: Save, themeTags: ThemeTag[] | undefined, roster: LoveInterest[]): Save {
  if (!themeTags || themeTags.length === 0) return save;

  const counts = { ...save.themeTagCounts };
  for (const tag of themeTags) {
    counts[tag] = (counts[tag] ?? 0) + 1;
  }
  let next: Save = { ...save, themeTagCounts: counts };

  for (const li of roster) {
    const state = next.romance[li.id];
    if (!state || !state.introFired || state.closed) continue;

    const overlap = li.valuedTags.filter((tag) => themeTags.includes(tag)).length;
    if (overlap === 0) continue;

    next = {
      ...next,
      romance: {
        ...next.romance,
        [li.id]: { ...state, interest: state.interest + overlap * VALUED_TAG_INTEREST_GAIN },
      },
    };
  }

  return next;
}

/**
 * Apply an ambient acclaim or deference courtship signal (GAME_DESIGN.md
 * §6) to every open courtship, per that love interest's response profile.
 */
export function applyCourtshipSignal(save: Save, signal: 'acclaim' | 'deference', roster: LoveInterest[]): Save {
  let next = save;

  for (const li of roster) {
    const state = next.romance[li.id];
    if (!state || !state.introFired || state.closed) continue;

    const sign = signal === 'acclaim' ? li.acclaim : li.deference;
    if (sign === 0) continue;

    next = {
      ...next,
      romance: {
        ...next.romance,
        [li.id]: { ...state, interest: state.interest + sign * COURTSHIP_SIGNAL_MAGNITUDE },
      },
    };
  }

  return next;
}
