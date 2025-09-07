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

Completed in 5735dea
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- src/components/TodayDashboard.tsx

Milestone M5b — Student ZIP export (2025-09-06)
Planned files to modify
- package.json (add jszip dependency)
- src/components/StudentBinder.tsx (export ZIP button and generator)

Completed in 595a36f
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- package.json, package-lock.json
- src/components/StudentBinder.tsx

Milestone M2c — Schedule Extra flow (2025-09-06)
Planned files to modify
- src/components/TodayDashboard.tsx (add scheduling modal to create event and link request)

Completed in 50886f8
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- src/components/TodayDashboard.tsx

Minor update — Calendar visibility tweak (2025-09-06)
Planned files to modify
- src/components/WeeklyCalendar.tsx (hide canceled events on grid)

Completed in 5a03fcd
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- src/components/WeeklyCalendar.tsx

Milestone M8b — Testing (Vitest) (2025-09-06)
Planned files to add
- vitest.config.ts (test config)
- src/utils/__tests__/ranking.test.ts (ranking utility tests)
- src/store/__tests__/extras.test.ts (dedup logic tests with mocks)

Planned files to modify
- package.json (add test scripts and dev deps)
- .github/workflows/ci.yml (run tests)

Completed in 321b5c5
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- package.json, package-lock.json
- vitest.config.ts
- .github/workflows/ci.yml
- src/utils/__tests__/ranking.test.ts
- src/store/__tests__/extras.test.ts

Milestone M9 — Event modals (view/edit and add) (2025-09-06)
Planned files to add
- src/components/EventModal.tsx (view/edit/confirm/cancel/delete)
- src/components/AddEventModal.tsx (create event from slot)

Planned files to modify
- src/components/WeeklyCalendar.tsx (use modals instead of prompt; open detail modal on click)

Completed in b1ec895
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- src/components/EventModal.tsx
- src/components/AddEventModal.tsx
- src/components/WeeklyCalendar.tsx

Milestone M10 — Code splitting (lazy load non-core views) (2025-09-06)
Planned files to modify
- src/App.tsx (lazy load Today, Waitlist, Availability, Binder, Trash)

Completed in dac62fb
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- src/App.tsx

Milestone M11 — Accessibility & Keyboard (2025-09-06)
Planned files to modify
- src/components/WeeklyCalendar.tsx (Event blocks focusable + keyboard open)
- src/components/FillSlotModal.tsx (ARIA dialog attrs)
- src/components/EventModal.tsx (ARIA dialog attrs)
- src/components/AddEventModal.tsx (ARIA dialog attrs)
- src/components/TodayDashboard.tsx (ARIA on add/schedule modals)
- src/components/WaitlistManagement.tsx (ARIA on add modal)

Completed in dac62fb
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- src/components/WeeklyCalendar.tsx
- src/components/FillSlotModal.tsx
- src/components/EventModal.tsx
- src/components/AddEventModal.tsx
- src/components/TodayDashboard.tsx
- src/components/WaitlistManagement.tsx

Milestone M12 — ICS timezone correctness (UTC) (2025-09-07)
Planned files to modify
- src/components/WeeklyCalendar.tsx (export ICS dates as UTC with Z)

Completed in 1810277
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- src/components/WeeklyCalendar.tsx

Milestone M13 — Event conflict detection & suggestions (2025-09-07)
Planned files to add
- src/utils/scheduling.ts (overlap detection and next-available search)

Planned files to modify
- src/components/AddEventModal.tsx (prevent conflicts; suggest next slot)
- src/components/TodayDashboard.tsx (prevent conflicts in scheduling modal)

Completed in d7686c0
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- src/utils/scheduling.ts
- src/components/AddEventModal.tsx
- src/components/TodayDashboard.tsx

Milestone M14 — Availability filter (2025-09-07)
Planned files to modify
- src/components/AvailabilityReport.tsx (student filter in header)

Completed in 823a42e
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- src/components/AvailabilityReport.tsx

Milestone M15 — Trash days-left indicator (2025-09-07)
Planned files to modify
- src/components/TrashView.tsx (show days remaining until purge)

Completed in 823a42e
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- src/components/TrashView.tsx

Milestone M16 — Event time editing + conflict checks (2025-09-07)
Planned files to modify
- src/components/EventModal.tsx (edit date/time/duration with conflict detection)

Completed in 823a42e
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- src/components/EventModal.tsx

Milestone M17 — Availability windows for extras/waitlist (2025-09-07)
Planned files to modify
- src/types.ts (add windows to WaitlistEntry)
- src/components/WaitlistManagement.tsx (capture windows)
- src/components/TodayDashboard.tsx (capture windows in Add Extra Request)
- src/store/appStore.ts (merge windows in dedup)
- src/utils/ranking.ts (favor candidates matching slot windows)
- src/components/FillSlotModal.tsx (pass eventStart to ranking)

Completed in 900263d
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- src/types.ts
- src/components/WaitlistManagement.tsx
- src/components/TodayDashboard.tsx
- src/store/appStore.ts
- src/utils/ranking.ts
- src/components/FillSlotModal.tsx

Milestone M18 — Lint & tests (windows logic) (2025-09-07)
Planned files to add
- .eslintrc.cjs (ESLint config)
- .eslintignore
- src/utils/__tests__/ranking.windows.test.ts
- src/store/__tests__/extras_windows.test.ts

Planned files to modify
- .github/workflows/ci.yml (add lint step)

Completed in b88a603
Modified/added files
- CHANGE_LOG.md
- CHANGE_LOG_DETAILS.md
- .eslintrc.cjs
- .eslintignore
- .github/workflows/ci.yml
- src/utils/__tests__/ranking.windows.test.ts
- src/store/__tests__/extras_windows.test.ts
- lint fixes across src

