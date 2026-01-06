import { create } from 'zustand';
import { studentsRepo } from '../repositories/students';
import { eventsRepo } from '../repositories/events';
import { requestsRepo } from '../repositories/requests';
import { waitlistRepo } from '../repositories/waitlist';
import { sampleStudents, sampleEvents, sampleExtraRequests, sampleWaitlistEntries } from '../utils/sampleData';
import { EventSlice, createEventSlice } from './slices/eventSlice';
import { StudentSlice, createStudentSlice } from './slices/studentSlice';
import { RequestSlice, createRequestSlice } from './slices/requestSlice';

interface AppState extends EventSlice, StudentSlice, RequestSlice {
  initialized: boolean;
  initializeSampleData: () => void;
  hydrateFromDB: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get, ...args) => ({
  ...createEventSlice(set, get, ...args),
  ...createStudentSlice(set, get, ...args),
  ...createRequestSlice(set, get, ...args),

  initialized: false,

  initializeSampleData: () => {
    set({
      students: sampleStudents,
      events: sampleEvents,
      extraClassRequests: sampleExtraRequests,
      waitlist: sampleWaitlistEntries
    });

    (async () => {
      const studentCount = await studentsRepo.count();
      if (studentCount === 0) {
        await studentsRepo.addMany(sampleStudents);
        await eventsRepo.addMany(sampleEvents);
        await requestsRepo.addMany(sampleExtraRequests);
        await waitlistRepo.addMany(sampleWaitlistEntries);
      }
    })().catch(console.error);
  },

  hydrateFromDB: async () => {
    try {
      const [students, events, extraRequests, waitlist] = await Promise.all([
        studentsRepo.getAll(),
        eventsRepo.getAll(),
        requestsRepo.getAll(),
        waitlistRepo.getAll(),
      ]);

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
      console.error('Hydration failed:', err);
      set({ initialized: true });
    }
  },
}));
