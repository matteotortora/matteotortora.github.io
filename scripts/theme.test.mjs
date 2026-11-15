import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import { readThemePreference, themeBootstrap } from '../src/theme.mjs';

const storage = values => ({ getItem: key => values[key] ?? null });

test('saved theme takes precedence over system and legacy preferences', () => {
  assert.equal(readThemePreference(storage({ theme: 'light', darkMode: 'true' }), true), 'light');
  assert.equal(readThemePreference(storage({ theme: 'dark', darkMode: 'false' }), false), 'dark');
});

test('legacy preferences remain valid and new visitors follow their device', () => {
  assert.equal(readThemePreference(storage({ darkMode: 'true' }), false), 'dark');
  assert.equal(readThemePreference(storage({ darkMode: 'false' }), true), 'light');
  assert.equal(readThemePreference(storage({}), true), 'dark');
  assert.equal(readThemePreference(storage({}), false), 'light');
});

test('unavailable storage falls back to the device without crashing', () => {
  const blocked = { getItem() { throw new Error('Storage blocked'); } };
  assert.equal(readThemePreference(blocked, true), 'dark');
  assert.equal(readThemePreference(undefined, false), 'light');
});

test('inline bootstrap sets theme and browser color before React starts', () => {
  for (const theme of ['light', 'dark']) {
    const root = { dataset: {}, style: {} };
    const meta = { setAttribute(key, value) { this[key] = value; } };
    runInNewContext(themeBootstrap(), {
      window: { localStorage: storage({ theme }), matchMedia: () => ({ matches: theme !== 'dark' }) },
      document: { documentElement: root, querySelector: () => meta },
    });
    assert.equal(root.dataset.theme, theme);
    assert.equal(root.style.colorScheme, theme);
    assert.equal(meta.content, theme === 'dark' ? '#17191f' : '#f8f8f8');
  }
});
