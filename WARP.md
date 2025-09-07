# WARP Project Rules – Tutor Virtual Classroom

These rules guide how this repository is used inside Warp and by contributors/automation.

## Terminal & Safety
- Do NOT run long-lived servers (e.g., `npm run dev`) in this Warp session. Prefer a separate PowerShell window or automation.
- Avoid interactive/fullscreen commands. Use `--no-pager` variants where applicable.
- Never print or paste secrets. Use environment variables (e.g., `$env:API_KEY`) and keep `.env` files out of git.

## Tech & Architecture
- Stack: React 18 + TypeScript, Vite, Zustand, styled-components, date-fns, Dexie (planned).
- Components: functional with hooks; keep small and composable.
- State: Prefer colocated Zustand slices; avoid unnecessary global state.
- Styling: styled-components; co-locate styles with components.
- Modules: keep imports path-based; avoid deep circular dependencies.

## Quality & Conventions
- TypeScript: strict mode. Add JSDoc on exported functions/components.
- Linting: `npm run lint` must pass with zero warnings before merging.
- Performance: consider `React.lazy` + dynamic `import()` for larger views; keep initial bundle small.
- Accessibility: keyboard navigable, visible focus, ARIA semantics where needed, sufficient contrast.

## Project Structure
- `src/components` UI components
- `src/store` Zustand store(s)
- `src/utils` pure utilities
- `src/types.ts` shared types
- Keep files focused; prefer folders over very long files.

## Build & Artifacts
- Build with `npm run build` → `dist/` (static, deployable).
- Only track files essential to build: `src/**`, `index.html`, `vite.config.ts`, `tsconfig*.json`, `package.json`, lockfile(s), and `public/**` if present.
- Common non-essential files (docs, PDFs, local workspace configs) should remain untracked unless explicitly requested.

## Git & Reviews
- Initialize repo with minimal tracked set (see above).
- Use clear, conventional commit messages (e.g., `feat:`, `fix:`, `docs:`).
- Prefer small, focused PRs with descriptive summaries.

## Docs
- Keep `README.md` concise and actionable for devs.
- Update this `WARP.md` if team conventions change.

