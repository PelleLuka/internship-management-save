import { test, expect } from '@playwright/test';

test.describe('SC06 - Suppression de Stagiaire', () => {

  const uniqueId = Date.now();
  const testUser = {
    firstName: 'ToDelete',
    lastName: `User-${uniqueId}`,
    email: `delete.user.${uniqueId}@example.com`,
    startDate: '2099-01-01',
    endDate: '2025-07-31'
  };

  test('Supprimer un stagiaire existant', async ({ page }) => {
    // 0. Désactiver le cache API (Bonne pratique établie en SC04)
    await page.setExtraHTTPHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });

    // 1. Pré-condition : Créer un stagiaire
    await page.goto('/');
    await page.getByRole('button', { name: 'Nouveau' }).click();
    await page.getByLabel('Prénom').fill(testUser.firstName);
    await page.getByLabel('Nom', { exact: true }).fill(testUser.lastName);
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Date de début').fill(testUser.startDate);
    await page.getByLabel('Date de fin').fill(testUser.endDate);
    
    // Attendre la création pour être sûr
    const createPromise = page.waitForResponse(res => res.url().includes('/api/internships') && res.request().method() === 'POST' && res.status() === 201);
    await page.getByRole('button', { name: 'Créer' }).click();
    await createPromise;

    // Vérifier présence
    const fullName = `${testUser.firstName} ${testUser.lastName}`;
    await page.getByPlaceholder('Rechercher...').fill(testUser.email);
    await page.getByPlaceholder('Rechercher...').press('Enter');
    await expect(page.getByText(fullName)).toBeVisible();

    // 2. Supprimer le stagiaire
    // Setup du listener pour la boite de dialogue (window.confirm)
    page.once('dialog', dialog => {
      dialog.accept();
    });

    // Attendre la requête DELETE pour robustesse
    const deletePromise = page.waitForResponse(res => 
      res.url().includes('/api/internships') && 
      res.request().method() === 'DELETE' && 
      (res.status() === 200 || res.status() === 204)
    );

    // Clic sur bouton poubelle
    // Utilisation de l'aria-label mis en place précédemment
    await page.getByRole('button', { name: `Supprimer ${fullName}` }).click();

    // Attendre la fin du DELETE
    await deletePromise;

    // 3. Vérifier la disparition
    // On recharge pour être sûr (State Backend)
    await page.reload();
    await page.getByPlaceholder('Rechercher...').fill(testUser.email);
    await page.getByPlaceholder('Rechercher...').press('Enter');
    
    await expect(page.getByText(fullName)).toBeHidden({ timeout: 15000 });
  });

});
