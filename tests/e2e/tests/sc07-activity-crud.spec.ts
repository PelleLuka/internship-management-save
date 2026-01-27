import { test, expect } from '@playwright/test';

test.describe('SC07 - CRUD Activités', () => {

  const uniqueId = Date.now();
  const activityTitle = `Test-Act-${uniqueId}`;
  const activityTitleUpdated = `Mod-Act-${uniqueId}`;

  test('Gérer le cycle de vie d\'une activité', async ({ page }) => {
    // 0. Cache control
    await page.setExtraHTTPHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });

    // 1. Navigation
    await page.goto('/activities');
    await expect(page.getByRole('heading', { name: 'Activités' })).toBeVisible();

    // 2. Création
    await page.getByRole('button', { name: 'Nouvelle Activité' }).click();
    await page.getByLabel('Titre').fill(activityTitle);
    
    // Wait for POST
    const createPromise = page.waitForResponse(res => res.url().includes('/api/activities') && res.request().method() === 'POST' && res.status() === 201);
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await createPromise;
    await expect(page.getByRole('dialog')).toBeHidden();

    // Verification Creation
    // Le rechargement de la liste est long (N+1 queries), on reload pour avoir l'état frais
    await page.reload();
    // On vérifie directement dans la liste sans filtrer (moins de dépendances)
    await expect(page.getByText(activityTitle)).toBeVisible({ timeout: 15000 });

    // 3. Modification
    await page.waitForTimeout(2000); // Wait for hydration/interactivity
    const editButton = page.getByTestId(`edit-activity-${activityTitle}`);
    console.log(`Searching for button testid: "edit-activity-${activityTitle}"`);
    await expect(editButton).toBeVisible();
    // Scroll to center to avoid Sticky Header overlap (Critical for Mobile/Firefox)
    await editButton.evaluate((node: HTMLElement) => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await editButton.click({ force: true });
    
    await expect(page.getByRole('dialog')).toBeVisible();
    // Le formulaire charge les données via API (watch), donc peut prendre un instant
    await expect(page.getByLabel('Titre')).toHaveValue(activityTitle, { timeout: 10000 });
    
    await page.getByLabel('Titre').fill(activityTitleUpdated);
    
    // Wait for PUT
    const updatePromise = page.waitForResponse(res => res.url().includes('/api/activities') && res.request().method() === 'PUT' && res.status() === 200);
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await updatePromise;
    await expect(page.getByRole('dialog')).toBeHidden();

    // Verification Modif (Reload pour être sûr)
    await page.reload();
    await expect(page.getByText(activityTitleUpdated)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(activityTitle)).toBeHidden();

    // 4. Suppression
    // Setup dialog listener BEFORE clicking
    // Promisify dialog logic for robustness
    const deleteDialogPromise = new Promise<string>(resolve => {
        page.once('dialog', async dialog => {
            console.log(`Delete dialog: ${dialog.message()}`);
            resolve(dialog.message());
            await dialog.accept();
        });
    });
    
    // Trigger delete
    const deletePromise = page.waitForResponse(res => res.url().includes('/api/activities') && res.request().method() === 'DELETE' && (res.status() === 200 || res.status() === 204));
    await page.getByTestId(`delete-activity-${activityTitleUpdated}`).click();
    await deleteDialogPromise;
    await deletePromise;

    // Verification Suppression
    await page.reload();
    await expect(page.getByText(activityTitleUpdated)).toBeHidden({ timeout: 10000 });
  });

});
