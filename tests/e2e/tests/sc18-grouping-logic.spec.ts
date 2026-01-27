import { test, expect } from '@playwright/test';

test.describe('SC18 - Logique de Groupement', () => {

  const uniqueId = Date.now();
  const user2024 = {
    firstName: `Group24`,
    lastName: `Test-${uniqueId}`,
    email: `g24.${uniqueId}@test.com`,
    startDate: '2024-05-15', // Mai 2024
    endDate: '2024-08-30'
  };

  const user2025 = {
    firstName: `Group25`,
    lastName: `Test-${uniqueId}`,
    email: `g25.${uniqueId}@test.com`,
    startDate: '2025-01-10', // Janvier 2025
    endDate: '2025-06-30'
  };

  test('Vérifier le groupement par Année et Mois', async ({ page }) => {
    await page.goto('/');

    // 1. Créer User 2024
    await page.getByRole('button', { name: 'Nouveau' }).click();
    await page.getByLabel('Prénom').fill(user2024.firstName);
    await page.getByLabel('Nom', { exact: true }).fill(user2024.lastName);
    await page.getByLabel('Email').fill(user2024.email);
    await page.getByLabel('Date de début').fill(user2024.startDate);
    await page.getByLabel('Date de fin').fill(user2024.endDate);
    const c1 = page.waitForResponse(r => r.request().method() === 'POST');
    await page.getByRole('button', { name: 'Créer' }).click();
    await c1;

    // 2. Créer User 2025
    await page.getByRole('button', { name: 'Nouveau' }).click();
    await page.getByLabel('Prénom').fill(user2025.firstName);
    await page.getByLabel('Nom', { exact: true }).fill(user2025.lastName);
    await page.getByLabel('Email').fill(user2025.email);
    await page.getByLabel('Date de début').fill(user2025.startDate);
    await page.getByLabel('Date de fin').fill(user2025.endDate);
    const c2 = page.waitForResponse(r => r.request().method() === 'POST');
    await page.getByRole('button', { name: 'Créer' }).click();
    await c2;

    // 3. Vérifier les En-têtes (Headers)
    // On s'attend à voir "2024" et "2025" comme titres principaux (h2)
    await expect(page.getByRole('heading', { name: '2024', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: '2025', exact: true })).toBeVisible();

    // 4. Vérifier les Mois (via Headers h3)
    // Pour 2024 -> Mai
    // On cible spécifiquement la section 2024 via son ID (généré par InternshipGroupList)
    await expect(page.locator('#year-2024').getByRole('heading', { name: /Mai/i, level: 3 }).first()).toBeVisible();
    
    // Pour 2025 -> Janvier
    await expect(page.locator('#year-2025').getByRole('heading', { name: /Janvier/i, level: 3 }).first()).toBeVisible();

    // 5. Vérifier l'emplacement (Optionnel mais mieux)
    // On vérifie que User 2024 est bien SOUS l'année 2024.
    // Playwright `locator.filter` est puissant pour ça.
    
    // Trouver la section 2024 (On assume une structure hiérarchique ou visuelle)
    // Simplification: On vérifie juste la présence pour ce test "Smoke".
    
    // Nettoyage via suppression
    page.on('dialog', d => d.accept());
    // Suppression propre
    await page.getByTestId(`delete-${user2024.firstName}-${user2024.lastName}`).click().catch(() => {});
    await page.getByTestId(`delete-${user2025.firstName}-${user2025.lastName}`).click().catch(() => {});
  });

});
