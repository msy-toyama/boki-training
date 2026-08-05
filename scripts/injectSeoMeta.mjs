// Idempotent SEO meta injector for static KB + info pages.
// - Adds Open Graph / Twitter Card tags (after <link rel="canonical">).
// - Fixes Article schema logo.url (index.html -> image.jpg) and adds datePublished/dateModified/author.
// - Adds BreadcrumbList JSON-LD to KB pages (before </head>).
// Safe to run multiple times: each injection is skipped when already present.

import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://boki-training.com';
const OG_IMAGE = `${ORIGIN}/image.jpg`;
const TWITTER_SITE = '@ikasumi_dev';

// Curated keywords for 3級 topic pages (2級 pages already ship their own).
const KEYWORDS_3KYU = {
  '/kb/shiwake/': '簿記3級,仕訳,仕訳問題,借方,貸方,勘定科目,仕訳の覚え方,第1問,仕訳練習',
  '/kb/accounts/': '簿記3級,勘定科目,資産,負債,純資産,収益,費用,勘定科目一覧,簿記の5要素',
  '/kb/adjustments/': '簿記3級,決算整理,決算整理仕訳,減価償却,貸倒引当金,経過勘定,前払費用,未収収益,売上原価の算定',
  '/kb/books/': '簿記3級,補助簿,主要簿,仕訳帳,総勘定元帳,現金出納帳,売掛金元帳,買掛金元帳,補助記入帳',
  '/kb/consumption-tax/': '簿記3級,消費税,税抜方式,仮払消費税,仮受消費税,未払消費税,消費税の納付',
  '/kb/financial-statements/': '簿記3級,財務諸表,貸借対照表,損益計算書,BS,PL,当期純利益,第3問',
  '/kb/goods/': '簿記3級,商品売買,三分法,売上,仕入,売上原価,繰越商品,クレジット売掛金,前払金',
  '/kb/mistakes/': '簿記3級,よくある間違い,ケアレスミス,苦手克服,つまずき,勉強法,ミス対策',
  '/kb/roadmap/': '簿記3級,独学,勉強法,学習ロードマップ,合格,勉強時間,勉強の順番,学習スケジュール',
  '/kb/trial-balance/': '簿記3級,試算表,合計試算表,残高試算表,合計残高試算表,第2問,貸借一致,検算',
  '/kb/vouchers/': '簿記3級,伝票,伝票会計,入金伝票,出金伝票,振替伝票,三伝票制,仕訳日計表,起票',
  '/kb/glossary/': '簿記用語集,簿記3級,簿記2級,借方,貸方,勘定科目,仕訳,減価償却,引当金,のれん,用語解説',
  '/kb/exam-guide/': '簿記 試験,日商簿記,簿記3級 試験,簿記2級 試験,ネット試験,CBT,統一試験,受験料,申込方法,合格基準,試験時間',
  '/kb/study-method/': '簿記 勉強法,簿記3級 勉強法,簿記2級 勉強法,暗記のコツ,仕訳 練習,復習,間違いノート,電卓,独学',
};

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

function breadcrumbItems(pathname, leafName) {
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
  return items;
}

function buildBreadcrumb(pathname, leafName) {
  const items = breadcrumbItems(pathname, leafName);
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

function htmlEscape(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Visual breadcrumb nav (matches the KB dark theme, works for 3級/2級).
function buildBreadcrumbHtml(pathname, leafName) {
  const items = breadcrumbItems(pathname, leafName);
  const parts = items.map((it, i) => {
    const isLast = i === items.length - 1;
    const sep = i > 0 ? '\n          <li aria-hidden="true" class="text-slate-600">/</li>' : '';
    const label = htmlEscape(it.name);
    if (isLast) {
      return `${sep}\n          <li><span class="text-slate-200 font-bold" aria-current="page">${label}</span></li>`;
    }
    return `${sep}\n          <li><a href="${it.url.replace(ORIGIN, '') || '/'}" class="hover:text-white underline-offset-2 hover:underline transition-colors">${label}</a></li>`;
  });
  return (
    `\n      <nav aria-label="パンくずリスト" class="text-xs sm:text-sm text-slate-400">` +
    `\n        <ol class="flex flex-wrap items-center gap-x-1.5 gap-y-1">${parts.join('')}` +
    `\n        </ol>` +
    `\n      </nav>\n`
  );
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

  // 4) Visual breadcrumb nav (KB pages only, idempotent)
  if (isKb && !/aria-label="パンくずリスト"/.test(html)) {
    const leaf = leafNameFromTitle(title);
    const navHtml = buildBreadcrumbHtml(pathname, leaf);
    // Insert right after the opening <article ...> tag, else after <main ...>.
    if (/<article[^>]*>/.test(html)) {
      html = html.replace(/(<article[^>]*>)/, `$1${navHtml}`);
    } else if (/<main[^>]*>/.test(html)) {
      html = html.replace(/(<main[^>]*>)/, `$1${navHtml}`);
    }
  }

  // 5) keywords meta for 3級 topic pages (2級 pages already have their own)
  if (KEYWORDS_3KYU[pathname] && !/name="keywords"/.test(html)) {
    const kw = attrEscape(KEYWORDS_3KYU[pathname]);
    const kwTag = `\n  <meta name="keywords" content="${kw}">`;
    if (/<meta name="description"[^>]*>/.test(html)) {
      html = html.replace(/(<meta name="description"[^>]*>)/, `$1${kwTag}`);
    }
  }

  if (html !== before) {
    writeFileSync(abs, html, 'utf8');
    changed++;
    console.log(`updated: ${rel}`);
  }
}
console.log(`\nDone. ${changed} file(s) updated of ${allPages.length}.`);
