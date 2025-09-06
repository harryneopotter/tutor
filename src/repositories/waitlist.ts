import { db } from '../db/database';
import { WaitlistEntry } from '../types';

export const waitlistRepo = {
  async getAll(): Promise<WaitlistEntry[]> {
    return db.waitlist.toArray();
  },
  async add(entry: WaitlistEntry): Promise<string> {
    return db.waitlist.put(entry);
  },
  async addMany(entries: WaitlistEntry[]): Promise<void> {
    await db.waitlist.bulkPut(entries);
  },
  async remove(id: string): Promise<void> {
    await db.waitlist.delete(id);
  },
  async removeByStudentId(studentId: string): Promise<void> {
    await db.waitlist.where('studentId').equals(studentId).delete();
  }
};
