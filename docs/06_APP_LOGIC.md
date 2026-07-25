# メインアプリロジック詳細仕様書

## 概要

`App.tsx`はアプリケーション全体を統括するメインコンポーネントです。

- **行数**: 1,087行
- **役割**: 画面遷移、状態管理、ゲームループ、スコア管理
- **依存**: すべてのサービス・コンポーネント

---

## 画面遷移図

```
          ┌─────────┐
          │ title   │ タイトル画面
          └─────────┘
               │
       ┌───────┼───────┬──────────┐
       │       │       │          │
   ┌───▼──┐ ┌─▼──────▼────┐  ┌─▼──────┐
   │settings│ │question-type│  │ranking │
   │        │ │-select      │  │        │
   └───┬───┘ └──────┬───────┘  └────┬───┘
       │            │               │
       └────────┬───▼───────────────┘
                │
          ┌─────▼──────┐
          │   battle   │ 戦闘画面
          └─────┬──────┘
                │
          ┌─────▼──────┐
          │   result   │ 結果表示
          └─────┬──────┘
                │
         ┌──────┴──────┐
         │             │
    ┌────▼────┐   ┌───▼────┐
    │gameover │   │ clear  │
    └────┬────┘   └────┬───┘
         │             │
         └──────┬──────┘
                │
          ┌─────▼──────┐
          │   title    │ タイトルへ戻る
          └────────────┘
```

---

## State管理

### 画面制御

```typescript
const [screen, setScreen] = useState<'title' | 'settings' | 'question-type-select' | 'battle' | 'result' | 'gameover' | 'clear' | 'ranking'>('title');
```

**8つの画面**:
1. **title**: タイトル画面
2. **settings**: サウンド設定
3. **question-type-select**: 出題範囲選択
4. **battle**: 戦闘画面
5. **result**: 結果表示
6. **gameover**: ゲームオーバー
7. **clear**: クリア画面
8. **ranking**: ランキング

---

### ゲーム設定

```typescript
const [soundSettings, setSoundSettings] = useState({ bgm: true, sfx: true });
const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<QuestionType[]>([
  QuestionType.JOURNAL,
  QuestionType.SELECTION,
  QuestionType.NUMERIC
]);
```

---

### データ

```typescript
const [problem, setProblem] = useState<GeneratedProblem | null>(null);
const [loading, setLoading] = useState(false);
const [currentHighScore, setCurrentHighScore] = useState(0);
```

---

### 進行状況

```typescript
const [questionsAnswered, setQuestionsAnswered] = useState(0);
const [monsterIndex, setMonsterIndex] = useState(0);
```

---

### エンティティ

```typescript
const [currentMonster, setCurrentMonster] = useState<Monster | null>(null);
const [playerState, setPlayerState] = useState<PlayerState>({
  maxHp: 100,
  currentHp: 100,
  score: 0,
  combo: 0
});
```

---

### ターン・結果

```typescript
const [userAnswer, setUserAnswer] = useState<UserAnswer | null>(null);
const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
const [isSubmitting, setIsSubmitting] = useState(false);
```

---

### ビジュアル・タイマー

```typescript
const [timer, setTimer] = useState(0);              // 経過時間（秒）
const [attackInterval, setAttackInterval] = useState(15);  // 攻撃インターバル（秒）
const [damageDisplay, setDamageDisplay] = useState<{ amount: number; isCritical: boolean; target: 'monster' | 'player' } | null>(null);
const [isShaking, setIsShaking] = useState(false);
```

---

### その他

```typescript
const [showSurrenderConfirm, setShowSurrenderConfirm] = useState(false);
const timerRef = useRef<number | null>(null);
```

---

## useEffect管理

### 1. オーディオ設定の初期化

```typescript
useEffect(() => {
  const profile = getUserProfile();
  if (profile) {
    const settings = { bgm: profile.soundSettings.bgm, sfx: profile.soundSettings.sfx };
    setSoundSettings(settings);
    audioService.setSettings(settings.bgm, settings.sfx);
  }
}, []);
```

**処理**:
1. localStorageからユーザープロファイル取得
2. サウンド設定を復元
3. audioServiceに設定を適用

---

### 2. BGM制御

```typescript
useEffect(() => {
  if (screen === 'title') {
    audioService.playBgm(SoundType.BGM_TITLE);
  } else if (screen === 'battle') {
    audioService.playBgm(difficulty === 'Hard' ? SoundType.BGM_BATTLE_HARD : SoundType.BGM_BATTLE_EASY);
  } else if (screen === 'gameover' || screen === 'clear' || screen === 'ranking') {
    audioService.stopBgm();
    if (screen === 'gameover') audioService.playSfx(SoundType.SFX_GAMEOVER);
    if (screen === 'clear') audioService.playSfx(SoundType.SFX_CLEAR);
  }
}, [screen, difficulty]);
```

**BGMマッピング**:
- title: `BGM_TITLE`
- battle (Easy): `BGM_BATTLE_EASY`
- battle (Hard): `BGM_BATTLE_HARD`
- gameover: BGM停止 + `SFX_GAMEOVER`
- clear: BGM停止 + `SFX_CLEAR`
- ranking: BGM停止

---

### 3. タイマーループ

```typescript
useEffect(() => {
  // Practiceモードではタイマーを進行させない
  if (difficulty === 'Practice') {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return;
  }

  if (screen === 'battle' && !loading && problem && !showSurrenderConfirm) {
    timerRef.current = window.setInterval(() => {
      setTimer(prev => {
        const nextTime = prev + 0.1;
        if (nextTime >= attackInterval) {
          handleTimeDamage();  // 時間切れダメージ
          return 0;            // タイマーリセット
        }
        return nextTime;
      });
    }, 100);  // 100msごとに更新
  } else {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }
  
  return () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
}, [screen, loading, problem, attackInterval, showSurrenderConfirm, handleTimeDamage, difficulty]);
```

**動作条件**:
- `screen === 'battle'`
- `!loading`
- `problem !== null`
- `!showSurrenderConfirm`
- `difficulty !== 'Practice'` (Practiceモードはタイマー無効)

**タイマー更新**:
- 100msごとに0.1秒加算
- `attackInterval`到達時に`handleTimeDamage()`呼び出し
- タイマーを0にリセット

---

### 4. スコア保存

```typescript
useEffect(() => {
  if (screen === 'gameover' || screen === 'clear') {
    const profile = getUserProfile();
    
    const record: ScoreRecord = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      score: playerState.score,
      difficulty: difficulty,
      questionsAnswered: questionsAnswered,
      monsterDefeated: monsterIndex,
      userName: profile?.name || 'プレイヤー',
      prefecture: profile?.prefecture || '未設定'
    };
    saveScore(record);
  }
}, [screen]);
```

**トリガー**: `screen`が`'gameover'`または`'clear'`に変更時

---

## ゲームロジック関数

### spawnMonster(index: number): Monster

モンスターを生成。インデックスに応じて強化。

```typescript
const spawnMonster = (index: number): Monster => {
  const baseMonster = MONSTERS_LIST[index % MONSTERS_LIST.length];
  const loopCount = Math.floor(index / MONSTERS_LIST.length);
  const multiplier = 1 + (loopCount * 0.5);
  return {
    ...baseMonster,
    id: crypto.randomUUID(),
    maxHp: Math.floor(baseMonster.hp * multiplier),
    currentHp: Math.floor(baseMonster.hp * multiplier),
    level: index + 1
  };
};
```

**強化ロジック**:
- `loopCount`: モンスターリストを何周したか
- `multiplier`: 1周目1.0、2周目1.5、3周目2.0...
- HP: `baseHp × multiplier`

**例**:
- モンスター0（🐷ブタ、HP 30）
- モンスター12（2周目🐷ブタ、HP 45）
- モンスター24（3周目🐷ブタ、HP 60）

---

### calculateInterval(difficulty: Difficulty, qIndex: number): number

問題番号に応じて攻撃インターバルを動的に計算。

```typescript
const calculateInterval = (diff: Difficulty, qIndex: number) => {
  const settings = GAME_SETTINGS[diff];
  const progress = Math.min(qIndex / MAX_QUESTIONS, 1);
  const current = settings.startInterval - (progress * (settings.startInterval - settings.minInterval));
  return Math.max(settings.minInterval, current);
};
```

**例（Easy）**:
- `startInterval`: 15秒
- `minInterval`: 10秒
- 問題0: 15秒
- 問題50: 12.5秒
- 問題100: 10秒

**例（Hard）**:
- `startInterval`: 10秒
- `minInterval`: 5秒
- 問題0: 10秒
- 問題50: 7.5秒
- 問題100: 5秒

---

### handleTimeDamage()

時間切れ時のダメージ処理。

```typescript
const handleTimeDamage = React.useCallback(() => {
  audioService.playSfx(SoundType.SFX_DAMAGE);
  setIsShaking(true);
  setTimeout(() => setIsShaking(false), 500);
  
  const damage = 10 + Math.floor(questionsAnswered / 10);
  setDamageDisplay({ amount: damage, isCritical: false, target: 'player' });
  
  setPlayerState(prev => {
    const nextHp = Math.max(0, prev.currentHp - damage);
    
    if (nextHp === 0) {
      // タイマー停止
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      // 結果画面へ遷移
      setTimeout(() => {
        setBattleResult({
          damageDealt: 0,
          damageTaken: damage,
          isCorrect: false,
          isCritical: false,
          timeBonus: 0,
          monsterDefeated: false,
          playerDefeated: true
        });
        setScreen('result');
      }, 1000);
    }
    
    return { ...prev, currentHp: nextHp, combo: 0 };
  });
  
  setTimeout(() => setDamageDisplay(null), 1500);
}, [questionsAnswered]);
```

**ダメージ計算**:
```
damage = 10 + floor(questionsAnswered / 10)
```

**例**:
- 問題0-9: 10ダメージ
- 問題10-19: 11ダメージ
- 問題50-59: 15ダメージ

**HP 0の場合**:
1. タイマー停止
2. 1秒後に結果画面へ遷移（`playerDefeated: true`）

---

### selectDifficulty(selectedDiff: Difficulty)

難易度選択時の処理。

```typescript
const selectDifficulty = (selectedDiff: Difficulty) => {
  audioService.init();
  audioService.playSfx(SoundType.SFX_DECISION);
  setDifficulty(selectedDiff);
  setScreen('question-type-select');
};
```

**処理**:
1. AudioContext初期化（ユーザー操作必須）
2. 決定音再生
3. 難易度設定
4. 出題範囲選択画面へ遷移

---

### confirmQuestionTypes(types: QuestionType[])

出題範囲確定時の処理。

```typescript
const confirmQuestionTypes = (types: QuestionType[]) => {
  audioService.playSfx(SoundType.SFX_DECISION);
  setSelectedQuestionTypes(types);
  
  // ベストスコア読み込み
  const best = getPersonalBest(difficulty);
  setCurrentHighScore(best);

  // プレイヤー初期化
  const settings = GAME_SETTINGS[difficulty];
  setPlayerState({
    maxHp: settings.playerHp,
    currentHp: settings.playerHp,
    score: 0,
    combo: 0
  });
  
  // 進行状況リセット
  setQuestionsAnswered(0);
  setMonsterIndex(0);
  setCurrentMonster(spawnMonster(0));
  setAttackInterval(settings.startInterval);
  
  // 戦闘画面へ
  setScreen('battle');
  
  // 最初の問題を読み込み
  loadNextProblem(difficulty, 0, types);
};
```

**初期化項目**:
- ベストスコア
- プレイヤーHP（難易度別）
- スコア・コンボ
- 問題番号
- モンスター番号
- 攻撃インターバル

---

### loadNextProblem(diff: Difficulty, qIndex: number, types: QuestionType[])

次の問題を読み込み。

```typescript
const loadNextProblem = async (diff: Difficulty, qIndex: number, types: QuestionType[]) => {
  setLoading(true);
  setTimer(0);
  setUserAnswer(null);
  setBattleResult(null);
  setDamageDisplay(null);
  setShowSurrenderConfirm(false);
  setIsSubmitting(false);
  setAttackInterval(calculateInterval(diff, qIndex));
  
  const newProblem = await generateProblem(diff, types);
  setProblem(newProblem);
  setLoading(false);
};
```

**リセット項目**:
- タイマー
- ユーザー回答
- 戦闘結果
- ダメージ表示
- 降参確認モーダル
- 送信中フラグ
- 攻撃インターバル（動的計算）

---

### checkAnswer(userAns: UserAnswer, prob: GeneratedProblem): boolean

回答の正誤判定。

```typescript
const checkAnswer = (userAns: UserAnswer, prob: GeneratedProblem): boolean => {
  // 選択問題
  if (prob.type === QuestionType.SELECTION) {
    return typeof userAns === 'string' && userAns === prob.correctSelection;
  }
  
  // 計算問題
  if (prob.type === QuestionType.NUMERIC) {
    return typeof userAns === 'number' && userAns === prob.correctNumeric;
  }
  
  // 仕訳問題
  if (prob.type === QuestionType.JOURNAL && prob.correctJournal) {
    if (typeof userAns === 'object' && userAns !== null && 'debits' in userAns && 'credits' in userAns) {
      const u = userAns as JournalEntryAnswer;
      
      // 正規化関数（並び順を無視）
      const normalize = (items: { account: string; amount: number }[]) => 
        items.map(i => `${i.account}:${i.amount}`).sort().join('|');
      
      return normalize(u.debits) === normalize(prob.correctJournal.debits) &&
             normalize(u.credits) === normalize(prob.correctJournal.credits);
    }
  }
  
  return false;
};
```

**仕訳問題の正規化**:
```typescript
// 例
debits: [{ account: "現金", amount: 24000 }, { account: "商品", amount: 12000 }]
→ "現金:24000|商品:12000"
```

**並び順を無視**:
```
["現金:24000", "商品:12000"] と ["商品:12000", "現金:24000"] は同一
```

---

### handleAnswer(answer: UserAnswer)

回答処理のメインロジック。

```typescript
const handleAnswer = (answer: UserAnswer) => {
  if (!problem || !currentMonster || isSubmitting) return;
  setIsSubmitting(true);
  
  // 1. タイマー停止
  if (timerRef.current !== null) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }
  
  // 2. 正誤判定
  const isCorrect = checkAnswer(answer, problem);

  let damageDealt = 0;
  let damageTaken = 0;
  let timeBonus = 0;
  let isCritical = false;

  // 3. 正解時の処理
  if (isCorrect) {
    damageDealt = 20;
    
    // スピードボーナス判定
    if (timer < attackInterval * 0.3) {
      isCritical = true;
      damageDealt = Math.floor(damageDealt * 1.5);  // 30ダメージ
      timeBonus = 100;
      audioService.playSfx(SoundType.SFX_CRITICAL);
    } else {
      audioService.playSfx(SoundType.SFX_ATTACK);
    }
    
    // スコア加算
    setPlayerState(prev => ({
      ...prev,
      score: prev.score + damageDealt * 10 + timeBonus + (prev.combo * 50),
      combo: prev.combo + 1
    }));
  } 
  // 4. 不正解時の処理
  else {
    audioService.playSfx(SoundType.SFX_DAMAGE);
    damageTaken = 15;
    setPlayerState(prev => ({
      ...prev,
      currentHp: Math.max(0, prev.currentHp - damageTaken),
      combo: 0
    }));
  }

  // 5. モンスターへのダメージ適用
  let monsterDefeated = false;
  if (isCorrect) {
    const newMonsterHp = Math.max(0, currentMonster.currentHp - damageDealt);
    monsterDefeated = newMonsterHp === 0;
    setCurrentMonster({ ...currentMonster, currentHp: newMonsterHp });
    setDamageDisplay({ amount: damageDealt, isCritical, target: 'monster' });
    setIsShaking(true);
  } else {
    setDamageDisplay({ amount: damageTaken, isCritical: false, target: 'player' });
    setIsShaking(true);
  }

  setTimeout(() => setIsShaking(false), 500);

  // 6. 結果オブジェクト作成
  setBattleResult({
    damageDealt,
    damageTaken,
    isCorrect,
    isCritical,
    timeBonus,
    monsterDefeated,
    playerDefeated: playerState.currentHp - damageTaken <= 0
  });
  setUserAnswer(answer);

  // 7. 結果画面へ遷移
  setTimeout(() => {
    setIsSubmitting(false);
    setScreen('result');
  }, 1200);
};
```

**スコア計算**:
```
score += damageDealt * 10 + timeBonus + (combo * 50)
```

**例**:
- 正解（通常）: 20 × 10 = 200点
- 正解（クリティカル）: 30 × 10 + 100 = 400点
- コンボ5連鎖: +250点

**スピードボーナス条件**:
```typescript
timer < attackInterval * 0.3
```

**例（Easy、攻撃インターバル15秒）**:
- 4.5秒以内: クリティカル

---

### 降参機能

#### triggerSurrender()

降参ボタンクリック時。

```typescript
const triggerSurrender = () => {
  audioService.playSfx(SoundType.SFX_SELECT);
  setShowSurrenderConfirm(true);
};
```

#### confirmSurrender()

降参確定時。

```typescript
const confirmSurrender = () => {
  audioService.playSfx(SoundType.SFX_DAMAGE);
  setShowSurrenderConfirm(false);
  
  // タイマー停止
  if (timerRef.current !== null) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }
  
  // 降参 = 敗北扱い
  setBattleResult({
    damageDealt: 0,
    damageTaken: 0,
    isCorrect: false,
    isCritical: false,
    timeBonus: 0,
    monsterDefeated: false,
    playerDefeated: true
  });
  setUserAnswer(null);
  setScreen('result');
};
```

**特徴**:
- `playerDefeated: true`でゲームオーバー扱い
- 解説は表示される

#### cancelSurrender()

降参キャンセル時。

```typescript
const cancelSurrender = () => {
  audioService.playSfx(SoundType.SFX_CANCEL);
  setShowSurrenderConfirm(false);
};
```

---

### handleNext()

結果画面から次へ進む。

```typescript
const handleNext = () => {
  audioService.playSfx(SoundType.SFX_SELECT);
  if (!battleResult) return;
  
  // 1. プレイヤー死亡
  if (battleResult.playerDefeated) {
    setScreen('gameover');
    return;
  }
  
  const nextQIndex = questionsAnswered + 1;
  
  // 2. 100問クリア
  if (nextQIndex >= MAX_QUESTIONS) {
    setScreen('clear');
    return;
  }
  
  // 3. モンスター討伐
  if (battleResult.monsterDefeated) {
    const nextMIndex = monsterIndex + 1;
    setMonsterIndex(nextMIndex);
    setCurrentMonster(spawnMonster(nextMIndex));
  }
  
  // 4. 次の問題へ
  setQuestionsAnswered(nextQIndex);
  setScreen('battle');
  loadNextProblem(difficulty, nextQIndex, selectedQuestionTypes);
};
```

**遷移フロー**:
1. プレイヤー死亡 → `gameover`
2. 100問達成 → `clear`
3. それ以外 → `battle`（次の問題）

---

## 画面レンダリング

### 1. タイトル画面 (title)

```tsx
<div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
  <div className="inline-block p-4 bg-slate-800 rounded-full mb-4 border-4 border-indigo-500">
    <Sword size={64} className="text-yellow-400" />
  </div>
  <h1 className="text-5xl md:text-7xl font-black">簿記<br/>トレーニング大戦</h1>
  
  {/* 難易度選択ボタン */}
  <div className="grid md:grid-cols-3 gap-6">
    <button onClick={() => selectDifficulty('Practice')}>
      <BookOpen /> Practice
    </button>
    <button onClick={() => selectDifficulty('Easy')}>
      <Shield /> Easy
    </button>
    <button onClick={() => selectDifficulty('Hard')}>
      <Sword /> Hard
    </button>
  </div>
  
  {/* サブメニュー */}
  <button onClick={() => setScreen('settings')}>
    <Settings /> サウンド設定
  </button>
  <button onClick={() => setScreen('ranking')}>
    <History /> プレイ履歴
  </button>
</div>
```

---

### 2. サウンド設定画面 (settings)

```tsx
<div className="bg-slate-800 rounded-xl p-6 space-y-6">
  {/* BGM設定 */}
  <div className="flex items-center justify-between">
    <div>
      <Music /> BGM（背景音楽）
    </div>
    <button onClick={toggleBgm} className="w-16 h-8 rounded-full">
      {/* トグルスイッチ */}
    </button>
  </div>
  
  {/* 効果音設定 */}
  <div className="flex items-center justify-between">
    <div>
      <Zap /> 効果音
    </div>
    <button onClick={toggleSfx} className="w-16 h-8 rounded-full">
      {/* トグルスイッチ */}
    </button>
  </div>
</div>
```

**toggleBgm() / toggleSfx()**:
```typescript
const toggleBgm = () => {
  const newBgm = !soundSettings.bgm;
  const newSettings = { ...soundSettings, bgm: newBgm };
  setSoundSettings(newSettings);
  audioService.setSettings(newSettings.bgm, newSettings.sfx);
  
  // localStorageに保存
  const profile = getUserProfile() || { soundSettings: { bgm: true, sfx: true } };
  profile.soundSettings.bgm = newBgm;
  localStorage.setItem('boki-training-profile', JSON.stringify(profile));
};
```

---

### 3. 出題範囲選択画面 (question-type-select)

```tsx
<QuestionTypeSelector
  onConfirm={confirmQuestionTypes}
  onBack={() => setScreen('title')}
/>
```

---

### 4. 戦闘画面 (battle)

```tsx
<div className="h-screen bg-slate-900 flex flex-col">
  {/* ヘッダー */}
  <header className="bg-slate-950/50 backdrop-blur-md border-b border-slate-800">
    <div className="flex justify-between items-center">
      {/* 左: ゲーム情報 */}
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-indigo-600 rounded">B</div>
        <span>簿記トレ大戦</span>
        <span className={difficulty === 'Hard' ? 'text-red-300' : 'text-green-300'}>
          {difficulty}
        </span>
        <div className="text-yellow-500">
          <Crown size={12} /> BEST: {currentHighScore.toLocaleString()}
        </div>
      </div>
      
      {/* 右: スコア・問題番号 */}
      <div className="flex items-center gap-4">
        <div>
          <span>SCORE</span>
          <span className="text-yellow-400 font-mono">{playerState.score.toLocaleString()}</span>
        </div>
        <div>
          <BookOpen size={16} />
          <span>{questionsAnswered + 1}/{MAX_QUESTIONS}</span>
        </div>
      </div>
    </div>
  </header>

  {/* メインエリア */}
  <main className="flex-1 overflow-y-auto">
    {/* 戦闘シーン */}
    {currentMonster && (
      <BattleScene 
        monster={currentMonster}
        playerState={playerState}
        timeRatio={Math.min(1, timer / attackInterval)}
        damageDisplay={damageDisplay}
        isShaking={isShaking}
      />
    )}

    {/* 問題表示 */}
    {loading ? (
      <div className="flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p>モンスター出現中...</p>
      </div>
    ) : problem ? (
      <>
        {/* 問題文 */}
        <div className="bg-slate-900/80 rounded-xl p-4 border-l-8 border-indigo-500">
          <span className="px-2 py-0.5 bg-indigo-800/60 text-indigo-200 text-xs rounded">
            {problem.type}
          </span>
          <p className="text-slate-100">{problem.text}</p>
          
          {/* 降参ボタン */}
          <button onClick={triggerSurrender}>
            <Flag size={16} /> 降参
          </button>
        </div>

        {/* 回答フォーム */}
        <JournalEntryForm 
          problem={problem}
          onSubmit={handleAnswer} 
          isSubmitting={isSubmitting} 
        />
      </>
    ) : null}
  </main>

  {/* 降参確認モーダル */}
  {showSurrenderConfirm && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-slate-800 rounded-2xl p-8">
        <AlertTriangle className="text-yellow-500" />
        <h3>降参しますか？</h3>
        <button onClick={cancelSurrender}>続ける</button>
        <button onClick={confirmSurrender}>降参する</button>
      </div>
    </div>
  )}
</div>
```

---

### 5. 結果画面 (result)

```tsx
<ResultCard 
  problem={problem} 
  userAnswer={userAnswer} 
  result={battleResult}
  onNext={handleNext}
  isGameOver={battleResult.playerDefeated}
/>
```

---

### 6. ゲームオーバー/クリア画面 (gameover / clear)

```tsx
<div className="min-h-screen bg-slate-900 flex items-center justify-center">
  <div className={`max-w-md p-8 rounded-2xl border-4 ${isClear ? 'bg-yellow-900/40 border-yellow-500' : 'bg-red-900/40 border-red-500'}`}>
    {isClear ? <Trophy size={80} /> : <AlertTriangle size={80} />}
    
    <h2>{isClear ? 'GAME CLEAR!!' : 'GAME OVER'}</h2>
    
    {/* スコア表示 */}
    <div className="bg-slate-800 p-4 rounded-lg">
      <div>到達問題数: {questionsAnswered} / {MAX_QUESTIONS}</div>
      <div>討伐モンスター: {monsterIndex} 体</div>
      <div>TOTAL SCORE: {playerState.score.toLocaleString()}</div>
    </div>

    {/* ボタン */}
    <button onClick={() => setScreen('title')}>タイトルへ戻る</button>
    <button onClick={() => setScreen('ranking')}>スコア画面へ</button>
  </div>
</div>
```

---

### 7. ランキング画面 (ranking)

```tsx
<RankingScreen onBack={() => setScreen('title')} />
```

---

## ゲームバランス

### 難易度別パラメータ

#### Practice
```typescript
{
  playerHp: Infinity,     // 無限HP
  startInterval: Infinity, // タイマーなし
  minInterval: Infinity
}
```

#### Easy
```typescript
{
  playerHp: 300,
  startInterval: 15,  // 15秒
  minInterval: 10     // 10秒
}
```

#### Hard
```typescript
{
  playerHp: 100,
  startInterval: 10,  // 10秒
  minInterval: 5      // 5秒
}
```

---

### ダメージバランス

| 状況 | ダメージ | 対象 |
|---|---|---|
| 正解（通常） | 20 | モンスター |
| 正解（クリティカル） | 30 | モンスター |
| 不正解 | 15 | プレイヤー |
| 時間切れ | 10 + floor(問題数/10) | プレイヤー |

---

### スコア計算式

```
score += damageDealt * 10 + timeBonus + (combo * 50)
```

**内訳**:
- 基本ダメージ: 20 → 200点
- クリティカル: 30 → 300点
- スピードボーナス: +100点
- コンボボーナス: コンボ数 × 50点

**例（5連鎖クリティカル）**:
```
300 + 100 + (5 * 50) = 650点
```

---

## iOS実装時の考慮点

### State管理

React Hooksから**SwiftUI @State / @StateObject**へ。

```swift
class GameViewModel: ObservableObject {
    @Published var screen: Screen = .title
    @Published var difficulty: Difficulty = .easy
    @Published var playerState: PlayerState = PlayerState()
    @Published var currentMonster: Monster?
    @Published var problem: GeneratedProblem?
    @Published var questionsAnswered: Int = 0
    @Published var timer: Double = 0
    @Published var battleResult: BattleResult?
    
    // タイマー
    private var timerCancellable: AnyCancellable?
    
    func startTimer() {
        timerCancellable = Timer.publish(every: 0.1, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                self?.updateTimer()
            }
    }
    
    func stopTimer() {
        timerCancellable?.cancel()
    }
}
```

---

### タイマー実装

**React (setInterval)**:
```typescript
timerRef.current = window.setInterval(() => {
  setTimer(prev => prev + 0.1);
}, 100);
```

**iOS (Timer.publish)**:
```swift
timerCancellable = Timer.publish(every: 0.1, on: .main, in: .common)
    .autoconnect()
    .sink { [weak self] _ in
        self?.timer += 0.1
        if self?.timer >= self?.attackInterval {
            self?.handleTimeDamage()
            self?.timer = 0
        }
    }
```

---

### 画面遷移

**React (useState)**:
```typescript
setScreen('battle');
```

**iOS (NavigationStack / sheet)**:
```swift
struct ContentView: View {
    @StateObject var viewModel = GameViewModel()
    
    var body: some View {
        NavigationStack {
            Group {
                switch viewModel.screen {
                case .title:
                    TitleView()
                case .battle:
                    BattleView()
                case .result:
                    ResultView()
                case .gameover:
                    GameOverView()
                }
            }
        }
        .environmentObject(viewModel)
    }
}
```

---

### localStorageの代替

**UserDefaults**（軽量データ）:
```swift
UserDefaults.standard.set(soundSettings.bgm, forKey: "bgm_enabled")
```

**CoreData**（大量データ・履歴）:
```swift
let context = PersistenceController.shared.container.viewContext
let newRecord = ScoreRecord(context: context)
newRecord.score = playerState.score
try? context.save()
```

---

## パフォーマンス最適化

### React.useCallback

```typescript
const handleTimeDamage = React.useCallback(() => {
  // ...
}, [questionsAnswered]);
```

**理由**: useEffect依存配列に関数を入れる場合、無限ループ防止

---

### setTimeout遅延処理

```typescript
setTimeout(() => {
  setIsShaking(false);
}, 500);
```

**iOS**:
```swift
DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
    self.isShaking = false
}
```

---

## デバッグ情報

### タイマー精度

- setInterval: 100ms
- 実際の精度: ±10ms（ブラウザによる）

### 状態デバッグ

React DevToolsで以下を確認:
- `screen`
- `playerState.currentHp`
- `timer`
- `questionsAnswered`

---

## エラーハンドリング

### 問題生成失敗

```typescript
const newProblem = await generateProblem(diff, types);
// generateProblem内でエラー時はthrow
```

**対策**: try-catchで囲み、エラー画面へ遷移

### タイマーリーク

```typescript
return () => {
  if (timerRef.current !== null) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }
};
```

**重要**: useEffectのクリーンアップ関数で必ずタイマーを停止

---

## まとめ

`App.tsx`は1,087行のメインロジックで以下を管理:

1. **8つの画面遷移**
2. **タイマーループ**（100msごと）
3. **状態管理**（20以上のstate）
4. **ゲームバランス**（難易度別パラメータ）
5. **スコア計算**（コンボ・クリティカル）
6. **オーディオ制御**（BGM・SFX）
7. **localStorage連携**（スコア保存）

iOS版への移行時は:
- **ViewModel**でState管理
- **Timer.publish**でタイマー実装
- **NavigationStack**で画面遷移
- **UserDefaults/CoreData**でデータ永続化

これでメインアプリロジックのドキュメント化が完了しました。次はビルド・デプロイ設定に進みます。
