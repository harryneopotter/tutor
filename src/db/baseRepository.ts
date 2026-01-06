import { Table } from 'dexie';

export class BaseRepository<T, K> {
    constructor(protected table: Table<T, K>, protected name: string) { }

    async getAll(): Promise<T[]> {
        try {
            return await this.table.toArray();
        } catch (error) {
            console.error(`[${this.name}Repo] Failed to fetch all:`, error);
            throw error;
        }
    }

    async getById(id: K): Promise<T | undefined> {
        try {
            return await this.table.get(id);
        } catch (error) {
            console.error(`[${this.name}Repo] Failed to fetch by ID ${id}:`, error);
            throw error;
        }
    }

    async add(item: T): Promise<K> {
        try {
            return await this.table.put(item);
        } catch (error) {
            console.error(`[${this.name}Repo] Failed to add item:`, error);
            throw error;
        }
    }

    async addMany(items: T[]): Promise<void> {
        try {
            await this.table.bulkPut(items);
        } catch (error) {
            console.error(`[${this.name}Repo] Failed to add many items:`, error);
            throw error;
        }
    }

    async update(id: K, updates: Partial<T>): Promise<number> {
        try {
            return await this.table.update(id, updates);
        } catch (error) {
            console.error(`[${this.name}Repo] Failed to update ID ${id}:`, error);
            throw error;
        }
    }

    async remove(id: K): Promise<void> {
        try {
            await this.table.delete(id);
        } catch (error) {
            console.error(`[${this.name}Repo] Failed to remove ID ${id}:`, error);
            throw error;
        }
    }

    async count(): Promise<number> {
        return this.table.count();
    }
}
