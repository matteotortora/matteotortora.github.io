import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const failures = [];
function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    console.error(`Cannot read valid JSON from ${file}.`);
    process.exit(1);
  }
}
const manifest = readJson('package.json');
const lock = readJson('package-lock.json');
const expectedNode = readFileSync('.nvmrc', 'utf8').trim();

if (process.versions.node !== expectedNode) {
  failures.push(`Use Node ${expectedNode} (nvm use).`);
}

for (const group of ['dependencies', 'devDependencies']) {
  const declared = manifest[group] || {};
  const locked = lock.packages?.['']?.[group] || {};
  if (JSON.stringify(Object.entries(declared).sort()) !== JSON.stringify(Object.entries(locked).sort())) {
    failures.push(`package-lock.json does not match package.json (${group}).`);
  }
}

const files = new Set(execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], {
  encoding: 'utf8',
}).split('\0').filter(Boolean));

const credentialPattern = /(?:gh[pousr]_[A-Za-z0-9]{36,255}|github_pat_[A-Za-z0-9_]{20,})/;
const conflictPattern = /^(?:<{7} |={7}$|>{7} )/m;

for (const file of files) {
  if (file.startsWith('build/') || file.startsWith('node_modules/')) continue;
  let bytes;
  try {
    bytes = readFileSync(file);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') continue;
    throw error;
  }
  if (bytes.includes(0)) continue;
  const content = bytes.toString('utf8');
  if (credentialPattern.test(content)) failures.push(`Possible GitHub credential in ${file}.`);
  if (conflictPattern.test(content)) failures.push(`Unresolved merge conflict in ${file}.`);
}

let remotes = '';
try {
  remotes = execFileSync('git', ['config', '--local', '--get-regexp', '^remote\\..*\\.(url|pushurl)$'], {
    encoding: 'utf8',
  });
} catch (error) {
  if (error.status !== 1) throw error;
}
for (const line of remotes.split('\n')) {
  const value = line.slice(line.indexOf(' ') + 1);
  if (!/^https?:\/\//i.test(value)) continue;
  try {
    const url = new URL(value);
    if (url.username || url.password) failures.push('A Git remote contains embedded credentials.');
  } catch {
    failures.push('A Git remote contains an invalid HTTP URL.');
  }
}

if (failures.length) {
  for (const failure of failures) console.error(failure);
  process.exitCode = 1;
} else {
  console.log('Security checks passed: runtime, lockfile, merge conflicts and GitHub credential patterns.');
}
