import { expect, test } from '@playwright/test';

test.describe('SC08 - Association Stage-Activité', () => {
  const uniqueId = Date.now();
  const internLastName = `AssocTest-${uniqueId}`;
  const activityTitle = `Tennis-${uniqueId}`;

  test('Associer une activité à un stagiaire', async ({ page }) => {
    test.setTimeout(60000);

    // --- CREATE ACTIVITY ---
    await page.goto('/activities');
    await page.getByRole('button', { name: 'Nouvelle Activité' }).click();
    await page.getByLabel('Titre').fill(activityTitle);
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    // Attendre que la création soit confirmée (ex: retour à la liste ou toast)
    await expect(page.getByText(activityTitle)).toBeVisible();

    // --- CREATE INTERN ---
    await page.goto('/internships');
    await page.getByRole('button', { name: 'Nouveau' }).click();
    await page.getByLabel('Prénom').fill('John');
    await page.getByLabel('Nom', { exact: true }).fill(internLastName);
    await page.getByLabel('Email').fill(`john.${uniqueId}@test.com`);
    await page.getByLabel('Date de début').fill('2099-01-01');
    await page.getByLabel('Date de fin').fill('2100-01-01');
    await page.getByRole('button', { name: 'Créer' }).click();

    // --- ASSOCIATION ---
    await page.reload();

    // Identifier la carte du stagiaire
    const card = page
      .locator('.bg-white.rounded-xl', { hasText: internLastName })
      .first();
    await card.scrollIntoViewIfNeeded();
    await card.click();

    // Ouvrir le menu d'ajout
    const openMenuBtn = card.getByRole('button', {
      name: 'Ajouter une activité',
    });
    await expect(openMenuBtn).toBeVisible();
    await openMenuBtn.click();

    // Sélectionner l'activité dans la liste déroulante/modal
    // On utilise filter pour être sûr de cliquer sur le bouton de la liste
    const activityItem = page.getByRole('button', {
      name: activityTitle,
      exact: true,
    });
    await activityItem.click();

    // Cibler le bouton de validation final (celui avec le compteur, ex: "Ajouter (1)")
    // La regex /Ajouter \(\d+\)/ évite de cliquer sur le bouton "Ajouter une activité"
    const validateBtn = page.getByRole('button', { name: /Ajouter \(\d+\)/ });

    // Attendre que le bouton soit cliquable (qu'il ne soit plus 'disabled')
    await expect(validateBtn).toBeEnabled({ timeout: 5000 });
    await validateBtn.click();

    // --- VERIFICATION ---
    // On vérifie que le TAG (span) est présent dans la carte.
    // On spécifie 'span' pour ne pas confondre avec le bouton de sélection
    const successTag = card.locator('span').filter({ hasText: activityTitle });
    await expect(successTag).toBeVisible({ timeout: 10000 });
  });
});
