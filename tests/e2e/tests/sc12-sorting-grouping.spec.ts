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
    // 0. Setup: Créer 2 stagiaires
    await page.goto('/');
    
    // Création User A
    await page.getByRole('button', { name: 'Nouveau' }).click();
    await page.getByLabel('Prénom').fill(userA.firstName);
    await page.getByLabel('Nom', { exact: true }).fill(userA.lastName);
    await page.getByLabel('Email').fill(userA.email);
    await page.getByLabel('Date de début').fill(userA.startDate);
    await page.getByLabel('Date de fin').fill(userA.endDate);
    await page.getByRole('button', { name: 'Créer' }).click();

    // Création User Z
    await page.getByRole('button', { name: 'Nouveau' }).click();
    await page.getByLabel('Prénom').fill(userZ.firstName);
    await page.getByLabel('Nom', { exact: true }).fill(userZ.lastName);
    await page.getByLabel('Email').fill(userZ.email);
    await page.getByLabel('Date de début').fill(userZ.startDate);
    await page.getByLabel('Date de fin').fill(userZ.endDate);
    await page.getByRole('button', { name: 'Créer' }).click();

    // 1. Tri par Défaut (Date Descendant normalement)
    // Albert (Janvier) vs Zoe (Février). Zoe devrait être avant Albert si Date Desc.
    // On va forcer le tri pour être sûr.
    
    // 2. Tri par Prénom (A-Z) -> Albert avant Zoe
    await page.getByRole('combobox').selectOption('firstName');
    
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
