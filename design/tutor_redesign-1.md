# ✨ Tutor Scheduler — Modern Redesign (Elegant • Modern • Calm Productivity)

> Goal: elevate the existing scheduling suite (Weekly Calendar, Today, Waitlist, Availability, Binder, Trash, Modals) with a cohesive design system, refined layouts, and delightful micro‑interactions. Optimized for focus, speed, and trust.

---

## 1) Brand & Aesthetic Direction

**Mood:** calm productivity, confident, human.  
**Look:** light surfaces, soft depth, high legibility, precise spacing, friendly geometry.  
**Motion:** subtle and purposeful; 180–220ms ease-out; reduce on prefers‑reduced‑motion.  

**Color System**  
- Surface 0 `#F8FAFC` (page background)  
- Surface 1 `#FFFFFF` (cards, modals)  
- Ink 900 `#0F172A`; Ink 600 `#475569`; Ink 400 `#94A3B8`  
- Brand **Indigo 600** `#4F46E5` (primary) • hover `#4338CA`  
- Success `#16A34A` • Warning `#F59E0B` • Danger `#EF4444` • Info `#0EA5E9`  
- Accents for student tags (auto‑generated): teal, violet, amber, rose, sky, lime.

**Type System**  
- Headline: **Inter** 700  
- UI & Body: **Inter** 400–600  
- Numeric UI (time, durations): **JetBrains Mono** 500 for crisp readouts

**Elevation & Shape**  
- Radius: **rounded-2xl** for cards/modals; **rounded-xl** for inputs; **rounded-full** for pills.  
- Shadow: soft layered (`shadow-[0_1px_1px_rgba(16,24,40,0.04),0_10px_20px_rgba(16,24,40,0.06)]`).  
- Borders: 1px `#E2E8F0` on cards; inputs with focus ring brand‑indigo.

**Iconography**  
- lucide-style line icons at 20/24px; duotone for emphasis on empty states.

---

## 2) App Shell (Global Layout)

**Structure**  
- **Left Sidebar (72px collapsed → 240px expanded)**: App icon, primary sections (Calendar, Today, Waitlist, Availability, Binder, Trash). Active item = brand pill highlight.  
- **Top Bar**: Page title + context controls (date range, filters) left; global search (⌘K), New Class (primary) and Export on right.  
- **Content**: max‑width fluid, 24px gutters, 16px grid.  

**Global UX**  
- **Command Palette (⌘K)**: jump to student, “New class with Alice 9am Tue”, “Go to next week”.  
- **Toasts**: anchored bottom‑right, 4s auto‑dismiss, undo actions.

---

## 3) Component Library

### Buttons
- **Primary**: indigo solid; **Secondary**: indigo outline; **Tertiary**: ghost.  
- Sizes sm/md/lg with 12px vertical padding; icons always 20px.  

### Inputs
- Filled white, subtle border; focus ring `ring-2 ring-indigo-500/40`.  
- **Select** uses segmented list with check and search; **Duration** uses segmented pills (30/45/60/90/custom).

### Status Chips
- **Confirmed** (success/green), **Pending** (amber), **Canceled** (slate/line-through on event), **Waitlist** (violet).  
- Style: `rounded-full px-2.5 py-0.5 text-xs font-medium` with soft tint backgrounds.

### Cards
- 16px padding, 12px gap, subtle border; header w/ title + meta; footer actions right‑aligned.

### Modal / Drawer
- **Modal**: 720–880px, centered, dim backdrop 40%; sticky header + sticky footer; ESC to close.  
- **Drawer** (alt on mobile): slide‑up with same content.

---

## 4) Screen Redesigns

### A) Weekly Calendar

**Header Row**  
- Left: **Week selector** (‹ ›) + date range (Sep 1–7, 2025) + **view switch** (Week / Day / Month)  
- Right: timezone badge, **Export .ics**, **New Class** (primary)  

**Time Grid**  
- 30‑min rows; zebra tint every hour; sticky **Now Line** in red at current time.  
- **Event Chips**: rounded-lg, 6px left color bar = student color; title + student + duration; subtle gloss hover; **drag to resize**, **⌥ drag to duplicate**.  
- **Conflict Awareness**: overlapping chips stack w/ 3D offset; tooltip lists collisions + quick resolve.

**Quick Add**  
- Double‑click a slot → inline composer (Title, Student, Duration pills, Save). Converts to event w/ micro‑confirm.

**Context Menu (right‑click)**  
- Edit, Duplicate, Convert to Recurring…, Mark Confirmed, Delete (to Trash).

---

### B) Add Class (New) Modal

**Layout:** 2‑column form; labels left aligned; distilled copy.

- **Start**: date + time picker with quick presets (Next available 60m, Tomorrow 9a).  
- **Title**: autocomplete from templates (Algebra Review, Essay Writing).  
- **Student**: searchable select with avatar + grade + preferences.  
- **Duration**: segmented pills (30/45/60/90/Custom).  
- **Notes (optional)**: expandable text area.  
- **Footer**: Cancel (tertiary) • **Save** (primary).  
- **Keyboard**: Enter to save, ⌘S; ESC to cancel.

**Smart Hints**  
- Inline banner shows **availability conflicts** + suggested times (“Alice is free 10:30–11:30”).

---

### C) Event Details Modal

- **Header**: Title + Student avatar + **Status chip** (Pending ⇄ Confirmed toggle) + overflow menu.  
- **Body (2 cols)**:  
  - Left: Title, Student, Date, Time, Duration (same controls as New).  
  - Right: Notes, Attachments, **History** (created/edited), **Conflicts & Suggestions** panel.  
- **Footer**: **Confirm**, Save, Delete (danger/outline), Close.  
- Validation + optimistic save with toast.

---

### D) Today

**Top Summary**  
- 3 KPIs: Classes (Confirmed/Pending), Total hours, Pending extras.  
- Inline filter: by student/status.

**Timeline List**  
- Sessions grouped by time; left accent bar by status; hover reveals quick actions.  
- **Row anatomy**: Title • Student meta • time range • **status chip** • actions: Confirm / Cancel.  
- **Pending Extras**: compact cards with context + **Schedule** (opens inline slot picker), **Snooze**, **Dismiss**.

---

### E) Waitlist

- **Card list** with avatar, grade, preference chips (e.g., 60 min), note.  
- Right‑side **Schedule** button opens **smart slot picker** (shows mutual free grid).  
- Bulk actions: select multiple → Schedule all / Remove.

---

### F) Availability

- **Heatmap** by day/time with legend; green = free, red = blocked; subtle grid with rounded cells.  
- Student filter (multi‑select) + quick presets (Weekdays, Weekends, Evenings).  
- Click‑drag to paint availability; **⌥** toggles erase.  
- Side panel summary: “Alice: Mon 8–12, Wed 1–4 …” with copyable text.

---

### G) Binder

- Split layout: **Left** add/edit panel; **Right** Topics list.  
- Topic chips with month badge; drag to reorder; inline edit on click.  
- Secondary tab: **Lesson Plans** with checklist rows + attachments.

---

### H) Trash

- Warm empty state with illustration + “No deleted classes in last 30 days”.  
- When items exist: table with Title, Student, Deleted on, **Restore**, **Purge**; bulk restore; 30‑day countdown badge.

---

## 5) Accessibility & Performance

- Minimum 4.5:1 contrast; focus styles visible; tab order logical.  
- Targets ≥ 40px; large touch affordances on mobile.  
- Lazy render heavy views (calendar virtual rows).  
- Respect `prefers-reduced-motion`.

---

## 6) Interaction Details (Micro‑UX)

- **Hover**: lift 1px + subtle shadow; **Pressed**: compress shadow + inset.  
- **Now Line** animates gently; **Drag handles** appear on event edges.  
- **Keyboard**:  
  - Week nav: ← → ; Jump to Today: T  
  - New class: N  
  - Confirm selected: C  
  - Delete: ⌫ (with confirm)

---

## 7) Tailwind-ish Implementation Notes

> Below are drop‑in component patterns illustrating the look/feel. (Use with shadcn/ui + lucide-react.)

```tsx
// AppShell
export function AppShell({ title, actions, children }: { title: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="hidden md:flex w-72 flex-col border-r border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="h-16 flex items-center gap-2 px-5">
          <div className="h-8 w-8 rounded-xl bg-indigo-600" />
          <span className="font-semibold">Tutor</span>
        </div>
        <nav className="px-2 py-3 space-y-1">
          {[
            { label: 'Weekly Calendar', icon: 'Calendar' },
            { label: 'Today', icon: 'NotebookPen' },
            { label: 'Waitlist', icon: 'Users' },
            { label: 'Availability', icon: 'Clock' },
            { label: 'Binder', icon: 'BookOpen' },
            { label: 'Trash', icon: 'Trash' },
          ].map((i) => (
            <a key={i.label} className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-700">
              <i className="h-4 w-4" />
              <span>{i.label}</span>
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1">
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/75 backdrop-blur">
          <div className="mx-auto max-w-[1600px] h-16 px-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
            <div className="flex items-center gap-2">{actions}</div>
          </div>
        </div>
        <div className="mx-auto max-w-[1600px] p-4">{children}</div>
      </main>
    </div>
  );
}
```

```tsx
// StatusPill
export function StatusPill({ status }: { status: 'pending'|'confirmed'|'canceled'|'waitlist' }) {
  const map = {
    pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    confirmed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    canceled: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 line-through',
    waitlist: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  }[status];
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${map}`}>{status}</span>;
}
```

```tsx
// EventCard (calendar chip)
export function EventCard({ title, student, color, time }: { title: string; student: string; color: string; time: string }) {
  return (
    <div className="group relative h-full w-full rounded-lg bg-white shadow ring-1 ring-slate-200 overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-1.5" style={{ background: color }} />
      <div className="px-2.5 py-1.5 text-[13px] leading-tight">
        <div className="font-medium truncate">{title}</div>
        <div className="text-slate-500 truncate">{student} • {time}</div>
      </div>
      <div className="absolute inset-0 hidden group-hover:block bg-slate-900/0" />
    </div>
  );
}
```

```tsx
// Modal Shell
export function Modal({ title, children, footer }: any) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-6">
      <div className="absolute inset-0 bg-slate-900/40" />
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
        <header className="sticky top-0 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-semibold">{title}</h3>
          <button className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100">ESC</button>
        </header>
        <div className="p-6">{children}</div>
        <footer className="sticky bottom-0 px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-2">{footer}</footer>
      </div>
    </div>
  );
}
```

```tsx
// WaitlistCard
export function WaitlistCard({ name, grade, prefs, onSchedule }: any) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-200 to-indigo-400" />
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-slate-500">{grade} • {prefs}</div>
        </div>
      </div>
      <button onClick={onSchedule} className="rounded-xl bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700">Schedule</button>
    </div>
  );
}
```

```tsx
// Availability Cell
export function AvailabilityCell({ state='free' }: { state?: 'free'|'busy'|'unknown' }) {
  const tone = state==='free' ? 'bg-emerald-100' : state==='busy' ? 'bg-rose-200' : 'bg-slate-100';
  return <div className={`h-8 w-full rounded-md ${tone} ring-1 ring-white`} />;
}
```

---

## 8) Copy Guidelines (tone)

- Clear, friendly, actionable.  
- Titles: “Algebra Review” not “Lesson – Algebra”.  
- Microcopy:
  - Conflicts: “Alice is booked 9–10a. Try 10:30a?”  
  - Empty: “No deleted classes in the last 30 days.”

---

## 9) Handoff Checklist

- Figma styles: color tokens + type scale + 8pt spacing.  
- Components: Button, Input, Select, Segmented, StatusPill, Card, Modal, Toast, Tooltip.  
- Views: Week/Day/Month Calendar, Today, Waitlist, Availability heatmap, Binder, Trash, Add/Edit modals.  
- Interaction spec: keyboard map, drag‑n‑drop behaviors, conflict resolution flow.

---

### Outcome
A coherent, elegant interface that reduces cognitive load, speeds core actions (create, confirm, schedule), and looks delightful across desktop and mobile—ready for incremental rollout with minimal disruption to existing workflows.

