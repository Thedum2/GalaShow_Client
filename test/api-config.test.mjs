import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { SourceTextModule } from 'node:vm';

async function loadConfig(env) {
  const source = await readFile(new URL('../src/api/config.ts', import.meta.url), 'utf8');
  const module = new SourceTextModule(source, {
    initializeImportMeta(meta) { meta.env = env; },
  });
  await module.link(() => {});
  await module.evaluate();
  return module.namespace;
}

test('API requests default to the API for the selected build mode', async () => {
  for (const [mode, expected] of [
    ['development', 'https://api-dev.galashow.cloud'],
    ['production', 'https://api.galashow.cloud'],
  ]) {
    for (const value of [undefined, '', '   ']) {
      const config = await loadConfig({ MODE: mode, VITE_API_URL: value });
      assert.equal(config.API_BASE_URL, expected);
    }
  }
});

test('explicit API overrides preserve paths and normalize trailing slashes', async () => {
  const config = await loadConfig({ MODE: 'production', VITE_API_URL: ' http://localhost:8080/api/// ' });
  assert.equal(config.API_BASE_URL, 'http://localhost:8080/api');
});
