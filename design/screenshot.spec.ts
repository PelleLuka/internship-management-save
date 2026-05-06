import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from '@playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, 'screenshots');

const SCREENS = [
  { name: 'internships', path: '/internships' },
  { name: 'activities', path: '/activities' },
  { name: 'categories', path: '/categories' },
  { name: 'settings', path: '/settings' },
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
