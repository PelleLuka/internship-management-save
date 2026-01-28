import { expect, test } from '@playwright/test';

test.describe('Sanity Check - Database Integrity', () => {

  test('Vérifier les données restaurées (Stagiaires & Activités)', async ({ request }) => {
    // 1. Check Internships Count (Expected: 60)
    const internshipsRes = await request.get('/api/internships');
    expect(internshipsRes.ok()).toBeTruthy();
    const internships = await internshipsRes.json();
    expect(internships.total, 'Le nombre de stagiaires restaurés doit être de 60').toBe(60);

    // 2. Check Activities Count (Expected: 15)
    const activitiesRes = await request.get('/api/activities');
    expect(activitiesRes.ok()).toBeTruthy();
    const activities = await activitiesRes.json();
    expect(activities.length, 'Le nombre d\'activités restaurées doit être de 12').toBe(12);

    interface Internship {
      id: number;
      firstName: string;
      lastName: string;
      activityIds: number[];
    }

    // 3. Spot Check Integrity (Internship ID 60 - The last one)
    const intern60InList = internships.data.find((i: Internship) => i.id === 60);
    expect(intern60InList, 'Le stagiaire ID 60 doit exister dans la liste').toBeDefined();

    // Fetch details for Internship ID 60
    const intern60Res = await request.get('/api/internships/60');
    expect(intern60Res.ok()).toBeTruthy();
    const intern60 = await intern60Res.json();

    expect(intern60.firstName).toBe('Joël');
    expect(intern60.lastName).toBe('Dacobeau');

    // 4. Check Associations (Internship ID 60 should have specific activities)
    // Fetch activities for Internship ID 60
    const intern60ActivitiesRes = await request.get('/api/internships/60/activities');
    expect(intern60ActivitiesRes.ok()).toBeTruthy();
    const intern60Activities = await intern60ActivitiesRes.json();
    
    // Check for specific activities (14 and 15 in the list of activities)
    interface Activity {
      id: number;
    }
    const activityIds = intern60Activities.map((a: Activity) => a.id);
    expect(activityIds).toContain(14);
    expect(activityIds).toContain(15);
  });

});
