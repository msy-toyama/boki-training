# 📚 簿記トレーニング大戦 - 3級100本ノック

RPG風の簿記学習ゲーム。116問の豊富な問題でモンスターを倒しながら日商簿記3級を完全攻略！

## ✨ 特徴

- 🎮 **RPGバトルシステム**: 問題を解いてモンスターを倒す爽快感
- 📝 **116問の豊富な問題**: 仕訳62問 + 選択30問 + 計算24問
- 🎲 **実質無限のランダム出題**: 毎回異なる数値で出題
- ⏱️ **タイムアタック**: 制限時間内に素早く解答してクリティカルヒット
- 🎯 **問題形式選択**: 苦手分野に絞った練習が可能
- 🎵 **BGM・効果音**: Web Audio APIによる本格的なサウンド
- 📊 **スコア記録**: プレイ履歴とベストスコアの管理
- 📱 **レスポンシブ対応**: スマホ・タブレット・PCすべてで快適

## 🚀 技術スタック

- **フレームワーク**: React 18.2 + TypeScript 5.0
- **ビルドツール**: Vite 4.4.5
- **スタイリング**: TailwindCSS (CDN)
- **アイコン**: Lucide React 0.263.1
- **デプロイ**: GitHub Pages

## 🛠️ ローカル開発

### 前提条件

- Node.js (v18以上推奨)
- npm

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# GitHub Pagesへデプロイ
npm run deploy
```

## 📦 プロジェクト構造

```
src/
├── App.tsx                      # メインゲームロジック
├── index.tsx                    # エントリーポイント
├── types.ts                     # 型定義
├── constants.ts                 # 問題データ（116問）
├── components/                  # UIコンポーネント
│   ├── BattleScene.tsx         # バトル画面
│   ├── JournalEntryForm.tsx    # 回答入力フォーム
│   ├── ResultCard.tsx          # 結果表示
│   ├── QuestionTypeSelector.tsx # 問題形式選択
│   └── RankingScreen.tsx       # スコア履歴
├── services/                    # ビジネスロジック
│   ├── problemService.ts       # 問題生成
│   ├── audioService.ts         # サウンド管理
│   └── scoreService.ts         # スコア管理
└── utils/                       # ユーティリティ
    ├── errorBoundary.tsx       # エラーハンドリング
    └── helpers.ts              # 汎用関数
```

## 🎯 簿記3級カバー範囲

- ✅ 商品売買（掛取引、現金取引、返品、諸掛）
- ✅ 現金・預金（現金過不足、当座借越、小口現金）
- ✅ 手形取引（受取手形、支払手形、不渡り）
- ✅ 固定資産（取得、減価償却、除却、修繕）
- ✅ 税金・給与（消費税、源泉所得税、法人税等）
- ✅ 決算整理（減価償却、貸倒引当金、見越繰延）
- ✅ 資本取引（設立、増資、配当）
- ✅ 伝票会計・補助簿・精算表・財務諸表

**カバー率: 95%以上**

## 📊 ビルド結果

```
dist/index.html              3.71 kB │ gzip:  1.45 kB
dist/assets/react-vendor.js  140.70 kB │ gzip: 45.17 kB
dist/assets/index.js         87.31 kB │ gzip: 27.66 kB
dist/assets/lucide.js        5.56 kB │ gzip:  2.22 kB
---------------------------------------------------
合計:                        233.57 kB │ gzip: 74.05 kB
```

## 📄 ライセンス

© 2024 Toyama Digital Works. All rights reserved.

本アプリは学習用であり、実務上の正確性を保証するものではありません。
