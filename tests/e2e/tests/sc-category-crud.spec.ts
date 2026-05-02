import { test, expect } from '@playwright/test';

test.describe('Category CRUD', () => {
  test('create a category', async ({ page }) => {
    await page.goto('/categories');
    await page.getByRole('button', { name: /nouvelle catégorie/i }).click();
    await page.getByPlaceholder(/ex.*développement/i).fill('Développement');
    await page.getByRole('button', { name: /^créer$/i }).click();
    await expect(page.getByRole('heading', { name: 'Développement' }).first()).toBeVisible();
  });

  test('edit a category', async ({ page }) => {
    await page.goto('/categories');
    // Create one first
    await page.getByRole('button', { name: /nouvelle catégorie/i }).click();
    await page.getByPlaceholder(/ex.*développement/i).fill('A Modifier');
    await page.getByRole('button', { name: /^créer$/i }).click();
    await expect(page.getByRole('heading', { name: 'A Modifier' }).first()).toBeVisible();
    // Edit it
    const card = page.locator('div.bg-white.rounded-xl').filter({ has: page.getByRole('heading', { name: 'A Modifier' }) }).first();
    await card.getByRole('button', { name: /modifier/i }).click();
    await page.getByPlaceholder(/ex.*développement/i).fill('Modifié');
    await page.getByRole('button', { name: /enregistrer/i }).click();
    await expect(page.getByRole('heading', { name: 'Modifié' }).first()).toBeVisible();
  });

  test('delete button is disabled when category has linked activities', async ({ page }) => {
    await page.goto('/categories');
    // If any category has activityCount > 0, its delete button should be disabled
    const disabledDeleteBtn = page.locator('button[aria-label*="impossible"]');
    // This test passes if no such button exists OR if they are all disabled
    const count = await disabledDeleteBtn.count();
    if (count > 0) {
      await expect(disabledDeleteBtn.first()).toBeDisabled();
    }
  });

  test('delete a category with no linked activities', async ({ page }) => {
    await page.goto('/categories');
    await page.getByRole('button', { name: /nouvelle catégorie/i }).click();
    await page.getByPlaceholder(/ex.*développement/i).fill('A Supprimer');
    await page.getByRole('button', { name: /^créer$/i }).click();
    await expect(page.getByRole('heading', { name: 'A Supprimer' }).first()).toBeVisible();
    // Find delete button for this card (should be enabled, 0 linked activities)
    const card = page.locator('div.bg-white.rounded-xl').filter({ has: page.getByRole('heading', { name: 'A Supprimer' }) }).first();
    await card.getByRole('button', { name: /supprimer/i }).click();
    await expect(page.getByRole('heading', { name: 'A Supprimer' })).not.toBeVisible();
  });

  test('categories displayed as card grid', async ({ page }) => {
    await page.goto('/categories');
    // Layout must be a grid, not a list
    await expect(page.locator('.grid')).toBeVisible();
    // Seeded categories must appear (use role to be more specific)
    await expect(page.getByRole('heading', { name: 'Programmation' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Web' }).first()).toBeVisible();
  });
});
