import { db } from '../db/database';
import { ClassEvent } from '../types';
import { BaseRepository } from '../db/baseRepository';

class EventsRepository extends BaseRepository<ClassEvent, string> {
  constructor() {
    super(db.classEvents, 'Events');
  }

  async softDelete(id: string): Promise<number> {
    const deletedAt = new Date().toISOString();
    return this.update(id, { deletedAt } as Partial<ClassEvent>);
  }
}

export const eventsRepo = new EventsRepository();
