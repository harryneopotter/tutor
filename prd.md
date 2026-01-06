----------------------- Page 1-----------------------

📘 Tutor Virtual Classroom – MVP PRD 



1. Context 



Tutors currently rely on Google Notes (3–4), Google Calendar, and Excel. 



This leads to: 



- Fragmented scheduling, missed extra classes. 



- No way to confirm/cancel classes quickly. 



- Difficult to fill canceled slots. 



- Scattered syllabus/lesson plans across files.  



Goal:  Build a single-user, offline-first app (iPad-first) to manage  schedules, lesson plans, and student 



binders in one place. 



2. MVP Scope 



Must-have for MVP: 



- Weekly Calendar (15-min slots, color-coded). 



- Today Dashboard (confirm/cancel, pending extras). 

- Waitlist + Fill-This-Slot flow. 



- Reminder/Flag system for extra class requests. 



- Student Binder (basic info, syllabus, lesson plan list, file links). 



- Soft-delete (Trash, 30-day restore). 



- Availability Report (basic free/busy view). 



- One-way ICS export. 



- Local-first storage (IndexedDB + ZIP bundles on-demand).  



Not in MVP (future phases): 



- PDF parsing of syllabus. 



- Migration/import tools. 



- Advanced reporting. 



- Cloud sync. 



3. Screens & Flows 



3.1 Weekly Calendar (Home) 



       • Grid with 7 columns (Mon–Sun), 15-min rows.  



       • Color coding:  



       • Blue = tutor’s own classes  



       • Green = student classes  



       • Red = missing info  



                                                             1 


----------------------- Page 2-----------------------

       • Interactions:  



       • Tap empty slot → Add Class modal.  



       • Tap existing class → Class Detail popup.  



       • Long press → quick cancel.  



3.2 Today Dashboard 



       • Chronological list of today’s classes.  



       • Each entry: Name, Subject, Time, Status (Pending/Confirmed/Canceled).  



       • Buttons: Confirm ✅, Cancel ❌.  



       • Section: Pending Extras (extra class requests).  



       • Pending Extra row: Student + Duration + [Schedule] [Snooze] [Dismiss].  



3.3 Waitlist & Fill-This-Slot 



       • When a class is canceled, popup suggests top 3 students.  



       • Candidates: Name, Availability, Duration.  



       • One-tap Assign or Skip.  



3.4 Reminder / Flag System 



       • Tutors log extra class requests.  



       • Flags appear in Dashboard until resolved.  



       • Actions: Schedule, Snooze (24h), Dismiss.  



       • Duplicates auto-merged.  



3.5 Student Detail 



       • Header: Name, Grade, Notes.  



       • Tabs:  



       • Syllabus: Month–Topic list.  



       • Lesson Plans: Topic, Date, Duration, Notes.  



       • Files: Worksheets, Notes, PDFs.  



       • Footer: Export Bundle (ZIP).  



3.6 Trash (Soft-Delete) 



       • Deleted classes → Trash for 30 days.  



       • [Restore] button re-adds class if slot free.  



       • If conflict, show reschedule prompt.  



3.7 Availability Report 



       • Heatmap grid of week.  



       • Colors:  



       • Light green = free  



       • Dark green = partial  



       • Pink/red = busy  



                                                              2 


----------------------- Page 3-----------------------

3.8 ICS Export 



     • Export weekly classes → ICS file.  



     • Import into Google Calendar/Apple Calendar. 



4. Data Model (MVP Minimal) 



Student 



  { 



     id: string, 



     name: string, 



    grade: string, 



     notes?: string 



  } 



ClassEvent 



  { 



     id: string, 



     studentId: string, 



     title: string, 



     start: string,     // ISO 



     end: string,       // ISO 



     confirmed: boolean, 



     canceled: boolean, 



     deletedAt?: string 



  } 



ExtraClassRequest 



  { 



     id: string, 



     studentId: string, 



     durationMin: number, 



    windows?: { dow: number, start: string, end: string }[], 



     notes?: string, 



     status: "open"|"scheduled"|"snoozed"|"dismissed", 



     snoozeUntil?: string, 



     linkedEventId?: string, 



     createdAt: string, 



                                                 3 


----------------------- Page 4-----------------------

     updatedAt: string 



  } 



WaitlistEntry 



  { 



     id: string, 



     studentId: string, 



     durationMin: number, 



     notes?: string 



  } 



SyllabusTopic 



  { 



     id: string, 



     studentId: string, 



     month: string, 



     topic: string, 



     page?: string 



  } 



LessonPlan 



  { 



     id: string, 



     studentId: string, 



     topic: string, 



     date: string, 



     durationMin: number, 



     resources?: string[], 



     notes?: string 



  } 



5. Tech Stack 



      • Frontend: React + TypeScript, Vite.  



      • UI: styled-components, grid-first, iPad-first.  



      • Storage: IndexedDB via Dexie.  



      • Exports: 



      • ZIP (JSZip, per-student bundles).  



      • ICS (ics-js or custom).  



                                                   4 


----------------------- Page 5-----------------------

6. Build Roadmap (MVP) 



     1. Calendar Grid: weekly, interactive slots, color-coded.  



     2. Today Dashboard: list view, confirm/cancel.  



     3. Waitlist + Fill-This-Slot.  



     4. Reminder system: extra class requests.  



     5. Student Detail Binder (tabs + export ZIP).  



     6. Trash (30-day recovery).  



     7. Availability Report (heatmap).  



     8. ICS Export.  



7. UX Notes 



      • High contrast for status (Confirmed, Pending, Canceled).  



      • Reminders visible on Dashboard at all times.  



      • Extra classes flagged with bell icon in header.  



      • Calendar: scrollable, supports pinch-zoom on iPad.  



      • Trash/Restore must be one-tap, no hidden menus.  



                                                           5 

