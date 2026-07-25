// Idempotent SEO meta injector for static KB + info pages.
// - Adds Open Graph / Twitter Card tags (after <link rel="canonical">).
// - Fixes Article schema logo.url (index.html -> og-image.png) and adds datePublished/dateModified/author.
// - Adds BreadcrumbList JSON-LD to KB pages (before </head>).
// Safe to run multiple times: each injection is skipped when already present.

import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://boki-training.com';
const OG_IMAGE = `${ORIGIN}/og-image.png`;
const TWITTER_SITE = '@ikasumi_dev';

const kbPages = globSync('public/kb/**/index.html', { cwd: ROOT });
const infoPages = ['about', 'terms', 'privacy', 'contact', 'faq'].map((p) => `public/${p}/index.html`);
const allPages = [...kbPages, ...infoPages];

function attrEscape(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function extract(re, html) {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function leafNameFromTitle(title) {
  // Use the first segment before a full-width or ascii vertical bar.
  return title.split(/｜|\|/)[0].trim();
}

function buildBreadcrumb(pathname, leafName) {
  const items = [{ name: 'ホーム', url: `${ORIGIN}/` }];
  if (pathname === '/kb/') {
    items.push({ name: '簿記攻略KB', url: `${ORIGIN}/kb/` });
  } else if (pathname === '/kb/level2/') {
    items.push({ name: '簿記攻略KB', url: `${ORIGIN}/kb/` });
    items.push({ name: '簿記2級', url: `${ORIGIN}/kb/level2/` });
  } else if (pathname.startsWith('/kb/level2/')) {
    items.push({ name: '簿記攻略KB', url: `${ORIGIN}/kb/` });
    items.push({ name: '簿記2級', url: `${ORIGIN}/kb/level2/` });
    items.push({ name: leafName, url: `${ORIGIN}${pathname}` });
  } else {
    items.push({ name: '簿記攻略KB', url: `${ORIGIN}/kb/` });
    items.push({ name: leafName, url: `${ORIGIN}${pathname}` });
  }
  const itemListElement = items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: it.url,
  }));
  const json = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
  return `  <script type="application/ld+json">\n${JSON.stringify(json, null, 2)
    .split('\n')
    .map((l) => '  ' + l)
    .join('\n')}\n  </script>\n`;
}

let changed = 0;
for (const rel of allPages) {
  const abs = path.join(ROOT, rel);
  let html = readFileSync(abs, 'utf8');
  const before = html;

  const canonical = extract(/<link rel="canonical" href="([^"]+)"/, html);
  const title = extract(/<title>([\s\S]*?)<\/title>/, html);
  const description = extract(/<meta name="description" content="([^"]*)"/, html);
  if (!canonical || !title) {
    console.warn(`skip (missing canonical/title): ${rel}`);
    continue;
  }
  const pathname = canonical.replace(ORIGIN, '');
  const isKb = rel.startsWith('public/kb/');
  const isHub = pathname === '/kb/' || pathname === '/kb/level2/';
  const ogType = isKb && !isHub ? 'article' : 'website';

  // 1) Open Graph / Twitter tags
  if (!/property="og:/.test(html)) {
    const t = attrEscape(title);
    const d = attrEscape(description || title);
    const ogBlock =
      `\n  <meta property="og:type" content="${ogType}">` +
      `\n  <meta property="og:site_name" content="簿記トレーニング大戦">` +
      `\n  <meta property="og:locale" content="ja_JP">` +
      `\n  <meta property="og:url" content="${canonical}">` +
      `\n  <meta property="og:title" content="${t}">` +
      `\n  <meta property="og:description" content="${d}">` +
      `\n  <meta property="og:image" content="${OG_IMAGE}">` +
      `\n  <meta name="twitter:card" content="summary_large_image">` +
      `\n  <meta name="twitter:site" content="${TWITTER_SITE}">` +
      `\n  <meta name="twitter:title" content="${t}">` +
      `\n  <meta name="twitter:description" content="${d}">` +
      `\n  <meta name="twitter:image" content="${OG_IMAGE}">`;
    html = html.replace(/(<link rel="canonical" href="[^"]+">)/, `$1${ogBlock}`);
  }

  // 2) Article schema fixes (KB topic pages)
  if (/"@type":\s*"Article"/.test(html)) {
    html = html.replace(
      /"url":\s*"https:\/\/boki-training\.com\/index\.html"/g,
      `"url": "${OG_IMAGE}"`,
    );
    if (!/"datePublished"/.test(html)) {
      html = html.replace(
        /("@type":\s*"Article",)/,
        `$1\n    "datePublished": "2024-11-21",\n    "dateModified": "2026-07-26",\n    "author": {\n      "@type": "Organization",\n      "name": "Toyama Digital Works",\n      "url": "https://boki-training.com/"\n    },\n    "inLanguage": "ja",`,
      );
    }
  }

  // 3) BreadcrumbList JSON-LD (KB pages only)
  if (isKb && !/"BreadcrumbList"/.test(html)) {
    const leaf = leafNameFromTitle(title);
    const crumb = buildBreadcrumb(pathname, leaf);
    html = html.replace(/<\/head>/, `${crumb}</head>`);
  }

  if (html !== before) {
    writeFileSync(abs, html, 'utf8');
    changed++;
    console.log(`updated: ${rel}`);
  }
}
console.log(`\nDone. ${changed} file(s) updated of ${allPages.length}.`);
