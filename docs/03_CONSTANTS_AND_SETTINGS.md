# 定数とゲーム設定詳細仕様書

## ファイル: constants.ts（1,560行）

このファイルはアプリケーションの核心部分で、以下を定義しています：
1. 勘定科目マスターデータ
2. モンスターリスト
3. ゲーム設定
4. **147種類の問題テンプレート**（最重要）

---

## 1. 勘定科目定義（ACCOUNT_DEFINITIONS）

### 概要
日商簿記3級で使用する全勘定科目を5つのカテゴリーに分類。

### データ構造
```typescript
export const ACCOUNT_DEFINITIONS: { 
  name: string; 
  category: 'Asset' | 'Liability' | 'NetAsset' | 'Revenue' | 'Expense' 
}[] = [...]
```

### カテゴリー別勘定科目数

| カテゴリー | 日本語 | 勘定科目数 | 例 |
|---|---|---|---|
| `Asset` | 資産 | 32科目 | 現金、売掛金、商品、建物 |
| `Liability` | 負債 | 18科目 | 買掛金、借入金、未払金 |
| `NetAsset` | 純資産 | 4科目 | 資本金、繰越利益剰余金 |
| `Revenue` | 収益 | 10科目 | 売上、受取利息、受取家賃 |
| `Expense` | 費用 | 24科目 | 仕入、給料、支払家賃 |

**合計**: 88科目

### 資産（Asset）32科目
```typescript
現金, 小口現金
普通預金, 当座預金, 定期預金
受取手形, 売掛金, 電子記録債権, クレジット売掛金
貸付金, 手形貸付金
仮払金, 立替金, 前払金
未収金, 差入保証金
受取商品券, 不渡手形
売買目的有価証券
商品, 貯蔵品, 消耗品
建物, 備品, 車両運搬具, 土地
前払費用, 未収収益, 仮払法人税等, 仮払消費税
```

### 負債（Liability）18科目
```typescript
買掛金, 支払手形, 電子記録債務, 未払金
借入金, 手形借入金
当座借越, 前受金
預り金, 仮受金
所得税預り金, 社会保険料預り金
未払法人税等, 未払配当金, 未払消費税
商品券
未払費用, 前受収益, 仮受消費税
```

### 純資産（NetAsset）4科目
```typescript
資本金, 資本準備金, 利益準備金, 繰越利益剰余金
```

### 収益（Revenue）10科目
```typescript
売上
受取利息, 受取家賃, 受取配当金, 受取手数料
雑収入
償却債権取立益, 固定資産売却益, 貸倒引当金戻入
有価証券売却益
```

### 費用（Expense）24科目
```typescript
仕入
給料, 法定福利費
旅費交通費, 通信費, 水道光熱費
広告宣伝費, 消耗品費
支払家賃, 支払地代, 支払利息, 支払手数料
租税公課, 貸倒損失, 雑費, 雑損, 現金過不足
減価償却費, 貸倒引当金繰入
固定資産売却損, 固定資産除却損
有価証券売却損
法人税、住民税及び事業税
```

### iOS実装時の考慮点
```swift
struct AccountDefinition: Codable {
    let name: String
    let category: AccountCategory
}

enum AccountCategory: String, Codable {
    case asset = "Asset"
    case liability = "Liability"
    case netAsset = "NetAsset"
    case revenue = "Revenue"
    case expense = "Expense"
    
    var displayName: String {
        switch self {
        case .asset: return "資産"
        case .liability: return "負債"
        case .netAsset: return "純資産"
        case .revenue: return "収益"
        case .expense: return "費用"
        }
    }
}
```

---

## 2. 勘定科目リスト（ACCOUNT_TITLES）

### 概要
セレクトボックス表示用の文字列配列（91科目）。

```typescript
export const ACCOUNT_TITLES = [
  ...ACCOUNT_DEFINITIONS.map(d => d.name),  // 88科目
  '貸倒引当金',      // 評価勘定
  '減価償却累計額',  // 評価勘定
  '損益'            // 決算用
];
```

### 特別な勘定科目

| 科目 | 分類 | 説明 |
|---|---|---|
| **貸倒引当金** | 評価勘定 | 売掛金等のマイナス勘定 |
| **減価償却累計額** | 評価勘定 | 固定資産のマイナス勘定 |
| **損益** | 決算用 | 収益・費用を集計する勘定 |

### 使用場面
- 仕訳問題の勘定科目セレクトボックス
- 問題生成時の選択可能勘定科目リスト

---

## 3. モンスターリスト（MONSTERS_LIST）

### 定義
```typescript
export const MONSTERS_LIST = [
  { name: 'スライム', emoji: '💧', hp: 30 },
  { name: 'バット', emoji: '🦇', hp: 40 },
  { name: 'スケルトン', emoji: '💀', hp: 50 },
  { name: 'ゴースト', emoji: '👻', hp: 60 },
  { name: 'オーク', emoji: '👹', hp: 80 },
  { name: 'ミミック', emoji: '📦', hp: 90 },
  { name: 'ゴーレム', emoji: '🗿', hp: 100 },
  { name: 'ケルベロス', emoji: '🐺', hp: 120 },
  { name: 'サイクロプス', emoji: '👁️', hp: 150 },
  { name: 'ドラゴン', emoji: '🐉', hp: 200 },
  { name: 'キングデーモン', emoji: '👿', hp: 250 },
  { name: '魔王', emoji: '👑', hp: 300 },
];
```

### モンスター一覧表

| No. | 名前 | 絵文字 | HP | 難易度 |
|---|---|---|---|---|
| 1 | スライム | 💧 | 30 | ★☆☆☆☆ |
| 2 | バット | 🦇 | 40 | ★☆☆☆☆ |
| 3 | スケルトン | 💀 | 50 | ★★☆☆☆ |
| 4 | ゴースト | 👻 | 60 | ★★☆☆☆ |
| 5 | オーク | 👹 | 80 | ★★☆☆☆ |
| 6 | ミミック | 📦 | 90 | ★★★☆☆ |
| 7 | ゴーレム | 🗿 | 100 | ★★★☆☆ |
| 8 | ケルベロス | 🐺 | 120 | ★★★★☆ |
| 9 | サイクロプス | 👁️ | 150 | ★★★★☆ |
| 10 | ドラゴン | 🐉 | 200 | ★★★★★ |
| 11 | キングデーモン | 👿 | 250 | ★★★★★ |
| 12 | 魔王 | 👑 | 300 | ★★★★★ |

### 出現ロジック
モンスターはランダムに選択されます。
```typescript
const randomMonster = MONSTERS_LIST[Math.floor(Math.random() * MONSTERS_LIST.length)];
```

### HP設計思想
- **初級**: HP 30-60（2-3問で撃破）
- **中級**: HP 80-120（3-4問で撃破）
- **上級**: HP 150-300（5-10問で撃破）

### iOS実装例
```swift
struct MonsterTemplate {
    let name: String
    let emoji: String
    let hp: Int
}

let monstersList: [MonsterTemplate] = [
    MonsterTemplate(name: "スライム", emoji: "💧", hp: 30),
    // ...
]
```

---

## 4. 最大問題数（MAX_QUESTIONS）

### 定義
```typescript
export const MAX_QUESTIONS = 100;
```

### 説明
1プレイでの最大問題数。100問達成でクリア。

### 使用場面
- 進行度計算（`questionsAnswered / MAX_QUESTIONS`）
- 時間制限の動的調整
- プログレスバー表示

---

## 5. ゲーム設定（GAME_SETTINGS）

### 定義
```typescript
export const GAME_SETTINGS = {
  Easy: {
    playerHp: 300,
    startInterval: 30,
    minInterval: 10,
  },
  Hard: {
    playerHp: 100,
    startInterval: 20,
    minInterval: 5,
  },
  Practice: {
    playerHp: 999999,
    startInterval: 999999,
    minInterval: 999999,
  }
};
```

### 詳細比較表

| 項目 | Practice | Easy | Hard |
|---|---|---|---|
| **プレイヤーHP** | 999,999（無限） | 300 | 100 |
| **初期制限時間** | なし | 30秒 | 20秒 |
| **最短制限時間** | なし | 10秒 | 5秒 |
| **時間経過ダメージ** | なし | あり | あり |
| **BGM** | Easy BGM | Easy BGM | Hard BGM |
| **想定対象** | 初学者 | 初心者 | 上級者 |

### 制限時間の動的調整ロジック

#### 計算式
```typescript
const calculateInterval = (difficulty: Difficulty, qIndex: number) => {
  const settings = GAME_SETTINGS[difficulty];
  const progress = Math.min(qIndex / MAX_QUESTIONS, 1);
  const current = settings.startInterval - (progress * (settings.startInterval - settings.minInterval));
  return Math.max(settings.minInterval, current);
};
```

#### Easyモードの時間推移

| 問題数 | 進行度 | 制限時間 |
|---|---|---|
| 1問目 | 0% | 30秒 |
| 25問目 | 25% | 25秒 |
| 50問目 | 50% | 20秒 |
| 75問目 | 75% | 15秒 |
| 100問目 | 100% | 10秒 |

#### Hardモードの時間推移

| 問題数 | 進行度 | 制限時間 |
|---|---|---|
| 1問目 | 0% | 20秒 |
| 25問目 | 25% | 16.25秒 |
| 50問目 | 50% | 12.5秒 |
| 75問目 | 75% | 8.75秒 |
| 100問目 | 100% | 5秒 |

### 時間経過ダメージ

#### ダメージ計算式
```typescript
const damage = 10 + Math.floor(questionsAnswered / 10);
```

#### ダメージ推移表

| 問題数 | ダメージ |
|---|---|
| 1-9問 | 10 |
| 10-19問 | 11 |
| 20-29問 | 12 |
| 30-39問 | 13 |
| 90-99問 | 19 |
| 100問 | 20 |

### iOS実装例
```swift
struct GameSettings {
    let playerHP: Int
    let startInterval: TimeInterval
    let minInterval: TimeInterval
    
    static let practice = GameSettings(
        playerHP: 999999,
        startInterval: .infinity,
        minInterval: .infinity
    )
    
    static let easy = GameSettings(
        playerHP: 300,
        startInterval: 30.0,
        minInterval: 10.0
    )
    
    static let hard = GameSettings(
        playerHP: 100,
        startInterval: 20.0,
        minInterval: 5.0
    )
}
```

---

## 6. 問題テンプレート（PROBLEM_TEMPLATES）

### 概要
**147種類**の問題テンプレートを定義。これがアプリの最も重要な部分。

### 構成
```
総数: 147問
├─ 仕訳問題（JOURNAL）: 78問（54%）
├─ 選択問題（SELECTION）: 35問（24%）
├─ 計算問題（NUMERIC）: 31問（21%）
└─ 決算総合問題（STATEMENT）: 3問（2%）

範囲タグ:
├─ 標準（standard）: 104問
├─ 発展（advanced）: 30問
├─ 旧範囲（legacy）: 3問
└─ 現行3級範囲外（out_of_scope）: 10問

通常出題では `standard` と `advanced` を対象にし、`legacy` と `out_of_scope` は除外する。
```

### セクション一覧（30カテゴリー）

| No. | カテゴリー | 問題数 | 難易度 |
|---|---|---|---|
| 1 | 現金・預金 | 5問 | ★☆☆ |
| 2 | 商品売買 | 4問 | ★★☆ |
| 3 | 手形・電子記録債権 | 4問 | ★★☆ |
| 4 | 有価証券・固定資産 | 1問 | ★★★ |
| 5 | 税金・給与 | 5問 | ★★★ |
| 6 | 決算整理 | 21問 | ★★★★ |
| 7 | 有価証券取引 | 3問 | ★★★ |
| 8 | 定期預金の利息 | 2問 | ★★☆ |
| 9 | 訂正仕訳 | 2問 | ★★★ |
| 10 | 貸倒れの実際発生 | 3問 | ★★★ |
| 11 | 当座借越 | 1問 | ★★☆ |
| 12 | 固定資産の購入 | 2問 | ★★★ |
| 13 | 現金過不足 | 2問 | ★★☆ |
| 14 | 手形の割引 | 1問 | ★★★ |
| 15 | 給料の支払い | 2問 | ★★★ |
| 16 | 電子記録債権・債務 | 2問 | ★★☆ |
| 17 | クレジット売上 | 1問 | ★★☆ |
| 18 | 貸付金と借入金の利息 | 3問 | ★★★ |
| 19 | 減価償却の各種計算 | 2問 | ★★★★ |
| 20 | 貸倒引当金の各種パターン | 2問 | ★★★★ |
| 21 | 売上原価・商品関連の計算 | 2問 | ★★★★ |
| 22 | 決算整理の複合計算 | 2問 | ★★★★★ |
| 23 | 利息・手数料の計算 | 2問 | ★★★ |
| 24 | 当期純利益の計算 | 1問 | ★★★★★ |
| 25 | 消費税を含む複合取引 | 2問 | ★★★★ |
| 26 | 決算整理の複合処理 | 3問 | ★★★★★ |
| 27 | 固定資産の売却 | 2問 | ★★★★ |
| 28 | 複雑な給与計算 | 1問 | ★★★★ |
| 29 | 期中の複合取引 | 3問 | ★★★★ |
| 30 | 固定資産の修繕と改良 | 2問 | ★★★ |

### 問題テンプレートの構造例

#### 例1: シンプルな仕訳問題
```typescript
{
  type: QuestionType.JOURNAL,
  textTemplate: (a, t) => `${t}より売掛金の回収として、同店振出しの小切手${a.toLocaleString()}円を受け取った。`,
  generateJournalAnswer: (a) => ({
    debits: [{ account: '現金', amount: a }],
    credits: [{ account: '売掛金', amount: a }]
  }),
  explanation: "他店振出しの小切手は、通貨代用証券として「現金」勘定で処理します。"
}
```

**生成例**:
```
問題文: A商店より売掛金の回収として、同店振出しの小切手10,000円を受け取った。

正解:
借方: 現金 10,000円
貸方: 売掛金 10,000円

解説: 他店振出しの小切手は、通貨代用証券として「現金」勘定で処理します。
```

#### 例2: 複合仕訳問題
```typescript
{
  type: QuestionType.JOURNAL,
  textTemplate: (a, t) => `${t}に対する買掛金${a.toLocaleString()}円を支払うため、当座預金口座から振り込んだ。なお、振込手数料${(660).toLocaleString()}円は当方負担とし、普通預金から支払われた。`,
  generateJournalAnswer: (a) => ({
    debits: [
      { account: '買掛金', amount: a }, 
      { account: '支払手数料', amount: 660 }
    ],
    credits: [
      { account: '当座預金', amount: a }, 
      { account: '普通預金', amount: 660 }
    ]
  }),
  explanation: "振込手数料は「支払手数料」として処理します。"
}
```

#### 例3: 選択問題
```typescript
{
  type: QuestionType.SELECTION,
  textTemplate: () => `「建物」の勘定科目はどの分類に属しますか？`,
  generateSelectionAnswer: () => ({
    correct: '資産',
    options: ['資産', '負債', '純資産', '収益']
  }),
  explanation: "建物は固定資産に分類され、資産の一部です。"
}
```

#### 例4: 計算問題
```typescript
{
  type: QuestionType.NUMERIC,
  textTemplate: (a) => `商品${a.toLocaleString()}円を仕入れ、消費税10%を含めて現金で支払った。合計金額はいくらですか？`,
  generateNumericAnswer: (a) => a * 1.1,
  explanation: "消費税10%を加算するため、元の金額に1.1を掛けます。"
}
```

### ランダムパラメータ生成

#### 金額（amount）
```typescript
const amounts = [5000, 10000, 15000, 20000, 30000, 50000, 100000];
const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
```

#### 対象（target）
```typescript
const targets = ['A商店', 'B株式会社', 'C工場', 'D銀行'];
const randomTarget = targets[Math.floor(Math.random() * targets.length)];
```

### iOS実装時の考慮点

#### テンプレートのJSON化
Web版はTypeScriptの関数でテンプレートを定義していますが、iOS版ではJSON形式に変換する必要があります。

**アプローチ1**: サーバーAPIで問題生成
```swift
// APIから生成済みの問題を取得
struct Problem: Codable {
    let id: String
    let type: String
    let text: String
    let correctAnswer: Answer
    let options: [String]?
    let explanation: String
}
```

**アプローチ2**: ローカルで問題生成
```swift
// テンプレートをSwiftで再実装
struct ProblemTemplate {
    let type: QuestionType
    let generateText: (Int, String?) -> String
    let generateAnswer: (Int, String?) -> Answer
    let explanation: String
}
```

**推奨**: アプローチ2（完全オフライン動作）

---

## 7. 現行3級範囲タグ分布

`problemScopeService.ts`で、テンプレートを現行3級対策としての扱いに分類する。

| タグ | 問題数 | 通常出題 | 用途 |
|---|---:|---|---|
| `standard` | 108 | 対象 | 現行3級の標準演習 |
| `advanced` | 23 | 対象 | 合格後半・実戦寄りの発展演習 |
| `legacy` | 3 | 除外 | 個人商店前提や旧処理の確認用 |
| `out_of_scope` | 10 | 除外 | 現行3級範囲外または2級以上寄り |

今後、テンプレートごとの難易度を明示的に扱う場合は、範囲タグとは別に `difficultyLevel` などのメタデータを追加する。

---

## 8. iOS版への移行戦略

### ステップ1: テンプレートの抽出
Web版の`PROBLEM_TEMPLATES`を分析し、以下の形式でJSON化。

```json
{
  "templates": [
    {
      "id": "journal_001",
      "type": "JOURNAL",
      "category": "現金・預金",
      "difficulty": 1,
      "textPattern": "{target}より売掛金の回収として、同店振出しの小切手{amount}円を受け取った。",
      "debitAccount": "現金",
      "debitAmount": "{amount}",
      "creditAccount": "売掛金",
      "creditAmount": "{amount}",
      "explanation": "他店振出しの小切手は、通貨代用証券として「現金」勘定で処理します。"
    }
  ]
}
```

### ステップ2: Swiftでの問題生成エンジン
```swift
class ProblemGenerator {
    func generate(template: Template) -> Problem {
        let amount = [5000, 10000, 20000].randomElement()!
        let target = ["A商店", "B株式会社"].randomElement()!
        
        let text = template.textPattern
            .replacingOccurrences(of: "{amount}", with: "\\(amount.formatted())")
            .replacingOccurrences(of: "{target}", with: target)
        
        return Problem(
            id: UUID().uuidString,
            type: template.type,
            text: text,
            correctAnswer: generateAnswer(template, amount: amount),
            explanation: template.explanation
        )
    }
}
```

### ステップ3: オフライン動作の確保
- すべてのテンプレートをアプリバンドルに含める
- CoreDataでユーザーデータを管理
- ネットワーク不要で完全動作

---

## まとめ

`constants.ts`は以下を提供します：

1. **88種類の勘定科目マスター**
2. **12種類のモンスター**
3. **3段階の難易度設定**
4. **147種類の問題テンプレート**
   - 仕訳: 78問
   - 選択: 35問
   - 計算: 31問
   - 決算総合: 3問
   - 範囲タグ: 標準104 / 発展30 / 旧範囲3 / 範囲外10

iOS版では、これらを**JSON形式**または**Swift構造体**で再実装することで、完全なオフライン動作を実現できます。
