import { describe, it, expect } from 'vitest';
import { rankWaitlistCandidates } from '../../ranking';

describe('rankWaitlistCandidates', () => {
  it('sorts by closeness to duration and then by name', () => {
    const students = [
      { id: 'a', name: 'Alice', grade: '10' },
      { id: 'b', name: 'Bob', grade: '9' },
      { id: 'c', name: 'Carol', grade: '11' },
    ];
    const entries = [
      { id: '1', studentId: 'b', durationMin: 70 },
      { id: '2', studentId: 'a', durationMin: 60 },
      { id: '3', studentId: 'c', durationMin: 60 },
    ];

    const ranked = rankWaitlistCandidates(60, entries as any, students as any);
    expect(ranked.map(e => e.studentId)).toEqual(['a','c','b']);
  });
});

