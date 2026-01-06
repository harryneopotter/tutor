import { db } from '../db/database';
import { WaitlistEntry } from '../types';
import { BaseRepository } from '../db/baseRepository';

class WaitlistRepository extends BaseRepository<WaitlistEntry, string> {
  constructor() {
    super(db.waitlist, 'Waitlist');
  }

  async removeByStudentId(studentId: string): Promise<void> {
    try {
      await db.waitlist.where('studentId').equals(studentId).delete();
    } catch (error) {
      console.error(`[WaitlistRepo] Failed to remove by studentId ${studentId}:`, error);
      throw error;
    }
  }
}

export const waitlistRepo = new WaitlistRepository();
