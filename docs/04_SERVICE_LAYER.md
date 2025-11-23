# サービスレイヤー詳細仕様書

## 概要

サービスレイヤーは、ビジネスロジックを担当する3つのサービスで構成されています：

1. **audioService.ts** (249行): サウンド管理
2. **problemService.ts** (158行): 問題生成ロジック
3. **scoreService.ts** (69行): スコア・プロファイル管理

---

## 1. audioService.ts - サウンド管理サービス

### ファイル情報
- **行数**: 249行
- **依存**: Web Audio API
- **シングルトン**: `export const audioService = new AudioService();`

### クラス構造

```typescript
class AudioService {
  // プライベートプロパティ
  private ctx: AudioContext | null = null;
  private isBgmPlaying: boolean = false;
  private currentBgmType: SoundType | null = null;
  private bgmInterval: number | null = null;
  private enabled: { bgm: boolean; sfx: boolean } = { bgm: true, sfx: true };

  // パブリックメソッド
  public init(): void
  public setSettings(bgm: boolean, sfx: boolean): void
  public playSfx(type: SoundType): void
  public playBgm(type: SoundType): void
  public stopBgm(): void
}
```

### プロパティ詳細

| プロパティ | 型 | 説明 |
|---|---|---|
| `ctx` | `AudioContext \| null` | Web Audio APIのコンテキスト |
| `isBgmPlaying` | `boolean` | BGM再生中かどうか |
| `currentBgmType` | `SoundType \| null` | 現在再生中のBGM種類 |
| `bgmInterval` | `number \| null` | BGMループ用のインターバルID |
| `enabled` | `{ bgm: boolean; sfx: boolean }` | サウンド有効/無効設定 |

---

### メソッド: init()

#### 目的
AudioContextを初期化。ブラウザの自動再生ポリシーに対応するため、ユーザー操作時に遅延初期化。

#### 実装
```typescript
public init() {
  try {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('Web Audio API is not supported in this browser');
        return;
      }
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  } catch (error) {
    console.error('Failed to initialize AudioContext:', error);
    this.ctx = null;
  }
}
```

#### ブラウザ互換性対応
- Chrome/Edge: `window.AudioContext`
- Safari: `window.webkitAudioContext`

#### iOS実装時の考慮点
iOSではWeb Audio APIの代わりに**AVFoundation**を使用。

```swift
import AVFoundation

class AudioService {
    private var audioEngine: AVAudioEngine?
    private var bgmPlayer: AVAudioPlayerNode?
    
    func initialize() {
        audioEngine = AVAudioEngine()
        // 初期化処理
    }
}
```

---

### メソッド: setSettings(bgm, sfx)

#### 目的
サウンド設定の変更。

#### パラメータ
- `bgm: boolean` - BGMのオン/オフ
- `sfx: boolean` - 効果音のオン/オフ

#### 動作
1. 設定を保存
2. BGMがオフになった場合、BGMを停止
3. BGMがオンになった場合、前回のBGMを再開

---

### メソッド: playSfx(type)

#### 目的
効果音を再生。Web Audio APIで音を合成。

#### サポートする効果音

| SoundType | 波形 | 周波数変化 | 長さ | 説明 |
|---|---|---|---|---|
| `SFX_SELECT` | square | 440Hz → 880Hz | 50ms | 選択時のピロリン音 |
| `SFX_DECISION` | square | 880Hz → 1760Hz | 100ms | 決定時のポロロン音 |
| `SFX_CANCEL` | sawtooth | 300Hz → 150Hz | 100ms | キャンセル時のブーン音 |
| `SFX_ATTACK` | sawtooth | 440Hz → 110Hz | 100ms | 攻撃時のバシッ音 |
| `SFX_DAMAGE` | sawtooth + LFO | 150Hz → 50Hz | 200ms | ダメージ時のズシーン音 |
| `SFX_CRITICAL` | square | 880→1760→3520Hz | 300ms | クリティカル時のキュピーン音 |
| `SFX_CLEAR` | square | C-E-G-C（アルペジオ） | 400ms | クリア時のドレミファ音 |
| `SFX_GAMEOVER` | sawtooth | 400Hz → 100Hz | 1000ms | ゲームオーバー時の悲しい音 |

#### 実装例: SFX_SELECT
```typescript
case SoundType.SFX_SELECT:
  osc.type = 'square';  // 矩形波（レトロゲーム風）
  osc.frequency.setValueAtTime(440, t);  // 初期周波数 440Hz（ラの音）
  osc.frequency.exponentialRampToValueAtTime(880, t + 0.05);  // 50ms後に880Hzへ
  gain.gain.setValueAtTime(0.1, t);  // 音量0.1からスタート
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);  // フェードアウト
  osc.start(t);
  osc.stop(t + 0.05);  // 50ms後に停止
  break;
```

#### 実装例: SFX_CLEAR（アルペジオ）
```typescript
case SoundType.SFX_CLEAR:
  // C-E-G-C（ドミソド）のアルペジオ
  [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
    const o = this.ctx!.createOscillator();
    const g = this.ctx!.createGain();
    o.connect(g);
    g.connect(this.ctx!.destination);
    o.type = 'square';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.1, t + i * 0.1);  // 100msごとに再生
    g.gain.exponentialRampToValueAtTime(0.01, t + i * 0.1 + 0.3);
    o.start(t + i * 0.1);
    o.stop(t + i * 0.1 + 0.3);
  });
  break;
```

#### iOS実装時の考慮点
AVFoundationで音声ファイルを再生する方式が一般的。

```swift
enum SFXType {
    case select, decision, attack, damage, critical, clear, gameover, cancel
    
    var filename: String {
        switch self {
        case .select: return "sfx_select.wav"
        case .decision: return "sfx_decision.wav"
        // ...
        }
    }
}

func playSFX(_ type: SFXType) {
    guard let url = Bundle.main.url(forResource: type.filename, withExtension: nil) else { return }
    let player = try? AVAudioPlayer(contentsOf: url)
    player?.play()
}
```

---

### メソッド: playBgm(type)

#### 目的
BGMをループ再生。シンプルなメロディーをWeb Audio APIで生成。

#### BGMの種類

| SoundType | テンポ | 音階 | 雰囲気 | 使用場面 |
|---|---|---|---|---|
| `BGM_TITLE` | 250ms/音符 | G-A-B-C-D | 穏やか | タイトル画面 |
| `BGM_BATTLE_EASY` | 200ms/音符 | C-E-G（長調） | 明るい | Easy/Practice戦闘 |
| `BGM_BATTLE_HARD` | 120ms/音符 | A-C-G（短調） | 緊張感 | Hard戦闘 |

#### BGMループの仕組み
```typescript
this.bgmInterval = window.setInterval(() => {
  if (!this.isBgmPlaying) return;
  const freq = sequence[step % sequence.length];  // シーケンスをループ
  playNote(freq === 0 ? null : freq, speed / 1000);
  step++;
}, speed);
```

#### メロディー定義例: BGM_TITLE
```typescript
const melodyTitle = [
  392, 0, 392, 0, 440, 0, 392, 0, 493, 0, 440, 0,  // G(休符)G(休符)A(休符)G(休符)B(休符)A(休符)
  392, 0, 392, 0, 440, 0, 587, 0, 523, 0, 0, 0     // G(休符)G(休符)A(休符)D(休符)C(休符)(休符)(休符)
];
```

**周波数と音名の対応**:
| 周波数 | 音名 |
|---|---|
| 261Hz | C（ド） |
| 293Hz | D（レ） |
| 329Hz | E（ミ） |
| 349Hz | F（ファ） |
| 392Hz | G（ソ） |
| 440Hz | A（ラ） |
| 493Hz | B（シ） |
| 523Hz | C（ド・1オクターブ上） |

#### フェードイン処理（クリックノイズ防止）
```typescript
const playNote = (freq: number | null, duration: number) => {
  // ...
  const t = this.ctx.currentTime;
  gain.gain.setValueAtTime(0, t);  // 音量0からスタート
  gain.gain.linearRampToValueAtTime(0.03, t + 0.01);  // 10msで0.03へ
  gain.gain.setValueAtTime(0.03, t + 0.01);
  gain.gain.linearRampToValueAtTime(0.0, t + duration - 0.05);  // フェードアウト
  // ...
};
```

#### iOS実装時の考慮点
ループ再生用の音楽ファイルを用意。

```swift
var bgmPlayer: AVAudioPlayer?

func playBGM(_ type: BGMType) {
    guard let url = Bundle.main.url(forResource: type.filename, withExtension: "mp3") else { return }
    bgmPlayer = try? AVAudioPlayer(contentsOf: url)
    bgmPlayer?.numberOfLoops = -1  // 無限ループ
    bgmPlayer?.volume = 0.3
    bgmPlayer?.play()
}
```

---

### メソッド: stopBgm()

#### 目的
BGMを停止。

#### 実装
```typescript
public stopBgm() {
  this.isBgmPlaying = false;
  if (this.bgmInterval) {
    clearInterval(this.bgmInterval);
    this.bgmInterval = null;
  }
}
```

---

## 2. problemService.ts - 問題生成サービス

### ファイル情報
- **行数**: 158行
- **依存**: constants.ts, types.ts
- **主要関数**: `generateProblem()`

### 定数

#### COMPANY_NAMES
取引先名のランダム生成用。
```typescript
const COMPANY_NAMES = ['A商店', 'B商事', 'C物産', 'D商店', 'E社', 'Fマート', '山田商店', '鈴木商事'];
```

---

### ユーティリティ関数

#### shuffleArray<T>(array: T[]): T[]
配列をシャッフル（Fisher-Yatesアルゴリズム）。

```typescript
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
```

#### generateDistractorAmounts(correctAmounts: number[]): number[]
間違いの選択肢（ダミー金額）を生成。

**戦略**:
1. **微妙な変化** (20%): ±1,000〜5,000円
2. **消費税ミス** (20%): 1.1倍
3. **桁ミス** (20%): 10倍
4. **倍数ミス** (20%): 2倍または0.5倍
5. **ランダム** (20%): 完全ランダム

```typescript
const generateDistractorAmounts = (correctAmounts: number[]): number[] => {
  const distractors = new Set<number>();
  const base = correctAmounts[0] || 10000;

  while (distractors.size < 5) {
    const r = Math.random();
    let val = 0;

    if (r < 0.2) {
      // 微妙な変化
      val = base + (Math.floor(Math.random() * 10) - 5) * 1000;
    } else if (r < 0.4) {
      // 消費税ミス
      val = Math.floor(base * 1.1);
    } else if (r < 0.6) {
      // 桁ミス
      val = base * 10;
    } else if (r < 0.8) {
      // 倍数ミス
      val = base * (Math.random() > 0.5 ? 2 : 0.5);
    } else {
      // ランダム
      val = (Math.floor(Math.random() * 90) + 10) * 1000;
    }

    val = Math.floor(Math.abs(val));
    if (val > 0 && !correctAmounts.includes(val)) {
      distractors.add(val);
    }
  }
  return Array.from(distractors);
};
```

---

### メイン関数: generateProblem()

#### シグネチャ
```typescript
export const generateProblem = async (
  difficulty: Difficulty, 
  allowedTypes?: QuestionType[]
): Promise<GeneratedProblem>
```

#### パラメータ
- `difficulty`: 難易度（Practice/Easy/Hard）
- `allowedTypes`: 許可する問題タイプ（省略時は全タイプ）

#### 処理フロー

##### 1. テンプレートのフィルタリング
```typescript
const availableTemplates = allowedTypes && allowedTypes.length > 0
  ? PROBLEM_TEMPLATES.filter(t => allowedTypes.includes(t.type))
  : PROBLEM_TEMPLATES;

if (availableTemplates.length === 0) {
  throw new Error('No templates available for the selected question types');
}
```

##### 2. ランダムテンプレート選択
```typescript
const templateIndex = Math.floor(Math.random() * availableTemplates.length);
const template = availableTemplates[templateIndex];
```

##### 3. 金額生成
```typescript
let base = Math.pow(10, Math.floor(Math.random() * 3) + 3); // 1000, 10000, 100000
let multiplier = Math.floor(Math.random() * 50) + 1; 
let amount = base * multiplier; 
// 12で割り切れる金額にする（月割計算用）
amount = Math.floor(amount / 12000) * 12000 + 12000;
```

**生成される金額の範囲**:
- 最小: 12,000円
- 最大: 5,000,000円程度
- 特徴: 12で割り切れる（月割計算に対応）

##### 4. 取引先名の生成
```typescript
const targetName = COMPANY_NAMES[Math.floor(Math.random() * COMPANY_NAMES.length)];
```

##### 5. 基本問題オブジェクトの作成
```typescript
const problem: GeneratedProblem = {
  id: crypto.randomUUID(),  // UUID生成
  type: template.type,
  text: template.textTemplate(amount, targetName),
  explanation: template.explanation,
  difficulty: difficulty,
};
```

##### 6. 問題タイプ別の処理

###### 仕訳問題（JOURNAL）
```typescript
case QuestionType.JOURNAL:
  // 正解の仕訳を生成
  problem.correctJournal = template.generateJournalAnswer(amount, targetName);
  
  // 正解に含まれる勘定科目と金額を抽出
  const correctAccounts = new Set<string>();
  const correctAmounts = new Set<number>();
  
  problem.correctJournal.debits.forEach(d => {
    correctAccounts.add(d.account);
    correctAmounts.add(d.amount);
  });
  problem.correctJournal.credits.forEach(c => {
    correctAccounts.add(c.account);
    correctAmounts.add(c.amount);
  });
  
  // 勘定科目の選択肢を作成（正解 + ダミー5科目）
  const otherAccounts = ACCOUNT_TITLES.filter(a => !correctAccounts.has(a));
  const numDummyNeeded = Math.max(0, 5 - correctAccounts.size);
  const selectedDummyAccounts = shuffleArray(otherAccounts).slice(0, numDummyNeeded);
  problem.selectableAccounts = shuffleArray([...correctAccounts, ...selectedDummyAccounts]);

  // 金額の選択肢を作成（正解 + ダミー）
  const distinctCorrectAmounts = Array.from(correctAmounts);
  const dummyAmounts = generateDistractorAmounts(distinctCorrectAmounts);
  const finalAmounts = [...distinctCorrectAmounts, ...dummyAmounts].slice(0, 5);
  problem.amountOptions = shuffleArray(finalAmounts).sort((a, b) => a - b);
  break;
```

###### 選択問題（SELECTION）
```typescript
case QuestionType.SELECTION:
  const { correct, options } = template.generateSelectionAnswer();
  const shuffledOptions = shuffleArray(options);
  problem.correctSelection = correct;
  problem.options = shuffledOptions;
  break;
```

###### 計算問題（NUMERIC）
```typescript
case QuestionType.NUMERIC:
  const correctVal = template.generateNumericAnswer(amount);
  problem.correctNumeric = correctVal;

  // 金額の選択肢を生成（正解 + ダミー5つ）
  const dummyAmounts = generateDistractorAmounts([correctVal]);
  const finalAmounts = [correctVal, ...dummyAmounts].slice(0, 5);
  problem.amountOptions = shuffleArray(finalAmounts).sort((a, b) => a - b);
  break;
```

---

### 生成例

#### 入力
```typescript
const problem = await generateProblem('Easy', [QuestionType.JOURNAL]);
```

#### 出力
```typescript
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  type: "仕訳問題",
  text: "B商事より売掛金の回収として、同店振出しの小切手24,000円を受け取った。",
  correctJournal: {
    debits: [{ account: "現金", amount: 24000 }],
    credits: [{ account: "売掛金", amount: 24000 }]
  },
  selectableAccounts: ["現金", "売掛金", "買掛金", "普通預金", "商品", "仕入"],
  amountOptions: [12000, 24000, 26400, 36000, 48000],
  explanation: "他店振出しの小切手は、通貨代用証券として「現金」勘定で処理します。",
  difficulty: "Easy"
}
```

---

### iOS実装時の考慮点

#### アプローチ1: 問題生成エンジンをSwiftで実装
```swift
struct ProblemGenerator {
    func generate(difficulty: Difficulty, allowedTypes: [QuestionType]?) async throws -> GeneratedProblem {
        // 1. テンプレート選択
        let template = selectRandomTemplate(allowedTypes: allowedTypes)
        
        // 2. パラメータ生成
        let amount = generateAmount()
        let target = generateTargetName()
        
        // 3. 問題生成
        return try generateProblem(from: template, amount: amount, target: target, difficulty: difficulty)
    }
}
```

#### アプローチ2: 事前生成した問題をバンドル
```swift
// 10,000問を事前生成してJSONで配布
if let url = Bundle.main.url(forResource: "problems", withExtension: "json") {
    let data = try Data(contentsOf: url)
    let problems = try JSONDecoder().decode([GeneratedProblem].self, from: data)
}
```

**推奨**: アプローチ1（無限の問題パターン）

---

## 3. scoreService.ts - スコア管理サービス

### ファイル情報
- **行数**: 69行
- **依存**: localStorage
- **純粋関数**: すべての関数はstatic相当

### ストレージキー

```typescript
const STORAGE_KEY_HISTORY = 'boki_game_history';       // プレイ履歴
const STORAGE_KEY_BEST_EASY = 'boki_game_best_easy';   // Easyのベストスコア
const STORAGE_KEY_BEST_HARD = 'boki_game_best_hard';   // Hardのベストスコア
const STORAGE_KEY_PROFILE = 'boki_game_profile';       // ユーザープロファイル
```

---

### 関数: saveUserProfile(profile)

#### 目的
ユーザープロファイルをlocalStorageに保存。

#### パラメータ
```typescript
profile: UserProfile = {
  name: string;
  prefecture: string;
  soundSettings: SoundSettings;
}
```

#### 実装
```typescript
export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
};
```

#### iOS実装
```swift
func saveUserProfile(_ profile: UserProfile) {
    let encoder = JSONEncoder()
    if let data = try? encoder.encode(profile) {
        UserDefaults.standard.set(data, forKey: "user_profile")
    }
}
```

---

### 関数: getUserProfile()

#### 目的
保存されたユーザープロファイルを取得。

#### 戻り値
`UserProfile | null`

#### 実装
```typescript
export const getUserProfile = (): UserProfile | null => {
  const str = localStorage.getItem(STORAGE_KEY_PROFILE);
  return str ? JSON.parse(str) : null;
};
```

#### iOS実装
```swift
func getUserProfile() -> UserProfile? {
    guard let data = UserDefaults.standard.data(forKey: "user_profile") else { return nil }
    let decoder = JSONDecoder()
    return try? decoder.decode(UserProfile.self, from: data)
}
```

---

### 関数: saveScore(record)

#### 目的
スコアを保存（履歴とベストスコア）。

#### パラメータ
```typescript
record: ScoreRecord = {
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

#### 処理フロー
1. **履歴に追加**（最新100件まで保存）
2. **ベストスコア更新**（難易度別に管理）

#### 実装
```typescript
export const saveScore = (record: ScoreRecord): boolean => {
  try {
    // 1. 履歴に追加
    const historyStr = localStorage.getItem(STORAGE_KEY_HISTORY);
    const history: ScoreRecord[] = historyStr ? JSON.parse(historyStr) : [];
    const newHistory = [record, ...history].slice(0, 100);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(newHistory));

    // 2. ベストスコア更新
    const key = record.difficulty === 'Easy' ? STORAGE_KEY_BEST_EASY : STORAGE_KEY_BEST_HARD;
    const bestStr = localStorage.getItem(key);
    const currentBest = bestStr ? Number(bestStr) : 0;
    
    if (record.score > currentBest) {
      localStorage.setItem(key, String(record.score));
    }
    return true;
  } catch (e) {
    console.error("Failed to save score", e);
    return false;
  }
};
```

#### エラーハンドリング
- プライベートブラウジングモード
- localStorageが無効
- ストレージ容量不足

#### iOS実装
```swift
func saveScore(_ record: ScoreRecord) -> Bool {
    do {
        // 1. 履歴に追加
        var history = getHistory()
        history.insert(record, at: 0)
        history = Array(history.prefix(100))
        
        let encoder = JSONEncoder()
        let data = try encoder.encode(history)
        UserDefaults.standard.set(data, forKey: "score_history")
        
        // 2. ベストスコア更新
        let bestKey = record.difficulty == .easy ? "best_easy" : "best_hard"
        let currentBest = UserDefaults.standard.integer(forKey: bestKey)
        if record.score > currentBest {
            UserDefaults.standard.set(record.score, forKey: bestKey)
        }
        
        return true
    } catch {
        print("Failed to save score: \\(error)")
        return false
    }
}
```

---

### 関数: getHistory()

#### 目的
プレイ履歴を取得（最大100件）。

#### 戻り値
`ScoreRecord[]`（新しい順）

#### 実装
```typescript
export const getHistory = (): ScoreRecord[] => {
  try {
    const str = localStorage.getItem(STORAGE_KEY_HISTORY);
    return str ? JSON.parse(str) : [];
  } catch {
    return [];
  }
};
```

---

### 関数: getPersonalBest(difficulty)

#### 目的
難易度別のベストスコアを取得。

#### パラメータ
`difficulty: Difficulty`

#### 戻り値
`number`（スコアがない場合は0）

#### 実装
```typescript
export const getPersonalBest = (difficulty: Difficulty): number => {
  try {
    const key = difficulty === 'Easy' ? STORAGE_KEY_BEST_EASY : STORAGE_KEY_BEST_HARD;
    return Number(localStorage.getItem(key) || 0);
  } catch {
    return 0;
  }
};
```

#### iOS実装
```swift
func getPersonalBest(difficulty: Difficulty) -> Int {
    let key = difficulty == .easy ? "best_easy" : "best_hard"
    return UserDefaults.standard.integer(forKey: key)
}
```

---

## サービス間の依存関係

```
┌─────────────────────────────────────────┐
│         App.tsx (メインロジック)          │
└─────────────────────────────────────────┘
              ↓ ↓ ↓
   ┌──────────┼──────────┬──────────┐
   ↓          ↓          ↓          ↓
┌─────┐  ┌─────────┐  ┌──────┐  ┌──────┐
│audio│  │ problem │  │score │  │types │
│Service│  │Service │  │Service│  │      │
└─────┘  └─────────┘  └──────┘  └──────┘
   ↓          ↓          ↓          ↑
┌─────┐  ┌─────────┐  ┌──────┐     │
│Web  │  │constants│  │local │     │
│Audio│  │         │  │Storage│    │
│API  │  │         │  │       │    │
└─────┘  └─────────┘  └──────┘     │
                                    │
              すべてのサービスが依存
```

---

## iOS版への移行戦略まとめ

### audioService
- **Web Audio API** → **AVFoundation**
- 音声ファイル（.wav, .mp3）を事前に用意
- `AVAudioPlayer`で再生

### problemService
- **JavaScript関数** → **Swift構造体**
- テンプレートをJSONまたはSwift配列で定義
- ランダム生成ロジックを再実装

### scoreService
- **localStorage** → **UserDefaults** / **CoreData**
- UserDefaults: 軽量データ（設定、ベストスコア）
- CoreData: 大量データ（プレイ履歴100件）

---

## パフォーマンス考慮事項

### Web版
- **audioService**: AudioContextの初期化は遅延実行（ユーザー操作後）
- **problemService**: 問題生成は50ms以内（`setTimeout(resolve, 50)`）
- **scoreService**: localStorage書き込みは同期的だが高速

### iOS版
- **audioService**: AVAudioEngine初期化は起動時に実行
- **problemService**: 問題生成は非同期（async/await）
- **scoreService**: UserDefaults書き込みは同期、CoreDataは非同期

---

これでサービスレイヤーのドキュメント化が完了しました。次はコンポーネントレイヤーに進みます。
