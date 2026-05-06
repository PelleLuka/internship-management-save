import { expect, test } from '@playwright/test';

test.describe('SC04 - Validation (Erreurs) Stagiaire', () => {
  const uniqueId = Date.now();
  const invalidUser = {
    firstName: 'Invalid',
    lastName: `User-${uniqueId}`,
    email: `invalidemail${uniqueId}`, // EMAIL INVALIDE (pas de @ ni domaine)
    startDate: '2099-01-01',
    endDate: '2025-07-01', // FIN AVANT DÉBUT
  };

  test("Vérifier les messages d'erreur et la validation", async ({ page }) => {
    await page.goto('/');

    // 1. Ouvrir la modale
    await page.getByRole('button', { name: 'Nouveau' }).click();

    // 2. Soumettre vide -> Validation Frontend
    // Avec novalidate, on s'attend à nos messages rouges, pas d'infobulle navigateur
    await page.getByRole('button', { name: 'Créer' }).click();

    // Attendre que la validation se déclenche
    await page.waitForTimeout(500);

    // Vérification des messages d'erreur personnalisés (utiliser role="alert" pour plus de robustesse)
    await expect(
      page
        .getByRole('alert')
        .filter({ hasText: 'Le prénom doit avoir entre 1 et 50 caractères.' }),
    ).toBeVisible();
    await expect(
      page
        .getByRole('alert')
        .filter({ hasText: 'Le nom doit avoir entre 1 et 50 caractères.' }),
    ).toBeVisible();
    await expect(
      page
        .getByRole('alert')
        .filter({ hasText: 'Veuillez entrer une adresse email valide.' }),
    ).toBeVisible();
    await expect(
      page
        .getByRole('alert')
        .filter({ hasText: 'La date de début est requise.' }),
    ).toBeVisible();
    await expect(
      page
        .getByRole('alert')
        .filter({ hasText: 'La date de fin est requise.' }),
    ).toBeVisible();

    // 3. Validation Logique (Dates Incohérentes) et Email
    await page.getByLabel('Prénom').fill(invalidUser.firstName);
    await page.getByLabel('Nom', { exact: true }).fill(invalidUser.lastName);
    await page.getByLabel('Email').fill(invalidUser.email); // email invalide
    await page.getByLabel('Date de début').fill(invalidUser.startDate); // start > end
    await page.getByLabel('Date de fin').fill(invalidUser.endDate);

    await page.getByRole('button', { name: 'Créer' }).click();

    // Attendre que la validation se déclenche
    await page.waitForTimeout(500);

    // Vérifier erreur email spécifique
    await expect(
      page
        .getByRole('alert')
        .filter({ hasText: 'Veuillez entrer une adresse email valide.' }),
    ).toBeVisible();

    // Vérifier erreur date
    await expect(
      page.getByRole('alert').filter({
        hasText:
          'La date de fin doit être égale ou postérieure à la date de début.',
      }),
    ).toBeVisible();

    // 4. La modale doit toujours être visible (pas de fermeture)
    await expect(page.getByRole('dialog')).toBeVisible();

    // 5. Fermer
    await page.getByRole('button', { name: 'Annuler' }).click();
  });
});
