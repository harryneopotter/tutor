# Pre-Push Hook

## Overview
A git pre-push hook has been set up to automatically validate the build before any push to the remote repository. This prevents broken builds from being pushed and helps maintain CI stability.

## What it checks
1. **Dependencies**: Runs `npm ci` to ensure package.json and package-lock.json are in sync
2. **TypeScript**: Runs `npx tsc -p tsconfig.build.json` to check for compilation errors
3. **Build**: Runs `npx vite build` to ensure the production build succeeds
4. **Tests**: Runs `npx vitest run` to ensure all tests pass

## Location
The hook is located at `.git/hooks/pre-push` and is automatically executed by git before each push.

## Behavior
- ✅ **If all checks pass**: The push proceeds normally
- ❌ **If any check fails**: The push is blocked and you'll see an error message

## Bypassing the hook (not recommended)
If you absolutely need to bypass the hook in an emergency:
```bash
git push --no-verify
```

## Troubleshooting
- **npm ci fails**: Run `npm install` to sync package-lock.json
- **TypeScript fails**: Fix compilation errors in your code
- **Build fails**: Check for build-specific errors (missing files, etc.)
- **Tests fail**: Fix failing tests or update them if needed

## Windows Compatibility
The hook uses `#!/bin/sh` which works with Git Bash on Windows. If you encounter issues, ensure Git Bash is properly installed and available.
