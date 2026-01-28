import { test, expect } from '@playwright/test';

test.describe('SC03 - Création de Stagiaire (Happy Path)', () => {

  const testUser = {
    firstName: 'Jean',
    lastName: `Dupont-Test-${Date.now()}`,
    email: `jean.dupont.${Date.now()}@example.com`,
    startDate: '2099-01-01',
    endDate: '2025-06-30'
  };

  test('Créer un nouveau stagiaire avec succès', async ({ page }) => {
    // 1. Ouvrir l'application
    await page.goto('/');

    // 2. Ouvrir la modale de création
    await page.getByRole('button', { name: 'Nouveau' }).click();

    // 3. Remplir le formulaire
    await page.getByLabel('Prénom').fill(testUser.firstName);
    await page.getByLabel('Nom', { exact: true }).fill(testUser.lastName);
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Date de début').fill(testUser.startDate);
    await page.getByLabel('Date de fin').fill(testUser.endDate);

    // 4. Soumettre
    await page.getByRole('button', { name: 'Créer' }).click();

    // 5. Vérifier la présence dans la liste
    // On cherche le texte du nom complet
    const fullName = `${testUser.firstName} ${testUser.lastName}`;
    await expect(page.getByText(fullName)).toBeVisible();

    // Nettoyage (Optionnel mais recommandé si on ne reset pas la DB)
    // On supprime le stagiaire créé pour ne pas polluer
    if (await page.getByText(fullName).isVisible()) {
        // En mode carte, il faut souvent développer la carte ou trouver le bouton poubelle associé
        // Dans InternshipDashboard, le bouton poubelle est visible au survol ou en mobile
        // Pour faire simple, on filtre la liste pour ne voir que lui
        await page.getByPlaceholder('Rechercher...').fill(testUser.email);
        await expect(page.getByText(fullName)).toBeVisible();
        
        // On clique sur le bouton supprimer de la carte visible (Trash2 icon)
        // On cible le bouton qui contient l'icone de suppression
        // Note: Dans le code source, le bouton delete a une classe `text-red-600`
        // Pour cet exercice, on va commenter le nettoyage automatique car le SC06 (Suppression) le testera mieux.
        // await page.locator('.text-red-600').first().click(); 
    }
  });

});
