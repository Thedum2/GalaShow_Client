import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { SourceTextModule } from 'node:vm';

async function loadConfig(env) {
  const source = await readFile(new URL('../src/api/polychatConfig.ts', import.meta.url), 'utf8');
  const module = new SourceTextModule(source, {
    initializeImportMeta(meta) { meta.env = env; },
  });
  await module.link(() => {});
  await module.evaluate();
  return module.namespace;
}

test('PolyChat relay defaults to the same-origin /polychat mount in every mode', async () => {
  for (const DEV of [true, false]) {
    for (const value of [undefined, '', '   ']) {
      const config = await loadConfig({ DEV, VITE_POLYCHAT_API_URL: value });
      assert.equal(config.POLYCHAT_API_BASE_URL, '/polychat');
    }
  }
});

test('explicit relay overrides normalize trailing slashes and derive platform endpoints', async () => {
  const config = await loadConfig({ DEV: true, VITE_POLYCHAT_API_URL: ' https://relay.example.com/api// ' });
  assert.equal(config.POLYCHAT_API_BASE_URL, 'https://relay.example.com/api');
  assert.equal(config.CHZZK_API_BASE_URL, 'https://relay.example.com/api/chzzk');
  assert.equal(config.YOUTUBE_STREAM_URL, 'https://relay.example.com/api/youtube/chat/stream');
});
