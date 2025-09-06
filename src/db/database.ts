import Dexie, { Table } from 'dexie';
import { Student, ClassEvent, ExtraClassRequest, WaitlistEntry } from '../types';

export class TutorDB extends Dexie {
  students!: Table<Student, string>;
  classEvents!: Table<ClassEvent, string>;
  extraRequests!: Table<ExtraClassRequest, string>;
  waitlist!: Table<WaitlistEntry, string>;

  constructor() {
    super('tutor_vc_db');
    this.version(1).stores({
      students: 'id, name',
      classEvents: 'id, studentId, start, end, deletedAt',
      extraRequests: 'id, studentId, status, snoozeUntil',
      waitlist: 'id, studentId, durationMin'
    });

    // v2: add binder tables
    this.version(2).stores({
      students: 'id, name',
      classEvents: 'id, studentId, start, end, deletedAt',
      extraRequests: 'id, studentId, status, snoozeUntil',
      waitlist: 'id, studentId, durationMin',
      syllabusTopics: 'id, studentId, month',
      lessonPlans: 'id, studentId, date'
    });
  }
}

export const db = new TutorDB();

