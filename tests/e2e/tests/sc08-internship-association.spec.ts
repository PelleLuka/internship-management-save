import { test, expect } from '@playwright/test';

test.describe('SC08 - Association Stage-Activité', () => {

  const uniqueId = Date.now();
  const internLastName = `AssocTest-${uniqueId}`;
  const activityTitle = `Tennis-${uniqueId}`;

  test('Associer une activité à un stagiaire', async ({ page }) => {
    // 1. Setup: Créer un stagiaire et une activité via API (plus rapide) ou UI
    // On utilise l'UI pour la consistance E2E
    
    // Create Activity
    await page.goto('/activities');
    await page.getByRole('button', { name: 'Nouvelle Activité' }).click();
    await page.getByLabel('Titre').fill(activityTitle);
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    
    // Create Intern
    await page.goto('/internships');
    await page.getByRole('button', { name: 'Nouveau' }).click();
    await page.getByLabel('Prénom').fill('John');
    await page.getByLabel('Nom', { exact: true }).fill(internLastName);
    await page.getByLabel('Email').fill(`john.${uniqueId}@test.com`);
    await page.getByLabel('Date de début').fill('2025-01-01');
    await page.getByLabel('Date de fin').fill('2025-06-01');
    await page.getByRole('button', { name: 'Créer' }).click();

    // 2. Association
    // Rechercher le stagiaire
    await page.reload(); // Ensure list is fresh
    await page.getByPlaceholder('Rechercher...').fill(internLastName);
    await page.waitForTimeout(500); // Debounce search
    
    // Expand card (Click on header/name)
    const card = page.locator('.bg-white.rounded-xl', { hasText: internLastName }).first();
    await card.click();
    
    // Verify Expanded area visible
    await expect(page.getByText('Ajouter une activité')).toBeVisible();
    
    // Open Menu
    await page.getByRole('button', { name: 'Ajouter une activité' }).click();
    
    // Select Activity
    await page.getByRole('button', { name: activityTitle }).click();
    
    // Save
    // Button text contains "Valider (1)"
    await page.getByRole('button', { name: /Valider/ }).click();
    
    // 3. Verification
    // Verify tag is visible in the activity list of the card
    await expect(card.getByText(activityTitle)).toBeVisible();
  });

});
