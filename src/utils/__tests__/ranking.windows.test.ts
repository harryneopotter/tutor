import { describe, it, expect } from 'vitest';
import { rankWaitlistCandidates } from '../ranking';

describe('rankWaitlistCandidates with windows', () => {
  it('prefers entries whose windows include event start time', () => {
    const students = [
      { id: 'a', name: 'Alice', grade: '10' },
      { id: 'b', name: 'Bob', grade: '9' },
    ];
    const entries = [
      { id: '1', studentId: 'a', durationMin: 60, windows: [{ dow: 1, start: '09:00', end: '11:00' }] },
      { id: '2', studentId: 'b', durationMin: 60, windows: [{ dow: 2, start: '09:00', end: '11:00' }] },
    ];
    const mondayAtTen = new Date('2025-01-06T10:00:00'); // Monday
    const ranked = rankWaitlistCandidates(60, entries as any, students as any, { eventStart: mondayAtTen });
    expect(ranked[0].studentId).toBe('a');
  });
});

