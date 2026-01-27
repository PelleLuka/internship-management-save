import { test, expect } from '@playwright/test';

test.describe('SC17 - Tests aux Limites', () => {

  test('Longueur maximale des champs', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('button', { name: 'Nouveau' }).click();

    // Limite théorique : 50 caractères pour le prénom (selon frontend validation)
    const exactLimit = 'a'.repeat(50);
    const overLimit = 'a'.repeat(51);

    // 1. Tester la limite exacte (Devrait passer la validation locale)
    await page.getByLabel('Prénom').fill(exactLimit);
    // On vérifie qu'il n'y a PAS de message d'erreur rouge
    await expect(page.getByText('Le prénom ne doit pas dépasser')).toBeHidden();

    // 2. Tester le dépassement (Devrait échouer)
    await page.getByLabel('Prénom').fill(overLimit);
    await page.getByRole('button', { name: 'Créer' }).click(); // Trigger validation
    // On s'attend à un message d'erreur
    // Note: Le sélecteur dépend de votre implémentation précise des messages d'erreur
    await expect(page.getByText('Le prénom doit avoir entre 1 et 50 caractères.')).toBeVisible();
    
    // Le bouton Créer devrait être sans effet ou bloqué (si implémenté via disable)
    // Dans votre cas, il n'est pas disabled mais le click ne ferme pas la modale.
  });

});
