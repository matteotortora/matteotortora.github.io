import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('each publication figure has an explicit descriptive alternative', () => {
    const publications = JSON.parse(readFileSync(new URL('../src/info/publications.json', import.meta.url), 'utf8'));
    for (const publication of publications.filter(item => item.image)) {
        assert.equal(typeof publication.imageAlt, 'string', `Missing imageAlt: ${publication.id}`);
        assert.ok(publication.imageAlt.trim(), `Empty imageAlt: ${publication.id}`);
        assert.notEqual(publication.imageAlt, publication.title, `Describe the figure rather than repeating the title: ${publication.id}`);
    }
});
