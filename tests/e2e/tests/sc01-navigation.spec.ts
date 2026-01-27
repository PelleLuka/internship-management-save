import { test, expect } from '@playwright/test';

test.describe('SC01 - Navigation & Affichage', () => {

  test('Redirection Accueil vers Internships', async ({ page }) => {
    // 1. Ouvrir la page d'accueil
    await page.goto('/');

    // 2. Vérifier la redirection automatique
    // L'application doit rediriger "/" vers "/internships"
    await expect(page).toHaveURL(/.*\/internships/);

    // 3. Vérifier le titre de la page pour être sûr qu'on est au bon endroit
    await expect(page.getByRole('heading', { name: 'Stagiaires' })).toBeVisible();
  });

  test('Navigation Menu Latéral', async ({ page }) => {
    await page.goto('/internships');

    // 1. Ouvrir le menu si on est sur mobile (le bouton est visible)
    const menuButton = page.getByRole('button', { name: 'Ouvrir le menu' });
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }

    // 2. Cliquer sur le lien "Activités" dans la sidebar
    await page.getByRole('link', { name: 'Activités' }).click();

    // 2. Vérifier l'URL et le titre
    await expect(page).toHaveURL(/.*\/activities/);
    await expect(page.getByRole('heading', { name: 'Activités' })).toBeVisible();

    // 3. Revenir sur "Stagiaires"
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }
    await page.getByRole('link', { name: 'Stagiaires' }).click();
    
    // 4. Vérifier le retour
    await expect(page).toHaveURL(/.*\/internships/);
    await expect(page.getByRole('heading', { name: 'Stagiaires' })).toBeVisible();
  });

});
