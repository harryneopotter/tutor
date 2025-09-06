# CHANGE_LOG

Purpose
- This log lists files added/modified/removed per milestone. Detailed rationale lives in CHANGE_LOG_DETAILS.md.
- Update this file before starting each new milestone.

Milestone M0 — Project initialization and docs (2025-09-06)
Commits
- 6e7719a chore: init minimal build set
- 271f7c8 chore: add .gitignore and README

Files added (initial repository content)
- index.html
- package.json
- package-lock.json
- vite.config.ts
- tsconfig.json
- tsconfig.node.json
- src/App.tsx
- src/components/FillSlotModal.tsx
- src/components/TodayDashboard.tsx
- src/components/WaitlistManagement.tsx
- src/components/WeeklyCalendar.tsx
- src/main.tsx
- src/store/appStore.ts
- src/types.ts
- src/utils/sampleData.ts

Files added (docs and housekeeping)
- .gitignore
- README.md

Local-only (intentionally untracked)
- WARP.md

Milestone M1 — Persistence foundation (Dexie) (2025-09-06)
Planned files to add
- src/db/database.ts (Dexie DB initialization, tables, indexes)
- src/repositories/students.ts (CRUD helpers)
- src/repositories/events.ts (CRUD + soft-delete helpers)
- src/repositories/requests.ts (CRUD helpers for ExtraClassRequest)
- src/repositories/waitlist.ts (CRUD helpers, including removeByStudentId)

Planned files to modify
- src/store/appStore.ts (add hydrateFromDB, make actions write-through to Dexie)
- src/App.tsx (hydrate from DB on mount)

Completed in 06c565e
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- src/db/database.ts
- src/repositories/events.ts
- src/repositories/requests.ts
- src/repositories/students.ts
- src/repositories/waitlist.ts
- src/store/appStore.ts
- src/App.tsx

Milestone M2 — Extra class reminders/flags + Today Dashboard integration (2025-09-06)
Planned files to modify
- src/store/appStore.ts (dedup/merge logic in addExtraClassRequest)
- src/components/TodayDashboard.tsx (UI to add extra requests via modal; actions remain the same)

Completed in 6d86fa0
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- src/store/appStore.ts
- src/components/TodayDashboard.tsx

Milestone M3 — Waitlist & Fill-This-Slot suggestions (2025-09-06)
Planned files to add
- src/utils/ranking.ts (candidate ranking helpers)

Planned files to modify
- src/components/FillSlotModal.tsx (use ranking; better suggestions)

Completed in a167034
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- src/utils/ranking.ts
- src/components/FillSlotModal.tsx

Milestone M4 — Trash (soft-delete) (2025-09-06)
Planned files to add
- src/components/TrashView.tsx (list, restore, and reschedule flow)

Planned files to modify
- src/store/appStore.ts (restoreEvent, updateEventTimes, purge >30d deleted)
- src/repositories/events.ts (add remove helper)
- src/App.tsx (add navigation to Trash view)

Completed in 03045b9
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- src/repositories/events.ts
- src/store/appStore.ts
- src/components/TrashView.tsx
- src/App.tsx

Milestone M7 — ICS export (2025-09-06)
Planned files to modify
- src/components/WeeklyCalendar.tsx (Export .ics for current week)

Completed in 3d6627b
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- src/components/WeeklyCalendar.tsx

Milestone M6 — Availability Report (heatmap) (2025-09-06)
Planned files to add
- src/components/AvailabilityReport.tsx (weekly heatmap by slot)

Planned files to modify
- src/App.tsx (add navigation to Availability)

Milestone M5 — Student Binder (syllabus, lesson plans) (2025-09-06)
Planned files to add
- src/components/StudentBinder.tsx (binder UI)
- src/repositories/binder.ts (syllabus/lesson plans CRUD)

Planned files to modify
- src/db/database.ts (add v2 with syllabusTopics, lessonPlans)
- src/App.tsx (add navigation to Binder)

Completed in 5aabdaf
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- src/db/database.ts (v2 schema)
- src/repositories/binder.ts
- src/components/StudentBinder.tsx
- src/App.tsx

Milestone M8 — CI (build) (2025-09-06)
Planned files to add
- .github/workflows/ci.yml (build on push/pull_request)
- CHANGE_LOG_DETAILS.md
- src/components/AvailabilityReport.tsx
- src/App.tsx

Milestone M8 — CI (build) (2025-09-06)
Planned files to add
- .github/workflows/ci.yml (build on push/pull_request)

Completed in 7cb359a
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- .github/workflows/ci.yml

Milestone M2b — Snooze visibility (Today Dashboard) (2025-09-06)
Planned files to modify
- src/components/TodayDashboard.tsx (hide snoozed requests until snoozeUntil)

