import { test, expect } from '@playwright/test';

test.describe('SC19 - Validation Exhaustive des Champs', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // --- STAGIAIRES ---

  test('Validation Prénom/Nom (Limites 1-50)', async ({ page }) => {
    await page.getByRole('button', { name: 'Nouveau' }).click();

    // 1. Vide (Invalide)
    await page.getByLabel('Prénom').fill('');
    await page.getByRole('button', { name: 'Créer' }).click();
    await expect(page.getByText('Le prénom doit avoir entre 1 et 50 caractères.')).toBeVisible();

    // 2. 1 Caractère (Valide)
    await page.getByLabel('Prénom').fill('A');
    await expect(page.getByText('Le prénom doit avoir entre 1 et 50 caractères.')).toBeHidden();

    // 3. 50 Caractères (Valide)
    const exactLimit = 'a'.repeat(50);
    await page.getByLabel('Prénom').fill(exactLimit);
    await expect(page.getByText('Le prénom doit avoir entre 1 et 50 caractères.')).toBeHidden();

    // 4. 51 Caractères (Invalide)
    const overLimit = 'a'.repeat(51);
    await page.getByLabel('Prénom').fill(overLimit);
    await page.getByRole('button', { name: 'Créer' }).click();
    await expect(page.getByText('Le prénom doit avoir entre 1 et 50 caractères.')).toBeVisible();
  });

  test('Validation Email (Formats)', async ({ page }) => {
    await page.getByRole('button', { name: 'Nouveau' }).click();
    
    const invalidEmails = ['plainaddress', '#@%^%#$@#$@#.com', '@example.com', 'Joe Smith <email@example.com>', 'email.example.com', 'email@example@example.com'];
    
    for (const email of invalidEmails) {
        await page.getByLabel('Email').fill(email);
        await page.getByRole('button', { name: 'Créer' }).click();
        await expect(page.getByText('Veuillez entrer une adresse email valide.')).toBeVisible();
    }

    const validEmails = ['email@example.com', 'firstname.lastname@example.com', 'email@subdomain.example.com', '1234567890@example.com'];
    
    for (const email of validEmails) {
        await page.getByLabel('Email').fill(email);
        // On check juste que le message d'erreur disparait/n'est pas là
        // Note: Cela nécessite que les autres champs ne bloquent pas ou qu'on check juste l'absence erreur email
        await expect(page.getByText('Veuillez entrer une adresse email valide.')).toBeHidden();
    }
  });

  test('Validation Dates (Logique)', async ({ page }) => {
    await page.getByRole('button', { name: 'Nouveau' }).click();

    // Cas: Fin AVANT Début (Invalide)
    await page.getByLabel('Date de début').fill('2025-06-01');
    await page.getByLabel('Date de fin').fill('2025-01-01');
    await page.getByRole('button', { name: 'Créer' }).click();
    
    await expect(page.getByText('La date de fin doit être égale ou postérieure à la date de début.')).toBeVisible();

    // Cas: Fin == Début (Valide)
    await page.getByLabel('Date de fin').fill('2025-06-01');
    await expect(page.getByText('La date de fin doit être égale ou postérieure à la date de début.')).toBeHidden();
  });


  // --- ACTIVITÉS ---

  test('Validation Titre Activité (Limites 3-100)', async ({ page }) => {
    await page.goto('/activities');
    await page.getByRole('button', { name: 'Nouvelle Activité' }).click();

    // 1. Vide (Invalide)
    await page.getByLabel('Titre').fill('');
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await expect(page.getByText('Le titre doit avoir entre 3 et 100 caractères.')).toBeVisible();

    // 2. 2 Caractères (Invalide - Min 3)
    await page.getByLabel('Titre').fill('AB');
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await expect(page.getByText('Le titre doit avoir entre 3 et 100 caractères.')).toBeVisible({ timeout: 1000 });

    // 3. 3 Caractères (Valide)
    await page.getByLabel('Titre').fill('ABC');
    await expect(page.getByText('Le titre doit avoir entre 3 et 100 caractères.')).toBeHidden();

    // 4. 100 Caractères (Valide)
    const exactLimit = 'a'.repeat(100);
    await page.getByLabel('Titre').fill(exactLimit);
    await expect(page.getByText('Le titre doit avoir entre 3 et 100 caractères.')).toBeHidden();

    // 5. 101 Caractères (Invalide)
    const overLimit = 'a'.repeat(101);
    await page.getByLabel('Titre').fill(overLimit);
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await expect(page.getByText('Le titre doit avoir entre 3 et 100 caractères.')).toBeVisible();
  });

});
