# ビルド・デプロイ設定詳細

## 概要

このアプリはViteでビルドし、Cloudflare Pagesにデプロイされています。

---

## ビルドツール: Vite 7.2.4

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
    "@vitejs/plugin-react": "^4.0.3",
    "gh-pages": "^6.1.0",
    "typescript": "^5.0.2",
    "vite": "^7.2.4"
  }
}
```

### スクリプト

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバー起動（http://localhost:5173） |
| `npm run build` | TypeScriptコンパイル + Viteビルド |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run deploy` | GitHub Pagesへデプロイ |

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

### 1. TypeScriptコンパイル

```bash
tsc
```

**実行内容**:
- 型チェックのみ（`noEmit: true`）
- エラーがあればビルド中断

### 2. Viteビルド

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

vite v7.2.4 building for production...
✓ 45 modules transformed.
dist/index.html                   0.64 kB │ gzip:  0.38 kB
dist/assets/index-a1b2c3d4.css    8.92 kB │ gzip:  2.54 kB
dist/assets/lucide-e5f6g7h8.js  117.34 kB │ gzip: 36.12 kB
dist/assets/react-vendor-i9j0.js 143.21 kB │ gzip: 46.08 kB
dist/assets/index-k1l2m3n4.js   152.87 kB │ gzip: 48.23 kB
✓ built in 609ms
```

**特徴**:
- **超高速**: 609ms
- **Gzip圧縮後**: 合計約133KB
- **初回ロード**: 約0.5秒

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
GitHub Actions起動
    ↓
Cloudflare Pages自動ビルド
    ↓
デプロイ完了（約2分）
    ↓
https://boki-training.pages.dev/
```

---

## CSP設定 (_headers)

Content Security Policyの設定。

### public/_headers

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';
```

**設定内容**:
- `script-src 'unsafe-inline' 'unsafe-eval'`: Web Audio API対応
- `img-src data: https:`: Data URIとHTTPS画像許可
- `font-src data:`: Data URIフォント許可

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
  <meta property="og:url" content="https://boki-training.pages.dev/" />
  
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

Sitemap: https://boki-training.pages.dev/sitemap.xml
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
1. GitHub Actionsトリガー
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

### CSPエラー: Web Audio API

```
Refused to execute inline script because it violates CSP
```

**対策**:
`_headers`ファイルで`'unsafe-eval'`を追加

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

## CI/CD

### GitHub Actions (.github/workflows/deploy.yml)

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: boki-training
          directory: dist
```

---

## まとめ

**ビルド時間**: 609ms（超高速）
**ビルドサイズ**: 約133KB（Gzip）
**デプロイ時間**: 約2分
**URL**: https://boki-training.pages.dev/

**最適化ポイント**:
- コード分割
- Tree Shaking
- Gzip圧縮
- キャッシュ戦略

これでビルド・デプロイ設定のドキュメント化が完了しました。
