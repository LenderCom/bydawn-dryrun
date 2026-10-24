/**
 * The clock By Dawn speaks in: times of night as `hh:mm`, and how long until a time comes round again.
 * By Dawn's queue view used this before it had a name.
 */

/** A time of day as `hh:mm`, 24-hour, in UTC. */
export function clock(at: Date): string {
  return `${String(at.getUTCHours()).padStart(2, '0')}:${String(at.getUTCMinutes()).padStart(2, '0')}`;
}

/** Minutes from `from` until the next `hh:mm` (UTC), wrapping past midnight. 0 when it is that minute now. */
export function minutesUntil(from: Date, hhmm: string): number {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(hhmm);
  if (!match) throw new RangeError(`minutesUntil: expected hh:mm, got "${hhmm}"`);
  const target = Number(match[1]) * 60 + Number(match[2]);
  const now = from.getUTCHours() * 60 + from.getUTCMinutes();
  return (target - now + 24 * 60) % (24 * 60);
}
