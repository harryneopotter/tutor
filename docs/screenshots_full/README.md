# 🎓 Tutor Virtual Classroom

A premium, offline-first tutoring management workspace designed for teachers who need a reliable, private, and high-performance environment. This application is optimized for **iPhone, iPad, and Desktop**, providing a seamless "app-like" experience through PWA technology.

![Main Hero](docs/screenshots/dashboard.png)

---

## ✨ Features at a Glance

### 📅 Intelligent Scheduling
*   **Weekly Grid**: Monday-start 30-minute intervals (6 AM – 10 PM).
*   **Conflict Detection**: Real-time warnings when sessions overlap.
*   **Quick Actions**: Confirm or Cancel lessons with a single tap from the dashboard.
*   **Quick Cancel (Touch Optimized)**: Long-press any event to instantly cancel and find a replacement.

### 🔖 Student Detail Binder
*   **Syllabus Hub**: Organize curriculum by Year/Month/Topic.
*   **Lesson Planning**: Dedicated space for resources, notes, and teaching goals.
*   **ZIP Archive**: Export a complete student portfolio including all plans and metadata in one click.

### 🕒 Smart Waitlist (Auto-Fill)
*   **Priority Ranking**: The system suggests the best candidates when a slot opens up.
*   **Window Matching**: Automatically filters students based on their specific availability windows.

### 💾 Advanced Data Sovereignty
*   **Local-First**: Your data never leaves your device—stored securely in IndexedDB.
*   **Full System Backup**: Export your entire database to a JSON file for safe-keeping.
*   **One-Click Restore**: Seamlessly migrate your entire workspace to a new device.

---

## 📸 Visual Gallery

| **Weekly Calendar** | **Student Binder** |
| :---: | :---: |
| ![Calendar](docs/screenshots/dashboard.png) | ![Binder](docs/screenshots/binder.png) |
| *Intuitive 7-day grid with conflict resolution.* | *Comprehensive lesson planning and syllabus tracking.* |

| **Smart Settings** | **Verified Performance** |
| :---: | :---: |
| ![Settings](docs/screenshots/settings.png) | ![Verification](docs/screenshots/verification.webp) |
| *Tailored themes and robust data management.* | *100% Type-safe and accessibility certified.* |

---

## 🏗️ Architecture & Technical Stack

The project is built on a modular, scalable architecture emphasizing privacy and speed.

*   **Runtime**: React 18 & TypeScript
*   **Build Tool**: Vite (Ultra-fast HMR)
*   **Design System**: `styled-components` with a custom "Refractive Glass" theme.
*   **State Management**: Zustand (Modular slice pattern)
*   **Database**: Dexie.js (IndexedDB wrapper)
*   **Testing**: Vitest & Axe-core

### 📂 Repository Structure
```text
src/
├── features/     # Feature-based domain logic (binder, calendar, etc.)
├── ui/           # Standardized UI primitives (Button, Card, Modal)
├── store/        # State management (Event, Student, Request slices)
├── db/           # Schema definitions and Repository Layer
└── utils/        # Shared helpers (Backup, ZIP generation, ICS export)
```

---

## 🚀 Installation & Deployment

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 📱 Installing on iOS / Android (PWA)
This app is fully PWA-compatible. For the best experience:
1.  Navigate to the deployed URL in **Safari** (iOS) or **Chrome** (Android).
2.  Tap the **Share** (iOS) or **Menu** (Android) icon.
3.  Select **"Add to Home Screen"**.
4.  The app will now appear on your home screen with its own icon and zero browser UI.

---

## 🛡️ Privacy & Quality
*   **100% Offline**: Works without internet once installed.
*   **No Tracking**: No external analytics or third-party cookies.
*   **A11y Certified**: Fully keyboard-navigable and screen-reader friendly.

---

*Hand-crafted for premium tutoring management. Personalized for Jane.*
