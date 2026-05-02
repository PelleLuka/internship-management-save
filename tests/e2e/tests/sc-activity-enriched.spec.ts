import { test, expect } from '@playwright/test';

test.describe('Enriched Activity Form', () => {
  test('activity form shows description and categories fields', async ({ page }) => {
    await page.goto('/activities');
    await page.getByRole('button', { name: /nouvelle activité/i }).click();
    await expect(page.getByPlaceholder(/description/i)).toBeVisible();
    await expect(page.getByText(/catégories/i).first()).toBeVisible();
  });

  test('document zone is always visible on activity cards', async ({ page }) => {
    await page.goto('/activities');
    await expect(page.getByText(/documentation/i).first()).toBeVisible();
  });

  test('can select categories when creating an activity', async ({ page }) => {
    // First create a category via API
    await page.request.post('/api/categories', {
      data: { name: 'Test Cat E2E' }
    });
    await page.goto('/activities');
    await page.getByRole('button', { name: /nouvelle activité/i }).click();
    await expect(page.getByText('Test Cat E2E')).toBeVisible();
    await page.getByText('Test Cat E2E').click();
    // Category should now be selected (has blue styling)
    await expect(page.getByText('Test Cat E2E')).toHaveClass(/bg-blue-600/);
  });

  test('activity card shows category badges', async ({ page }) => {
    await page.goto('/activities');
    // Activity 4 "Réalisation d'un site Web..." is seeded with Programmation + Web categories
    const card = page.locator('.grid > div').filter({ hasText: 'Réalisation d\'un site Web' });
    await expect(card.locator('span').filter({ hasText: 'Web' })).toBeVisible();
    await expect(card.locator('span').filter({ hasText: 'Programmation' })).toBeVisible();
  });

  test('activity card shows description excerpt', async ({ page }) => {
    await page.goto('/activities');
    const card = page.locator('.grid > div').filter({ hasText: 'Réalisation d\'un site Web' });
    await expect(card.locator('text=Réalisation d\'un site web complet')).toBeVisible();
  });
});
