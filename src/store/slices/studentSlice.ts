import { StateCreator } from 'zustand';
import { Student, WaitlistEntry, ClassEvent } from '../../types';
import { studentsRepo } from '../../repositories/students';
import { waitlistRepo } from '../../repositories/waitlist';
import { eventsRepo } from '../../repositories/events';

export interface StudentSlice {
    students: Student[];
    waitlist: WaitlistEntry[];

    addStudent: (student: Omit<Student, 'id'>) => void;
    addWaitlistEntry: (entry: Omit<WaitlistEntry, 'id'>) => void;
    removeWaitlistEntry: (id: string) => void;
    updateStudent: (id: string, updates: Partial<Student>) => void;
    assignSlotFromWaitlist: (eventId: string, studentId: string, duration: number) => void;
}

// Slice pattern with cross-slice dependencies usually requires the full state type
// But for now I'll use any or a combined interface if I had one.
// Let's assume StudentSlice needs access to events from EventSlice.

export const createStudentSlice: StateCreator<any, [], [], StudentSlice> = (set, get) => ({
    students: [],
    waitlist: [],

    addStudent: (studentData) => {
        const student: Student = {
            ...studentData,
            id: crypto.randomUUID(),
        };
        set((state: any) => ({ students: [...state.students, student] }));
        void studentsRepo.add(student).catch(console.error);
    },

    addWaitlistEntry: (entryData) => {
        const entry: WaitlistEntry = {
            ...entryData,
            id: crypto.randomUUID(),
        };
        set((state: any) => ({ waitlist: [...state.waitlist, entry] }));
        void waitlistRepo.add(entry).catch(console.error);
    },

    removeWaitlistEntry: (id) => {
        set((state: any) => ({
            waitlist: state.waitlist.filter((entry: WaitlistEntry) => entry.id !== id)
        }));
        void waitlistRepo.remove(id).catch(console.error);
    },

    updateStudent: (id, updates) => {
        set((state: any) => ({
            students: state.students.map((s: Student) => s.id === id ? { ...s, ...updates } : s)
        }));
        void studentsRepo.update(id, updates).catch(console.error);
    },

    assignSlotFromWaitlist: (eventId, studentId, duration) => {
        const { events, waitlist, students } = get();
        const originalEvent = events.find((e: ClassEvent) => e.id === eventId);

        if (originalEvent) {
            const newEvent: ClassEvent = {
                id: crypto.randomUUID(),
                studentId,
                title: `${students.find((s: Student) => s.id === studentId)?.name || 'Student'} Class`,
                start: originalEvent.start,
                end: new Date(new Date(originalEvent.start).getTime() + duration * 60000).toISOString(),
                confirmed: false,
                canceled: false
            };

            const updatedWaitlist = waitlist.filter((entry: WaitlistEntry) => entry.studentId !== studentId);

            set((state: any) => ({
                events: [...state.events, newEvent],
                waitlist: updatedWaitlist
            }));

            void eventsRepo.add(newEvent).catch(console.error);
            void waitlistRepo.removeByStudentId(studentId).catch(console.error);
        }
    },
});
