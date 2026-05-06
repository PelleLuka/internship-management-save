import { expect, test } from '@playwright/test';

test.describe('SC20 - Mise à jour avec Carte Étendue', () => {
  test('Les activités doivent rester visibles après modification', async ({
    page,
  }) => {
    test.setTimeout(60000);
    // 1. Ouvrir page activité
    await page.goto('/activities');
    await page.getByRole('button', { name: 'Nouvelle Activité' }).click();
    const activityTitle = `Act-Persist-${Date.now()}`;
    await page.getByLabel('Titre').fill(activityTitle);
    await page.getByRole('button', { name: 'Enregistrer' }).click();

    // 2. Créer un stagiaire
    await page.goto('/');
    await page.getByRole('button', { name: 'Nouveau' }).click();
    const uniqueId = Date.now();
    const user = {
      firstName: 'Persist',
      lastName: `User-${uniqueId}`,
      email: `persist.${uniqueId}@test.com`,
      startDate: '2099-01-01',
      endDate: '2100-06-01',
    };
    await page.getByLabel('Prénom').fill(user.firstName);
    await page.getByLabel('Nom', { exact: true }).fill(user.lastName);
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Date de début').fill(user.startDate);
    await page.getByLabel('Date de fin').fill(user.endDate);
    await page.getByRole('button', { name: 'Créer' }).click();

    // 3. Déplier la carte (premier de liste grâce à 2099)
    const cardHeader = page
      .getByText(`${user.firstName} ${user.lastName}`)
      .first();
    await expect(cardHeader).toBeVisible();

    // Click sur le header pour déplier (le parent clickable)
    await cardHeader.click();

    // 4. Ajouter l'activité
    // Il faut probablement attendre l'expansion
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Ajouter une activité' }).click();
    // Select Activity with Retry Logic
    const activityButton = page.getByRole('button', { name: activityTitle });
    await activityButton.click();

    // Wait for "Ajouter (N)" button to appear
    const validateBtn = page.getByRole('button', { name: /Ajouter \(\d+\)/ });
    try {
      await validateBtn.waitFor({ state: 'visible', timeout: 2000 });
    } catch (_e) {
      console.log('Valid button not visible in SC20, retrying click...');
      await activityButton.click({ force: true });
    }
    await validateBtn.click({ force: true });

    // Vérifier que l'activité est là
    await expect(
      page.locator('.rounded-full').filter({ hasText: activityTitle }),
    ).toBeVisible();

    // 5. Modifier le stagiaire (sans toucher aux activités)
    // Le bouton modifier est visible quand la carte est dépliée (ou au survol, mais déplié il est là)
    const fullName = `${user.firstName} ${user.lastName}`;
    await page.getByRole('button', { name: `Modifier ${fullName}` }).click();
    await page.getByLabel('Prénom').fill(`${user.firstName} Edited`);
    await page.getByRole('button', { name: 'Mettre à jour' }).click();

    // 6. Vérifier que la carte est toujours dépliée et que l'activité est toujours là
    // Le nom a changé
    const newName = `${user.firstName} Edited ${user.lastName}`;
    await expect(page.getByText(newName).first()).toBeVisible();

    // BUG ACTUEL: On s'attend à ce que l'activité ait disparu si le bug est présent
    // OU on s'attend à ce qu'elle soit là si on veut tester le fix.
    await expect(
      page.locator('.rounded-full').filter({ hasText: activityTitle }),
    ).toBeVisible();

    // 7. Vérifier la persistance serveur (Reload)
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Mobile Check Again (Reset after reload)
    // Pas besoin de recherche car date 2099 met l'élément en haut
    const finalCardHeader = page.getByRole('heading', { name: newName });
    await expect(finalCardHeader).toBeVisible();
    await finalCardHeader.click(); // Expand again
    await expect(
      page.locator('.rounded-full').filter({ hasText: activityTitle }),
    ).toBeVisible();
  });
});
