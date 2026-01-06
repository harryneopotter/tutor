import { db } from '../db/database';
import { Student } from '../types';
import { BaseRepository } from '../db/baseRepository';

class StudentsRepository extends BaseRepository<Student, string> {
  constructor() {
    super(db.students, 'Students');
  }
}

export const studentsRepo = new StudentsRepository();
