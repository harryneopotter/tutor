import { db } from '../db/database';
import { Student } from '../types';

export const studentsRepo = {
  async getAll(): Promise<Student[]> {
    return db.students.toArray();
  },
  async add(student: Student): Promise<string> {
    return db.students.put(student);
  },
  async addMany(students: Student[]): Promise<void> {
    await db.students.bulkPut(students);
  },
  async count(): Promise<number> {
    return db.students.count();
  }
};
