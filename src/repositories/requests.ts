import { db } from '../db/database';
import { ExtraClassRequest } from '../types';
import { BaseRepository } from '../db/baseRepository';

class RequestsRepository extends BaseRepository<ExtraClassRequest, string> {
  constructor() {
    super(db.extraRequests, 'Requests');
  }
}

export const requestsRepo = new RequestsRepository();
