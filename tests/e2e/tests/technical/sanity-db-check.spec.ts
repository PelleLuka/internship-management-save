import { expect, test } from '@playwright/test';

test.describe('Sanity Check - Database Integrity', () => {
  test('Vérifier les données restaurées (Stagiaires & Activités)', async ({
    request,
  }) => {
    // 1. Check Internships Count (Expected: 26)
    const internshipsRes = await request.get('/api/internships');
    expect(internshipsRes.ok()).toBeTruthy();
    const internships = await internshipsRes.json();
    expect(
      internships.total,
      'Le nombre de stagiaires restaurés doit être de 26',
    ).toBe(26);

    // 2. Check Activities Count (Expected: 13)
    const activitiesRes = await request.get('/api/activities');
    expect(activitiesRes.ok()).toBeTruthy();
    const activities = await activitiesRes.json();
    expect(
      activities.length,
      "Le nombre d'activités visibles restaurées doit être de 13",
    ).toBe(13);

    // 3b. Check Categories Count (Expected: 6 default categories)
    const categoriesRes = await request.get('/api/categories');
    expect(categoriesRes.ok()).toBeTruthy();
    const categories = await categoriesRes.json();
    expect(
      categories.length,
      'Le nombre de catégories par défaut doit être de 6',
    ).toBe(6);

    interface Internship {
      id: number;
      firstName: string;
      lastName: string;
      activityIds: number[];
    }

    // 3. Spot Check Integrity (Internship ID 60 - The last one)
    const intern60InList = internships.data.find(
      (i: Internship) => i.id === 60,
    );
    expect(
      intern60InList,
      'Le stagiaire ID 60 doit exister dans la liste',
    ).toBeDefined();

    // Fetch details for Internship ID 60
    const intern60Res = await request.get('/api/internships/60');
    expect(intern60Res.ok()).toBeTruthy();
    const intern60 = await intern60Res.json();

    expect(intern60.firstName).toBe('Joël');
    expect(intern60.lastName).toBe('Dacobeau');

    // 4. Check Associations on a known internship with linked activities.
    // Internship 60 has no linked activities; we use internship 1 (Lucas Martin)
    // which is seeded with activities 1 and 2.
    const intern1ActivitiesRes = await request.get(
      '/api/internships/1/activities',
    );
    expect(intern1ActivitiesRes.ok()).toBeTruthy();
    const intern1Activities = await intern1ActivitiesRes.json();
    const activityIds = intern1Activities.map((a: Activity) => a.id);
    expect(activityIds).toContain(1);
    expect(activityIds).toContain(2);
  });
});

interface Activity {
  id: number;
}
