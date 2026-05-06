import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SCREENS = [
  'internships',
  'activities',
  'categories',
  'settings',
  'certificate',
];

const toBase64 = (filePath) => {
  if (!existsSync(filePath)) return null;
  return `data:image/png;base64,${readFileSync(filePath).toString('base64')}`;
};

const cards = SCREENS.map((name) => {
  const pencilSrc = toBase64(resolve(__dirname, `screens/${name}.png`));
  const appSrc = toBase64(resolve(__dirname, `screenshots/${name}.png`));

  const img = (src, label) =>
    src
      ? `<div class="col"><p class="label">${label}</p><img src="${src}" alt="${label} — ${name}"></div>`
      : `<div class="col"><p class="label">${label}</p><p class="missing">⚠️ Screenshot manquant</p></div>`;

  return `
<section>
  <h2>${name}</h2>
  <div class="row">
    ${img(pencilSrc, 'Pencil')}
    ${img(appSrc, 'App')}
  </div>
</section>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Validation Design — WorkXP Admin</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, sans-serif; background: #f8fafc; color: #0f172a; padding: 2rem; }
  h1 { font-size: 1.25rem; font-weight: 700; margin-bottom: 2rem; color: #1e293b; }
  section { margin-bottom: 3rem; }
  h2 { font-size: 1rem; font-weight: 600; text-transform: capitalize; margin-bottom: 0.75rem;
       color: #475569; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .col { display: flex; flex-direction: column; gap: 0.375rem; }
  .label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
           letter-spacing: 0.06em; color: #94a3b8; }
  img { width: 100%; border: 1px solid #e2e8f0; border-radius: 0.5rem; display: block; }
  .missing { color: #dc2626; font-size: 0.875rem; padding: 1rem;
             background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.5rem; }
</style>
</head>
<body>
<h1>Validation Design — WorkXP Admin</h1>
${cards}
</body>
</html>`;

const reportPath = resolve(__dirname, 'validation-report.html');
writeFileSync(reportPath, html, 'utf8');
console.log('✅ Rapport généré : design/validation-report.html');

const opener =
  process.platform === 'darwin'
    ? 'open'
    : process.platform === 'win32'
      ? 'start'
      : 'xdg-open';

try {
  execSync(`${opener} "${reportPath}"`);
} catch {
  console.log(`   Ouvrir manuellement : ${reportPath}`);
}
