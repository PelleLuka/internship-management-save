import { test, expect } from '@playwright/test';

test.describe('SC20 - Mise à jour avec Carte Étendue', () => {

  test('Les activités doivent rester visibles après modification', async ({ page }) => {
    // 1. Créer une activité
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
        startDate: '2025-01-01',
        endDate: '2025-06-01'
    };
    await page.getByLabel('Prénom').fill(user.firstName);
    await page.getByLabel('Nom', { exact: true }).fill(user.lastName);
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Date de début').fill(user.startDate);
    await page.getByLabel('Date de fin').fill(user.endDate);
    await page.getByRole('button', { name: 'Créer' }).click();

    // 3. Déplier la carte
    // Mobile Check: Ouvrir la recherche si masquee
    const searchInput = page.getByPlaceholder('Rechercher...');
    if (!await searchInput.isVisible()) {
        const toggleBtn = page.getByRole('button', { name: 'Rechercher' });
        if (await toggleBtn.isVisible()) {
            await toggleBtn.click();
            await page.waitForTimeout(500); 
            await searchInput.waitFor({ state: 'visible' });
        }
    }
    await searchInput.fill(user.email);
    const cardHeader = page.getByRole('heading', { name: `${user.firstName} ${user.lastName}` });
    await expect(cardHeader).toBeVisible();
    
    // Click sur le header pour déplier (le parent clickable)
    // On doit cibler le conteneur ou le header
    await cardHeader.click(); 

    // 4. Ajouter l'activité
    await page.getByRole('button', { name: 'Ajouter une activité' }).click();
    await page.getByRole('button', { name: activityTitle }).click();
    await page.getByRole('button', { name: /Ajouter \(\d+\)/ }).click();
    
    // Vérifier que l'activité est là
    await expect(page.locator('.rounded-full').filter({ hasText: activityTitle })).toBeVisible();

    // 5. Modifier le stagiaire (sans toucher aux activités)
    // Le bouton modifier est visible quand la carte est dépliée (ou au survol, mais déplié il est là)
    await page.getByRole('button', { name: `Modifier ${user.firstName}` }).click();
    await page.getByLabel('Prénom').fill(user.firstName + ' Edited');
    await page.getByRole('button', { name: 'Mettre à jour' }).click();

    // 6. Vérifier que la carte est toujours dépliée et que l'activité est toujours là
    // Le nom a changé
    const newName = `${user.firstName} Edited ${user.lastName}`;
    await expect(page.getByRole('heading', { name: newName })).toBeVisible();
    
    // BUG ACTUEL: On s'attend à ce que l'activité ait disparu si le bug est présent
    // OU on s'attend à ce qu'elle soit là si on veut tester le fix.
    await expect(page.locator('.rounded-full').filter({ hasText: activityTitle })).toBeVisible();

    // 7. Vérifier la persistance serveur (Reload)
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Mobile Check Again (Reset after reload)
    if (!await searchInput.isVisible()) {
        const toggleBtn = page.getByRole('button', { name: 'Rechercher' });
        if (await toggleBtn.isVisible()) {
            await toggleBtn.click();
            await page.waitForTimeout(500); 
            await searchInput.waitFor({ state: 'visible' });
        }
    }
    await searchInput.fill(user.email);
    const finalCardHeader = page.getByRole('heading', { name: newName });
    await expect(finalCardHeader).toBeVisible();
    await finalCardHeader.click(); // Expand again
    await expect(page.locator('.rounded-full').filter({ hasText: activityTitle })).toBeVisible();
  });

});
