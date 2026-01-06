import { StateCreator } from 'zustand';
import { ExtraClassRequest, ClassEvent } from '../../types';
import { requestsRepo } from '../../repositories/requests';
import { eventsRepo } from '../../repositories/events';

/**
 * Handles extra class requests from students.
 */
export interface RequestSlice {
    /** List of all extra class requests */
    extraClassRequests: ExtraClassRequest[];

    /**
     * Adds an extra class request.
     * If an open request already exists for the same student and duration,
     * it merges the notes and availability windows instead of creating a duplicate.
     */
    addExtraClassRequest: (request: Omit<ExtraClassRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
    /** Updates request details like status or notes */
    updateExtraClassRequest: (id: string, updates: Partial<ExtraClassRequest>) => void;
    /** Converts a request into a concrete calendar event */
    scheduleExtra: (requestId: string, data: { studentId: string; title: string; start: string; end: string }) => void;
}

export const createRequestSlice: StateCreator<any, [], [], RequestSlice> = (set, get) => ({
    extraClassRequests: [],

    addExtraClassRequest: (requestData) => {
        const now = new Date().toISOString();

        const mergeWindows = (a?: { dow: number; start: string; end: string }[], b?: { dow: number; start: string; end: string }[]) => {
            const key = (w: { dow: number; start: string; end: string }) => `${w.dow}|${w.start}|${w.end}`;
            const map = new Map<string, { dow: number; start: string; end: string }>();
            (a || []).forEach(w => map.set(key(w), w));
            (b || []).forEach(w => map.set(key(w), w));
            return Array.from(map.values());
        };

        const existing = get().extraClassRequests.find((r: ExtraClassRequest) =>
            (r.status === 'open' || r.status === 'snoozed') &&
            r.studentId === requestData.studentId &&
            r.durationMin === requestData.durationMin
        );

        if (existing) {
            const mergedNotes = requestData.notes
                ? (existing.notes ? `${existing.notes}; ${requestData.notes}` : requestData.notes)
                : existing.notes;
            const mergedWindows = mergeWindows(existing.windows, (requestData as any).windows);
            const updates: Partial<ExtraClassRequest> = { notes: mergedNotes, updatedAt: now, windows: mergedWindows };
            set((state: any) => ({
                extraClassRequests: state.extraClassRequests.map((r: ExtraClassRequest) => r.id === existing.id ? { ...r, ...updates } : r)
            }));
            void requestsRepo.update(existing.id, updates).catch(console.error);
            return;
        }

        const request: ExtraClassRequest = {
            ...requestData,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
        } as ExtraClassRequest;

        set((state: any) => ({
            extraClassRequests: [...state.extraClassRequests, request]
        }));
        void requestsRepo.add(request).catch(console.error);
    },

    updateExtraClassRequest: (id, updates) => {
        const now = new Date().toISOString();
        set((state: any) => ({
            extraClassRequests: state.extraClassRequests.map((request: ExtraClassRequest) =>
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

        set((state: any) => ({
            events: [...state.events, event],
            extraClassRequests: state.extraClassRequests.map((r: ExtraClassRequest) =>
                r.id === requestId ? { ...r, status: 'scheduled', linkedEventId: event.id, updatedAt: now } : r
            ),
        }));

        void eventsRepo.add(event).catch(console.error);
        void requestsRepo.update(requestId, { status: 'scheduled', linkedEventId: event.id, updatedAt: now }).catch(console.error);
    },
});
