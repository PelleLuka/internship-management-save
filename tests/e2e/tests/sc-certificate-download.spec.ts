import { test, expect } from '@playwright/test';

test.describe('Certificate Download', () => {
  test('certificate button exists on internship cards', async ({ page }) => {
    await page.goto('/internships');
    // The Printer icon button should be visible (it has title="Télécharger le certificat")
    await expect(
      page.locator('button[title="Télécharger le certificat"]').first()
    ).toBeVisible();
  });

  test('settings page is accessible', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByText(/modèle de certificat/i)).toBeVisible();
    await expect(page.getByText(/uploader un nouveau modèle/i)).toBeVisible();
  });
});
