import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../repositories/students', () => ({ studentsRepo: { count: async () => 0, addMany: async () => {}, add: async () => 'ok', getAll: async () => [] } }));
vi.mock('../../repositories/events', () => ({ eventsRepo: { add: async () => 'ok', addMany: async () => {}, getAll: async () => [], update: async () => 1, softDelete: async () => 1, remove: async () => {} } }));
vi.mock('../../repositories/requests', () => ({ requestsRepo: { add: async () => 'ok', addMany: async () => {}, getAll: async () => [], update: async () => 1 } }));
vi.mock('../../repositories/waitlist', () => ({ waitlistRepo: { add: async () => 'ok', addMany: async () => {}, getAll: async () => [], remove: async () => {}, removeByStudentId: async () => {} } }));

// polyfill crypto.randomUUID
(globalThis as any).crypto = (globalThis as any).crypto || {};
(globalThis as any).crypto.randomUUID = (globalThis as any).crypto.randomUUID || (() => Math.random().toString(36).slice(2));

import { useAppStore } from '../../appStore';

describe('extras dedup', () => {
  beforeEach(() => {
    // reset store
    useAppStore.setState({ students: [], events: [], extraClassRequests: [], waitlist: [], currentWeek: new Date(), selectedEvent: null });
  });

  it('merges notes for duplicate open/snoozed requests of same student and duration', () => {
    const add = useAppStore.getState().addExtraClassRequest;

    add({ studentId: 's1', durationMin: 60, notes: 'first', status: 'open' });
    add({ studentId: 's1', durationMin: 60, notes: 'second', status: 'open' });

    const list = useAppStore.getState().extraClassRequests;
    expect(list.length).toBe(1);
    expect(list[0].notes).toContain('first');
    expect(list[0].notes).toContain('second');
  });
});

