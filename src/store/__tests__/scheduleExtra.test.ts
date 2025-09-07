import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../repositories/students', () => ({ studentsRepo: { count: async () => 0, addMany: async () => {}, add: async () => 'ok', getAll: async () => [] } }));
vi.mock('../../repositories/events', () => ({ eventsRepo: { add: async () => 'ok', addMany: async () => {}, getAll: async () => [], update: async () => 1, softDelete: async () => 1, remove: async () => {} } }));
vi.mock('../../repositories/requests', () => ({ requestsRepo: { add: async () => 'ok', addMany: async () => {}, getAll: async () => [], update: async () => 1 } }));
vi.mock('../../repositories/waitlist', () => ({ waitlistRepo: { add: async () => 'ok', addMany: async () => {}, getAll: async () => [], remove: async () => {}, removeByStudentId: async () => {} } }));

// polyfill crypto.randomUUID
vi.stubGlobal('crypto', { randomUUID: () => Math.random().toString(36).slice(2) } as any);

import { useAppStore } from '../appStore';
import type { ExtraClassRequest } from '../../types';

describe('scheduleExtra', () => {
  beforeEach(() => {
    // reset store with a known request
    const now = new Date().toISOString();
    const req: ExtraClassRequest = {
      id: 'req1',
      studentId: 's1',
      durationMin: 60,
      status: 'open',
      createdAt: now,
      updatedAt: now,
    };
    useAppStore.setState({ students: [], events: [], extraClassRequests: [req], waitlist: [], currentWeek: new Date(), selectedEvent: null });
  });

  it('creates an event and links the request via linkedEventId with status scheduled', () => {
    const schedule = useAppStore.getState().scheduleExtra;

    const start = '2025-01-01T10:00:00.000Z';
    const end = '2025-01-01T11:00:00.000Z';
    schedule('req1', { studentId: 's1', title: 'Extra Class - s1', start, end });

    const state = useAppStore.getState();
    expect(state.events.length).toBe(1);
    const ev = state.events[0];
    expect(ev.studentId).toBe('s1');
    expect(ev.start).toBe(start);
    expect(ev.end).toBe(end);

    const req = state.extraClassRequests.find(r => r.id === 'req1');
    expect(req?.status).toBe('scheduled');
    expect(req?.linkedEventId).toBe(ev.id);
  });
});

