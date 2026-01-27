import { test, expect } from '@playwright/test';

test.describe('SC13 - État du Formulaire', () => {

  test('Vérifier la remise à zéro du formulaire après fermeture', async ({ page }) => {
    await page.goto('/');

    // 1. Ouvrir et Remplir partiellement
    await page.getByRole('button', { name: 'Nouveau' }).click();
    await page.getByLabel('Prénom').fill('DirtyData');
    await page.getByLabel('Nom', { exact: true }).fill('ShouldBeGone');
    
    // 2. Annuler (Fermer)
    await page.getByRole('button', { name: 'Annuler' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();

    // 3. Rouvrir
    await page.getByRole('button', { name: 'Nouveau' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // 4. Vérifier que c'est vide
    await expect(page.getByLabel('Prénom')).toBeEmpty();
    await expect(page.getByLabel('Nom', { exact: true })).toBeEmpty();
  });

});
