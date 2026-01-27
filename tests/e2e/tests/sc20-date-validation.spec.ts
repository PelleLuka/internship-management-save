import { test, expect } from '@playwright/test';

test.describe('SC20 - Validation des Dates', () => {

  test('Accepte date début = date fin (Stage journée unique)', async ({ page }) => {
    // Données de test
    const today = new Date().toISOString().split('T')[0];
    const testUser = {
      firstName: 'OneDay',
      lastName: `Intern-${Date.now()}`,
      email: `oneday.${Date.now()}@test.com`,
      startDate: today,
      endDate: today // MÊME DATE
    };

    await page.goto('/');
    await page.getByRole('button', { name: 'Nouveau' }).click();

    await page.getByLabel('Prénom').fill(testUser.firstName);
    await page.getByLabel('Nom', { exact: true }).fill(testUser.lastName);
    await page.getByLabel('Email').fill(testUser.email);
    
    // Remplir les dates identiques
    await page.getByLabel('Date de début').fill(testUser.startDate);
    await page.getByLabel('Date de fin').fill(testUser.endDate);

    // Vérifier qu'AUCUNE erreur n'est affichée
    // Le message d'erreur est "La date de fin doit être égale ou postérieure..."
    await expect(page.getByText('égale ou postérieure')).toBeHidden();

    // Soumettre
    await page.getByRole('button', { name: 'Créer' }).click();

    // Vérifier création réussie (La modale se ferme, l'user apparaît)
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.getByText(`${testUser.firstName} ${testUser.lastName}`)).toBeVisible();
  });

  test('Refuse date fin < date début', async ({ page }) => {
    const testUser = {
      firstName: 'BadDates',
      lastName: 'Tester',
      email: 'bad.dates@test.com',
      startDate: '2024-02-02',
      endDate: '2024-02-01' // FIN AVANT DÉBUT
    };

    await page.goto('/');
    await page.getByRole('button', { name: 'Nouveau' }).click();

    await page.getByLabel('Date de début').fill(testUser.startDate);
    await page.getByLabel('Date de fin').fill(testUser.endDate);
    
    // Trigger validation (click create) ou interaction
    await page.getByRole('button', { name: 'Créer' }).click();

    // Vérifier le message d'erreur
    await expect(page.getByText('La date de fin doit être égale ou postérieure à la date de début.')).toBeVisible();
    
    // Vérifier que la modale est toujours ouverte
    await expect(page.getByRole('dialog')).toBeVisible();
  });

});
