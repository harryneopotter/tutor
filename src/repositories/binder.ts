import { db } from '../db/database';
import { SyllabusTopic, LessonPlan } from '../types';
import { BaseRepository } from '../db/baseRepository';

class BinderRepository {
  // Binder uses multiple tables, so we'll encapsulate them
  // or use sub-repositories if needed. For now, we'll keep it as a service-like repo.

  async getSyllabusByStudent(studentId: string): Promise<SyllabusTopic[]> {
    return db.syllabusTopics.where('studentId').equals(studentId).toArray();
  }

  async addSyllabusTopic(topic: SyllabusTopic): Promise<string> {
    return db.syllabusTopics.put(topic);
  }

  async getLessonPlansByStudent(studentId: string): Promise<LessonPlan[]> {
    return db.lessonPlans.where('studentId').equals(studentId).toArray();
  }

  async addLessonPlan(plan: LessonPlan): Promise<string> {
    return db.lessonPlans.put(plan);
  }
}

export const binderRepo = new BinderRepository();
