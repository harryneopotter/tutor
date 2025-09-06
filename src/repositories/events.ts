import { db } from '../db/database';
import { ClassEvent } from '../types';

export const eventsRepo = {
  async getAll(): Promise<ClassEvent[]> {
    return db.classEvents.toArray();
  },
  async add(event: ClassEvent): Promise<string> {
    return db.classEvents.put(event);
  },
  async addMany(events: ClassEvent[]): Promise<void> {
    await db.classEvents.bulkPut(events);
  },
  async update(id: string, updates: Partial<ClassEvent>): Promise<number> {
    return db.classEvents.update(id, updates);
  },
  async softDelete(id: string): Promise<number> {
    const deletedAt = new Date().toISOString();
    return db.classEvents.update(id, { deletedAt });
  }
};
