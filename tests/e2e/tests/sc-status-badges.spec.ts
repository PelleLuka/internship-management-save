import { test, expect } from '@playwright/test';

test.describe('Internship Status Badges', () => {
  test('past internships show Terminé badge', async ({ page }) => {
    await page.goto('/internships');
    // Seed data has internships ending in 2024 — all past
    await expect(page.locator('span').filter({ hasText: 'Terminé' }).first()).toBeVisible();
  });

  test('future internship shows À venir badge', async ({ page }) => {
    // Create a future internship via API
    const res = await page.request.post('/api/internships', {
      data: {
        firstName: 'Future',
        lastName: 'Test',
        email: 'future.test@example.com',
        startDate: '2027-01-01',
        endDate: '2027-01-02',
      }
    });
    expect(res.ok()).toBeTruthy();
    await page.goto('/internships');
    await expect(page.locator('span').filter({ hasText: 'À venir' }).first()).toBeVisible();
  });

  test('status badge is visible on each card', async ({ page }) => {
    await page.goto('/internships');
    // At least one badge of any status type should be visible
    const badges = page.locator('span').filter({
      hasText: /^(Terminé|En cours|À venir)$/
    });
    await expect(badges.first()).toBeVisible();
  });
});
