# 📚 簿記トレーニング大戦 - 3級100本ノック

RPG風の簿記学習ゲーム。147種の問題テンプレートから実質無限の問題を生成し、モンスターを倒しながら日商簿記3級を学習できます。

## ✨ 特徴

- 🎮 **RPGバトルシステム**: 問題を解いてモンスターを倒す爽快感
- 🎲 **実質無限の出題パターン**: 147種のテンプレート × ランダム数値生成で毎回異なる問題
- 📝 **豊富な問題形式**: 仕訳78種 + 選択35種 + 計算31種 + 決算総合3種のテンプレート
- 🧭 **現行3級範囲タグ**: 標準・発展・旧範囲・範囲外を分類し、通常出題では旧範囲/範囲外を除外
- 🔁 **間違い復習**: 間違えた問題を問題文・正答つきで保存し、履歴画面から再挑戦可能
- ⏱️ **タイムアタック**: 制限時間内に素早く解答してクリティカルヒット
- 🎯 **問題形式選択**: 苦手分野に絞った練習が可能
- 🎵 **BGM・効果音**: Web Audio APIによる本格的なサウンド
- 📊 **スコア記録**: プレイ履歴とベストスコアの管理
- 📱 **レスポンシブ対応**: スマホ・タブレット・PCすべてで快適

## 🚀 技術スタック

- **フレームワーク**: React 18.3.1 + TypeScript 5.9.3（lockfile基準）
- **ビルドツール**: Vite 7.3.3（lockfile基準）
- **スタイリング**: TailwindCSS (PostCSS/Vite build)
- **アイコン**: Lucide React 0.263.1
- **デプロイ**: Cloudflare Pages（GitHub push 連携）

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

# 問題テンプレート監査
npm run audit:problems

# 本番ビルド
npm run build

# 本番相当プレビュー
npm run preview
```

## 🚢 本番更新

本番環境は Cloudflare Pages が GitHub の更新を検知してビルド・配信します。更新前は必ず以下を通してください。

```bash
npm run audit:problems
npm run build
```

`npm run deploy` は GitHub Pages 用の補助コマンドです。通常の本番更新では、レビュー後に GitHub へ push し、Cloudflare Pages のデプロイ完了を確認します。

## 📦 プロジェクト構造

```
src/
├── App.tsx                      # メインゲームロジック
├── index.tsx                    # エントリーポイント
├── types.ts                     # 型定義
├── constants.ts                 # 問題データ（147テンプレート）
├── components/                  # UIコンポーネント
│   ├── BattleScene.tsx         # バトル画面
│   ├── JournalEntryForm.tsx    # 回答入力フォーム
│   ├── ResultCard.tsx          # 結果表示
│   ├── QuestionTypeSelector.tsx # 問題形式選択
│   └── RankingScreen.tsx       # スコア履歴
├── services/                    # ビジネスロジック
│   ├── problemService.ts       # 問題生成
│   ├── problemScopeService.ts  # 現行3級範囲タグ分類
│   ├── wrongAnswerService.ts   # 間違い問題の保存・復習
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

通常出題は現行3級の標準・発展問題を対象にし、旧範囲・範囲外タグの問題は除外します。

## 📊 品質確認

```bash
npm run test:run
npm run audit:problems
npx tsc --noEmit
```

## 📄 ライセンス

© 2024 Toyama Digital Works. All rights reserved.

本アプリは学習用であり、実務上の正確性を保証するものではありません。
