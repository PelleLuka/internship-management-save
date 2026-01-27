import { test, expect } from '@playwright/test';

test.describe('SC10 - Recherche Stagiaire', () => {

  const uniqueId = Date.now();
  const testUser = {
    firstName: `Searchable`,
    lastName: `User-${uniqueId}`,
    email: `search.${uniqueId}@test.com`,
    startDate: '2025-09-01',
    endDate: '2026-06-30'
  };

  test('Filtrer la liste des stagiaires', async ({ page }) => {
    // 1. Créer un stagiaire unique pour le test
    await page.goto('/');
    await page.getByRole('button', { name: 'Nouveau' }).click();
    await page.getByLabel('Prénom').fill(testUser.firstName);
    await page.getByLabel('Nom', { exact: true }).fill(testUser.lastName);
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Date de début').fill(testUser.startDate);
    await page.getByLabel('Date de fin').fill(testUser.endDate);
    
    // Attendre la création
    const createResponse = page.waitForResponse(res => res.url().includes('/api/internships') && res.request().method() === 'POST' && res.status() === 201);
    await page.getByRole('button', { name: 'Créer' }).click();
    await createResponse;

    // 2. Recherche Positive
    await page.getByPlaceholder('Rechercher...').fill(testUser.lastName);
    // Attente implicite que la liste se mette à jour (Vue reactivity)
    await expect(page.getByText(testUser.lastName)).toBeVisible();
    
    // Vérifier que d'autres éléments ne sont PAS visibles (si possible, mais difficile sans connaître le dataset)
    // On peut vérifier le compteur si disponible, ou s'assurer qu'au moins 1 élément est là.

    // 3. Recherche Négative (Aucun résultat)
    const impossibleName = "XylophoneZeroResultXYZ";
    await page.getByPlaceholder('Rechercher...').fill(impossibleName);
    
    // Il ne doit plus y avoir de cartes
    // Le code Vue n'affiche pas de message "Aucun résultat", donc on vérifie juste que notre user est caché
    await expect(page.getByText(testUser.lastName)).toBeHidden();

    // 4. Reset Recherche
    await page.getByPlaceholder('Rechercher...').clear();
    await expect(page.getByText(testUser.lastName)).toBeVisible();

    // Nettoyage (Suppression)
    page.on('dialog', dialog => dialog.accept());
    await page.getByLabel(`Supprimer ${testUser.firstName} ${testUser.lastName}`).click();
  });

});
