import { db } from '../db/database';
import { useAppStore } from '../store/appStore';

export const BackupService = {
    /**
     * Exports all database tables to a single JSON file and triggers a download.
     */
    async exportData() {
        try {
            const data = {
                students: await db.students.toArray(),
                classEvents: await db.classEvents.toArray(),
                extraRequests: await db.extraRequests.toArray(),
                waitlist: await db.waitlist.toArray(),
                syllabusTopics: await db.syllabusTopics.toArray(),
                lessonPlans: await db.lessonPlans.toArray(),
                exportedAt: new Date().toISOString(),
                version: 2
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tutor_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('Backup failed:', error);
            throw error;
        }
    },

    /**
     * Imports data from a JSON file, replaces existing database content, and re-hydrates the app store.
     */
    async importData(file: File) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const content = e.target?.result as string;
                    const data = JSON.parse(content);

                    // Basic validation
                    if (!data.students || !data.classEvents) {
                        throw new Error('Invalid backup file format');
                    }

                    // Clear existing data
                    await Promise.all([
                        db.students.clear(),
                        db.classEvents.clear(),
                        db.extraRequests.clear(),
                        db.waitlist.clear(),
                        db.syllabusTopics.clear(),
                        db.lessonPlans.clear()
                    ]);

                    // Import new data
                    await Promise.all([
                        db.students.bulkPut(data.students),
                        db.classEvents.bulkPut(data.classEvents),
                        db.extraRequests.bulkPut(data.extraRequests || []),
                        db.waitlist.bulkPut(data.waitlist || []),
                        db.syllabusTopics.bulkPut(data.syllabusTopics || []),
                        db.lessonPlans.bulkPut(data.lessonPlans || [])
                    ]);

                    // Re-hydrate store
                    await useAppStore.getState().hydrateFromDB();
                    resolve(true);
                } catch (error) {
                    console.error('Import failed:', error);
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }
};
