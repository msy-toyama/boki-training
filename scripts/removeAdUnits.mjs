// 審査通過までの暫定対応: 静的KBページのダミー広告ユニット(data-ad-slot="0000000000")を撤去する。
//
// AdSenseの承認前にダミースロットの <ins> を配置すると、広告リクエストが失敗して
// 空枠・コンソール400エラー・「未完成サイト」シグナルの原因になる。
// SPA側(components/AdUnit.tsx)は空スロットで何も描画しない方針なので、静的HTMLも同じ方針に統一する。
//
// ヘッダーの adsbygoogle ローダー(<script async ...adsbygoogle.js>)と
// google-adsense-account meta は審査に必要なため残す(=このスクリプトは撤去しない)。
//
// 承認後に AdSense管理画面で発行した実スロットIDで広告を再設置する。
//
// 使い方: node scripts/removeAdUnits.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// 広告ブロック(コメント + div.my-8 で囲まれた ins + push script)を丸ごと削除する正規表現。
// インデントや前後の空行も含めて除去し、余分な空白行を残さない。
const AD_BLOCK = /[ \t]*<!-- 広告ユニット[^\n]*-->\n[ \t]*<div class="my-8 text-center">\s*\n[ \t]*<ins class="adsbygoogle"[^\n]*<\/ins>\s*\n[ \t]*<script>\(adsbygoogle[^\n]*<\/script>\s*\n[ \t]*<\/div>\n/g;

const files = globSync('public/kb/**/index.html', { cwd: root });

let changedFiles = 0;
let removedBlocks = 0;

for (const rel of files) {
  const abs = join(root, rel);
  const before = readFileSync(abs, 'utf8');
  const matches = before.match(AD_BLOCK);
  if (!matches) continue;
  const after = before.replace(AD_BLOCK, '');
  writeFileSync(abs, after, 'utf8');
  changedFiles += 1;
  removedBlocks += matches.length;
  console.log(`  removed ${matches.length} ad block(s): ${rel}`);
}

console.log(`\nDone. ${removedBlocks} ad block(s) removed across ${changedFiles} file(s).`);

// 残存チェック
const remaining = files.filter((rel) =>
  readFileSync(join(root, rel), 'utf8').includes('data-ad-slot="0000000000"'),
);
if (remaining.length) {
  console.warn(`\nWARNING: dummy slots still present in ${remaining.length} file(s):`);
  remaining.forEach((r) => console.warn(`  ${r}`));
  process.exitCode = 1;
}
