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

Milestone M3 — Waitlist & Fill-This-Slot suggestions (2025-09-06)
Plan and rationale (before implementation)
- src/utils/ranking.ts (new)
  - Provide rankWaitlistCandidates(canceledEventDuration, entries, students) scoring by:
    - Absolute duration difference (smaller is better)
    - Tie-breaker: student name A→Z
- src/components/FillSlotModal.tsx
  - Use ranking helper instead of naive slice(0,3).
  - Keep UI the same, but suggestions are better targeted.

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

Milestone M7 — ICS export (2025-09-06)
Plan and rationale (before implementation)
- src/components/WeeklyCalendar.tsx
  - Add "Export .ics" button to export events in the currently viewed week.
  - Generate a simple VCALENDAR with VEVENT entries (local time) and trigger download.

