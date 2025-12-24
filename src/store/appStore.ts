import { create } from 'zustand';
import { Student, ClassEvent, ExtraClassRequest, WaitlistEntry } from '../types';
import { sampleStudents, sampleEvents, sampleExtraRequests, sampleWaitlistEntries } from '../utils/sampleData';
import { studentsRepo } from '../repositories/students';
import { eventsRepo } from '../repositories/events';
import { requestsRepo } from '../repositories/requests';
import { waitlistRepo } from '../repositories/waitlist';

interface AppState {
  // Data
  students: Student[];
  events: ClassEvent[];
  extraClassRequests: ExtraClassRequest[];
  waitlist: WaitlistEntry[];
  
  // UI State
  currentWeek: Date;
  selectedEvent: ClassEvent | null;
  initialized: boolean;
  
  // Actions
  setCurrentWeek: (week: Date) => void;
  setSelectedEvent: (event: ClassEvent | null) => void;
  addEvent: (event: Omit<ClassEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<ClassEvent>) => void;
  deleteEvent: (id: string) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  addExtraClassRequest: (request: Omit<ExtraClassRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExtraClassRequest: (id: string, updates: Partial<ExtraClassRequest>) => void;
  /**
   * Schedule an extra class request into a concrete ClassEvent and link them.
   * - Creates a new ClassEvent and persists it
   * - Updates the ExtraClassRequest status to 'scheduled' and sets linkedEventId
   */
  scheduleExtra: (
    requestId: string,
    data: { studentId: string; title: string; start: string; end: string }
  ) => void;
  addWaitlistEntry: (entry: Omit<WaitlistEntry, 'id'>) => void;
  removeWaitlistEntry: (id: string) => void;
  assignSlotFromWaitlist: (eventId: string, studentId: string, duration: number) => void;
  initializeSampleData: () => void;
  hydrateFromDB: () => Promise<void>;
  restoreEvent: (id: string) => void;
  updateEventTimes: (id: string, startISO: string, endISO: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  students: [],
  events: [],
  extraClassRequests: [],
  waitlist: [],
  currentWeek: new Date(),
  selectedEvent: null,
  initialized: false,

  // Actions
  setCurrentWeek: (week) => set({ currentWeek: week }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  
  addEvent: (eventData) => {
    const event: ClassEvent = {
      ...eventData,
      id: crypto.randomUUID(),
    };
    set((state) => ({ events: [...state.events, event] }));
    // Persist (fire-and-forget)
    void eventsRepo.add(event).catch(console.error);
  },

  updateEvent: (id, updates) => {
    set((state) => ({
      events: state.events.map(event => 
        event.id === id ? { ...event, ...updates } : event
      )
    }));
    void eventsRepo.update(id, updates).catch(console.error);
  },

  deleteEvent: (id) => {
    const now = new Date().toISOString();
    set((state) => ({
      events: state.events.map(event =>
        event.id === id ? { ...event, deletedAt: now } : event
      )
    }));
    void eventsRepo.softDelete(id).catch(console.error);
  },

  addStudent: (studentData) => {
    const student: Student = {
      ...studentData,
      id: crypto.randomUUID(),
    };
    set((state) => ({ students: [...state.students, student] }));
    void studentsRepo.add(student).catch(console.error);
  },

  addExtraClassRequest: (requestData) => {
    const now = new Date().toISOString();

    const mergeWindows = (a?: { dow: number; start: string; end: string }[], b?: { dow: number; start: string; end: string }[]) => {
      const key = (w: { dow: number; start: string; end: string }) => `${w.dow}|${w.start}|${w.end}`;
      const map = new Map<string, { dow: number; start: string; end: string }>();
      (a || []).forEach(w => map.set(key(w), w));
      (b || []).forEach(w => map.set(key(w), w));
      return Array.from(map.values());
    };

    const existing = get().extraClassRequests.find(r => 
      (r.status === 'open' || r.status === 'snoozed') &&
      r.studentId === requestData.studentId &&
      r.durationMin === requestData.durationMin
    );

    if (existing) {
      const mergedNotes = requestData.notes
        ? (existing.notes ? `${existing.notes}; ${requestData.notes}` : requestData.notes)
        : existing.notes;
      const mergedWindows = mergeWindows(existing.windows, (requestData as Omit<ExtraClassRequest, 'id' | 'createdAt' | 'updatedAt'>).windows);
      const updates: Partial<ExtraClassRequest> = { notes: mergedNotes, updatedAt: now, windows: mergedWindows };
      set((state) => ({
        extraClassRequests: state.extraClassRequests.map(r => r.id === existing.id ? { ...r, ...updates } : r)
      }));
      void requestsRepo.update(existing.id, updates).catch(console.error);
      return;
    }

    const request: ExtraClassRequest = {
      ...requestData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ 
      extraClassRequests: [...state.extraClassRequests, request] 
    }));
    void requestsRepo.add(request).catch(console.error);
  },

  updateExtraClassRequest: (id, updates) => {
    const now = new Date().toISOString();
    set((state) => ({
      extraClassRequests: state.extraClassRequests.map(request =>
        request.id === id 
          ? { ...request, ...updates, updatedAt: now }
          : request
      )
    }));
    void requestsRepo.update(id, { ...updates, updatedAt: now }).catch(console.error);
  },

  scheduleExtra: (requestId, data) => {
    const now = new Date().toISOString();
    const event: ClassEvent = {
      id: crypto.randomUUID(),
      studentId: data.studentId,
      title: data.title,
      start: data.start,
      end: data.end,
      confirmed: false,
      canceled: false,
    };

    set((state) => ({
      events: [...state.events, event],
      extraClassRequests: state.extraClassRequests.map(r =>
        r.id === requestId ? { ...r, status: 'scheduled', linkedEventId: event.id, updatedAt: now } : r
      ),
    }));

    void eventsRepo.add(event).catch(console.error);
    void requestsRepo.update(requestId, { status: 'scheduled', linkedEventId: event.id, updatedAt: now }).catch(console.error);
  },

  initializeSampleData: () => {
    set({
      students: sampleStudents,
      events: sampleEvents,
      extraClassRequests: sampleExtraRequests,
      waitlist: sampleWaitlistEntries
    });
    // Seed Dexie if empty (fire-and-forget)
    (async () => {
      const [studentCount] = await Promise.all([
        studentsRepo.count(),
      ]);
      if (studentCount === 0) {
        await studentsRepo.addMany(sampleStudents);
        await eventsRepo.addMany(sampleEvents);
        await requestsRepo.addMany(sampleExtraRequests);
        await waitlistRepo.addMany(sampleWaitlistEntries);
      }
    })().catch(console.error);
  },

  addWaitlistEntry: (entryData) => {
    const entry: WaitlistEntry = {
      ...entryData,
      id: crypto.randomUUID(),
    };
    set((state) => ({ waitlist: [...state.waitlist, entry] }));
    void waitlistRepo.add(entry).catch(console.error);
  },

  removeWaitlistEntry: (id) => {
    set((state) => ({
      waitlist: state.waitlist.filter(entry => entry.id !== id)
    }));
    void waitlistRepo.remove(id).catch(console.error);
  },

  assignSlotFromWaitlist: (eventId, studentId, duration) => {
    const { events, waitlist } = get();
    const originalEvent = events.find(e => e.id === eventId);
    
    if (originalEvent) {
      // Create new event for the assigned student
      const newEvent: ClassEvent = {
        id: crypto.randomUUID(),
        studentId,
        title: `${get().students.find(s => s.id === studentId)?.name || 'Student'} Class`,
        start: originalEvent.start,
        end: new Date(new Date(originalEvent.start).getTime() + duration * 60000).toISOString(),
        confirmed: false,
        canceled: false
      };
      
      // Remove the student from waitlist if they were on it
      const updatedWaitlist = waitlist.filter(entry => entry.studentId !== studentId);
      
      set((state) => ({
        events: [...state.events, newEvent],
        waitlist: updatedWaitlist
      }));

      // Persist changes
      void eventsRepo.add(newEvent).catch(console.error);
      void waitlistRepo.removeByStudentId(studentId).catch(console.error);
    }
  },
  hydrateFromDB: async () => {
    try {
      const [students, events, extraRequests, waitlist] = await Promise.all([
        studentsRepo.getAll(),
        eventsRepo.getAll(),
        requestsRepo.getAll(),
        waitlistRepo.getAll(),
      ]);

      // Purge events soft-deleted > 30 days ago
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      const toPurge = events.filter(e => e.deletedAt && new Date(e.deletedAt) < cutoff);
      if (toPurge.length > 0) {
        await Promise.all(toPurge.map(e => eventsRepo.remove(e.id)));
      }

      const liveEvents = events.filter(e => !e.deletedAt || new Date(e.deletedAt) >= cutoff);

      set({
        students,
        events: liveEvents,
        extraClassRequests: extraRequests,
        waitlist,
        initialized: true,
      });
    } catch (err) {
      console.error(err);
      // Even if hydration fails, allow the app to proceed
      set({ initialized: true });
    }
  },

  // Restore a soft-deleted event by clearing deletedAt
  restoreEvent: (id: string) => {
    set((state) => ({
      events: state.events.map(ev => ev.id === id ? ({ ...ev, deletedAt: undefined }) : ev)
    }));
    void eventsRepo.update(id, { deletedAt: undefined }).catch(console.error);
  },

  // Update event time range
  updateEventTimes: (id: string, startISO: string, endISO: string) => {
    set((state) => ({
      events: state.events.map(ev => ev.id === id ? ({ ...ev, start: startISO, end: endISO }) : ev)
    }));
    void eventsRepo.update(id, { start: startISO, end: endISO }).catch(console.error);
  },
}));
