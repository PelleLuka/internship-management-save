import { test, expect } from '@playwright/test';

test.describe('SC09 - Dissociation Stage-Activité', () => {

  const uniqueId = Date.now();
  const internLastName = `DissocTest-${uniqueId}`;
  const activityTitle = `PingPong-${uniqueId}`;

  test('Dissocier une activité d\'un stagiaire', async ({ page }) => {
    // 1. Setup: Créer Intern + Activity + Association via UI
    
    // Create Activity
    await page.goto('/activities');
    await page.getByRole('button', { name: 'Nouvelle Activité' }).click();
    await page.getByLabel('Titre').fill(activityTitle);
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    
    // Create Intern
    await page.goto('/internships');
    await page.getByRole('button', { name: 'Nouveau' }).click();
    await page.getByLabel('Prénom').fill('Jane');
    await page.getByLabel('Nom', { exact: true }).fill(internLastName);
    await page.getByLabel('Email').fill(`jane.${uniqueId}@test.com`);
    await page.getByLabel('Date de début').fill('2025-01-01');
    await page.getByLabel('Date de fin').fill('2025-06-01');
    await page.getByRole('button', { name: 'Créer' }).click();

    // Associate
    await page.reload();
    await page.getByPlaceholder('Rechercher...').fill(internLastName);
    await page.waitForTimeout(500);
    const card = page.locator('.bg-white.rounded-xl', { hasText: internLastName }).first();
    await card.click();
    await page.getByRole('button', { name: 'Ajouter une activité' }).click();
    await page.getByRole('button', { name: activityTitle }).click();
    await page.getByRole('button', { name: /Valider/ }).click();
    await expect(card.getByText(activityTitle)).toBeVisible();

    // 2. Dissociation
    // Le bouton de suppression apparaît au survol de l'activité (opacity-0)
    // Select the tag containing the title
    const tag = card.locator('span.inline-flex', { hasText: activityTitle });
    
    // Setup dialog listener
    page.once('dialog', dialog => dialog.accept());
    
    // Click the X button inside the tag
    // title="Retirer l'activité"
    const removeButton = tag.getByTitle("Retirer l'activité");
    
    // Force click because of opacity-0
    await removeButton.click({ force: true });
    
    // 3. Verification
    await expect(card.getByText(activityTitle)).toBeHidden();
    await expect(card.getByText('Aucune activité')).toBeVisible();
  });

});
