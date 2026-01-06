import { StateCreator } from 'zustand';
import { ClassEvent } from '../../types';
import { eventsRepo } from '../../repositories/events';

/**
 * Handles all calendar-related state and actions.
 */
export interface EventSlice {
    /** List of all class events (including soft-deleted ones) */
    events: ClassEvent[];
    /** The currently selected event for detailed viewing/editing */
    selectedEvent: ClassEvent | null;
    /** The current week being viewed in the calendar */
    currentWeek: Date;

    /** Updates the current week being viewed */
    setCurrentWeek: (week: Date) => void;
    /** Sets the active event for the modal */
    setSelectedEvent: (event: ClassEvent | null) => void;
    /** Adds a new event to the store and persists it to the database */
    addEvent: (event: Omit<ClassEvent, 'id'>) => void;
    /** Updates an existing event and persists changes */
    updateEvent: (id: string, updates: Partial<ClassEvent>) => void;
    /** Soft deletes an event by setting deletedAt and updates the DB */
    deleteEvent: (id: string) => void;
    /** Restores a soft-deleted event */
    restoreEvent: (id: string) => void;
    /** Updates the start and end times for a specific event */
    updateEventTimes: (id: string, startISO: string, endISO: string) => void;
}

export const createEventSlice: StateCreator<EventSlice, [], [], EventSlice> = (set) => ({
    events: [],
    selectedEvent: null,
    currentWeek: new Date(),

    setCurrentWeek: (week) => set({ currentWeek: week }),
    setSelectedEvent: (event) => set({ selectedEvent: event }),

    addEvent: (eventData) => {
        const event: ClassEvent = {
            ...eventData,
            id: crypto.randomUUID(),
        };
        set((state) => ({ events: [...state.events, event] }));
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

    restoreEvent: (id) => {
        set((state) => ({
            events: state.events.map(ev => ev.id === id ? ({ ...ev, deletedAt: undefined }) : ev)
        }));
        void eventsRepo.update(id, { deletedAt: undefined }).catch(console.error);
    },

    updateEventTimes: (id, startISO, endISO) => {
        set((state) => ({
            events: state.events.map(ev => ev.id === id ? ({ ...ev, start: startISO, end: endISO }) : ev)
        }));
        void eventsRepo.update(id, { start: startISO, end: endISO }).catch(console.error);
    },
});
