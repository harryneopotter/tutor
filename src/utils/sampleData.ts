import { Student, ClassEvent, ExtraClassRequest, WaitlistEntry } from '../types';
import { addHours, addMinutes, startOfDay, startOfWeek, addDays } from 'date-fns';

const now = new Date();
const todayStart = startOfDay(now);
const weekStart = startOfWeek(now, { weekStartsOn: 1 });

export const sampleStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    grade: '10th Grade',
    notes: 'Needs help with algebra'
  },
  {
    id: '2', 
    name: 'Bob Smith',
    grade: '9th Grade',
    notes: 'Strong in math, working on essay writing'
  },
  {
    id: '3',
    name: 'Carol Davis',
    grade: '11th Grade',
    notes: 'Preparing for SATs'
  },
  {
    id: '4',
    name: 'David Lee',
    grade: '8th Grade',
    notes: 'Geometry starter'
  },
  {
    id: '5',
    name: 'Emma Thompson',
    grade: '12th Grade',
    notes: 'Chemistry exam next month'
  },
  {
    id: '6',
    name: 'Frank Wu',
    grade: '10th Grade',
    notes: 'Evening sessions preferred'
  },
  {
    id: '7',
    name: 'Grace Kim',
    grade: '9th Grade',
    notes: 'Focus on reading comprehension'
  }
];

export const sampleEvents: ClassEvent[] = [
  // Today examples
  {
    id: 'evt1',
    studentId: '1',
    title: 'Algebra Review',
    start: addHours(todayStart, 9).toISOString(), // 9 AM today
    end: addMinutes(addHours(todayStart, 9), 60).toISOString(), // 10 AM today
    confirmed: false,
    canceled: false
  },
  {
    id: 'evt2',
    studentId: '2',
    title: 'Essay Writing',
    start: addHours(todayStart, 14).toISOString(), // 2 PM today
    end: addMinutes(addHours(todayStart, 14), 90).toISOString(), // 3:30 PM today
    confirmed: true,
    canceled: false
  },
  {
    id: 'evt3',
    studentId: '3',
    title: 'SAT Practice',
    start: addHours(todayStart, 16).toISOString(), // 4 PM today
    end: addMinutes(addHours(todayStart, 16), 60).toISOString(), // 5 PM today
    confirmed: false,
    canceled: false
  },
  {
    id: 'evt4',
    studentId: '4',
    title: 'Geometry Basics',
    start: addHours(todayStart, 11).toISOString(), // 11 AM today
    end: addMinutes(addHours(todayStart, 11), 60).toISOString(), // 12 PM today
    confirmed: false,
    canceled: false
  },
  {
    id: 'evt5',
    studentId: '5',
    title: 'Chemistry Review',
    start: addHours(todayStart, 12.5).toISOString(), // 12:30 PM today
    end: addMinutes(addHours(todayStart, 12.5), 60).toISOString(), // 1:30 PM today
    confirmed: false,
    canceled: true // canceled example
  },
  {
    id: 'evt6',
    studentId: '6',
    title: 'Evening Math',
    start: addHours(todayStart, 18.5).toISOString(), // 6:30 PM today
    end: addMinutes(addHours(todayStart, 18.5), 60).toISOString(), // 7:30 PM today
    confirmed: true,
    canceled: false
  },

  // Spread across the current week (Mon–Sun)
  // Monday
  {
    id: 'evtMon1',
    studentId: '1',
    title: 'Mon Algebra Drill',
    start: addHours(addDays(weekStart, 0), 9).toISOString(),
    end: addMinutes(addHours(addDays(weekStart, 0), 9), 60).toISOString(),
    confirmed: false,
    canceled: false
  },
  {
    id: 'evtMon2',
    studentId: '4',
    title: 'Mon Geometry Practice',
    start: addHours(addDays(weekStart, 0), 13).toISOString(),
    end: addMinutes(addHours(addDays(weekStart, 0), 13), 60).toISOString(),
    confirmed: true,
    canceled: false
  },
  // Tuesday
  {
    id: 'evtTue1',
    studentId: '2',
    title: 'Tue Essay Review',
    start: addHours(addDays(weekStart, 1), 11.5).toISOString(), // 11:30
    end: addMinutes(addHours(addDays(weekStart, 1), 11.5), 60).toISOString(),
    confirmed: false,
    canceled: false
  },
  {
    id: 'evtTue2',
    studentId: '6',
    title: 'Tue Evening Math',
    start: addHours(addDays(weekStart, 1), 19).toISOString(), // 7:00 PM
    end: addMinutes(addHours(addDays(weekStart, 1), 19), 60).toISOString(),
    confirmed: true,
    canceled: false
  },
  // Wednesday
  {
    id: 'evtWed1',
    studentId: '3',
    title: 'Wed SAT Practice',
    start: addHours(addDays(weekStart, 2), 15).toISOString(),
    end: addMinutes(addHours(addDays(weekStart, 2), 15), 60).toISOString(),
    confirmed: false,
    canceled: false
  },
  {
    id: 'evtWed2',
    studentId: '5',
    title: 'Wed Chem Lab Review',
    start: addHours(addDays(weekStart, 2), 10).toISOString(),
    end: addMinutes(addHours(addDays(weekStart, 2), 10), 60).toISOString(),
    confirmed: false,
    canceled: false
  },
  // Thursday
  {
    id: 'evtThu1',
    studentId: '4',
    title: 'Thu Geometry Basics',
    start: addHours(addDays(weekStart, 3), 9.5).toISOString(), // 9:30
    end: addMinutes(addHours(addDays(weekStart, 3), 9.5), 60).toISOString(),
    confirmed: false,
    canceled: false
  },
  {
    id: 'evtThu2',
    studentId: '7',
    title: 'Thu Reading Comprehension',
    start: addHours(addDays(weekStart, 3), 16).toISOString(),
    end: addMinutes(addHours(addDays(weekStart, 3), 16), 60).toISOString(),
    confirmed: true,
    canceled: false
  },
  // Friday
  {
    id: 'evtFri1',
    studentId: '1',
    title: 'Fri Algebra Quiz Prep',
    start: addHours(addDays(weekStart, 4), 14.5).toISOString(), // 2:30 PM
    end: addMinutes(addHours(addDays(weekStart, 4), 14.5), 60).toISOString(),
    confirmed: false,
    canceled: false
  },
  {
    id: 'evtFri2',
    studentId: '2',
    title: 'Fri Essay Outline',
    start: addHours(addDays(weekStart, 4), 9).toISOString(),
    end: addMinutes(addHours(addDays(weekStart, 4), 9), 60).toISOString(),
    confirmed: true,
    canceled: false
  },
  // Saturday
  {
    id: 'evtSat1',
    studentId: '3',
    title: 'Sat SAT Mock Test',
    start: addHours(addDays(weekStart, 5), 9).toISOString(),
    end: addMinutes(addHours(addDays(weekStart, 5), 9), 90).toISOString(),
    confirmed: false,
    canceled: false
  },
  // Sunday
  {
    id: 'evtSun1',
    studentId: '7',
    title: 'Sun Reading Workshop',
    start: addHours(addDays(weekStart, 6), 16).toISOString(), // 4 PM
    end: addMinutes(addHours(addDays(weekStart, 6), 16), 60).toISOString(),
    confirmed: true,
    canceled: false
  }
];

export const sampleExtraRequests: ExtraClassRequest[] = [
  {
    id: 'extra1',
    studentId: '1',
    durationMin: 60,
    notes: 'Extra help before test next week',
    status: 'open',
    windows: [
      { dow: 1, start: '18:00', end: '19:00' }, // Mon
      { dow: 3, start: '18:00', end: '19:00' }, // Wed
    ],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  },
  {
    id: 'extra2',
    studentId: '3',
    durationMin: 90,
    notes: 'Additional SAT prep session',
    status: 'open',
    windows: [
      { dow: 6, start: '10:00', end: '12:00' }, // Sat
    ],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  },
  {
    id: 'extra3',
    studentId: '2',
    durationMin: 30,
    notes: 'Essay follow-up',
    status: 'snoozed',
    snoozeUntil: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago -> should appear
    windows: [
      { dow: 2, start: '17:00', end: '18:00' }, // Tue
    ],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  },
  {
    id: 'extra4',
    studentId: '5',
    durationMin: 60,
    notes: 'Chemistry lab recap',
    status: 'dismissed',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  },
  {
    id: 'extra5',
    studentId: '6',
    durationMin: 60,
    notes: 'Evening preferred',
    status: 'open',
    windows: [
      { dow: 2, start: '18:00', end: '20:00' }, // Tue
      { dow: 4, start: '18:00', end: '20:00' }, // Thu
    ],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  }
];

export const sampleWaitlistEntries: WaitlistEntry[] = [
  {
    id: 'wait1',
    studentId: '1',
    durationMin: 60,
    notes: 'Available for makeup sessions',
    windows: [ { dow: 1, start: '17:00', end: '18:00' } ] // Mon
  },
  {
    id: 'wait2',
    studentId: '2',
    durationMin: 30,
    notes: 'Short review sessions preferred',
    windows: [ { dow: 2, start: '16:00', end: '17:00' } ] // Tue
  },
  {
    id: 'wait3',
    studentId: '3',
    durationMin: 90,
    notes: 'Longer sessions for SAT prep',
    windows: [ { dow: 6, start: '09:00', end: '12:00' } ] // Sat
  },
  {
    id: 'wait4',
    studentId: '4',
    durationMin: 60,
    notes: 'Morning preferred',
    windows: [ { dow: 3, start: '10:00', end: '12:00' } ] // Wed
  },
  {
    id: 'wait5',
    studentId: '7',
    durationMin: 60,
    notes: 'Reading focus',
    windows: [ { dow: 0, start: '09:00', end: '11:00' } ] // Sun
  }
];
