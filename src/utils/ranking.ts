import { Student, WaitlistEntry } from '../types';

export function rankWaitlistCandidates(
  eventDurationMin: number,
  entries: WaitlistEntry[],
  students: Student[]
): WaitlistEntry[] {
  const nameMap = new Map(students.map(s => [s.id, s.name.toLowerCase()]));
  return [...entries]
    .sort((a, b) => {
      const da = Math.abs(a.durationMin - eventDurationMin);
      const db = Math.abs(b.durationMin - eventDurationMin);
      if (da !== db) return da - db;
      const na = nameMap.get(a.studentId) || '';
      const nb = nameMap.get(b.studentId) || '';
      return na.localeCompare(nb);
    });
}

