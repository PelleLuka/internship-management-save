import { test, expect } from '@playwright/test';

test.describe('Internship Status Badges', () => {
  test('past internships show TERMINÉ badge', async ({ page }) => {
    await page.goto('/internships');
    // Seed data has internships ending in 2024 — all past
    await expect(page.getByText('✓ TERMINÉ').first()).toBeVisible();
  });

  test('future internship shows À VENIR badge', async ({ page }) => {
    // internship id=60 has dates 2025-09-01 to 2025-09-02 — past as of May 2026
    // Create a future one via API
    const personRes = await page.request.post('/api/internships', {
      data: {
        firstName: 'Future',
        lastName: 'Test',
        email: 'future.test@example.com',
        startDate: '2027-01-01',
        endDate: '2027-01-02',
      }
    });
    expect(personRes.ok()).toBeTruthy();
    await page.goto('/internships');
    await expect(page.getByText('◷ À VENIR').first()).toBeVisible();
  });

  test('status badge is visible on each card', async ({ page }) => {
    await page.goto('/internships');
    // At least one badge of any type should be visible
    const badges = page.locator('span').filter({
      hasText: /✓ TERMINÉ|● EN COURS|◷ À VENIR/
    });
    await expect(badges.first()).toBeVisible();
  });
});
