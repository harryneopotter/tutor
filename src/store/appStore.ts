import { create } from 'zustand';
import { Student, ClassEvent, ExtraClassRequest, WaitlistEntry } from '../types';
import { sampleStudents, sampleEvents, sampleExtraRequests, sampleWaitlistEntries } from '../utils/sampleData';

interface AppState {
  // Data
  students: Student[];
  events: ClassEvent[];
  extraClassRequests: ExtraClassRequest[];
  waitlist: WaitlistEntry[];
  
  // UI State
  currentWeek: Date;
  selectedEvent: ClassEvent | null;
  
  // Actions
  setCurrentWeek: (week: Date) => void;
  setSelectedEvent: (event: ClassEvent | null) => void;
  addEvent: (event: Omit<ClassEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<ClassEvent>) => void;
  deleteEvent: (id: string) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  addExtraClassRequest: (request: Omit<ExtraClassRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExtraClassRequest: (id: string, updates: Partial<ExtraClassRequest>) => void;
  addWaitlistEntry: (entry: Omit<WaitlistEntry, 'id'>) => void;
  removeWaitlistEntry: (id: string) => void;
  assignSlotFromWaitlist: (eventId: string, studentId: string, duration: number) => void;
  initializeSampleData: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  students: [],
  events: [],
  extraClassRequests: [],
  waitlist: [],
  currentWeek: new Date(),
  selectedEvent: null,

  // Actions
  setCurrentWeek: (week) => set({ currentWeek: week }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  
  addEvent: (eventData) => {
    const event: ClassEvent = {
      ...eventData,
      id: crypto.randomUUID(),
    };
    set((state) => ({ events: [...state.events, event] }));
  },

  updateEvent: (id, updates) => {
    set((state) => ({
      events: state.events.map(event => 
        event.id === id ? { ...event, ...updates } : event
      )
    }));
  },

  deleteEvent: (id) => {
    const now = new Date().toISOString();
    set((state) => ({
      events: state.events.map(event =>
        event.id === id ? { ...event, deletedAt: now } : event
      )
    }));
  },

  addStudent: (studentData) => {
    const student: Student = {
      ...studentData,
      id: crypto.randomUUID(),
    };
    set((state) => ({ students: [...state.students, student] }));
  },

  addExtraClassRequest: (requestData) => {
    const now = new Date().toISOString();
    const request: ExtraClassRequest = {
      ...requestData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ 
      extraClassRequests: [...state.extraClassRequests, request] 
    }));
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
  },

  initializeSampleData: () => {
    set({
      students: sampleStudents,
      events: sampleEvents,
      extraClassRequests: sampleExtraRequests,
      waitlist: sampleWaitlistEntries
    });
  },

  addWaitlistEntry: (entryData) => {
    const entry: WaitlistEntry = {
      ...entryData,
      id: crypto.randomUUID(),
    };
    set((state) => ({ waitlist: [...state.waitlist, entry] }));
  },

  removeWaitlistEntry: (id) => {
    set((state) => ({
      waitlist: state.waitlist.filter(entry => entry.id !== id)
    }));
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
    }
  },
}));