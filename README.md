# Tutor Virtual Classroom MVP

A single-user, offline-first tutoring management application built with React, TypeScript, and Vite.

## Features Implemented

### ✅ Weekly Calendar
- 30-minute time slots (6 AM → 10 PM), Monday-start
- Click-to-add classes; event details modal
- Export .ics for current week (UTC timestamps)
- Subtle visuals: zebra hour rows, Now Line, gentle hover

### ✅ Today
- Chronological list of today's classes
- Confirm/Cancel pending classes
- Pending extra requests with Schedule/Snooze/Dismiss
- Consistent Card surfaces and StatusPill

### ✅ Waitlist
- Manage entries (student, duration, optional weekly windows)
- Add/remove entries via modal

### ✅ Availability Report
- Weekly heatmap (Mon–Sun × 30-min slots), optional student filter

### ✅ Binder
- Student syllabus topics and lesson plans (Dexie persistence)
- Export per-student ZIP (JSON bundle)

### ✅ Trash
- Soft-deleted classes list with restore and days-left indicator

### ✅ Navigation & Theme
- Top nav for Calendar, Today, Waitlist, Availability, Binder, Trash
- Settings → Theme palettes (Indigo, Teal, Rose, Amber) and Appearance (System/Light/Dark); persists across refresh
- Shared primitives: Button, Input, TextArea, Card, Modal, StatusPill
- Spacing uses an 8-pt grid

## Getting Started

```bash
# Install dependencies (clean)
npm ci

# Start development server
npm run dev
```

- Dev server: http://localhost:3000 (see vite.config.ts).
- In Warp, prefer launching in a separate PowerShell window to avoid terminal hijacking:
  ```powershell
  Start-Process pwsh -ArgumentList '-NoExit','-Command','npm run dev' -WorkingDirectory 'E:\AI\Github\projects for git\Tutor'
  ```

## Usage

1. Settings → choose a theme palette (Indigo/Teal/Rose/Amber)
2. Load Sample Data (if you want demo content)
3. Weekly Calendar: navigate weeks, click empty slots to add classes, click events for details
4. Today: confirm/cancel, manage extra requests
5. Waitlist: manage entries and notes/windows
6. Binder, Availability, Trash as needed

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Styled-components** for CSS-in-JS styling
- **Zustand** for state management
- **date-fns** for date manipulation
- **Dexie** for IndexedDB storage (planned)

## Screenshots

> Place images in `docs/screenshots/` with the filenames below to render these previews.
> Note: Screenshots are captured with Playwright on-demand only and are excluded from default test/build/CI.

- Weekly Calendar (light)

  ![Weekly Calendar (light)](docs/screenshots/calendar_light.png)

- Weekly Calendar (dark)

  ![Weekly Calendar (dark)](docs/screenshots/calendar_dark.png)

- Today (light)

  ![Today (light)](docs/screenshots/today_light.png)

- Today (dark)

  ![Today (dark)](docs/screenshots/today_dark.png)

- Availability (light/dark)

  ![Availability (light)](docs/screenshots/availability_light.png)

  ![Availability (dark)](docs/screenshots/availability_dark.png)

- Binder (light/dark)

  ![Binder (light)](docs/screenshots/binder_light.png)

  ![Binder (dark)](docs/screenshots/binder_dark.png)

- Waitlist (light/dark)

  ![Waitlist (light)](docs/screenshots/waitlist_light.png)

  ![Waitlist (dark)](docs/screenshots/waitlist_dark.png)

- Trash (light/dark)

  ![Trash (light)](docs/screenshots/trash_light.png)

  ![Trash (dark)](docs/screenshots/trash_dark.png)

## What’s New (Visual Refresh)

- Theme system + palette selector (Settings)
- Shared UI primitives (Button/Input/TextArea/Card/Modal/StatusPill)
- Subtle calendar visuals (zebra rows, Now Line, today tint, gentle hover)
- Card micro-shadows (motion-safe)
- Spacing normalized to 8-pt grid

## Backlog / Next

- Icon baseline alignment (complete); minor header polish as needed
- A11y QA follow-up (axe scan/contrast quick pass)
- README screenshots update

## Project Structure

```
src/
├── components/
│   ├── WeeklyCalendar.tsx
│   └── TodayDashboard.tsx
├── store/
│   └── appStore.ts
├── utils/
│   └── sampleData.ts
├── types.ts
├── App.tsx
└── main.tsx
```

## Prerequisites

- Node.js 18+ (Vite 5 requires Node 18 or newer)
- npm 9+

## Quickstart

```bash
# Install dependencies (clean, reproducible)
npm ci

# Start development server
npm run dev
```

The dev server runs on http://localhost:3000 (see vite.config.ts).

## Available Scripts

- `npm run dev` – Start the Vite dev server
- `npm run build` – Type-check then build production bundle to `dist/`
- `npm run preview` – Preview the production build locally
- `npm run lint` – Lint the project with ESLint
- `npm test` – Run unit + a11y tests (Vitest + axe); uses a fake IndexedDB polyfill
- `npm run screenshots:install` – Download Playwright browsers (on-demand)
- `npm run screenshots` – Capture docs/screenshots/* via Playwright (on-demand)

## Build & Preview

```bash
npm run build
npm run preview
```

Outputs to `dist/`. You can deploy the contents of `dist/` to any static hosting service.

## Architecture Notes

- UI: React 18 functional components + hooks, styled-components for styling
- State: Zustand store (`src/store/appStore.ts`)
- Dates: date-fns
- Offline-first: IndexedDB via Dexie (planned)
- Tooling: Vite for dev/build, TypeScript strict mode enabled

## Accessibility & Performance

- Accessibility:
  - Keyboard-friendly interactions; Settings/Waitlist modals use ARIA roles
  - Visible focus for buttons/inputs (brand ring)
  - Automated a11y tests with axe for key screens (Calendar, Today, Waitlist, Trash, Binder)
- Performance: leverage Vite’s fast HMR, consider React.lazy() + dynamic import() for route- or feature-level code splitting
- Images/assets: prefer modern formats and pre-sized assets; avoid layout shift

## Conventions & Quality

- TypeScript: strict mode, noImplicit* checks (see tsconfig.json)
- Linting: run `npm run lint` and keep warnings at zero
- Components: functional components with hooks; keep components small and testable
- State: colocate slice logic; avoid unnecessary global state
- Docs: keep README and WARP.md updated as behavior changes

## MVP Roadmap (from PRD)

- Waitlist & Fill-This-Slot
- Student Detail Binder (syllabus, lesson plans, files)
- Trash/soft-delete with 30-day recovery
- Availability Report (heatmap)
- ICS export
- IndexedDB persistence

## Notes

- For terminal usage guidelines and project-specific rules, see `WARP.md`.

## License

TBD.
