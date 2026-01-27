import { test, expect } from '@playwright/test';

test.describe('SC11 - Résilience Réseau', () => {

  test('Gérer une erreur serveur 500 lors de la création', async ({ page }) => {
    await page.goto('/');

    // 1. Intercepter la requête POST et simuler une erreur 500
    await page.route('**/api/internships', route => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Simulation Erreur Base de Données' })
        });
      } else {
        route.continue();
      }
    });

    // 2. Remplir le formulaire avec des données VALIDES
    await page.getByRole('button', { name: 'Nouveau' }).click();
    await page.getByLabel('Prénom').fill('Test');
    await page.getByLabel('Nom', { exact: true }).fill('NetworkError');
    await page.getByLabel('Email').fill('network@error.com');
    await page.getByLabel('Date de début').fill('2025-01-01');
    await page.getByLabel('Date de fin').fill('2025-12-31');
    
    // 3. Setup listener pour l'alerte (le frontend utilise window.alert dans le catch)
    let alertMessage = '';
    page.once('dialog', async dialog => {
        alertMessage = dialog.message();
        await dialog.accept();
    });

    // 4. Soumettre
    await page.getByRole('button', { name: 'Créer' }).click();
    
    // 5. Vérifications
    // On attend un peu que la promesse du submit se rejette et déclenche l'alerte
    await page.waitForTimeout(500); 

    // Vérifier que l'alerte a bien été déclenchée
    expect(alertMessage).toContain('Simulation Erreur Base de Données');

    // Vérifier que la modale est TOUJOURS ouverte (car échec)
    await expect(page.getByRole('dialog')).toBeVisible();

    // Vérifier que les données sont toujours là (pas de reset intempestif)
    await expect(page.getByLabel('Prénom')).toHaveValue('Test');
  });

});
