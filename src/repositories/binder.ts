import { db } from '../db/database';
import { LessonPlan, SyllabusTopic } from '../types';

export const binderRepo = {
  // Syllabus
  async getSyllabusByStudent(studentId: string): Promise<SyllabusTopic[]> {
    return db.table<SyllabusTopic, string>('syllabusTopics').where('studentId').equals(studentId).toArray();
  },
  async addSyllabusTopic(topic: SyllabusTopic): Promise<string> {
    return db.table<SyllabusTopic, string>('syllabusTopics').put(topic);
  },
  async updateSyllabusTopic(id: string, updates: Partial<SyllabusTopic>): Promise<number> {
    return db.table<SyllabusTopic, string>('syllabusTopics').update(id, updates);
  },
  async removeSyllabusTopic(id: string): Promise<void> {
    await db.table<SyllabusTopic, string>('syllabusTopics').delete(id);
  },

  // Lesson Plans
  async getLessonPlansByStudent(studentId: string): Promise<LessonPlan[]> {
    return db.table<LessonPlan, string>('lessonPlans').where('studentId').equals(studentId).toArray();
  },
  async addLessonPlan(plan: LessonPlan): Promise<string> {
    return db.table<LessonPlan, string>('lessonPlans').put(plan);
  },
  async updateLessonPlan(id: string, updates: Partial<LessonPlan>): Promise<number> {
    return db.table<LessonPlan, string>('lessonPlans').update(id, updates);
  },
  async removeLessonPlan(id: string): Promise<void> {
    await db.table<LessonPlan, string>('lessonPlans').delete(id);
  },
};
