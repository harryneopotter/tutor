import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../../repositories/students', () => ({ studentsRepo: { count: async () => 0, addMany: async () => {}, add: async () => 'ok', getAll: async () => [] } }));
vi.mock('../../../repositories/events', () => ({ eventsRepo: { add: async () => 'ok', addMany: async () => {}, getAll: async () => [], update: async () => 1, softDelete: async () => 1, remove: async () => {} } }));
vi.mock('../../../repositories/requests', () => ({ requestsRepo: { add: async () => 'ok', addMany: async () => {}, getAll: async () => [], update: async () => 1 } }));
vi.mock('../../../repositories/waitlist', () => ({ waitlistRepo: { add: async () => 'ok', addMany: async () => {}, getAll: async () => [], remove: async () => {}, removeByStudentId: async () => {} } }));

// polyfill crypto.randomUUID
vi.stubGlobal('crypto', { randomUUID: () => Math.random().toString(36).slice(2) } as any);

import { useAppStore } from '../appStore';

describe('extras dedup windows', () => {
  beforeEach(() => {
    useAppStore.setState({ students: [], events: [], extraClassRequests: [], waitlist: [], currentWeek: new Date(), selectedEvent: null });
  });

  it('merges windows on duplicate requests', () => {
    const add = useAppStore.getState().addExtraClassRequest;

    add({ studentId: 's1', durationMin: 60, status: 'open', windows: [{ dow: 1, start: '09:00', end: '10:00' }] });
    add({ studentId: 's1', durationMin: 60, status: 'open', windows: [{ dow: 2, start: '10:00', end: '11:00' }] });

    const list = useAppStore.getState().extraClassRequests;
    expect(list.length).toBe(1);
    expect(list[0].windows?.length).toBe(2);
  });
});

