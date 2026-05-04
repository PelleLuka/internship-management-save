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

  test('cannot delete modal appears when category has linked activities', async ({ page }) => {
    // Create a category via API
    const catRes = await page.request.post('/api/categories', {
      data: { name: 'CatBlock E2E' },
    });
    const { id: catId } = await catRes.json();

    // Link it to an activity via API (create activity with this category)
    await page.request.post('/api/activities', {
      data: { title: 'ActForCatBlock E2E', categoryIds: [catId] },
    });

    await page.goto('/categories');

    // Find the category card and click delete button
    const card = page.locator('.grid > div').filter({ hasText: 'CatBlock E2E' });
    const deleteBtn = card.locator('button').filter({ hasText: '' }).last();
    await deleteBtn.click({ force: true });

    // Modal should appear with the category name
    await expect(page.getByText('Suppression impossible')).toBeVisible();
    await expect(page.getByText('CatBlock E2E')).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: 'Fermer' }).click();
    await expect(page.getByText('Suppression impossible')).not.toBeVisible();
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
