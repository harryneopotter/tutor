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

