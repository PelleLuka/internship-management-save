import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tokensPath = resolve(__dirname, 'tokens.json');
const cssPath = resolve(__dirname, '../frontend/src/tokens.css');

const { pencil, tokens, updatedAt } = JSON.parse(
  readFileSync(tokensPath, 'utf8'),
);

const lines = Object.entries(tokens).map(([name, def]) => {
  const value = def.ref !== undefined ? pencil[def.ref] : def.value;
  if (!value)
    throw new Error(
      `Token "${name}" — ref "${def.ref}" introuvable dans pencil`,
    );
  return `  ${name}: ${value};`;
});

const css = `:root {\n${lines.join('\n')}\n}\n`;
writeFileSync(cssPath, css, 'utf8');

console.log(`✅ tokens.css régénéré depuis tokens.json (source: ${updatedAt})`);
console.log(
  `   ${Object.keys(tokens).length} tokens écrits → frontend/src/tokens.css`,
);
