# CHANGE_LOG_DETAILS

Purpose
- Explain what was changed and why for each file in a milestone. Keep this updated before starting the next milestone.

Milestone M0 — Project initialization and docs (2025-09-06)
Summary
- Initialized git, added remote, and pushed minimal build set.
- Tracked docs and housekeeping (*.md, .gitignore) per your updated preference.
- Kept WARP.md intentionally untracked but present locally for terminal/project rules.

Details by file (added in repo init commit 6e7719a)
- index.html
  - Base HTML shell for Vite React app. Includes global CSS reset and user-select: none to avoid accidental text selection on touch devices (iPad-first).
- package.json
  - Project metadata, scripts (dev/build/preview/lint), and runtime/dev dependencies.
  - Scripts: dev (vite), build (tsc && vite build), lint (eslint), preview (vite preview).
- package-lock.json
  - Pin exact versions for reproducible installs.
- vite.config.ts
  - Vite configuration: React plugin, dev server port 3000, build outDir = dist.
- tsconfig.json
  - TypeScript strict config for browser code; ES2020 target; bundler resolution; JSX react-jsx; noEmit.
- tsconfig.node.json
  - Node-side TS settings for Vite tooling.
- src/App.tsx
  - Root application component that ties together navigation between Weekly Calendar and Today Dashboard.
- src/components/WeeklyCalendar.tsx
  - Weekly grid view with Monday-start week and 30-minute slots; color coding (blue/green/red); click-to-add and event detail interactions.
- src/components/TodayDashboard.tsx
  - Chronological list of today's classes; confirm/cancel actions; surface pending extra class requests.
- src/components/FillSlotModal.tsx
  - Modal UI scaffolding for creating a class in a selected slot.
- src/components/WaitlistManagement.tsx
  - UI scaffolding to manage waitlist entries; to be integrated with Fill-This-Slot workflow.
- src/main.tsx
  - React entry point that mounts the app to #root.
- src/store/appStore.ts
  - Zustand store for app state; will be extended to persist through Dexie.
- src/types.ts
  - Shared TypeScript types for Students, Events, etc. Will expand to include ExtraClassRequest, WaitlistEntry, SyllabusTopic, LessonPlan.
- src/utils/sampleData.ts
  - Utility to load sample data for testing the UI quickly.

Details by file (docs/housekeeping commit 271f7c8)
- .gitignore (added)
  - Node/Vite/TypeScript patterns: node_modules, dist, .vite, *.tsbuildinfo, logs, .env*, editors/OS artifacts, coverage.
  - Project-specific ignores: Tutor.code-workspace, prd.md, *.pdf.
  - Rationale: keep repository focused on source code and build essentials; avoid committing environment and editor noise.
- README.md (added to VCS; content enhanced earlier)
  - Additions: Prerequisites, Quickstart (npm ci, npm run dev), Available Scripts, Build & Preview, Architecture Notes, A11y & Performance, Conventions & Quality, MVP Roadmap, Notes (see WARP.md), License placeholder.
  - Rationale: actionable onboarding for contributors; aligns with quality standards and web performance/a11y preferences.

Local-only (intentionally untracked)
- WARP.md (created, not tracked)
  - Content: Terminal safety (don’t run long-lived servers in this Warp session), coding standards (TS strict, JSDoc, ESLint), architecture/state conventions, performance and a11y guidance, minimal tracked set policy.
  - Rationale: Follows your preference to keep WARP rules local while guiding development.

Process steps (non-file changes)
- git init → created the repository and initial commit 6e7719a with minimal build set.
- git remote add origin git@github.com:harryneopotter/tutor.git → connected to GitHub.
- git push -u origin main → published the main branch.
- Tracked docs in commit 271f7c8 per your instruction to include README and .gitignore as essential.

Notes for next milestones
- Slot granularity set to 30 minutes (confirmed); PRD language should reflect 30-minute slots going forward.
- Future milestones will append new sections to both CHANGE_LOG.md and CHANGE_LOG_DETAILS.md before implementation begins.

Milestone M1 — Persistence foundation (Dexie) (2025-09-06)
Plan and rationale (before implementation)
- src/db/database.ts (new)
  - Create a Dexie database named tutor_vc_db with typed tables:
    - students (id primary key, index: name)
    - classEvents (id primary key, indexes: studentId, start, end, deletedAt)
    - extraRequests (id primary key, indexes: studentId, status, snoozeUntil)
    - waitlist (id primary key, indexes: studentId, durationMin)
- src/repositories/students.ts (new)
  - CRUD helpers: getAll, add, addMany, count.
- src/repositories/events.ts (new)
  - CRUD helpers: getAll, add, addMany, update, softDelete.
- src/repositories/requests.ts (new)
  - CRUD helpers: getAll, add, addMany, update.
- src/repositories/waitlist.ts (new)
  - CRUD helpers: getAll, add, addMany, remove, removeByStudentId.
- src/store/appStore.ts (modify)
  - Add hydrateFromDB() to load state on startup.
  - Write-through to Dexie in add/update/delete actions for events, students, requests, and waitlist.
  - initializeSampleData() seeds Dexie if empty (fire-and-forget) while populating UI immediately.
- src/App.tsx (modify)
  - Call hydrateFromDB() on mount to populate state from Dexie.

Completed in 06c565e
- Added: src/db/database.ts; src/repositories/{events,requests,students,waitlist}.ts
- Modified: src/store/appStore.ts; src/App.tsx; CHANGE_LOG.md; CHANGE_LOG_DETAILS.md

Notes
- No migrations required (v1 schema).
- Slot size remains 30 minutes (no UI change required for M1).

Milestone M2 — Extra class reminders/flags + Today Dashboard integration (2025-09-06)
Plan and rationale (before implementation)
- src/store/appStore.ts
  - Enhance addExtraClassRequest to deduplicate open/snoozed requests for same student + duration.
  - Merge notes when applicable and update updatedAt.
- src/components/TodayDashboard.tsx
  - Add “Add Extra Request” modal with fields: student, duration (minutes), notes.
  - Keep Snooze (24h), Schedule (placeholder for now), and Dismiss actions.
  - Ensure pending/snoozed requests appear prominently.

Completed in 6d86fa0
- Modified: src/store/appStore.ts (dedup/merge); src/components/TodayDashboard.tsx (modal + form)
- Updated docs: CHANGE_LOG.md; CHANGE_LOG_DETAILS.md

Milestone M3 — Waitlist & Fill-This-Slot suggestions (2025-09-06)
Plan and rationale (before implementation)
- src/utils/ranking.ts (new)
  - Provide rankWaitlistCandidates(canceledEventDuration, entries, students) scoring by:
    - Absolute duration difference (smaller is better)
    - Tie-breaker: student name A→Z
- src/components/FillSlotModal.tsx
  - Use ranking helper instead of naive slice(0,3).
  - Keep UI the same, but suggestions are better targeted.

Completed in a167034
- Added: src/utils/ranking.ts
- Modified: src/components/FillSlotModal.tsx (rank suggestions)
- Updated docs: CHANGE_LOG.md; CHANGE_LOG_DETAILS.md

Milestone M4 — Trash (soft-delete) (2025-09-06)
Plan and rationale (before implementation)
- src/components/TrashView.tsx (new)
  - List soft-deleted events with Restore button.
  - If conflict on restore, offer reschedule to the next available 30‑min slot same day.
- src/store/appStore.ts (modify)
  - Add restoreEvent(id) and updateEventTimes(id, {start,end}).
  - On hydrateFromDB(), purge events with deletedAt older than 30 days.
- src/repositories/events.ts (modify)
  - Add remove(id) helper for purging.
- src/App.tsx (modify)
  - Add "Trash" tab and routing to TrashView.

Completed in 03045b9
- Added: src/components/TrashView.tsx
- Modified: src/store/appStore.ts (restore/update/purge), src/repositories/events.ts (remove), src/App.tsx (nav)
- Updated docs: CHANGE_LOG.md; CHANGE_LOG_DETAILS.md

Milestone M7 — ICS export (2025-09-06)
Plan and rationale (before implementation)
- src/components/WeeklyCalendar.tsx
  - Add "Export .ics" button to export events in the currently viewed week.
  - Generate a simple VCALENDAR with VEVENT entries (local time) and trigger download.

Completed in 3d6627b
- Modified: src/components/WeeklyCalendar.tsx (Export .ics UI + generator)
- Updated docs: CHANGE_LOG.md; CHANGE_LOG_DETAILS.md

Milestone M6 — Availability Report (heatmap) (2025-09-06)
Plan and rationale (before implementation)
- src/components/AvailabilityReport.tsx (new)
  - Render a 7×N grid (Mon–Sun × 30-min slots) with color-coded occupancy per slot.
  - Colors: light green = free (0%), darker green = partial (0–100%), pink/red = busy (100%).
- src/App.tsx (modify)
  - Add "Availability" nav and route to AvailabilityReport.

Milestone M5 — Student Binder (syllabus, lesson plans) (2025-09-06)
Plan and rationale (before implementation)
- src/db/database.ts (modify)
  - Add version 2 with tables: syllabusTopics (id, studentId, month) and lessonPlans (id, studentId, date).
- src/repositories/binder.ts (new)
  - CRUD helpers for topics and plans: getAllByStudent, add, update, remove.
- src/components/StudentBinder.tsx (new)
  - UI with student picker and tabs: Syllabus and Lesson Plans with add/edit minimal forms.
- src/App.tsx (modify)
  - Add "Binder" nav to open StudentBinder.

Completed in 5aabdaf
- Modified: src/db/database.ts (v2 schema), src/App.tsx (nav)
- Added: src/repositories/binder.ts; src/components/StudentBinder.tsx
- Updated docs: CHANGE_LOG.md; CHANGE_LOG_DETAILS.md

Milestone M8 — CI (build) (2025-09-06)
Plan and rationale (before implementation)
- .github/workflows/ci.yml (new)
  - Run on push and pull_request.
  - Steps: setup Node, npm ci, npm run build (tsc && vite build).
  - Omit lint/tests for now to avoid false negatives until configs/tests are added.
Plan and rationale (before implementation)
- .github/workflows/ci.yml (new)
  - Run on push and pull_request.
  - Steps: setup Node, npm ci, npm run build (tsc && vite build).
  - Omit lint/tests for now to avoid false negatives until configs/tests are added.

Completed in 7cb359a
- Added: .github/workflows/ci.yml
- Updated docs: CHANGE_LOG.md; CHANGE_LOG_DETAILS.md

Milestone M2b — Snooze visibility (Today Dashboard) (2025-09-06)
Plan and rationale (before implementation)
- src/components/TodayDashboard.tsx
  - Filter pending extras as: open OR (snoozed AND snoozeUntil <= now)
  - This keeps snoozed items hidden until they are due.

Completed in 5735dea
- Modified: src/components/TodayDashboard.tsx (filter snoozed by snoozeUntil)
- Updated docs: CHANGE_LOG.md; CHANGE_LOG_DETAILS.md

Milestone M5b — Student ZIP export (2025-09-06)
Plan and rationale (before implementation)
- package.json (modify)
  - Add dependency: jszip
- src/components/StudentBinder.tsx (modify)
  - Add "Export ZIP" button to download per-student JSON bundle: student.json, lessonPlans.json, syllabus.json, classes.json, manifest.json.

Completed in 595a36f
- Modified: package.json (add jszip)
- Modified: src/components/StudentBinder.tsx (Export ZIP with dynamic import of JSZip)
- Updated lockfile and docs

Milestone M2c — Schedule Extra flow (2025-09-06)
Plan and rationale (before implementation)
- src/components/TodayDashboard.tsx (modify)
  - Add modal on "Schedule" to pick date, time and duration (default from request).
  - On save: create ClassEvent and update request to status=scheduled with linkedEventId.

Completed in 50886f8
- Modified: src/components/TodayDashboard.tsx (scheduling modal, event creation, request link)
- Updated docs: CHANGE_LOG.md; CHANGE_LOG_DETAILS.md

Minor update — Calendar visibility tweak (2025-09-06)
Plan and rationale (before implementation)
- src/components/WeeklyCalendar.tsx
  - Do not render canceled events in week grid (keep them visible in Today view with canceled status if needed).

Completed in 5a03fcd
- Modified: src/components/WeeklyCalendar.tsx (filter out canceled)
- Updated docs: CHANGE_LOG.md; CHANGE_LOG_DETAILS.md

Milestone M8b — Testing (Vitest) (2025-09-06)
Plan and rationale (before implementation)
- vitest.config.ts (new)
  - Configure jsdom environment and TypeScript support.
- src/utils/__tests__/ranking.test.ts (new)
  - Verify rankWaitlistCandidates sorts by duration closeness with tie-breaker by name.
- src/store/__tests__/extras.test.ts (new)
  - Mock repositories; verify addExtraClassRequest dedupes and merges notes.
- package.json (modify)
  - Add scripts: test, test:watch; add devDependency: vitest.
- .github/workflows/ci.yml (modify)
  - Run npm test after build.

