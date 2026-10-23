import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// Se prueba el HTML generado, nunca se modifica src/ ni dist/.
const qa = (directory) => spawnSync(process.execPath, ['scripts/qa.mjs', directory], { encoding: 'utf8' });

test('el build actual supera QA', () => {
  const result = qa('dist');
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

for (const [name, mutate, expected] of [
  ['imagen local inexistente', (html) => html.replace(/(<img\b[^>]*src=")[^"]+/, '$1missing-image.webp'), /destino local inexistente/],
  ['canonical de otro origen', (html) => html.replace(/(<link rel="canonical" href=")[^"]+/, '$1https://wrong-origin.test/'), /canonical incorrecta/],
  ['JSON-LD inválido', (html) => html.replace(/(<script type="application\/ld\+json"[^>]*>)/, '$1invalid'), /JSON-LD inválido/],
  ['ancla interna inexistente', (html) => html.replace('href="#main"', 'href="#missing-anchor"'), /ancla inexistente/],
]) {
  test(`QA rechaza ${name}`, () => {
    const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'gxn-qa-'));
    try {
      fs.cpSync('dist', fixture, { recursive: true });
      const home = path.join(fixture, 'index.html');
      fs.writeFileSync(home, mutate(fs.readFileSync(home, 'utf8')));
      const result = qa(fixture);
      assert.equal(result.status, 1, result.stdout + result.stderr);
      assert.match(result.stderr, expected);
    } finally {
      // Únicamente la carpeta temporal creada por esta prueba.
      fs.rmSync(fixture, { recursive: true });
    }
  });
}
