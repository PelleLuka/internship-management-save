import { expect, test } from '@playwright/test';

test.describe('Certificate Download', () => {
  test('certificate button exists on internship cards', async ({ page }) => {
    await page.goto('/internships');
    await expect(
      page.locator('button[title="Aperçu du certificat"]').first(),
    ).toBeVisible();
  });

  test('settings page is accessible', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByText(/modèle de certificat/i)).toBeVisible();
    await expect(page.getByText(/uploader un nouveau modèle/i)).toBeVisible();
  });

  test('certificate button navigates to preview page', async ({ page }) => {
    await page.goto('/internships');
    // force:true bypasses pointer-events:none on hover-reveal buttons
    await page
      .locator('button[title="Aperçu du certificat"]')
      .first()
      .click({ force: true });
    await expect(page).toHaveURL(/\/certificate\/\d+/);
    await expect(page.getByText('Certificat de Stage')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Imprimer' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Télécharger PDF' }),
    ).toBeVisible();
  });
});
