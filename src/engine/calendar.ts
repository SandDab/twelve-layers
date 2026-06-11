import { assignKanzashiMonths } from './kanzashi';
import type { Save } from './types';

/**
 * Advance the calendar by one month, mutating a copy of the save.
 * On the month-12 -> month-1 rollover: the year increments, the
 * outgoing year's Tokimeki is recorded in tokimekiHistory, Tokimeki
 * resets to zero, and the kanzashi month assignments are re-rolled for
 * the new year (NG+ re-roll, GAME_DESIGN.md §8). Everything else
 * (attributes, resources, favors, flags, ripple queue) persists
 * untouched.
 */
export function tickCalendar(save: Save): Save {
  if (save.month < 12) {
    return { ...save, month: save.month + 1 };
  }

  const nextYear = save.year + 1;
  return {
    ...save,
    year: nextYear,
    month: 1,
    tokimeki: 0,
    tokimekiHistory: { ...save.tokimekiHistory, [save.year]: save.tokimeki },
    kanzashiAssignments: assignKanzashiMonths(save.kanzashiSeed, nextYear),
  };
}
