import { test, expect } from '@playwright/test';

test.describe('SC12 - Tri et Groupement', () => {

  const uniqueId = Date.now();
  const userA = {
    firstName: `Albert`,
    lastName: `SortTest-${uniqueId}`,
    email: `albert.${uniqueId}@test.com`,
    startDate: '2025-01-01', // Janvier
    endDate: '2025-06-30'
  };
  
  const userZ = {
    firstName: `Zoe`,
    lastName: `SortTest-${uniqueId}`,
    email: `zoe.${uniqueId}@test.com`,
    startDate: '2025-02-01', // Février
    endDate: '2025-06-30'
  };

  test('Vérifier le tri de la liste', async ({ page }) => {
    // test.skip(true, 'Sorting flaky on parallel runs');
    // 0. Setup: Créer 2 stagiaires
    await page.goto('/');
    
    // ... (rest of setup)

    // 2. Tri par Prénom (A-Z) -> Albert avant Zoe
    // Ajout d'un filtre préalable pour isoler les tests (sinon noyés)
    await page.getByPlaceholder('Rechercher...').fill(`SortTest-${uniqueId}`);
    await page.waitForTimeout(1000); // Wait for search
    
    await page.getByRole('combobox').selectOption('firstName');
    await page.waitForTimeout(2500); // Wait for sort (Debounce 300ms + Fetch + Render)
    
    // On vérifie l'ordre dans le DOM
    // On récupère tous les titres de cartes qui contiennent "SortTest"
    const titles = page.getByRole('heading', { level: 3 }).filter({ hasText: `SortTest-${uniqueId}` });
    
    // On attend que le tri se fasse
    await expect(titles.first()).toContainText('Albert');
    await expect(titles.nth(1)).toContainText('Zoe');

    // 3. Tri par Date (Récent -> Ancien) -> Zoe (Fev) avant Albert (Jan)
    await page.getByRole('combobox').selectOption('dateDesc');
    await expect(titles.first()).toContainText('Zoe');
    await expect(titles.nth(1)).toContainText('Albert');

    // Nettoyage
    page.on('dialog', dialog => dialog.accept());
    // On supprime les deux (le filtre search peut aider à les isoler pour le click)
    await page.getByPlaceholder('Rechercher...').fill(`SortTest-${uniqueId}`);
    await page.getByTestId(`delete-${userA.firstName}-${userA.lastName}`).click().catch(() => page.getByLabel(`Supprimer ${userA.firstName} ${userA.lastName}`).click());
    await page.getByTestId(`delete-${userZ.firstName}-${userZ.lastName}`).click().catch(() => page.getByLabel(`Supprimer ${userZ.firstName} ${userZ.lastName}`).click());
  });

});
