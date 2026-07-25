# コンポーネント詳細仕様書

## 概要

このアプリは5つの主要なReactコンポーネントで構成されています：

1. **BattleScene.tsx** (133行): 戦闘画面UI
2. **JournalEntryForm.tsx** (358行): 問題回答入力フォーム
3. **QuestionTypeSelector.tsx** (132行): 出題範囲選択画面
4. **RankingScreen.tsx** (222行): ランキング・履歴表示
5. **ResultCard.tsx** (177行): 結果カード
6. **SettingsScreen.tsx** (77行): サウンド設定画面

---

## 1. BattleScene.tsx - 戦闘画面UI

### ファイル情報
- **行数**: 133行
- **役割**: モンスターとの戦闘シーンを視覚的に表示
- **依存**: types.ts, lucide-react

### Props定義

```typescript
interface BattleSceneProps {
  monster: Monster;           // 現在のモンスター情報
  playerState: PlayerState;   // プレイヤーの状態（HP等）
  timeRatio: number;          // 0.0～1.0（攻撃タイミングゲージ）
  damageDisplay: {            // ダメージ表示（アニメーション用）
    amount: number;
    isCritical: boolean;
    target: 'monster' | 'player';
  } | null;
  isShaking: boolean;         // モンスターの振動エフェクト
}
```

### UI構造

```
┌─────────────────────────────────────┐
│ 🌥️ 背景エフェクト（雲・山）   🌥️   │
│                                     │
│ [Monster Name] Lv.5                 │
│ ███████░░░ (HP Bar)                │
│                                     │
│                                     │
│           👹 (モンスター)            │
│         [100 DMG!]                  │
│                                     │
│                                     │
│ 🛡️ PLAYER HP: 250/300              │
│ ██████████░░ (Player HP Bar)       │
│ ⏱️ MONSTER ATTACK ██████░░ (Gauge) │
└─────────────────────────────────────┘
```

### 主要機能

#### 1. HPバーの色変更
```typescript
let playerHpColor = 'bg-green-500';
if (playerHpPercentage < 30) playerHpColor = 'bg-red-500 animate-pulse';
else if (playerHpPercentage < 60) playerHpColor = 'bg-yellow-500';
```

**ルール**:
- 60%以上: 緑
- 30-60%: 黄色
- 30%未満: 赤（点滅）

#### 2. 攻撃ゲージの色変更
```typescript
let timeColor = 'bg-blue-500';
if (timeRatio > 0.7) timeColor = 'bg-yellow-500';
if (timeRatio > 0.9) timeColor = 'bg-red-600 animate-pulse';
```

**ルール**:
- 0-70%: 青
- 70-90%: 黄色
- 90-100%: 赤（点滅、危険！）

#### 3. ダメージポップアップ
```typescript
{damageDisplay && damageDisplay.target === 'monster' && (
  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full z-20 pointer-events-none animate-damage w-full text-center">
    <div className={`font-black text-6xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] stroke-black ${damageDisplay.isCritical ? 'text-yellow-400 scale-125' : 'text-white'}`}>
      {damageDisplay.amount}
      {damageDisplay.isCritical && <span className="text-sm block text-center text-yellow-300 font-bold mt-1 animate-pulse">CRITICAL!!</span>}
    </div>
  </div>
)}
```

**仕様**:
- 通常: 白文字、サイズ6xl
- クリティカル: 黄色、1.25倍拡大、「CRITICAL!!」表示

#### 4. プレイヤーダメージのフラッシュエフェクト
```typescript
{damageDisplay && damageDisplay.target === 'player' && (
  <div className="absolute inset-0 bg-red-500/30 animate-pulse z-0 rounded-lg pointer-events-none"></div>
)}
```

赤いオーバーレイで画面全体を点滅させる。

#### 5. モンスターの振動アニメーション
```typescript
<div className={`relative text-7xl sm:text-8xl md:text-8xl transition-transform duration-100 cursor-default select-none ${isShaking ? 'animate-shake' : 'animate-bounce-slow'}`}>
  {monster.emoji}
</div>
```

**アニメーション**:
- 通常: `animate-bounce-slow`（ゆっくり跳ねる）
- 攻撃時: `animate-shake`（振動）

---

### iOS実装時の考慮点

#### SwiftUI実装例

```swift
struct BattleSceneView: View {
    let monster: Monster
    let playerState: PlayerState
    let timeRatio: Double
    let damageDisplay: DamageDisplay?
    let isShaking: Bool
    
    var body: some View {
        ZStack {
            // 背景
            backgroundLayer
            
            VStack(spacing: 20) {
                // モンスター情報
                monsterInfoView
                
                Spacer()
                
                // モンスター絵文字
                Text(monster.emoji)
                    .font(.system(size: 80))
                    .offset(x: isShaking ? 10 : 0)
                    .animation(.easeInOut(duration: 0.1).repeatCount(3), value: isShaking)
                
                // ダメージポップアップ
                if let damage = damageDisplay, damage.target == .monster {
                    damagePopup(damage)
                }
                
                Spacer()
                
                // プレイヤー情報
                playerInfoView
            }
            .padding()
            
            // プレイヤーダメージフラッシュ
            if let damage = damageDisplay, damage.target == .player {
                Color.red.opacity(0.3)
                    .animation(.easeInOut(duration: 0.3), value: damageDisplay)
            }
        }
    }
    
    private var playerHpColor: Color {
        let percentage = Double(playerState.currentHp) / Double(playerState.maxHp)
        if percentage < 0.3 { return .red }
        else if percentage < 0.6 { return .yellow }
        else { return .green }
    }
}
```

---

## 2. JournalEntryForm.tsx - 問題回答入力フォーム

### ファイル情報
- **行数**: 358行
- **役割**: 3種類の問題タイプに対応した入力フォーム
- **依存**: types.ts, constants.ts, audioService.ts, lucide-react

### Props定義

```typescript
interface JournalEntryFormProps {
  problem: GeneratedProblem;    // 現在の問題
  onSubmit: (answer: UserAnswer) => void;  // 回答送信
  isSubmitting: boolean;        // 送信中フラグ
}
```

### State管理

```typescript
// 仕訳問題用
const [debits, setDebits] = useState<JournalEntryItem[]>([{ account: '', amount: 0 }]);
const [credits, setCredits] = useState<JournalEntryItem[]>([{ account: '', amount: 0 }]);

// 計算問題用
const [numericInput, setNumericInput] = useState<string | number>('');

// 選択問題用
const [selectedOption, setSelectedOption] = useState<string | null>(null);
```

---

### 問題タイプ別UI

#### タイプ1: 選択問題 (SELECTION)

**レイアウト**:
```
┌─────────────────────────────────┐
│ [選択肢1]    [選択肢2]           │
│ [選択肢3]    [選択肢4]           │
│                                 │
│         [⚔️ 攻撃決定！]         │
└─────────────────────────────────┘
```

**実装**:
```typescript
<div className="grid grid-cols-2 gap-3">
  {problem.options?.map((option, idx) => (
    <button
      key={idx}
      onClick={() => {
        audioService.playSfx(SoundType.SFX_SELECT);
        setSelectedOption(option);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && selectedOption === option) {
          handleSelectionSubmit();
        }
      }}
      className={`p-3 rounded-xl border-2 font-bold transition-all ${
        selectedOption === option
          ? 'bg-indigo-600 border-indigo-400 ring-4 ring-indigo-500/20'
          : 'bg-slate-900/80 border-slate-600'
      }`}
    >
      <span>{option}</span>
    </button>
  ))}
</div>
```

**特徴**:
- グリッド2列レイアウト
- 選択時に青いリング表示
- Enterキーで即送信可能

---

#### タイプ2: 計算問題 (NUMERIC)

**レイアウト**:
```
┌─────────────────────────────────┐
│ 計算結果を選択してください         │
│ 🧮 [¥24,000 ▼]                  │
│                                 │
│     [⚔️ 攻撃決定！]             │
└─────────────────────────────────┘
```

**実装**:
```typescript
<select
  value={numericInput}
  onChange={(e) => {
    audioService.playSfx(SoundType.SFX_SELECT);
    setNumericInput(Number(e.target.value));
  }}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && numericInput !== '') {
      handleNumericSubmit();
    }
  }}
  className="w-full pl-12 pr-10 py-3 text-lg font-bold text-right bg-slate-800/80 border-2 border-slate-600 rounded-xl"
>
  <option value="" disabled>答えを選択</option>
  {availableAmounts.map((amt) => (
    <option key={amt} value={amt}>¥{amt.toLocaleString()}</option>
  ))}
</select>
```

**特徴**:
- ドロップダウン形式
- 金額はカンマ区切り表示
- 電卓アイコン付き

---

#### タイプ3: 仕訳問題 (JOURNAL)

**レイアウト**:
```
┌─────────────────────────────────────────┐
│ 借方 (左)          │  貸方 (右)          │
│ ─────────────────── │ ─────────────────── │
│ [現金 ▼] [24000▼]  │ [売掛金▼] [24000▼] │
│ [🗑️]               │ [🗑️]               │
│ + 行を追加          │ + 行を追加          │
│                                          │
│ 借方計: ¥24,000   貸方計: ¥24,000       │
│              [⚔️ 攻撃決定！]             │
└─────────────────────────────────────────┘
```

**実装**:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* 借方 (Debit Side) */}
  <div className="bg-slate-900/80 p-3 rounded-xl border-2 border-indigo-500/50">
    <h3 className="text-base font-bold text-slate-200 mb-2">
      <span className="w-3 h-3 bg-indigo-500 rounded-full"></span> 借方 (左)
    </h3>
    {debits.map((row, index) => (
      <div key={`debit-${index}`} className="flex gap-2 items-center">
        {/* 勘定科目選択 */}
        <select
          value={row.account}
          onChange={(e) => handleChange('debit', index, 'account', e.target.value)}
          className="flex-1 p-2 border rounded-md bg-slate-800/80"
        >
          <option value="">勘定科目を選択</option>
          {availableAccounts.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        
        {/* 金額選択 */}
        <select
          value={row.amount === 0 ? '' : row.amount}
          onChange={(e) => handleChange('debit', index, 'amount', e.target.value)}
          className="w-36 p-2 border rounded-md text-right font-mono font-bold"
        >
          <option value="" disabled>金額を選択</option>
          {availableAmounts.map((amt) => (
            <option key={amt} value={amt}>¥{amt.toLocaleString()}</option>
          ))}
        </select>
        
        {/* 削除ボタン */}
        <button
          onClick={() => handleRemoveRow('debit', index)}
          disabled={debits.length === 1}
        >
          <Trash2 size={18} />
        </button>
      </div>
    ))}
    
    {/* 行追加ボタン */}
    <button onClick={() => handleAddRow('debit')}>
      <Plus size={16} /> 行を追加
    </button>
  </div>
  
  {/* 貸方 (Credit Side) - 同様の構造 */}
</div>
```

**特徴**:
- 借方・貸方を左右に配置
- 複数行入力可能（+ 行を追加）
- 削除ボタン（最低1行は残す）
- 貸借バランスチェック

---

### バリデーション

#### 仕訳問題のバリデーションロジック

```typescript
const totalDebit = debits.reduce((acc, curr) => acc + (curr.amount || 0), 0);
const totalCredit = credits.reduce((acc, curr) => acc + (curr.amount || 0), 0);

const hasEmptyAccounts = debits.some(d => !d.account) || credits.some(c => !c.account);
const isBalanced = totalDebit === totalCredit && totalDebit > 0;
const isFormValid = isBalanced && !hasEmptyAccounts;
```

**条件**:
1. 借方合計 = 貸方合計
2. 合計金額 > 0
3. すべての勘定科目が選択済み

#### エラーメッセージ表示

```typescript
{!isBalanced && (
  <p className="text-red-400 text-sm font-bold bg-red-900/20 py-1 rounded animate-pulse">
    貸借の金額が一致していません！
  </p>
)}
{hasEmptyAccounts && (
  <p className="text-yellow-400 text-sm font-bold bg-yellow-900/20 py-1 rounded">
    勘定科目を選択してください！
  </p>
)}
```

---

### キーボード操作対応

すべての問題タイプでEnterキー送信に対応。

```typescript
onKeyDown={(e) => {
  if (e.key === 'Enter' && numericInput !== '') {
    handleNumericSubmit();
  }
}}
```

---

### iOS実装時の考慮点

#### 仕訳問題の入力UI

```swift
struct JournalEntryFormView: View {
    @State private var debits: [JournalEntryItem] = [JournalEntryItem()]
    @State private var credits: [JournalEntryItem] = [JournalEntryItem()]
    
    var body: some View {
        HStack {
            // 借方
            VStack {
                Text("借方")
                ForEach(debits.indices, id: \.self) { index in
                    HStack {
                        Picker("勘定科目", selection: $debits[index].account) {
                            ForEach(availableAccounts, id: \.self) { account in
                                Text(account).tag(account)
                            }
                        }
                        
                        Picker("金額", selection: $debits[index].amount) {
                            ForEach(availableAmounts, id: \.self) { amount in
                                Text("¥\(amount)").tag(amount)
                            }
                        }
                        
                        Button(action: { removeDebit(at: index) }) {
                            Image(systemName: "trash")
                        }
                        .disabled(debits.count == 1)
                    }
                }
                
                Button("+ 行を追加") {
                    debits.append(JournalEntryItem())
                }
            }
            
            // 貸方（同様）
        }
    }
}
```

---

## 3. QuestionTypeSelector.tsx - 出題範囲選択画面

### ファイル情報
- **行数**: 132行
- **役割**: 問題タイプの選択（第1問・第2問・第3問）
- **依存**: types.ts, lucide-react

### Props定義

```typescript
interface QuestionTypeSelectorProps {
  onConfirm: (types: QuestionType[]) => void;  // 選択確定
  onBack: () => void;                          // 戻る
}
```

### State管理

```typescript
const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
  QuestionType.JOURNAL,
  QuestionType.SELECTION,
  QuestionType.NUMERIC
]);
```

**初期状態**: すべて選択済み

---

### UI構造

```
┌────────────────────────────────────────┐
│           📚                           │
│      出題範囲を選択                     │
│  挑戦したい問題タイプを選んでください    │
│                                        │
│ ┌────────────────────────────────┐   │
│ │ 📝 第1問: 仕訳問題              ✓ │   │
│ │ 取引の仕訳を入力                  │   │
│ └────────────────────────────────┘   │
│                                        │
│ ┌────────────────────────────────┐   │
│ │ ✅ 第2問: 選択問題              ✓ │   │
│ │ 正しい選択肢を選ぶ                │   │
│ └────────────────────────────────┘   │
│                                        │
│ ┌────────────────────────────────┐   │
│ │ 🔢 第3問: 数値問題              ✓ │   │
│ │ 金額や数値を計算                  │   │
│ └────────────────────────────────┘   │
│                                        │
│ [この範囲で挑戦開始 (3タイプ選択中)]   │
│ [← 難易度選択に戻る]                 │
└────────────────────────────────────────┘
```

---

### 問題タイプ情報

```typescript
const typeInfo = [
  {
    type: QuestionType.JOURNAL,
    name: '第1問: 仕訳問題',
    description: '取引の仕訳を入力',
    emoji: '📝',
    color: 'blue'
  },
  {
    type: QuestionType.SELECTION,
    name: '第2問: 選択問題',
    description: '正しい選択肢を選ぶ',
    emoji: '✅',
    color: 'green'
  },
  {
    type: QuestionType.NUMERIC,
    name: '第3問: 数値問題',
    description: '金額や数値を計算',
    emoji: '🔢',
    color: 'purple'
  }
];
```

---

### 選択ロジック

```typescript
const toggleType = (type: QuestionType) => {
  if (selectedTypes.includes(type)) {
    // 最低1つは選択必須
    if (selectedTypes.length > 1) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    }
  } else {
    setSelectedTypes([...selectedTypes, type]);
  }
};
```

**制約**: 最低1つは選択必須（すべて外すことは不可）

---

### 選択状態の視覚フィードバック

```typescript
<button
  onClick={() => toggleType(info.type)}
  className={`w-full p-6 rounded-xl border-4 transition-all hover:scale-105 ${
    selected 
      ? 'bg-blue-900/60 border-blue-500'   // 選択中
      : 'bg-slate-800 border-slate-600'    // 未選択
  }`}
>
  <div className="flex items-center gap-4">
    <div className="text-4xl">{info.emoji}</div>
    <div className="flex-1 text-left">
      <h3 className="text-xl font-bold">{info.name}</h3>
      <p className="text-slate-400">{info.description}</p>
    </div>
    <div className="text-white">
      {selected ? <CheckCircle2 size={32} /> : <Circle size={32} />}
    </div>
  </div>
</button>
```

**スタイル**:
- 選択中: 濃い青背景、青枠、チェックマーク
- 未選択: 暗灰色背景、灰色枠、空円

---

### iOS実装時の考慮点

```swift
struct QuestionTypeSelectorView: View {
    @State private var selectedTypes: Set<QuestionType> = [.journal, .selection, .numeric]
    
    var body: some View {
        VStack(spacing: 20) {
            Text("出題範囲を選択")
                .font(.largeTitle.bold())
            
            ForEach(QuestionType.allCases, id: \.self) { type in
                Button(action: { toggleType(type) }) {
                    HStack {
                        Text(type.emoji)
                            .font(.system(size: 40))
                        
                        VStack(alignment: .leading) {
                            Text(type.name)
                                .font(.headline)
                            Text(type.description)
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        
                        Spacer()
                        
                        Image(systemName: selectedTypes.contains(type) ? "checkmark.circle.fill" : "circle")
                            .foregroundColor(selectedTypes.contains(type) ? .blue : .gray)
                    }
                    .padding()
                    .background(selectedTypes.contains(type) ? Color.blue.opacity(0.2) : Color.gray.opacity(0.1))
                    .cornerRadius(12)
                }
            }
            
            Button("この範囲で挑戦開始") {
                onConfirm(Array(selectedTypes))
            }
            .disabled(selectedTypes.isEmpty)
        }
    }
    
    func toggleType(_ type: QuestionType) {
        if selectedTypes.contains(type) {
            if selectedTypes.count > 1 {
                selectedTypes.remove(type)
            }
        } else {
            selectedTypes.insert(type)
        }
    }
}
```

---

## 4. RankingScreen.tsx - ランキング・履歴表示

### ファイル情報
- **行数**: 222行
- **役割**: プレイ履歴とベストスコアの表示
- **依存**: types.ts, scoreService.ts, lucide-react

### Props定義

```typescript
interface RankingScreenProps {
  onBack: () => void;
}
```

### State管理

```typescript
const [history, setHistory] = useState<ScoreRecord[]>([]);
const [bestEasy, setBestEasy] = useState(0);
const [bestHard, setBestHard] = useState(0);
const [loading, setLoading] = useState(true);
const [filter, setFilter] = useState<'All' | Difficulty>('All');
```

---

### UI構造

```
┌────────────────────────────────────────┐
│ ← 戻る                                  │
│                                        │
│ ┌──────────┐  ┌──────────┐            │
│ │EASY BEST │  │HARD BEST │            │
│ │  12,500  │  │  8,000   │            │
│ └──────────┘  └──────────┘            │
│                                        │
│ 📜 プレイ履歴   [All][Easy][Hard]      │
│ ┌────────────────────────────────┐   │
│ │ 2025/11/21 14:30               │   │
│ │ EASY Q.15 / 討伐 3    12,500   │   │
│ ├────────────────────────────────┤   │
│ │ 2025/11/21 13:00               │   │
│ │ HARD Q.10 / 討伐 2     8,000   │   │
│ └────────────────────────────────┘   │
└────────────────────────────────────────┘
```

---

### ベストスコア表示

```typescript
<div className="grid grid-cols-2 gap-4 mb-8">
  <div className="bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700 text-center relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
    <h2 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-2">EASY BEST</h2>
    <div className="text-3xl font-black text-white font-mono">
      {bestEasy.toLocaleString()}
    </div>
  </div>
  
  <div className="bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700 text-center relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
    <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">HARD BEST</h2>
    <div className="text-3xl font-black text-white font-mono">
      {bestHard.toLocaleString()}
    </div>
  </div>
</div>
```

**特徴**:
- 2列グリッド
- Easy: 緑のアクセント
- Hard: 赤のアクセント
- スコアはカンマ区切り

---

### フィルター機能

```typescript
<div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
  {(['All', 'Easy', 'Hard'] as const).map(type => (
    <button
      key={type}
      onClick={() => setFilter(type)}
      className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
        filter === type 
          ? 'bg-indigo-600 text-white shadow' 
          : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      {type}
    </button>
  ))}
</div>
```

**フィルタリングロジック**:
```typescript
const filteredHistory = history.filter(rec => 
  filter === 'All' || rec.difficulty === filter
);
```

---

### 履歴リスト

```typescript
{filteredHistory.map((rec, idx) => (
  <div key={idx} className="p-5 flex items-center justify-between hover:bg-slate-750 transition-colors group">
    <div>
      {/* 日時 */}
      <div className="text-xs text-slate-500 mb-1">
        {new Date(rec.date).toLocaleString()}
      </div>
      
      {/* 難易度・統計 */}
      <div className="font-bold text-white flex items-center gap-3">
        <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold border ${
          rec.difficulty === 'Hard' 
            ? 'bg-red-900/50 border-red-700 text-red-300' 
            : 'bg-green-900/50 border-green-700 text-green-300'
        }`}>
          {rec.difficulty}
        </span>
        <span className="text-sm text-slate-300 flex items-center gap-1">
          Q.{rec.questionsAnswered} / 討伐 {rec.monsterDefeated}
        </span>
      </div>
    </div>
    
    {/* スコア */}
    <div className="text-2xl font-mono font-bold text-indigo-300 group-hover:text-yellow-400 transition-colors">
      {rec.score.toLocaleString()}
    </div>
  </div>
))}
```

**特徴**:
- ホバー時にハイライト
- スコアがホバー時に黄色に変化
- 難易度バッジ（Easy: 緑、Hard: 赤）

---

### iOS実装時の考慮点

```swift
struct RankingScreenView: View {
    @State private var history: [ScoreRecord] = []
    @State private var bestEasy: Int = 0
    @State private var bestHard: Int = 0
    @State private var filter: FilterType = .all
    
    var filteredHistory: [ScoreRecord] {
        switch filter {
        case .all: return history
        case .easy: return history.filter { $0.difficulty == .easy }
        case .hard: return history.filter { $0.difficulty == .hard }
        }
    }
    
    var body: some View {
        VStack {
            // ベストスコア
            HStack(spacing: 20) {
                bestScoreCard(title: "EASY BEST", score: bestEasy, color: .green)
                bestScoreCard(title: "HARD BEST", score: bestHard, color: .red)
            }
            
            // フィルター
            Picker("Filter", selection: $filter) {
                Text("All").tag(FilterType.all)
                Text("Easy").tag(FilterType.easy)
                Text("Hard").tag(FilterType.hard)
            }
            .pickerStyle(SegmentedPickerStyle())
            
            // 履歴リスト
            List(filteredHistory) { record in
                HStack {
                    VStack(alignment: .leading) {
                        Text(record.date, style: .date)
                            .font(.caption)
                            .foregroundColor(.secondary)
                        
                        HStack {
                            DifficultyBadge(difficulty: record.difficulty)
                            Text("Q.\(record.questionsAnswered) / 討伐 \(record.monsterDefeated)")
                                .font(.caption)
                        }
                    }
                    
                    Spacer()
                    
                    Text("\(record.score)")
                        .font(.title2.bold().monospaced())
                        .foregroundColor(.blue)
                }
            }
        }
        .onAppear {
            loadData()
        }
    }
    
    func loadData() {
        history = scoreService.getHistory()
        bestEasy = scoreService.getPersonalBest(.easy)
        bestHard = scoreService.getPersonalBest(.hard)
    }
}
```

---

## 5. ResultCard.tsx - 結果カード

### ファイル情報
- **行数**: 177行
- **役割**: 回答結果の表示・解説・次へ進むボタン
- **依存**: types.ts, lucide-react

### Props定義

```typescript
interface ResultCardProps {
  problem: GeneratedProblem;     // 問題情報
  userAnswer: UserAnswer | null; // ユーザーの回答
  result: BattleResult;          // 結果（正解/不正解、ダメージ等）
  onNext: () => void;            // 次へ進む
  isGameOver: boolean;           // ゲームオーバーか
}
```

---

### 状態判定

```typescript
let state: 'win' | 'miss' | 'surrender' | 'dead' = 'miss';
if (result.isCorrect) state = 'win';
else if (userAnswer === null && !result.playerDefeated) state = 'surrender';
else if (result.playerDefeated) state = 'dead';
```

**4つの状態**:
1. **win**: 正解
2. **miss**: 不正解
3. **surrender**: 降参（タイムアップ）
4. **dead**: プレイヤー死亡

---

### UI構造（正解時）

```
┌────────────────────────────────────────┐
│ ⚔️ HIT!                                │
│                                        │
│       100 DMG                          │
│    ⚡️ SPEED BONUS ⚡️                  │
│   💀 モンスター討伐！                   │
└────────────────────────────────────────┘
│                                        │
│ 📖 解説                                │
│ 他店振出しの小切手は、通貨代用証券として  │
│ 「現金」勘定で処理します。               │
└────────────────────────────────────────┘
│ あなたの回答    │    正解               │
│ (借)現金 24000  │  (借)現金 24000      │
│ (貸)売掛金24000 │  (貸)売掛金24000     │
└────────────────────────────────────────┘
│                                        │
│     [次のターンへ →]                   │
└────────────────────────────────────────┘
```

---

### 結果バナー

```typescript
<div className={`text-center p-6 rounded-lg border-4 ${
  state === 'win' ? 'bg-indigo-900/80 border-indigo-500' : 
  state === 'dead' ? 'bg-red-950 border-red-600' :
  state === 'surrender' ? 'bg-slate-700/80 border-slate-500' :
  'bg-red-900/80 border-red-500'
}`}>
  <div className={`flex items-center justify-center gap-3 text-3xl font-black ${
    state === 'win' ? 'text-indigo-300' : 
    state === 'dead' ? 'text-red-500' :
    state === 'surrender' ? 'text-slate-300' :
    'text-red-400'
  }`}>
    {state === 'win' && <><Swords size={36} /> HIT!</>}
    {state === 'miss' && <><XCircle size={36} /> MISS...</>}
    {state === 'dead' && <><AlertTriangle size={36} /> YOU DIED</>}
    {state === 'surrender' && <><Flag size={36} /> RETIRED</>}
  </div>
```

**配色**:
- win: 青紫
- miss: 赤
- dead: 濃い赤
- surrender: 灰色

---

### ダメージ表示

```typescript
{state === 'win' && (
  <div className="flex flex-col items-center gap-1">
    <div className="text-5xl font-black text-yellow-400 drop-shadow-lg font-pixel">
      {result.damageDealt} <span className="text-lg text-white">DMG</span>
    </div>
    {result.isCritical && (
      <span className="text-red-400 font-bold animate-pulse">
        ⚡️ SPEED BONUS ⚡️
      </span>
    )}
  </div>
)}
```

---

### 回答比較テーブル

#### 仕訳問題の場合

```typescript
const renderUserAnswer = () => {
  if (problem.type === QuestionType.JOURNAL) {
    const ans = userAnswer as JournalEntryAnswer;
    return (
      <div className="space-y-1 text-slate-300 font-mono text-xs">
        {ans.debits.map((d, i) => (
          <div key={`ud-${i}`} className="flex justify-between border-b border-slate-800/50 pb-1">
            <span>(借){d.account}</span>
            <span>¥{d.amount.toLocaleString()}</span>
          </div>
        ))}
        {ans.credits.map((c, i) => (
          <div key={`uc-${i}`} className="flex justify-between border-b border-slate-800/50 pb-1">
            <span>(貸){c.account}</span>
            <span>¥{c.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
};
```

#### 選択問題の場合

```typescript
if (problem.type === QuestionType.SELECTION) {
  return <div className="text-slate-300 font-bold text-lg">{userAnswer as string}</div>;
}
```

#### 計算問題の場合

```typescript
if (problem.type === QuestionType.NUMERIC) {
  return <div className="text-slate-300 font-mono font-bold text-xl">{(userAnswer as number).toLocaleString()}</div>;
}
```

---

### 次へ進むボタン

```typescript
<button
  onClick={onNext}
  className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02] ${
    isGameOver 
      ? 'bg-red-600 hover:bg-red-700 text-white' 
      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
  }`}
>
  {isGameOver ? '結果画面へ' : result.monsterDefeated ? '次のモンスターへ' : '次のターンへ'} 
  <ArrowRight size={20} />
</button>
```

**ボタンテキスト**:
- ゲームオーバー: 「結果画面へ」
- モンスター討伐: 「次のモンスターへ」
- それ以外: 「次のターンへ」

---

### iOS実装時の考慮点

```swift
struct ResultCardView: View {
    let problem: GeneratedProblem
    let userAnswer: UserAnswer?
    let result: BattleResult
    let isGameOver: Bool
    let onNext: () -> Void
    
    var state: ResultState {
        if result.isCorrect { return .win }
        if userAnswer == nil && !result.playerDefeated { return .surrender }
        if result.playerDefeated { return .dead }
        return .miss
    }
    
    var body: some View {
        VStack(spacing: 20) {
            // 結果バナー
            resultBanner
            
            // 解説
            explanationSection
            
            // 回答比較
            comparisonGrid
            
            // 次へボタン
            Button(action: onNext) {
                HStack {
                    Text(buttonTitle)
                    Image(systemName: "arrow.right")
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(isGameOver ? Color.red : Color.blue)
                .foregroundColor(.white)
                .cornerRadius(12)
            }
        }
        .padding()
    }
    
    var buttonTitle: String {
        if isGameOver { return "結果画面へ" }
        if result.monsterDefeated { return "次のモンスターへ" }
        return "次のターンへ"
    }
}
```

---

## コンポーネント間の連携図

```
App.tsx (メイン)
    │
    ├── QuestionTypeSelector ──┐
    │                          │
    ├── BattleScene ───────────┤ State共有
    │                          │
    ├── JournalEntryForm ──────┤
    │                          │
    ├── ResultCard ────────────┤
    │                          │
    └── RankingScreen ─────────┘
```

---

## 共通UIパターン

### 1. ボタンスタイル

**主要ボタン**:
```css
bg-indigo-600 hover:bg-indigo-700 
text-white font-bold rounded-xl 
shadow-lg transition-all 
hover:scale-105 active:scale-95
```

**無効化ボタン**:
```css
bg-slate-600 text-slate-400 
cursor-not-allowed opacity-50
```

### 2. カードスタイル

```css
bg-slate-800 rounded-xl 
border border-slate-700 
shadow-lg p-6
```

### 3. アニメーション

**フェードイン**:
```css
animate-in fade-in slide-in-from-bottom-4 duration-500
```

**スケール変化**:
```css
hover:scale-105 active:scale-95 transition-all
```

**点滅**:
```css
animate-pulse
```

---

## レスポンシブデザイン

すべてのコンポーネントはモバイルファーストで設計。

**ブレークポイント**:
- sm: 640px
- md: 768px
- lg: 1024px

**例**:
```css
text-base md:text-lg        /* モバイル: 16px、タブレット: 18px */
grid-cols-1 md:grid-cols-2  /* モバイル: 1列、タブレット: 2列 */
```

---

## iOS版への移行戦略まとめ

### UIフレームワーク
- **React → SwiftUI**
- コンポーネント構造はほぼ1:1で対応可能

### State管理
- **useState → @State / @StateObject**
- **useEffect → .onAppear / .onChange**

### スタイリング
- **TailwindCSS → SwiftUIのModifier**
- `.padding()`, `.background()`, `.cornerRadius()`等

### アニメーション
- **CSS Animation → SwiftUI Animation**
- `.animation()`, `.transition()`, `.withAnimation()`

これでコンポーネントレイヤーのドキュメント化が完了しました。次はApp.tsxのメインロジック分析に進みます。
