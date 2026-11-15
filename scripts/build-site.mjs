import assert from 'node:assert/strict';
import { access, mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

const output = resolve(process.env.BUILD_PATH || 'build');
await mkdir(resolve('.local'), { recursive: true });
const temporary = await mkdtemp(resolve('.local/prerender-'));

try {
    await build();
    await build({
        ssr: { noExternal: [/^@mui\//] },
        build: {
            ssr: 'src/entry-server.jsx',
            outDir: temporary,
            emptyOutDir: true,
            copyPublicDir: false,
            rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
        },
        logLevel: 'warn',
    });
    const { render } = await import(pathToFileURL(join(temporary, 'entry-server.mjs')).href);
    const markup = render();
    const path = join(output, 'index.html');
    const template = await readFile(path, 'utf8');
    const outlet = '<div id="root"><!--prerender-outlet--></div>';
    assert.ok(template.includes(outlet), 'The HTML prerender outlet is missing.');
    assert.ok(markup.includes('<main'), 'The rendered page must include the main content.');
    for (const id of ['home', 'news', 'about', 'supervision', 'services', 'teaching', 'publications']) {
        assert.ok(markup.includes(`id="${id}"`), `The rendered page is missing ${id}.`);
    }
    const publications = JSON.parse(await readFile('src/info/publications.json', 'utf8'));
    for (const publication of publications) {
        assert.ok(markup.includes(`id="publication-${publication.id}"`), `The HTML is missing publication ${publication.id}.`);
    }
    assert.ok(markup.includes('srcSet='), 'The portrait must have responsive sources.');
    const html = template.replace(outlet, () => `<div id="root" data-prerendered="true">${markup}</div>`);
    const urls = new Set(Array.from(html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g), match => match[1]));
    for (const match of html.matchAll(/srcSet="([^\"]+)"/g)) {
        for (const candidate of match[1].split(',')) urls.add(candidate.trim().split(/\s+/)[0]);
    }
    for (const url of urls) await access(join(output, url.slice(1)));
    await writeFile(path, html);
    console.log(`Prerendered all seven sections into ${path}.`);
} finally {
    await rm(temporary, { recursive: true, force: true });
}
