import { test, expect } from '@playwright/test';

const LS_KEY = 'tutor-settings';
function store(theme: string, appearance: 'light' | 'dark') {
  return JSON.stringify({ state: { theme, appearance } });
}

async function prep(page, theme: string, appearance: 'light' | 'dark') {
  await page.addInitScript(([k, v]) => localStorage.setItem(k, v), [LS_KEY, store(theme, appearance)]);
}

test('calendar light', async ({ page }) => {
  await prep(page, 'indigo', 'light');
  await page.goto('/');
  // Wait for top nav to render
  await expect(page.getByText('Weekly Calendar')).toBeVisible();
  const root = page.locator('#root');
  await expect(root).toBeVisible();
  await root.screenshot({ path: 'docs/screenshots/calendar_light.png', animations: 'disabled' });
});

test('calendar dark', async ({ page }) => {
  await prep(page, 'indigo', 'dark');
  await page.goto('/');
  await expect(page.getByText('Weekly Calendar')).toBeVisible();
  const root = page.locator('#root');
  await root.screenshot({ path: 'docs/screenshots/calendar_dark.png', animations: 'disabled' });
});

test('today light', async ({ page }) => {
  await prep(page, 'indigo', 'light');
  await page.goto('/');
  await page.getByRole('button', { name: /today/i }).click();
  await expect(page.getByText(/Today's Schedule/i)).toBeVisible();
  const root = page.locator('#root');
  await root.screenshot({ path: 'docs/screenshots/today_light.png', animations: 'disabled' });
});

test('today dark', async ({ page }) => {
  await prep(page, 'indigo', 'dark');
  await page.goto('/');
  await page.getByRole('button', { name: /today/i }).click();
  await expect(page.getByText(/Today's Schedule/i)).toBeVisible();
  const root = page.locator('#root');
  await root.screenshot({ path: 'docs/screenshots/today_dark.png', animations: 'disabled' });
});

// Additional pages

test('availability light', async ({ page }) => {
  await prep(page, 'indigo', 'light');
  await page.goto('/');
  await page.getByRole('button', { name: /Availability/i }).click();
  await expect(page.getByText(/Availability Report/i)).toBeVisible();
  const root = page.locator('#root');
  await root.screenshot({ path: 'docs/screenshots/availability_light.png', animations: 'disabled' });
});

test('availability dark', async ({ page }) => {
  await prep(page, 'indigo', 'dark');
  await page.goto('/');
  await page.getByRole('button', { name: /Availability/i }).click();
  await expect(page.getByText(/Availability Report/i)).toBeVisible();
  const root = page.locator('#root');
  await root.screenshot({ path: 'docs/screenshots/availability_dark.png', animations: 'disabled' });
});

test('binder light', async ({ page }) => {
  await prep(page, 'indigo', 'light');
  await page.goto('/');
  await page.getByRole('button', { name: /Binder/i }).click();
  await expect(page.getByText(/Student Binder/i)).toBeVisible();
  const root = page.locator('#root');
  await root.screenshot({ path: 'docs/screenshots/binder_light.png', animations: 'disabled' });
});

test('binder dark', async ({ page }) => {
  await prep(page, 'indigo', 'dark');
  await page.goto('/');
  await page.getByRole('button', { name: /Binder/i }).click();
  await expect(page.getByText(/Student Binder/i)).toBeVisible();
  const root = page.locator('#root');
  await root.screenshot({ path: 'docs/screenshots/binder_dark.png', animations: 'disabled' });
});

test('waitlist light', async ({ page }) => {
  await prep(page, 'indigo', 'light');
  await page.goto('/');
  await page.getByRole('button', { name: /Waitlist/i }).click();
  await expect(page.getByText(/Waitlist Management/i)).toBeVisible();
  const root = page.locator('#root');
  await root.screenshot({ path: 'docs/screenshots/waitlist_light.png', animations: 'disabled' });
});

test('waitlist dark', async ({ page }) => {
  await prep(page, 'indigo', 'dark');
  await page.goto('/');
  await page.getByRole('button', { name: /Waitlist/i }).click();
  await expect(page.getByText(/Waitlist Management/i)).toBeVisible();
  const root = page.locator('#root');
  await root.screenshot({ path: 'docs/screenshots/waitlist_dark.png', animations: 'disabled' });
});

test('trash light', async ({ page }) => {
  await prep(page, 'indigo', 'light');
  await page.goto('/');
  await page.getByRole('button', { name: /Trash/i }).click();
  await expect(page.getByText(/Trash \(Soft-Deleted Classes\)/i)).toBeVisible();
  const root = page.locator('#root');
  await root.screenshot({ path: 'docs/screenshots/trash_light.png', animations: 'disabled' });
});

test('trash dark', async ({ page }) => {
  await prep(page, 'indigo', 'dark');
  await page.goto('/');
  await page.getByRole('button', { name: /Trash/i }).click();
  await expect(page.getByText(/Trash \(Soft-Deleted Classes\)/i)).toBeVisible();
  const root = page.locator('#root');
  await root.screenshot({ path: 'docs/screenshots/trash_dark.png', animations: 'disabled' });
});

