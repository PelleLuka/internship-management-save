import { test, expect } from '@playwright/test';

test.describe('SC16 - Sécurité XSS', () => {

  test('Injection de scripts dans le nom', async ({ page }) => {
    await page.goto('/');

    const xssPayload = '<bold id="xss-test">XSS</bold>';
    // Note: <script> est souvent bloqué par les navigateurs modernes ou frameworks, 
    // mais vérifier l'affichage HTML brut est pertinent.

    await page.getByRole('button', { name: 'Nouveau' }).click();
    await page.getByLabel('Prénom').fill('Hacker');
    await page.getByLabel('Nom', { exact: true }).fill(xssPayload);
    await page.getByLabel('Email').fill(`hacker.${Date.now()}@test.com`);
    await page.getByLabel('Date de début').fill('2099-01-01');
    await page.getByLabel('Date de fin').fill('2025-12-31');
    
    await page.getByRole('button', { name: 'Créer' }).click();

    // Vérification
    // Le texte doit apparaitre tel quel (échappé) et NE PAS être interprété comme du HTML.
    // Donc on ne doit PAS trouver d'élément avec id="xss-test".
    
    const xssElement = page.locator('#xss-test');
    await expect(xssElement).toBeHidden();
    
    // Le texte brut doit être présent (non interprété), même si tronqué visuellement sur mobile
    // On cible le titre de la carte qui contient "Hacker"
    const cardTitle = page.locator('h3').filter({ hasText: 'Hacker' }).first();
    await expect(cardTitle).toContainText(xssPayload);
    
    // Nettoyage
    page.on('dialog', dialog => dialog.accept());
    // On clique sur le bouton poubelle associé à ce user
    // On clique sur le bouton poubelle associé à ce user via son aria-label (Regex pour matcher le début)
    await page.getByRole('button', { name: /Supprimer Hacker/ }).click();
  });

});
