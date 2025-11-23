# 簿記トレーニング大戦 - 完全設計書

## 概要

このドキュメント群は、Web版（React + TypeScript）からiOS版（Swift + SwiftUI）への完全移行を支援するために作成されました。

---

## ドキュメント構成

### 01. [プロジェクト概要](./01_PROJECT_OVERVIEW.md)
- プロジェクトの全体像
- 主要機能
- 技術スタック
- パフォーマンス指標
- iOS版への移行検討

### 02. [型定義詳細](./02_TYPE_DEFINITIONS.md)
- 全16種類の型定義
- QuestionType, Difficulty, Monster, PlayerState等
- iOS SwiftへのマッピングとCodable準拠例
- 各型の使用例

### 03. [定数・設定・問題テンプレート](./03_CONSTANTS_AND_SETTINGS.md)
- 勘定科目マスター88科目
- モンスターリスト12種
- ゲーム設定（HP、時間制限）
- 116種類の問題テンプレート
- 難易度分布、カテゴリー30種

### 04. [サービスレイヤー](./04_SERVICE_LAYER.md)
- audioService.ts (249行): Web Audio API実装
- problemService.ts (158行): 問題生成ロジック
- scoreService.ts (69行): スコア・プロファイル管理
- iOS AVFoundation/UserDefaultsへのマッピング

### 05. [コンポーネント](./05_COMPONENTS.md)
- BattleScene.tsx (133行): 戦闘画面UI
- JournalEntryForm.tsx (358行): 問題回答入力フォーム
- QuestionTypeSelector.tsx (132行): 出題範囲選択画面
- RankingScreen.tsx (107行): ランキング・履歴表示
- ResultCard.tsx (166行): 結果カード
- iOS SwiftUIへの変換例

### 06. [メインアプリロジック](./06_APP_LOGIC.md)
- App.tsx (780行): 全体統括ロジック
- 画面遷移管理
- タイマーループ
- 状態管理（20以上のstate）
- ゲームバランス
- スコア計算
- iOS ViewModelへの移行方法

### 07. [ビルド・デプロイ設定](./07_BUILD_AND_DEPLOY.md)
- Vite 7.2.4設定
- TypeScript設定
- Cloudflare Pagesデプロイ
- CSP設定
- SEO対策
- パフォーマンス最適化

### 08. [iOS移行完全ガイド](./08_IOS_MIGRATION_GUIDE.md)
- プロジェクト構成
- フェーズ別移行手順（9フェーズ）
- SwiftUI実装例
- CoreData設定
- TestFlight/App Storeデプロイ
- 推定工数24日

---

## プロジェクト統計

| 項目 | 値 |
|---|---|
| 総コード行数 | 3,522行 |
| 問題テンプレート | 116種類 |
| 勘定科目 | 91科目 |
| モンスター | 12種類 |
| 難易度 | 3種類（Practice/Easy/Hard） |
| サウンド | BGM 3種 + SFX 8種 |
| ビルド時間 | 609ms |
| ビルドサイズ | 約133KB（Gzip） |

---

## 技術スタック対応表

| Web版 | iOS版 |
|---|---|
| React 18.2.0 | SwiftUI |
| TypeScript 5.0.2 | Swift 5.9+ |
| Vite 7.2.4 | Xcode 15+ |
| localStorage | UserDefaults / CoreData |
| Web Audio API | AVFoundation |
| CSS / TailwindCSS | SwiftUI Modifiers |
| Lucide React | SF Symbols |
| npm | Swift Package Manager |
| Cloudflare Pages | TestFlight / App Store |

---

## 使い方

### Web版の開発

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

### ドキュメントの活用

1. **型定義の確認**: `02_TYPE_DEFINITIONS.md`
2. **問題データの理解**: `03_CONSTANTS_AND_SETTINGS.md`
3. **サービスロジック**: `04_SERVICE_LAYER.md`
4. **UI実装**: `05_COMPONENTS.md`
5. **全体ロジック**: `06_APP_LOGIC.md`
6. **iOS移行**: `08_IOS_MIGRATION_GUIDE.md`

### iOS版開発の始め方

1. `08_IOS_MIGRATION_GUIDE.md`を熟読
2. Xcodeでプロジェクト作成
3. `Models/Types.swift`から型定義を実装
4. `Models/Constants.swift`で定数を定義
5. `Services/`レイヤーを実装
6. `ViewModels/GameViewModel.swift`で状態管理
7. `Views/`でUI実装
8. TestFlightでテスト
9. App Storeリリース

---

## ファイル構造

```
docs/
├── README.md (このファイル)
├── 01_PROJECT_OVERVIEW.md (約150行)
├── 02_TYPE_DEFINITIONS.md (約550行)
├── 03_CONSTANTS_AND_SETTINGS.md (約450行)
├── 04_SERVICE_LAYER.md (約700行)
├── 05_COMPONENTS.md (約900行)
├── 06_APP_LOGIC.md (約850行)
├── 07_BUILD_AND_DEPLOY.md (約400行)
└── 08_IOS_MIGRATION_GUIDE.md (約1,000行)
```

**総ドキュメント行数**: 約5,000行

---

## iOS版開発の推奨フロー

### フェーズ1: 準備（1-2日）
- [ ] Xcodeプロジェクト作成
- [ ] 型定義実装（`Types.swift`）
- [ ] 定数定義（`Constants.swift`）

### フェーズ2: データレイヤー（2-3日）
- [ ] 問題テンプレート実装（`ProblemTemplates.swift`）
- [ ] 音声ファイル作成・追加

### フェーズ3: サービスレイヤー（3-5日）
- [ ] AudioService実装
- [ ] ProblemService実装
- [ ] ScoreService実装

### フェーズ4: ViewModel（5-7日）
- [ ] GameViewModel実装
- [ ] タイマー実装
- [ ] 状態管理

### フェーズ5: View（7-10日）
- [ ] TitleView実装
- [ ] BattleView実装
- [ ] BattleSceneView実装
- [ ] JournalEntryFormView実装
- [ ] ResultCardView実装
- [ ] RankingScreenView実装
- [ ] QuestionTypeSelectorView実装

### フェーズ6: テスト（2-3日）
- [ ] ユニットテスト作成
- [ ] UIテスト作成
- [ ] 実機テスト

### フェーズ7: デプロイ（1-2日）
- [ ] App Store Connectセットアップ
- [ ] TestFlightアップロード
- [ ] ベータテスト

### フェーズ8: リリース（1日）
- [ ] App Store審査提出
- [ ] 承認後リリース

**合計推定工数**: 24-35日

---

## サポート

### Web版
- **URL**: https://boki-training.pages.dev/
- **リポジトリ**: https://github.com/msy-toyama/boki-training

### ドキュメント更新日
2025年11月21日

---

## ライセンス

© 2024 Toyama Digital Works. All rights reserved.

本ドキュメントはiOS版開発のために作成されました。学習目的での利用を想定しており、実務上の正確性を保証するものではありません。
