# Tutor Virtual Classroom MVP

A single-user, offline-first tutoring management application built with React, TypeScript, and Vite.

## Features Implemented

### ✅ Weekly Calendar Dashboard
- 30-minute time slots from 6 AM to 10 PM
- Monday-start week navigation
- Color-coded events (blue: tutor classes, green: student classes, red: missing info)
- Click-to-add events functionality
- Today highlighting

### ✅ Today Dashboard
- Chronological list of today's classes
- Confirm/cancel buttons for pending classes
- Status indicators (confirmed, pending, canceled)
- Pending extra class requests section
- Schedule/Snooze/Dismiss actions for extra requests

### ✅ Navigation
- Tab-based navigation between Weekly Calendar and Today Dashboard
- Sample data loader for testing

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

1. **Load Sample Data**: Click \"Load Sample Data\" to populate with test students and classes
2. **Weekly Calendar**: 
   - Navigate weeks with Previous/Next buttons
   - Click empty time slots to add new classes
   - Click existing events to view details
3. **Today Dashboard**:
   - View today's schedule
   - Confirm or cancel pending classes
   - Manage extra class requests

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Styled-components** for CSS-in-JS styling
- **Zustand** for state management
- **date-fns** for date manipulation
- **Dexie** for IndexedDB storage (planned)

## Next Steps (Remaining MVP Features)

- [ ] Waitlist & Fill-This-Slot functionality
- [ ] Student Detail Binder (syllabus, lesson plans, files)
- [ ] Trash/soft-delete with 30-day recovery
- [ ] Availability Report (heatmap view)
- [ ] ICS export functionality
- [ ] IndexedDB integration for persistence

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

- Accessibility: keyboard-friendly interactions, clear focus states, and color-contrast guidelines
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
