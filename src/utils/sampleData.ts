import { Student, ClassEvent, ExtraClassRequest, WaitlistEntry } from '../types';
import { addHours, addMinutes, startOfDay } from 'date-fns';

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
  }
];

export const sampleEvents: ClassEvent[] = [
  {
    id: 'evt1',
    studentId: '1',
    title: 'Algebra Review',
    start: addHours(startOfDay(new Date()), 9).toISOString(), // 9 AM today
    end: addMinutes(addHours(startOfDay(new Date()), 9), 60).toISOString(), // 10 AM today
    confirmed: false,
    canceled: false
  },
  {
    id: 'evt2',
    studentId: '2',
    title: 'Essay Writing',
    start: addHours(startOfDay(new Date()), 14).toISOString(), // 2 PM today
    end: addMinutes(addHours(startOfDay(new Date()), 14), 90).toISOString(), // 3:30 PM today
    confirmed: true,
    canceled: false
  },
  {
    id: 'evt3',
    studentId: '3',
    title: 'SAT Practice',
    start: addHours(startOfDay(new Date()), 16).toISOString(), // 4 PM today
    end: addMinutes(addHours(startOfDay(new Date()), 16), 60).toISOString(), // 5 PM today
    confirmed: false,
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'extra2',
    studentId: '3',
    durationMin: 90,
    notes: 'Additional SAT prep session',
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const sampleWaitlistEntries: WaitlistEntry[] = [
  {
    id: 'wait1',
    studentId: '1',
    durationMin: 60,
    notes: 'Available for makeup sessions'
  },
  {
    id: 'wait2',
    studentId: '2',
    durationMin: 30,
    notes: 'Short review sessions preferred'
  },
  {
    id: 'wait3',
    studentId: '3',
    durationMin: 90,
    notes: 'Longer sessions for SAT prep'
  }
];