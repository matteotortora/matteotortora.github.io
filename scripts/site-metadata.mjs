import site from '../src/info/site.json' with { type: 'json' };

import { themeBootstrap } from '../src/theme.mjs';

export { site };

export function siteMetadata(metadata = site) {
  const image = new URL(metadata.socialImage, metadata.url).href;
  const profile = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${metadata.url}#profile`,
    url: metadata.url,
    name: metadata.title,
    description: metadata.description,
    inLanguage: metadata.language,
    mainEntity: {
      '@type': 'Person',
      '@id': `${metadata.url}#matteo-tortora`,
      name: metadata.name,
      url: metadata.url,
      jobTitle: metadata.jobTitle,
      worksFor: { '@type': 'CollegeOrUniversity', ...metadata.affiliation },
      sameAs: metadata.profiles,
    },
  };
  const meta = (name, content) => ({ tag: 'meta', attrs: { name, content }, injectTo: 'head' });
  const og = (property, content) => ({ tag: 'meta', attrs: { property, content }, injectTo: 'head' });
  return [
    { tag: 'script', children: themeBootstrap(), injectTo: 'head' },
    { tag: 'title', children: metadata.title.replace(/[&<>]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[character]), injectTo: 'head' },
    meta('description', metadata.description),
    { tag: 'link', attrs: { rel: 'canonical', href: metadata.url }, injectTo: 'head' },
    { tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }, injectTo: 'head' },
    { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' }, injectTo: 'head' },
    { tag: 'link', attrs: { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }, injectTo: 'head' },
    og('og:type', 'website'),
    og('og:site_name', metadata.name),
    og('og:title', metadata.title),
    og('og:description', metadata.description),
    og('og:url', metadata.url),
    og('og:image', image),
    og('og:image:type', 'image/png'),
    og('og:image:width', '1200'),
    og('og:image:height', '630'),
    og('og:image:alt', metadata.socialImageAlt),
    meta('twitter:card', 'summary_large_image'),
    meta('twitter:title', metadata.title),
    meta('twitter:description', metadata.description),
    meta('twitter:image', image),
    meta('twitter:image:alt', metadata.socialImageAlt),
    {
      tag: 'script',
      attrs: { type: 'application/ld+json' },
      children: JSON.stringify(profile).replace(/</g, '\\u003c'),
      injectTo: 'head',
    },
  ];
}

export function metadataPlugin() {
  return {
    name: 'academic-profile-metadata',
    transformIndexHtml() { return siteMetadata(); },
  };
}
