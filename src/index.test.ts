import { describe, expect, it } from 'bun:test';
import { clock, minutesUntil } from './index';

describe('the By Dawn clock', () => {
  it('says a time of night as hh:mm', () => {
    expect(clock(new Date('2026-10-23T05:47:12Z'))).toBe('05:47');
    expect(clock(new Date('2026-10-23T23:05:00Z'))).toBe('23:05');
  });

  it('counts the minutes until a time comes round, past midnight too', () => {
    expect(minutesUntil(new Date('2026-10-23T05:00:00Z'), '05:47')).toBe(47);
    expect(minutesUntil(new Date('2026-10-23T23:30:00Z'), '00:15')).toBe(45);
    expect(minutesUntil(new Date('2026-10-23T05:47:00Z'), '05:47')).toBe(0);
  });

  it('refuses a time it cannot read', () => {
    expect(() => minutesUntil(new Date(), '25:00')).toThrow(RangeError);
  });
});
