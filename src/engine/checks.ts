import type { Attributes, Check } from './types';

/**
 * Checks are threshold-deterministic: a Check passes iff the
 * attribute meets or exceeds its minimum. No dice.
 */
export function resolveCheck(check: Check, attributes: Attributes): boolean {
  return attributes[check.attr] >= check.min;
}
