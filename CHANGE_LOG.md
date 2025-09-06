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

Milestone M2 — Extra class reminders/flags + Today Dashboard integration (2025-09-06)
Planned files to modify
- src/store/appStore.ts (dedup/merge logic in addExtraClassRequest)
- src/components/TodayDashboard.tsx (UI to add extra requests via modal; actions remain the same)

