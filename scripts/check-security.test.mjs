import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const checker = fileURLToPath(new URL('./check-security.mjs', import.meta.url));
const fakeToken = 'ghp_' + 'A'.repeat(36);
const cases = [
  { name: 'accepts a consistent project', prepare() {}, status: 0, message: 'Security checks passed' },
  {
    name: 'rejects malformed JSON without exposing its contents',
    prepare(dir) { writeFileSync(join(dir, 'package-lock.json'), '{"token":"' + fakeToken + '",'); },
    status: 1, message: 'Cannot read valid JSON',
  },
  {
    name: 'rejects a manifest that differs from the lockfile',
    prepare(dir) { writeFileSync(join(dir, 'package.json'), JSON.stringify({ dependencies: { react: '18.3.1' } })); },
    status: 1, message: 'does not match',
  },
  {
    name: 'rejects unresolved conflicts',
    prepare(dir) { writeFileSync(join(dir, 'source.js'), '<'.repeat(7) + ' branch\n'); },
    status: 1, message: 'Unresolved merge conflict',
  },
  {
    name: 'rejects credential patterns without exposing the credential',
    prepare(dir) { writeFileSync(join(dir, 'source.js'), fakeToken); },
    status: 1, message: 'Possible GitHub credential',
  },
  {
    name: 'rejects credentials embedded in remote URLs',
    prepare(dir) {
      execFileSync('git', ['remote', 'add', 'origin', 'https://build-user@example.com/project.git'], { cwd: dir });
    },
    status: 1, message: 'remote contains embedded credentials',
  },
];

for (const scenario of cases) {
  test(scenario.name, () => {
    const dir = mkdtempSync(join(tmpdir(), 'academic-site-security-test-'));
    try {
      execFileSync('git', ['init', '--quiet'], { cwd: dir });
      writeFileSync(join(dir, 'package.json'), '{}');
      writeFileSync(join(dir, 'package-lock.json'), JSON.stringify({ packages: { '': {} } }));
      writeFileSync(join(dir, '.nvmrc'), process.versions.node);
      scenario.prepare(dir);
      const result = spawnSync(process.execPath, [checker], { cwd: dir, encoding: 'utf8' });
      assert.equal(result.status, scenario.status, result.stderr);
      assert.ok((result.stdout + result.stderr).includes(scenario.message));
      assert.ok(!(result.stdout + result.stderr).includes(fakeToken));
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
}
