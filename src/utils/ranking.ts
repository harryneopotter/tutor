import { Student, WaitlistEntry } from '../types';

export function rankWaitlistCandidates(
  eventDurationMin: number,
  entries: WaitlistEntry[],
  students: Student[],
  opts?: { eventStart?: Date }
): WaitlistEntry[] {
  const nameMap = new Map(students.map(s => [s.id, s.name.toLowerCase()]));
  const eventStart = opts?.eventStart;
  const eventDow = eventStart ? eventStart.getDay() : undefined; // 0 (Sun) - 6 (Sat)
  const eventMinutes = eventStart ? (eventStart.getHours() * 60 + eventStart.getMinutes()) : undefined;

  const windowScore = (e: WaitlistEntry) => {
    if (!eventStart || !e.windows || e.windows.length === 0 || eventDow === undefined || eventMinutes === undefined) return 0;
    for (const w of e.windows) {
      if (w.dow !== eventDow) continue;
      const [sh, sm] = w.start.split(':').map(Number);
      const [eh, em] = w.end.split(':').map(Number);
      const sMin = sh * 60 + sm;
      const eMin = eh * 60 + em;
      if (eventMinutes >= sMin && eventMinutes < eMin) return 1; // match
    }
    return 0;
  };

  return [...entries]
    .sort((a, b) => {
      const wa = windowScore(a);
      const wb = windowScore(b);
      if (wa !== wb) return wb - wa; // prefer matches
      const da = Math.abs(a.durationMin - eventDurationMin);
      const db = Math.abs(b.durationMin - eventDurationMin);
      if (da !== db) return da - db;
      const na = nameMap.get(a.studentId) || '';
      const nb = nameMap.get(b.studentId) || '';
      return na.localeCompare(nb);
    });
}

