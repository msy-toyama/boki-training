# プロジェクト概要

## プロジェクト名
**簿記トレーニング大戦**（Boki Training Taisen）

## バージョン情報
- **現在のバージョン**: 1.0.0
- **最終更新日**: 2025年11月21日
- **開発環境**: React 18.2.0 + TypeScript 5.0.2 + Vite 7.2.4

## プロジェクトの目的
日商簿記3級の学習をRPG風のゲーム形式で楽しく学べるWebアプリケーション。
モンスターとのバトル形式で問題を解き、時間制限内に正解することでダメージを与える仕組み。

## 主要機能
1. **3つの難易度モード**
   - Practice（練習）: 時間制限なし、ダメージなし
   - Easy（初級）: HP 300、30秒スタート
   - Hard（上級）: HP 100、20秒スタート

2. **3つの問題タイプ**
   - 仕訳問題（Journal Entry）: 借方・貸方の入力
   - 選択問題（Selection）: 4択から選択
   - 計算問題（Numeric）: 数値を入力

3. **問題生成システム**
   - 116種類の問題テンプレート
   - ランダムパラメータ生成で実質無限の問題

4. **ゲーム要素**
   - モンスターのHP管理
   - プレイヤーのHP管理
   - コンボシステム
   - クリティカルヒット
   - スコアランキング

5. **サウンド機能**
   - BGM（タイトル、戦闘Easy/Hard）
   - 効果音（選択、決定、攻撃、ダメージ等）
   - オン/オフ切り替え

6. **データ永続化**
   - ハイスコア記録
   - プレイ履歴
   - サウンド設定
   - ユーザープロファイル

## 技術スタック

### フロントエンド
- **React 18.2.0**: UIライブラリ
- **TypeScript 5.0.2**: 型安全性
- **Vite 7.2.4**: ビルドツール（超高速）
- **Tailwind CSS 3.4.1**: ユーティリティファーストCSS
- **Lucide React**: アイコンライブラリ

### Web API
- **Web Audio API**: サウンド生成・再生
- **localStorage**: データ永続化

### デプロイ
- **Cloudflare Pages**: ホスティング（無料）
- **GitHub Actions**: 自動デプロイ
- **独自ドメイン**: boki-training.com

## プロジェクト構成
```
boki-training/
├── docs/                    # 📚 設計書（このドキュメント）
├── public/                  # 🌐 静的ファイル
│   ├── favicon.svg         # ファビコン
│   ├── manifest.json       # PWA設定
│   ├── robots.txt          # SEO: クローラー制御
│   ├── sitemap.xml         # SEO: サイトマップ
│   └── _headers            # Cloudflare Pages用ヘッダー設定
├── components/             # 🧩 Reactコンポーネント
│   ├── BattleScene.tsx     # 戦闘画面
│   ├── JournalEntryForm.tsx # 仕訳入力フォーム
│   ├── QuestionTypeSelector.tsx # 問題形式選択
│   ├── RankingScreen.tsx   # ランキング画面
│   ├── ResultCard.tsx      # 結果表示カード
│   └── UserProfileForm.tsx # ユーザープロファイル入力
├── services/               # 🔧 サービスレイヤー
│   ├── audioService.ts     # サウンド管理
│   ├── geminiService.ts    # AI解説生成（未使用）
│   ├── problemService.ts   # 問題生成ロジック
│   └── scoreService.ts     # スコア管理
├── utils/                  # 🛠️ ユーティリティ
├── App.tsx                 # 📱 メインアプリケーション
├── index.tsx               # 🚀 エントリーポイント
├── types.ts                # 📝 TypeScript型定義
├── constants.ts            # 📊 定数・問題テンプレート（1,125行）
├── index.html              # 🌐 HTMLエントリーポイント
├── vite.config.ts          # ⚙️ Vite設定
├── tsconfig.json           # ⚙️ TypeScript設定
├── package.json            # 📦 依存関係
└── README.md               # 📖 プロジェクト説明

総コード行数: 約3,500行
```

## パフォーマンス指標
- **ビルド時間**: 565ms（超高速）
- **バンドルサイズ**: 264KB（gzip: 77KB）
- **TypeScriptエラー**: 0件
- **セキュリティ脆弱性**: 0件
- **Lighthouse スコア**: 
  - Performance: 95+
  - Accessibility: 90+
  - Best Practices: 95+
  - SEO: 100

## SEO対策
- ✅ 19項目の完全実装
- ✅ robots.txt
- ✅ sitemap.xml
- ✅ 構造化データ（JSON-LD）
- ✅ OGP（Open Graph Protocol）
- ✅ Twitter Card
- ✅ PWA対応
- ✅ モバイル最適化

## ブラウザ対応
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- モバイルブラウザ（iOS Safari, Chrome Mobile）

## アクセシビリティ
- キーボード操作対応
- ARIA ラベル
- フォーカス表示
- レスポンシブデザイン

## 今後の拡張予定
- [ ] 簿記2級対応
- [ ] ユーザー認証
- [ ] オンライン対戦
- [ ] 問題作成機能
- [ ] 学習進捗グラフ
- [ ] iOS/Androidアプリ版

## iOS版への移行検討
本ドキュメントは、本Web版をベースにiOSネイティブアプリを開発するための設計書として作成されています。

### iOS版で検討すべき技術
- **UI Framework**: SwiftUI
- **データ永続化**: CoreData / UserDefaults
- **サウンド**: AVFoundation
- **状態管理**: Combine / @State / @ObservedObject
- **ビルドツール**: Xcode

### Web版との主な違い
| 機能 | Web版 | iOS版 |
|---|---|---|
| UI | React + Tailwind | SwiftUI |
| データ保存 | localStorage | UserDefaults/CoreData |
| サウンド | Web Audio API | AVFoundation |
| 配信 | Cloudflare Pages | App Store |
| 課金 | 将来検討 | In-App Purchase |
