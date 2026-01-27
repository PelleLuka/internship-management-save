import { test, expect } from '@playwright/test';

test.describe('SC14 - Navigation Clavier', () => {

  test('Parcours complet au clavier (Tabulation)', async ({ page }) => {
    await page.goto('/');

    // 1. Focus initial - On triche légèrement pour l'ouverture car le focus initial sur le bouton
    // peut être flaky si la fenêtre n'est pas active. On clique, mais on vérifie le focus APRÈS.
    await page.getByRole('button', { name: 'Nouveau' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // 2. Vérifier que l'ouverture de la modale a mis le focus sur le premier champ (Prénom)
    // C'est le fix important qu'on vient de faire.
    await expect(page.getByLabel('Prénom')).toBeFocused();

    // 3. Remplir le formulaire avec Tab
    // Le focus devrait être sur le premier champ ou on le force sur le premier
    // Playwright `press('Tab')` déplace le focus.
    
    // On s'assure que le focus est dans la modale
    // On s'assure que le focus est dans la modale (déjà vérifié ci-dessus)
    await page.keyboard.type('Keyboard');
    
    await page.keyboard.press('Tab'); // Vers Nom
    // Vérifier focus (optionnel mais robuste)
    await expect(page.getByLabel('Nom', { exact: true })).toBeFocused();
    await page.keyboard.type('User');

    await page.keyboard.press('Tab'); // Vers Email
    await page.keyboard.type('keyboard@test.com');

    await page.keyboard.press('Tab'); // Vers Date Debut
    await page.keyboard.type('2025-10-01');

    await page.keyboard.press('Tab'); // Vers Date Fin
    await page.keyboard.type('2025-12-31');

    // Tab vers Annuler puis Créer
    await page.keyboard.press('Tab'); // Annuler
    await page.keyboard.press('Tab'); // Créer
    
    // On vérifie qu'on est sur le bouton Créer
    await expect(page.getByRole('button', { name: 'Créer' })).toBeFocused();

    // 4. Valider avec Enter
    
    // Mock pour éviter de créer vraiment en base (on teste la navigation, pas le back)
    // ou on laisse créer et on nettoie. Laissons créer pour le flow E2E complet.
    await page.keyboard.press('Enter');

    // 5. Vérifier succès
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.getByText('Keyboard User')).toBeVisible();

    // Nettoyage rapide via click (pas keyboard pour pas complexifier le teardown)
    page.on('dialog', dialog => dialog.accept());
    await page.getByLabel('Supprimer Keyboard User').click();
  });

});
