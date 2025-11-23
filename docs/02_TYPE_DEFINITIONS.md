# 型定義詳細仕様書

## ファイル: types.ts

このファイルは、アプリケーション全体で使用される型定義を集約しています。
TypeScriptの型システムを活用し、完全な型安全性を実現しています。

---

## 1. 問題タイプ（QuestionType）

### 定義
```typescript
export enum QuestionType {
  JOURNAL = '仕訳問題',
  SELECTION = '選択問題',
  NUMERIC = '計算問題',
}
```

### 説明
日商簿記3級の出題形式を3種類に分類。

| 値 | 日本語 | 英語表記 | 説明 |
|---|---|---|---|
| `JOURNAL` | 仕訳問題 | Journal Entry | 借方・貸方の勘定科目と金額を入力 |
| `SELECTION` | 選択問題 | Multiple Choice | 4つの選択肢から正解を選ぶ |
| `NUMERIC` | 計算問題 | Numeric Input | 数値（金額）を計算して入力 |

### iOS実装時の考慮点
- SwiftUIでは `enum` として実装
- `String` の `rawValue` を持たせる
- 各問題タイプごとに異なるViewを表示

```swift
enum QuestionType: String, Codable {
    case journal = "仕訳問題"
    case selection = "選択問題"
    case numeric = "計算問題"
}
```

---

## 2. 難易度（Difficulty）

### 定義
```typescript
export type Difficulty = 'Easy' | 'Hard' | 'Practice';
```

### 説明
ゲームの難易度を3段階で管理。

| 値 | 日本語 | プレイヤーHP | 初期制限時間 | 最短制限時間 | 特徴 |
|---|---|---|---|---|---|
| `Practice` | 練習 | 999,999（無限） | なし | なし | 時間制限なし、ダメージなし |
| `Easy` | 初級 | 300 | 30秒 | 10秒 | 初心者向け、ゆっくり考えられる |
| `Hard` | 上級 | 100 | 20秒 | 5秒 | 上級者向け、素早い判断が必要 |

### 制限時間の動的変更
問題数が増えるごとに徐々に時間が短縮される。

**計算式**:
```typescript
const progress = Math.min(qIndex / MAX_QUESTIONS, 1);
const current = startInterval - (progress * (startInterval - minInterval));
```

例: Easyモードで50問目の場合
- `progress = 50 / 100 = 0.5`
- `current = 30 - (0.5 * (30 - 10)) = 20秒`

### iOS実装時の考慮点
```swift
enum Difficulty: String, Codable {
    case practice = "Practice"
    case easy = "Easy"
    case hard = "Hard"
    
    var playerHP: Int {
        switch self {
        case .practice: return 999999
        case .easy: return 300
        case .hard: return 100
        }
    }
    
    var startInterval: TimeInterval {
        switch self {
        case .practice: return .infinity
        case .easy: return 30.0
        case .hard: return 20.0
        }
    }
}
```

---

## 3. 簿記レベル（BookkeepingLevel）

### 定義
```typescript
export type BookkeepingLevel = 'Level3' | 'Level2';
```

### 説明
日商簿記の級を表す。現在は3級のみ実装。

| 値 | 日本語 | 実装状況 |
|---|---|---|
| `Level3` | 3級 | ✅ 実装済み |
| `Level2` | 2級 | 🔜 将来対応予定 |

---

## 4. 勘定科目分類（AccountCategory）

### 定義
```typescript
export type AccountCategory = 'Asset' | 'Liability' | 'NetAsset' | 'Revenue' | 'Expense';
```

### 説明
簿記の5大要素を表す。第2問対策用（現在未使用）。

| 値 | 日本語 | 説明 | 例 |
|---|---|---|---|
| `Asset` | 資産 | 会社が持っている財産 | 現金、売掛金、建物 |
| `Liability` | 負債 | 会社が返さなければならないお金 | 買掛金、借入金 |
| `NetAsset` | 純資産 | 資産 - 負債 | 資本金、利益剰余金 |
| `Revenue` | 収益 | 会社の売上 | 売上、受取利息 |
| `Expense` | 費用 | 会社の経費 | 仕入、給料、広告費 |

---

## 5. 仕訳項目（JournalEntryItem）

### 定義
```typescript
export interface JournalEntryItem {
  account: string;  // 勘定科目
  amount: number;   // 金額
}
```

### 説明
仕訳の1行を表す。借方または貸方の1つの項目。

### 例
```typescript
const item: JournalEntryItem = {
  account: '現金',
  amount: 10000
};
```

### iOS実装例
```swift
struct JournalEntryItem: Codable {
    let account: String
    let amount: Int
}
```

---

## 6. 仕訳回答（JournalEntryAnswer）

### 定義
```typescript
export interface JournalEntryAnswer {
  debits: JournalEntryItem[];   // 借方（複数可）
  credits: JournalEntryItem[];  // 貸方（複数可）
}
```

### 説明
仕訳問題の完全な回答。借方と貸方のリスト。

### 例: 単純仕訳
```typescript
const answer: JournalEntryAnswer = {
  debits: [{ account: '現金', amount: 10000 }],
  credits: [{ account: '売掛金', amount: 10000 }]
};
```

### 例: 複合仕訳
```typescript
const answer: JournalEntryAnswer = {
  debits: [
    { account: '現金', amount: 8000 },
    { account: '売掛金', amount: 2000 }
  ],
  credits: [
    { account: '売上', amount: 10000 }
  ]
};
```

### 検証ルール
1. **貸借平衡**: `sum(debits.amount) === sum(credits.amount)`
2. **勘定科目必須**: すべてのitemで `account !== ''`
3. **金額正数**: すべてのitemで `amount > 0`

---

## 7. ユーザー回答（UserAnswer）

### 定義
```typescript
export type UserAnswer = 
  | JournalEntryAnswer  // 仕訳問題用
  | string              // 選択問題用
  | number;             // 計算問題用
```

### 説明
Union型で3種類の問題タイプに対応。

| 問題タイプ | 型 | 例 |
|---|---|---|
| 仕訳問題 | `JournalEntryAnswer` | `{ debits: [...], credits: [...] }` |
| 選択問題 | `string` | `"現金"` |
| 計算問題 | `number` | `10000` |

### iOS実装時の考慮点
```swift
enum UserAnswer: Codable {
    case journal(JournalEntryAnswer)
    case selection(String)
    case numeric(Int)
}
```

---

## 8. 問題テンプレート（ProblemTemplate）

### 定義
```typescript
export interface ProblemTemplate {
  type: QuestionType;
  textTemplate: (amount: number, target?: string) => string;
  generateJournalAnswer?: (amount: number, target?: string) => JournalEntryAnswer;
  generateSelectionAnswer?: () => { correct: string; options: string[] };
  generateNumericAnswer?: (amount: number) => number;
  explanation: string;
}
```

### 説明
問題を生成するための設計図。116種類存在。

### プロパティ詳細

#### `type: QuestionType`
問題のタイプ（仕訳/選択/計算）

#### `textTemplate: (amount, target?) => string`
問題文を生成する関数。
- `amount`: ランダム生成された金額（例: 10000）
- `target`: オプショナルな対象（例: "A商店"）

**例**:
```typescript
textTemplate: (a) => `現金${a.toLocaleString()}円を当座預金に預け入れた。`
```

#### `generateJournalAnswer?: (amount, target?) => JournalEntryAnswer`
仕訳問題の正解を生成。

**例**:
```typescript
generateJournalAnswer: (a) => ({
  debits: [{ account: '当座預金', amount: a }],
  credits: [{ account: '現金', amount: a }]
})
```

#### `generateSelectionAnswer?: () => { correct, options }`
選択問題の正解と選択肢を生成。

**例**:
```typescript
generateSelectionAnswer: () => ({
  correct: '現金',
  options: ['現金', '売掛金', '買掛金', '未収入金']
})
```

#### `generateNumericAnswer?: (amount) => number`
計算問題の正解を生成。

**例**:
```typescript
generateNumericAnswer: (a) => a * 0.1  // 10%計算
```

#### `explanation: string`
問題の解説文。

---

## 9. 生成済み問題（GeneratedProblem）

### 定義
```typescript
export interface GeneratedProblem {
  id: string;
  type: QuestionType;
  text: string;
  
  correctJournal?: JournalEntryAnswer;
  correctSelection?: string;
  correctNumeric?: number;
  
  options?: string[];
  selectableAccounts?: string[];
  amountOptions?: number[];
  
  explanation: string;
  difficulty: Difficulty;
}
```

### 説明
ProblemTemplateから実際に生成された問題インスタンス。

### プロパティ詳細

| プロパティ | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | `string` | ✅ | ユニークID（UUID） |
| `type` | `QuestionType` | ✅ | 問題タイプ |
| `text` | `string` | ✅ | 問題文 |
| `correctJournal` | `JournalEntryAnswer` | 仕訳のみ | 正解の仕訳 |
| `correctSelection` | `string` | 選択のみ | 正解の選択肢 |
| `correctNumeric` | `number` | 計算のみ | 正解の数値 |
| `options` | `string[]` | 選択のみ | 選択肢リスト |
| `selectableAccounts` | `string[]` | 仕訳のみ | 選択可能な勘定科目 |
| `amountOptions` | `number[]` | 仕訳/計算 | 選択可能な金額 |
| `explanation` | `string` | ✅ | 解説文 |
| `difficulty` | `Difficulty` | ✅ | 難易度 |

### 例: 仕訳問題
```typescript
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  type: QuestionType.JOURNAL,
  text: "現金10,000円を当座預金に預け入れた。",
  correctJournal: {
    debits: [{ account: "当座預金", amount: 10000 }],
    credits: [{ account: "現金", amount: 10000 }]
  },
  selectableAccounts: ["現金", "当座預金", "普通預金", ...],
  amountOptions: [5000, 10000, 15000, 20000],
  explanation: "現金から当座預金への振替取引です。",
  difficulty: "Easy"
}
```

---

## 10. モンスター（Monster）

### 定義
```typescript
export interface Monster {
  id: string;
  name: string;
  emoji: string;
  maxHp: number;
  currentHp: number;
  level: number;
}
```

### 説明
戦闘相手のモンスター情報。

### プロパティ詳細

| プロパティ | 型 | 説明 | 例 |
|---|---|---|---|
| `id` | `string` | ユニークID | `"monster-1"` |
| `name` | `string` | モンスター名 | `"仕訳スライム"` |
| `emoji` | `string` | 表示する絵文字 | `"👾"` |
| `maxHp` | `number` | 最大HP | `200` |
| `currentHp` | `number` | 現在のHP | `150` |
| `level` | `number` | レベル | `1` |

### モンスターリスト
```typescript
const MONSTERS = [
  { name: '仕訳スライム', emoji: '👾', maxHp: 200, level: 1 },
  { name: '勘定ゴブリン', emoji: '👹', maxHp: 300, level: 2 },
  { name: '借方オーク', emoji: '👺', maxHp: 400, level: 3 },
  { name: '貸方トロール', emoji: '😈', maxHp: 500, level: 4 },
  { name: '簿記ドラゴン', emoji: '🐉', maxHp: 600, level: 5 },
];
```

---

## 11. プレイヤー状態（PlayerState）

### 定義
```typescript
export interface PlayerState {
  maxHp: number;
  currentHp: number;
  score: number;
  combo: number;
}
```

### 説明
プレイヤーの現在の状態。

| プロパティ | 型 | 説明 |
|---|---|---|
| `maxHp` | `number` | 最大HP（難易度により変化） |
| `currentHp` | `number` | 現在のHP |
| `score` | `number` | 現在のスコア |
| `combo` | `number` | 連続正解数 |

### スコア計算式
```
基本スコア = 100点
時間ボーナス = (残り時間 / 制限時間) * 50点
コンボボーナス = combo * 10点
クリティカル = 2倍

最終スコア = (基本 + 時間 + コンボ) * (クリティカル ? 2 : 1)
```

---

## 12. バトル結果（BattleResult）

### 定義
```typescript
export interface BattleResult {
  damageDealt: number;
  damageTaken: number;
  isCorrect: boolean;
  isCritical: boolean;
  timeBonus: number;
  monsterDefeated: boolean;
  playerDefeated: boolean;
}
```

### 説明
1問終了時の結果情報。

| プロパティ | 型 | 説明 |
|---|---|---|
| `damageDealt` | `number` | モンスターに与えたダメージ |
| `damageTaken` | `number` | プレイヤーが受けたダメージ |
| `isCorrect` | `boolean` | 正解かどうか |
| `isCritical` | `boolean` | クリティカルヒットかどうか |
| `timeBonus` | `number` | 時間ボーナス点 |
| `monsterDefeated` | `boolean` | モンスターを倒したか |
| `playerDefeated` | `boolean` | プレイヤーが倒されたか |

---

## 13. サウンドタイプ（SoundType）

### 定義
```typescript
export enum SoundType {
  BGM_TITLE,
  BGM_BATTLE_EASY,
  BGM_BATTLE_HARD,
  SFX_SELECT,
  SFX_DECISION,
  SFX_ATTACK,
  SFX_DAMAGE,
  SFX_CRITICAL,
  SFX_CLEAR,
  SFX_GAMEOVER,
  SFX_CANCEL
}
```

### 説明
アプリ内で使用する全サウンドの列挙型。

| 値 | タイプ | 説明 | 使用場面 |
|---|---|---|---|
| `BGM_TITLE` | BGM | タイトル画面 | タイトル表示時 |
| `BGM_BATTLE_EASY` | BGM | Easy/Practice戦闘 | Easy/Practice選択時 |
| `BGM_BATTLE_HARD` | BGM | Hard戦闘 | Hard選択時 |
| `SFX_SELECT` | 効果音 | 選択音 | ボタンにカーソル、選択肢選択 |
| `SFX_DECISION` | 効果音 | 決定音 | 攻撃決定、モード選択 |
| `SFX_ATTACK` | 効果音 | 攻撃音 | 正解時のダメージ |
| `SFX_DAMAGE` | 効果音 | 被ダメージ音 | 時間切れ、不正解 |
| `SFX_CRITICAL` | 効果音 | クリティカル音 | クリティカルヒット時 |
| `SFX_CLEAR` | 効果音 | クリア音 | モンスター撃破 |
| `SFX_GAMEOVER` | 効果音 | ゲームオーバー音 | HP 0時 |
| `SFX_CANCEL` | 効果音 | キャンセル音 | 戻るボタン |

### iOS実装時の考慮点
Web Audio APIの代わりにAVFoundationを使用。
```swift
enum SoundType {
    case bgmTitle
    case bgmBattleEasy
    case bgmBattleHard
    case sfxSelect
    // ...
    
    var filename: String {
        // 音声ファイルのパスを返す
    }
}
```

---

## 14. サウンド設定（SoundSettings）

### 定義
```typescript
export interface SoundSettings {
  bgm: boolean;
  sfx: boolean;
}
```

### 説明
ユーザーのサウンド設定。

| プロパティ | 型 | デフォルト | 説明 |
|---|---|---|---|
| `bgm` | `boolean` | `true` | BGMのオン/オフ |
| `sfx` | `boolean` | `true` | 効果音のオン/オフ |

### 保存場所
- Web版: `localStorage`
- iOS版: `UserDefaults`

---

## 15. ユーザープロファイル（UserProfile）

### 定義
```typescript
export interface UserProfile {
  name: string;
  prefecture: string;
  soundSettings: SoundSettings;
}
```

### 説明
ユーザーの基本情報。

| プロパティ | 型 | 説明 |
|---|---|---|
| `name` | `string` | ユーザー名 |
| `prefecture` | `string` | 都道府県（ランキング用、現在未使用） |
| `soundSettings` | `SoundSettings` | サウンド設定 |

---

## 16. スコアレコード（ScoreRecord）

### 定義
```typescript
export interface ScoreRecord {
  id: string;
  date: string;
  score: number;
  difficulty: Difficulty;
  questionsAnswered: number;
  monsterDefeated: number;
  userName: string;
  prefecture: string;
}
```

### 説明
1プレイの記録。

| プロパティ | 型 | 説明 |
|---|---|---|
| `id` | `string` | ユニークID |
| `date` | `string` | プレイ日時（ISO 8601形式） |
| `score` | `number` | 最終スコア |
| `difficulty` | `Difficulty` | プレイした難易度 |
| `questionsAnswered` | `number` | 回答した問題数 |
| `monsterDefeated` | `number` | 倒したモンスター数 |
| `userName` | `string` | ユーザー名 |
| `prefecture` | `string` | 都道府県 |

### 保存形式
```typescript
localStorage.setItem('boki-training-scores', JSON.stringify(records));
```

---

## iOS版への型マッピング

| TypeScript | Swift | 備考 |
|---|---|---|
| `string` | `String` | - |
| `number` | `Int` / `Double` | 金額は`Int`、時間は`Double` |
| `boolean` | `Bool` | - |
| `enum` | `enum` | `Codable`準拠 |
| `interface` | `struct` | `Codable`準拠 |
| `Array<T>` | `[T]` | - |
| `Union Type` | `enum` with associated values | - |
| `Optional` | `Optional` | `?`で表現 |

### Codable準拠の重要性
iOS版ではすべての型を`Codable`準拠にすることで、JSON変換やUserDefaults保存が簡単になります。

```swift
struct GeneratedProblem: Codable {
    let id: String
    let type: QuestionType
    let text: String
    // ...
}
```
