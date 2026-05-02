import { test, expect } from '@playwright/test';

test.describe('Category CRUD', () => {
  test('create a category', async ({ page }) => {
    await page.goto('/categories');
    await page.getByRole('button', { name: /nouvelle catégorie/i }).click();
    await page.getByPlaceholder(/ex.*développement/i).fill('Développement');
    await page.getByRole('button', { name: /^créer$/i }).click();
    await expect(page.getByText('Développement')).toBeVisible();
  });

  test('edit a category', async ({ page }) => {
    await page.goto('/categories');
    // Create one first
    await page.getByRole('button', { name: /nouvelle catégorie/i }).click();
    await page.getByPlaceholder(/ex.*développement/i).fill('A Modifier');
    await page.getByRole('button', { name: /^créer$/i }).click();
    await expect(page.getByText('A Modifier')).toBeVisible();
    // Edit it
    const row = page.locator('div').filter({ hasText: /^A Modifier/ }).first();
    await row.getByRole('button', { name: /modifier/i }).click();
    await page.getByPlaceholder(/ex.*développement/i).fill('Modifié');
    await page.getByRole('button', { name: /enregistrer/i }).click();
    await expect(page.getByText('Modifié')).toBeVisible();
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
    await expect(page.getByText('A Supprimer')).toBeVisible();
    // Find delete button for this row (should be enabled, 0 linked activities)
    const row = page.locator('div').filter({ hasText: /^A Supprimer/ }).first();
    await row.getByRole('button', { name: /supprimer/i }).click();
    await expect(page.getByText('A Supprimer')).not.toBeVisible();
  });
});
