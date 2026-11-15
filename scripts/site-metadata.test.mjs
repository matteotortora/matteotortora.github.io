import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { site, siteMetadata } from './site-metadata.mjs';

test('search and sharing metadata stay consistent with the canonical profile', () => {
  const tags = siteMetadata();
  const content = name => tags.find(tag => tag.attrs?.name === name || tag.attrs?.property === name)?.attrs.content;
  for (const name of ['description', 'og:description', 'twitter:description']) {
    assert.equal(content(name), site.description);
  }
  assert.equal(tags.filter(tag => tag.tag === 'title').length, 1);
  assert.equal(content('og:title'), site.title);
  assert.equal(content('twitter:title'), site.title);
  assert.equal(tags.find(tag => tag.attrs?.rel === 'canonical').attrs.href, site.url);
  assert.equal(content('og:url'), site.url);
  assert.equal(content('og:image'), new URL(site.socialImage, site.url).href);
  assert.equal(content('twitter:image'), content('og:image'));
  assert.equal(new URL(site.url).protocol, 'https:');
  assert.equal(new URL(site.url).hash, '');
});

test('profile text cannot introduce HTML or close the structured-data script', () => {
  const metadata = { ...site, name: '</script><script>alert(1)</script>', title: 'Research & <models>' };
  const tags = siteMetadata(metadata);
  assert.equal(tags.find(tag => tag.tag === 'title').children, 'Research &amp; &lt;models&gt;');
  const script = tags.find(tag => tag.attrs?.type === 'application/ld+json').children;
  assert.ok(!script.includes('</script>'));
  assert.equal(JSON.parse(script).mainEntity.name, metadata.name);
});

test('profile data omits email and placeholder entries', () => {
  const schema = JSON.parse(siteMetadata().find(tag => tag.attrs?.type === 'application/ld+json').children);
  assert.equal(schema.mainEntity.name, site.name);
  assert.equal(schema.mainEntity.worksFor.name, site.affiliation.name);
  assert.deepEqual(schema.mainEntity.sameAs, site.profiles);
  assert.ok(!('email' in schema.mainEntity));
  assert.doesNotMatch(JSON.stringify(schema), /mailto:|matteo\.tortora@|developer portfolio|linktopublication1/);
});

test('committed image dimensions and crawler files match the metadata', () => {
  for (const [file, width, height] of [
    ['social-card.png', 1200, 630],
    ['favicon-32.png', 32, 32],
    ['apple-touch-icon.png', 180, 180],
  ]) {
    const png = readFileSync(new URL(`../public/${file}`, import.meta.url));
    assert.equal(png.subarray(1, 4).toString(), 'PNG');
    assert.equal(png.readUInt32BE(16), width);
    assert.equal(png.readUInt32BE(20), height);
  }
  const robots = readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8');
  const sitemap = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  assert.ok(robots.includes(`Sitemap: ${site.url}sitemap.xml`));
  assert.ok(sitemap.includes(`<loc>${site.url}</loc>`));
});
