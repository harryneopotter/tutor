import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../store/appStore';

describe('Event State', () => {
    beforeEach(() => {
        // Reset store state if possible, though Zustand stores persist in tests
        // For simplicity, we'll just use unique titles
    });

    it('should add an event', () => {
        const title = 'Test Lesson ' + Math.random();
        useAppStore.getState().addEvent({
            studentId: 's1',
            title,
            start: new Date().toISOString(),
            end: new Date().toISOString(),
            confirmed: false,
            canceled: false
        });

        const state = useAppStore.getState();
        const event = state.events.find(e => e.title === title);
        expect(event).toBeDefined();
        expect(event?.studentId).toBe('s1');
    });

    it('should update an event', () => {
        const title = 'Initial Title';
        const updatedTitle = 'Updated Title';

        useAppStore.getState().addEvent({
            studentId: 's1',
            title,
            start: new Date().toISOString(),
            end: new Date().toISOString(),
            confirmed: false,
            canceled: false
        });

        const event = useAppStore.getState().events.find(e => e.title === title)!;
        useAppStore.getState().updateEvent(event.id, { title: updatedTitle });

        const updatedEvent = useAppStore.getState().events.find(e => e.id === event.id);
        expect(updatedEvent?.title).toBe(updatedTitle);
    });

    it('should soft delete an event', () => {
        const title = 'To Delete';
        useAppStore.getState().addEvent({
            studentId: 's1',
            title,
            start: new Date().toISOString(),
            end: new Date().toISOString(),
            confirmed: false,
            canceled: false
        });

        const event = useAppStore.getState().events.find(e => e.title === title)!;
        useAppStore.getState().deleteEvent(event.id);

        const deletedEvent = useAppStore.getState().events.find(e => e.id === event.id);
        expect(deletedEvent?.deletedAt).toBeDefined();
    });
});
