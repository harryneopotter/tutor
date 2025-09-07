export interface Student {
  id: string;
  name: string;
  grade: string;
  notes?: string;
}

export interface ClassEvent {
  id: string;
  studentId: string;
  title: string;
  start: string; // ISO string
  end: string;   // ISO string
  confirmed: boolean;
  canceled: boolean;
  deletedAt?: string;
}

export interface ExtraClassRequest {
  id: string;
  studentId: string;
  durationMin: number;
  windows?: { dow: number; start: string; end: string }[];
  notes?: string;
  status: "open" | "scheduled" | "snoozed" | "dismissed";
  snoozeUntil?: string;
  linkedEventId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WaitlistEntry {
  id: string;
  studentId: string;
  durationMin: number;
  notes?: string;
  windows?: { dow: number; start: string; end: string }[];
}

export interface SyllabusTopic {
  id: string;
  studentId: string;
  month: string;
  topic: string;
  page?: string;
}

export interface LessonPlan {
  id: string;
  studentId: string;
  topic: string;
  date: string;
  durationMin: number;
  resources?: string[];
  notes?: string;
}

export type ClassType = 'tutor-class' | 'student-class';
export type ClassStatus = 'confirmed' | 'pending' | 'canceled';

export interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
}