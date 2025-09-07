import { ClassEvent } from '../types';
import { endOfDay, isSameDay, addMinutes } from 'date-fns';

export function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function hasConflict(start: Date, end: Date, events: ClassEvent[]): boolean {
  return events.some(ev => {
    if (ev.deletedAt || ev.canceled) return false;
    const s = new Date(ev.start);
    const e = new Date(ev.end);
    if (!isSameDay(s, start)) return false;
    return overlaps(start, end, s, e);
  });
}

export function findNextAvailableSlotSameDay(start: Date, durationMin: number, events: ClassEvent[]): { start: Date; end: Date } | null {
  const dayEnd = endOfDay(start);
  for (let t = new Date(start); t <= dayEnd; t = addMinutes(t, 30)) {
    const candidateStart = t;
    const candidateEnd = addMinutes(t, durationMin);
    if (candidateEnd > dayEnd) break;
    if (!hasConflict(candidateStart, candidateEnd, events)) return { start: candidateStart, end: candidateEnd };
  }
  return null;
}

