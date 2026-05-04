import { test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const OUT_DIR = resolve(process.cwd(), 'design/screenshots');

const SCREENS = [
  { name: 'internships', path: '/internships' },
  { name: 'activities',  path: '/activities' },
  { name: 'categories',  path: '/categories' },
  { name: 'settings',    path: '/settings' },
  { name: 'certificate', path: '/certificate/1' },
];

test.beforeAll(() => {
  mkdirSync(OUT_DIR, { recursive: true });
});

for (const { name, path } of SCREENS) {
  test(`screenshot ${name}`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });
    await page.screenshot({
      path: `${OUT_DIR}/${name}.png`,
      fullPage: false,
    });
    console.log(`📸 ${name}.png`);
  });
}
