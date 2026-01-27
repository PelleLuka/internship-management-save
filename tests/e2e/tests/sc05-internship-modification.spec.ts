import { test, expect } from '@playwright/test';

test.describe('SC05 - Modification de Stagiaire', () => {

  const uniqueId = Date.now();
  const originalUser = {
    firstName: 'ToEdit',
    lastName: `User-${uniqueId}`,
    email: `edit.user.${uniqueId}@example.com`,
    startDate: '2025-02-01',
    endDate: '2025-07-31'
  };

  const modifiedUser = {
    firstName: 'Edited',
    lastName: 'Mod'
  };

  test('Modifier un stagiaire existant', async ({ page }) => {
    // Désactiver le cache pour éviter les données périmées (surtout Chrome)
    await page.setExtraHTTPHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });

    // 1. Pré-condition : Créer un stagiaire (via UI pour l'instant, plus tard via API si dispo)
    await page.goto('/');
    await page.getByRole('button', { name: 'Nouveau' }).click();
    await page.getByLabel('Prénom').fill(originalUser.firstName);
    await page.getByLabel('Nom', { exact: true }).fill(originalUser.lastName);
    await page.getByLabel('Email').fill(originalUser.email);
    await page.getByLabel('Date de début').fill(originalUser.startDate);
    await page.getByLabel('Date de fin').fill(originalUser.endDate);
    await page.getByRole('button', { name: 'Créer' }).click();

    // Vérifier qu'il est créé
    const fullNameOriginal = `${originalUser.firstName} ${originalUser.lastName}`;
    
    // Mobile Check: Ouvrir la recherche si masquee
    const searchInput = page.getByPlaceholder('Rechercher...');
    if (!await searchInput.isVisible()) {
        const toggleBtn = page.getByRole('button', { name: 'Rechercher' }); // L'icone loupe mobile
        if (await toggleBtn.isVisible()) {
            await toggleBtn.click();
            await page.waitForTimeout(500); // Wait for transition
            await searchInput.waitFor({ state: 'visible' });
        }
    }
    await searchInput.fill(originalUser.email);
    await expect(page.getByRole('heading', { name: fullNameOriginal })).toBeVisible();

    // 2. Ouvrir la modale d'édition
    // C'est ici que l'aria-label devient utile
    // On doit peut-être attendre un peu ou scroller, mais avec le filtre recherche il devrait être là
    await page.getByRole('button', { name: `Modifier ${fullNameOriginal}` }).click();

    // 3. Modifier les champs
    // Vérifier que les champs sont pré-remplis (C'est aussi un test de lecture)
    await expect(page.getByLabel('Prénom')).toHaveValue(originalUser.firstName);
    await expect(page.getByLabel('Email')).toHaveValue(originalUser.email);

    // Appliquer modifs
    await page.getByLabel('Prénom').fill(modifiedUser.firstName);
    await page.getByLabel('Nom', { exact: true }).fill(modifiedUser.lastName);
    
    // 4. Sauvegarder
    // On attend la réponse du serveur (PUT)
    const updatePromise = page.waitForResponse(response => 
      response.url().includes('/api/internships') && 
      response.request().method() === 'PUT' &&
      response.status() === 200
    );
    await page.getByRole('button', { name: 'Mettre à jour' }).click();
    await updatePromise;
    await expect(page.getByRole('dialog')).toBeHidden();

    // 5. Vérifier la mise à jour
    // Pour éviter les problèmes de rafraîchissement client, on recharge la page
    await page.reload();
    
    // On doit remettre le filtre car le reload l'a effacé
    await page.getByPlaceholder('Rechercher...').fill(originalUser.email);
    await page.getByPlaceholder('Rechercher...').press('Enter');
    
    const fullNameModified = `${modifiedUser.firstName} ${modifiedUser.lastName}`;
    await expect(page.getByRole('heading', { name: fullNameModified })).toBeVisible({ timeout: 15000 });
  });

});
