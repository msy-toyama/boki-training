# ビルド・デプロイ設定詳細

## 概要

このアプリはViteでビルドし、Cloudflare Pagesにデプロイされています。

---

## ビルドツール: Vite 7.3.3（lockfile基準）

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'lucide': ['lucide-react']
        }
      }
    }
  },
  esbuild: {
    drop: ['console', 'debugger']
  }
})
```

### 設定詳細

| 項目 | 値 | 説明 |
|---|---|---|
| `plugins` | `[react()]` | React Fast Refresh |
| `base` | `'/'` | ルートパス |
| `publicDir` | `'public'` | 静的ファイル配置 |
| `build.outDir` | `'dist'` | ビルド出力先 |
| `build.sourcemap` | `false` | ソースマップ無効（本番用） |
| `build.minify` | `'esbuild'` | esbuildで圧縮 |
| `esbuild.drop` | `['console', 'debugger']` | console.log削除 |

### コード分割

```typescript
manualChunks: {
  'react-vendor': ['react', 'react-dom'],
  'lucide': ['lucide-react']
}
```

**生成ファイル**:
- `index-XXXXXX.js` (メインコード)
- `react-vendor-XXXXXX.js` (React本体)
- `lucide-XXXXXX.js` (アイコン)

**メリット**:
- 並列ダウンロード
- ブラウザキャッシュ効率化

---

## package.json

### 依存関係

```json
{
  "dependencies": {
    "lucide-react": "^0.263.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^24.10.1",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@vitejs/plugin-react": "^4.0.3",
    "@vitest/coverage-v8": "^4.1.7",
    "happy-dom": "^20.9.0",
    "tailwindcss": "^3.4.17",
    "gh-pages": "^6.1.0",
    "typescript": "^5.0.2",
    "vite": "^7.2.4",
    "vitest": "^4.1.7"
  }
}
```

### スクリプト

```json
{
  "scripts": {
    "dev": "vite",
    "build:kb-css": "BROWSERSLIST_IGNORE_OLD_DATA=1 tailwindcss -c tailwind.kb.config.cjs -i ./styles/kb.css -o ./public/kb/styles.css --minify",
    "build": "npm run build:kb-css && tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "audit:problems": "node scripts/auditProblems.mjs",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバー起動（http://localhost:5173） |
| `npm run build:kb-css` | ナレッジベース用CSSをTailwindで生成 |
| `npm run build` | KB CSS生成 + TypeScriptコンパイル + Viteビルド |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run test:run` | Vitestを1回実行 |
| `npm run audit:problems` | 問題テンプレートと通常出題範囲を監査 |
| `npm run deploy` | GitHub Pagesへデプロイ（本番Cloudflareとは別の補助運用） |

---

## TypeScript設定

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler",
    "skipLibCheck": true,
    "noEmit": true
  }
}
```

**重要設定**:
- `strict: true`: 厳格な型チェック
- `jsx: "react-jsx"`: 新しいJSX変換（React 17+）
- `noEmit: true`: Viteがビルドするため、TypeScriptは型チェックのみ

---

## ビルドプロセス

### 1. ナレッジベースCSS生成

```bash
npm run build:kb-css
```

**実行内容**:
- `styles/kb.css` を入力として `public/kb/styles.css` を生成
- TailwindCSSの設定は `tailwind.kb.config.cjs` を使用

### 2. TypeScriptコンパイル

```bash
tsc
```

**実行内容**:
- 型チェックのみ（`noEmit: true`）
- エラーがあればビルド中断

### 3. Viteビルド

```bash
vite build
```

**実行内容**:
1. エントリーポイント解析（`index.html`）
2. TypeScript → JavaScript変換
3. CSS処理（TailwindCSS）
4. コード分割（`manualChunks`）
5. 圧縮（esbuild）
6. ハッシュ付きファイル名生成
7. `dist/`に出力

### 3. ビルド出力

```
dist/
├── index.html
├── assets/
│   ├── index-a1b2c3d4.js
│   ├── react-vendor-e5f6g7h8.js
│   ├── lucide-i9j0k1l2.js
│   └── index-m3n4o5p6.css
└── favicon.svg
```

---

## ビルドパフォーマンス

### 実測値

```bash
$ npm run build

vite v7.3.3 building client environment for production...
dist/index.html                         5.72 kB │ gzip:  1.86 kB
dist/assets/index-ceE4kVWW.css         45.83 kB │ gzip:  8.68 kB
dist/assets/lucide-CX2aOhr-.js         16.47 kB │ gzip:  6.08 kB
dist/assets/react-vendor-BUvQ2f46.js  133.82 kB │ gzip: 42.96 kB
dist/assets/index-D05JYdJG.js         198.69 kB │ gzip: 49.16 kB
```

**特徴**:
- **本番前確認**: `npm run audit:problems` と `npm run build` を必ず実行
- **今回の実測**: 1269 modules transformed / Vite build 970ms
- **初回ロード**: React vendor / lucide / app chunk を分割

---

## Cloudflare Pagesデプロイ

### GitHub連携

1. **リポジトリ**: `msy-toyama/boki-training`
2. **ブランチ**: `main`
3. **ビルドコマンド**: `npm run build`
4. **出力ディレクトリ**: `dist`

### 自動デプロイ

```
git push origin main
    ↓
Cloudflare PagesがGitHub更新を検知
    ↓
Cloudflare Pages自動ビルド
    ↓
デプロイ完了（約2分）
    ↓
https://boki-training.com/
```

---

## CSP設定 (_headers)

Content Security Policyの設定。

### public/_headers

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://adservice.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.googlesyndication.com https://*.adtrafficquality.google https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://pagead2.googlesyndication.com https://adservice.google.com https://googleads.g.doubleclick.net https://*.googlesyndication.com https://*.adtrafficquality.google https://*.google.com https://csi.gstatic.com https://static.cloudflareinsights.com; frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.googlesyndication.com https://*.adtrafficquality.google https://www.google.com; img-src 'self' data: https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.googlesyndication.com https://*.adtrafficquality.google https://*.google.com https://*.gstatic.com; media-src 'self' data:;
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Cache-Control: public, max-age=0, must-revalidate
```

**設定内容**:
- `script-src`: アプリ本体、AdSense、Cloudflare Insightsを許可
- `style-src`: ローカルCSSとGoogle Fonts読み込みを許可
- `frame-src` / `img-src` / `connect-src`: AdSense関連通信を許可

---

## SEO設定

### index.html

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- SEO -->
  <title>簿記トレーニング大戦 | 日商簿記3級オンライン学習ゲーム</title>
  <meta name="description" content="簿記3級の学習をRPG風ゲームで楽しく！仕訳問題・計算問題・選択問題の100問ノック。モンスターを倒しながら実践的な簿記スキルを身につけよう。無料・登録不要で今すぐプレイ可能。" />
  <meta name="keywords" content="簿記3級, 日商簿記, 簿記学習, 簿記ゲーム, 仕訳問題, オンライン学習, 無料学習ツール" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="簿記トレーニング大戦 - 簿記3級学習ゲーム" />
  <meta property="og:description" content="モンスターを倒しながら簿記を学ぶ！100問ノックで簿記3級をマスター。" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://boki-training.com/" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="簿記トレーニング大戦" />
  <meta name="twitter:description" content="簿記3級をゲームで楽しく学習！" />
  
  <!-- PWA -->
  <meta name="theme-color" content="#4f46e5" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>
```

---

## Favicon設定

### public/favicon.svg

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- 剣のアイコン -->
  <defs>
    <linearGradient id="bladeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="45" y="10" width="10" height="60" rx="2" fill="url(#bladeGradient)"/>
  <rect x="40" y="70" width="20" height="8" rx="2" fill="#fbbf24"/>
  <circle cx="50" cy="82" r="6" fill="#fbbf24"/>
</svg>
```

**特徴**:
- SVG形式（スケーラブル）
- 青いグラデーションの剣
- 金色の柄

---

## robots.txt

### public/robots.txt

```
User-agent: *
Allow: /

Sitemap: https://boki-training.com/sitemap.xml
```

**目的**: 検索エンジンのクロール許可

---

## パフォーマンス最適化

### 1. コード分割

```typescript
manualChunks: {
  'react-vendor': ['react', 'react-dom'],
  'lucide': ['lucide-react']
}
```

### 2. Tree Shaking

Viteが自動で未使用コードを削除。

### 3. Gzip圧縮

Cloudflare Pagesが自動でGzip/Brotli圧縮。

### 4. キャッシュ戦略

```
index.html: no-cache
assets/*.js: max-age=31536000 (1年)
```

---

## 開発ワークフロー

### ローカル開発

```bash
npm run dev
```

**特徴**:
- Hot Module Replacement（HMR）
- 即座に変更反映
- http://localhost:5173

### ビルド確認

```bash
npm run build
npm run preview
```

**特徴**:
- 本番環境と同じビルド
- http://localhost:4173

### デプロイ

```bash
git add .
git commit -m "Update"
git push origin main
```

**自動実行**:
1. Cloudflare PagesがGitHub更新を検知
2. Cloudflare Pagesビルド
3. 約2分でデプロイ完了

---

## トラブルシューティング

### ビルドエラー: TypeScript型エラー

```bash
$ npm run build
error TS2322: Type 'string' is not assignable to type 'number'.
```

**対策**:
1. `tsc --noEmit`で型チェック
2. エラー箇所を修正

### デプロイエラー: Cloudflare Pages

```
Error: Build failed
```

**対策**:
1. Cloudflare Pagesダッシュボードでログ確認
2. ビルドコマンド・出力ディレクトリ確認
3. 環境変数設定確認

### CSPエラー: 外部サービス

```
Refused to load the script because it violates CSP
```

**対策**:
`_headers` と `index.html` のCSPに、実際に利用している外部サービスのドメインを追加

---

## iOS版への移行時のビルド設定

### Xcode設定

```swift
// Info.plist
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <false/>
</dict>
```

### ビルド構成

- **Development**: デバッグシンボル有効
- **Release**: 最適化、App Store Connect

### 配布方法

1. **TestFlight**: ベータテスト
2. **App Store**: 本番リリース
3. **Enterprise**: 社内配布

---

## GitHub Pages補助デプロイ

### GitHub Actions (.github/workflows/deploy.yml)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main, master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
        env:
          VITE_BASE_PATH: /boki-training/
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
```

本番はCloudflare Pages + 独自ドメイン `boki-training.com` を主系とし、このGitHub ActionsはGitHub Pages向けの補助経路として扱います。

---

## まとめ

**ビルド時間**: Vite build 970ms（2026-05-26 ローカル実測）
**ビルドサイズ**: app chunk 198.69 kB / React vendor 133.82 kB / CSS 45.83 kB（gzip合計 約108.74 kB）
**デプロイ時間**: Cloudflare Pages の実行状況に依存
**本番URL**: https://boki-training.com/

**最適化ポイント**:
- コード分割
- Tree Shaking
- Gzip圧縮
- キャッシュ戦略

これでビルド・デプロイ設定のドキュメント化が完了しました。
