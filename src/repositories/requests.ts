import { db } from '../db/database';
import { ExtraClassRequest } from '../types';

export const requestsRepo = {
  async getAll(): Promise<ExtraClassRequest[]> {
    return db.extraRequests.toArray();
  },
  async add(request: ExtraClassRequest): Promise<string> {
    return db.extraRequests.put(request);
  },
  async addMany(requests: ExtraClassRequest[]): Promise<void> {
    await db.extraRequests.bulkPut(requests);
  },
  async update(id: string, updates: Partial<ExtraClassRequest>): Promise<number> {
    return db.extraRequests.update(id, updates);
  }
};
