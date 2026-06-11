import type { Save } from './types';

/**
 * Advance the calendar by one month, mutating a copy of the save.
 * On the month-12 -> month-1 rollover: the year increments, the
 * outgoing year's Clout is recorded in cloutHistory, and Clout
 * resets to zero. Everything else (attributes, resources, favors,
 * flags, ripple queue) persists untouched.
 */
export function tickCalendar(save: Save): Save {
  if (save.month < 12) {
    return { ...save, month: save.month + 1 };
  }

  return {
    ...save,
    year: save.year + 1,
    month: 1,
    clout: 0,
    cloutHistory: { ...save.cloutHistory, [save.year]: save.clout },
  };
}
