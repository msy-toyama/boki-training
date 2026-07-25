# iOS版開発完全移行ガイド

## 概要

このドキュメントは、Web版（React + TypeScript）からiOS版（Swift + SwiftUI）への完全移行を支援します。

---

## プロジェクト構成比較

### Web版
```
boki-training/
├── App.tsx (1,087行)
├── index.tsx
├── types.ts
├── constants.ts (1,560行)
├── components/ (6ファイル)
├── services/ (8ファイル)
└── public/
```

### iOS版（推奨構造）
```
BokiTraining/
├── BokiTrainingApp.swift
├── Models/
│   ├── Types.swift (型定義)
│   ├── Constants.swift (定数)
│   └── ProblemTemplates.swift (問題テンプレート)
├── Services/
│   ├── AudioService.swift
│   ├── ProblemService.swift
│   └── ScoreService.swift
├── ViewModels/
│   ├── GameViewModel.swift
│   └── RankingViewModel.swift
├── Views/
│   ├── TitleView.swift
│   ├── BattleView.swift
│   ├── BattleSceneView.swift
│   ├── JournalEntryFormView.swift
│   ├── QuestionTypeSelectorView.swift
│   ├── ResultCardView.swift
│   └── RankingScreenView.swift
├── Resources/
│   ├── Sounds/ (BGM/SFX)
│   └── Assets.xcassets/
└── Persistence/
    └── PersistenceController.swift (CoreData)
```

---

## 技術スタック対応表

| Web版 | iOS版 | 備考 |
|---|---|---|
| React 18.3.1 | SwiftUI | UIフレームワーク |
| TypeScript 5.9.3 | Swift 5.9+ | 言語 |
| Vite 7.3.3 | Xcode 15+ | ビルドツール |
| localStorage | UserDefaults / CoreData | データ永続化 |
| Web Audio API | AVFoundation | オーディオ |
| CSS / TailwindCSS | SwiftUI Modifiers | スタイリング |
| Lucide React | SF Symbols | アイコン |
| npm | Swift Package Manager | パッケージ管理 |
| Cloudflare Pages | TestFlight / App Store | 配布 |

---

## フェーズ1: プロジェクトセットアップ

### 1.1 Xcodeプロジェクト作成

```bash
# Xcodeを起動
File > New > Project
# iOS > App
# Product Name: BokiTraining
# Interface: SwiftUI
# Language: Swift
# Storage: CoreData (オプション)
```

### 1.2 必要なフレームワーク追加

```swift
import SwiftUI
import AVFoundation  // オーディオ
import Combine       // タイマー・非同期処理
import CoreData      // データ永続化（オプション）
```

---

## フェーズ2: 型定義の移行

### Web版 (types.ts)

```typescript
export enum QuestionType {
  JOURNAL = '仕訳問題',
  SELECTION = '選択問題',
  NUMERIC = '数値問題'
}

export type Difficulty = 'Practice' | 'Easy' | 'Hard';

export interface Monster {
  id: string;
  name: string;
  emoji: string;
  level: number;
  maxHp: number;
  currentHp: number;
}
```

### iOS版 (Models/Types.swift)

```swift
enum QuestionType: String, Codable, CaseIterable {
    case journal = "仕訳問題"
    case selection = "選択問題"
    case numeric = "数値問題"
}

enum Difficulty: String, Codable, CaseIterable {
    case practice = "Practice"
    case easy = "Easy"
    case hard = "Hard"
}

struct Monster: Identifiable, Codable {
    let id: UUID
    let name: String
    let emoji: String
    let level: Int
    let maxHp: Int
    var currentHp: Int
    
    init(id: UUID = UUID(), name: String, emoji: String, level: Int, maxHp: Int, currentHp: Int) {
        self.id = id
        self.name = name
        self.emoji = emoji
        self.level = level
        self.maxHp = maxHp
        self.currentHp = currentHp
    }
}
```

**移行ポイント**:
- `enum`: `String` raw valueを付与
- `interface` → `struct` + `Codable`
- `id: string` → `id: UUID`
- `Identifiable`プロトコル準拠

---

## フェーズ3: 定数の移行

### Web版 (constants.ts)

```typescript
export const ACCOUNT_TITLES = [
  '現金', '当座預金', '普通預金', // ...
];

export const MONSTERS_LIST: MonsterTemplate[] = [
  { name: 'スライム', emoji: '🟢', hp: 30 },
  { name: 'ゴブリン', emoji: '👺', hp: 50 },
  // ...
];
```

### iOS版 (Models/Constants.swift)

```swift
struct Constants {
    static let accountTitles: [String] = [
        "現金", "当座預金", "普通預金", // ...
    ]
    
    static let monstersList: [MonsterTemplate] = [
        MonsterTemplate(name: "スライム", emoji: "🟢", hp: 30),
        MonsterTemplate(name: "ゴブリン", emoji: "👺", hp: 50),
        // ...
    ]
    
    static let maxQuestions: Int = 100
    
    static let gameSettings: [Difficulty: GameSetting] = [
        .practice: GameSetting(playerHp: .max, startInterval: .infinity, minInterval: .infinity),
        .easy: GameSetting(playerHp: 300, startInterval: 15, minInterval: 10),
        .hard: GameSetting(playerHp: 100, startInterval: 10, minInterval: 5)
    ]
}

struct MonsterTemplate: Codable {
    let name: String
    let emoji: String
    let hp: Int
}

struct GameSetting {
    let playerHp: Int
    let startInterval: Double
    let minInterval: Double
}
```

---

## フェーズ4: サービスレイヤーの移行

### 4.1 AudioService

#### Web版 (audioService.ts)

```typescript
class AudioService {
  private ctx: AudioContext | null = null;
  
  public playSfx(type: SoundType) {
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    // ...
  }
}
```

#### iOS版 (Services/AudioService.swift)

```swift
import AVFoundation

class AudioService: ObservableObject {
    private var audioEngine: AVAudioEngine?
    private var bgmPlayer: AVAudioPlayer?
    @Published var isBgmEnabled: Bool = true
    @Published var isSfxEnabled: Bool = true
    
    init() {
        setupAudio()
    }
    
    func setupAudio() {
        audioEngine = AVAudioEngine()
        // 初期化処理
    }
    
    func playSFX(_ type: SFXType) {
        guard isSfxEnabled else { return }
        guard let url = Bundle.main.url(forResource: type.filename, withExtension: "wav") else { return }
        
        do {
            let player = try AVAudioPlayer(contentsOf: url)
            player.play()
        } catch {
            print("Failed to play SFX: \\(error)")
        }
    }
    
    func playBGM(_ type: BGMType) {
        guard isBgmEnabled else { return }
        guard let url = Bundle.main.url(forResource: type.filename, withExtension: "mp3") else { return }
        
        do {
            bgmPlayer = try AVAudioPlayer(contentsOf: url)
            bgmPlayer?.numberOfLoops = -1  // 無限ループ
            bgmPlayer?.volume = 0.3
            bgmPlayer?.play()
        } catch {
            print("Failed to play BGM: \\(error)")
        }
    }
    
    func stopBGM() {
        bgmPlayer?.stop()
    }
}

enum SFXType {
    case select, decision, attack, damage, critical, clear, gameover, cancel
    
    var filename: String {
        switch self {
        case .select: return "sfx_select"
        case .decision: return "sfx_decision"
        case .attack: return "sfx_attack"
        case .damage: return "sfx_damage"
        case .critical: return "sfx_critical"
        case .clear: return "sfx_clear"
        case .gameover: return "sfx_gameover"
        case .cancel: return "sfx_cancel"
        }
    }
}

enum BGMType {
    case title, battleEasy, battleHard
    
    var filename: String {
        switch self {
        case .title: return "bgm_title"
        case .battleEasy: return "bgm_battle_easy"
        case .battleHard: return "bgm_battle_hard"
        }
    }
}
```

**必要な作業**:
1. 音声ファイル作成（.wav/.mp3）
2. Xcode > Resources/Sounds/に追加
3. プロジェクトに追加（Copy if needed）

---

### 4.2 ProblemService

#### iOS版 (Services/ProblemService.swift)

```swift
class ProblemService {
    func generateProblem(difficulty: Difficulty, allowedTypes: [QuestionType]?) async throws -> GeneratedProblem {
        // 1. テンプレート選択
        let availableTemplates = filterTemplates(allowedTypes: allowedTypes)
        guard let template = availableTemplates.randomElement() else {
            throw ProblemServiceError.noTemplatesAvailable
        }
        
        // 2. パラメータ生成
        let amount = generateAmount()
        let target = generateTargetName()
        
        // 3. 問題生成
        let problem = try await generateProblem(from: template, amount: amount, target: target, difficulty: difficulty)
        
        return problem
    }
    
    private func generateAmount() -> Int {
        let base = Int.random(in: 1...100) * 1000
        return (base / 12000) * 12000 + 12000  // 12で割り切れる
    }
    
    private func generateTargetName() -> String {
        let companies = ["A商店", "B商事", "C物産", "D商店", "E社", "Fマート", "山田商店", "鈴木商事"]
        return companies.randomElement()!
    }
    
    private func filterTemplates(allowedTypes: [QuestionType]?) -> [ProblemTemplate] {
        guard let allowedTypes = allowedTypes, !allowedTypes.isEmpty else {
            return ProblemTemplates.all
        }
        return ProblemTemplates.all.filter { allowedTypes.contains($0.type) }
    }
}

enum ProblemServiceError: Error {
    case noTemplatesAvailable
}
```

---

### 4.3 ScoreService

#### iOS版 (Services/ScoreService.swift)

```swift
class ScoreService {
    func saveScore(_ record: ScoreRecord) -> Bool {
        do {
            // 履歴保存
            var history = getHistory()
            history.insert(record, at: 0)
            history = Array(history.prefix(100))  // 最大100件
            
            let encoder = JSONEncoder()
            let data = try encoder.encode(history)
            UserDefaults.standard.set(data, forKey: "score_history")
            
            // ベストスコア更新
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
    
    func getHistory() -> [ScoreRecord] {
        guard let data = UserDefaults.standard.data(forKey: "score_history") else { return [] }
        let decoder = JSONDecoder()
        return (try? decoder.decode([ScoreRecord].self, from: data)) ?? []
    }
    
    func getPersonalBest(difficulty: Difficulty) -> Int {
        let key = difficulty == .easy ? "best_easy" : "best_hard"
        return UserDefaults.standard.integer(forKey: key)
    }
    
    func saveUserProfile(_ profile: UserProfile) {
        let encoder = JSONEncoder()
        if let data = try? encoder.encode(profile) {
            UserDefaults.standard.set(data, forKey: "user_profile")
        }
    }
    
    func getUserProfile() -> UserProfile? {
        guard let data = UserDefaults.standard.data(forKey: "user_profile") else { return nil }
        let decoder = JSONDecoder()
        return try? decoder.decode(UserProfile.self, from: data)
    }
}
```

---

## フェーズ5: ViewModelの実装

### GameViewModel.swift

```swift
import SwiftUI
import Combine

class GameViewModel: ObservableObject {
    // Screen
    @Published var screen: Screen = .title
    
    // Settings
    @Published var difficulty: Difficulty = .easy
    @Published var selectedQuestionTypes: [QuestionType] = [.journal, .selection, .numeric]
    @Published var soundSettings = SoundSettings(bgm: true, sfx: true)
    
    // Data
    @Published var problem: GeneratedProblem?
    @Published var loading: Bool = false
    @Published var currentHighScore: Int = 0
    
    // Progression
    @Published var questionsAnswered: Int = 0
    @Published var monsterIndex: Int = 0
    
    // Entities
    @Published var currentMonster: Monster?
    @Published var playerState = PlayerState(maxHp: 100, currentHp: 100, score: 0, combo: 0)
    
    // Turn/Battle
    @Published var userAnswer: UserAnswer?
    @Published var battleResult: BattleResult?
    @Published var isSubmitting: Bool = false
    
    // Visual/Timer
    @Published var timer: Double = 0
    @Published var attackInterval: Double = 15
    @Published var damageDisplay: DamageDisplay?
    @Published var isShaking: Bool = false
    
    // Services
    private let audioService = AudioService()
    private let problemService = ProblemService()
    private let scoreService = ScoreService()
    
    // Timer
    private var timerCancellable: AnyCancellable?
    
    // MARK: - Game Flow
    
    func selectDifficulty(_ diff: Difficulty) {
        audioService.playSFX(.decision)
        difficulty = diff
        screen = .questionTypeSelect
    }
    
    func confirmQuestionTypes(_ types: [QuestionType]) {
        audioService.playSFX(.decision)
        selectedQuestionTypes = types
        
        // ベストスコア読み込み
        currentHighScore = scoreService.getPersonalBest(difficulty: difficulty)
        
        // プレイヤー初期化
        let settings = Constants.gameSettings[difficulty]!
        playerState = PlayerState(
            maxHp: settings.playerHp,
            currentHp: settings.playerHp,
            score: 0,
            combo: 0
        )
        
        // 進行状況リセット
        questionsAnswered = 0
        monsterIndex = 0
        currentMonster = spawnMonster(index: 0)
        attackInterval = settings.startInterval
        
        screen = .battle
        
        // 最初の問題を読み込み
        Task {
            await loadNextProblem()
        }
    }
    
    func startTimer() {
        guard difficulty != .practice else { return }
        
        timerCancellable = Timer.publish(every: 0.1, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                guard let self = self else { return }
                self.timer += 0.1
                
                if self.timer >= self.attackInterval {
                    self.handleTimeDamage()
                    self.timer = 0
                }
            }
    }
    
    func stopTimer() {
        timerCancellable?.cancel()
    }
    
    private func spawnMonster(index: Int) -> Monster {
        let baseMonster = Constants.monstersList[index % Constants.monstersList.count]
        let loopCount = index / Constants.monstersList.count
        let multiplier = 1.0 + Double(loopCount) * 0.5
        let hp = Int(Double(baseMonster.hp) * multiplier)
        
        return Monster(
            name: baseMonster.name,
            emoji: baseMonster.emoji,
            level: index + 1,
            maxHp: hp,
            currentHp: hp
        )
    }
    
    private func loadNextProblem() async {
        loading = true
        timer = 0
        userAnswer = nil
        battleResult = nil
        damageDisplay = nil
        isSubmitting = false
        
        // 攻撃インターバル計算
        let settings = Constants.gameSettings[difficulty]!
        let progress = min(Double(questionsAnswered) / Double(Constants.maxQuestions), 1.0)
        attackInterval = max(settings.minInterval, settings.startInterval - progress * (settings.startInterval - settings.minInterval))
        
        do {
            problem = try await problemService.generateProblem(difficulty: difficulty, allowedTypes: selectedQuestionTypes)
        } catch {
            print("Failed to generate problem: \\(error)")
        }
        
        loading = false
        startTimer()
    }
    
    func handleAnswer(_ answer: UserAnswer) {
        guard let problem = problem, let currentMonster = currentMonster, !isSubmitting else { return }
        isSubmitting = true
        stopTimer()
        
        let isCorrect = checkAnswer(answer, problem: problem)
        
        var damageDealt = 0
        var damageTaken = 0
        var timeBonus = 0
        var isCritical = false
        
        if isCorrect {
            damageDealt = 20
            
            if timer < attackInterval * 0.3 {
                isCritical = true
                damageDealt = Int(Double(damageDealt) * 1.5)
                timeBonus = 100
                audioService.playSFX(.critical)
            } else {
                audioService.playSFX(.attack)
            }
            
            playerState.score += damageDealt * 10 + timeBonus + playerState.combo * 50
            playerState.combo += 1
        } else {
            audioService.playSFX(.damage)
            damageTaken = 15
            playerState.currentHp = max(0, playerState.currentHp - damageTaken)
            playerState.combo = 0
        }
        
        var monsterDefeated = false
        if isCorrect {
            let newMonsterHp = max(0, currentMonster.currentHp - damageDealt)
            monsterDefeated = newMonsterHp == 0
            self.currentMonster?.currentHp = newMonsterHp
            damageDisplay = DamageDisplay(amount: damageDealt, isCritical: isCritical, target: .monster)
            isShaking = true
        } else {
            damageDisplay = DamageDisplay(amount: damageTaken, isCritical: false, target: .player)
            isShaking = true
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            self.isShaking = false
        }
        
        battleResult = BattleResult(
            damageDealt: damageDealt,
            damageTaken: damageTaken,
            isCorrect: isCorrect,
            isCritical: isCritical,
            timeBonus: timeBonus,
            monsterDefeated: monsterDefeated,
            playerDefeated: playerState.currentHp - damageTaken <= 0
        )
        userAnswer = answer
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
            self.isSubmitting = false
            self.screen = .result
        }
    }
    
    private func checkAnswer(_ answer: UserAnswer, problem: GeneratedProblem) -> Bool {
        // 正誤判定ロジック（Web版と同様）
        // ...
        return false
    }
    
    private func handleTimeDamage() {
        audioService.playSFX(.damage)
        isShaking = true
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            self.isShaking = false
        }
        
        let damage = 10 + questionsAnswered / 10
        damageDisplay = DamageDisplay(amount: damage, isCritical: false, target: .player)
        
        playerState.currentHp = max(0, playerState.currentHp - damage)
        playerState.combo = 0
        
        if playerState.currentHp == 0 {
            stopTimer()
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                self.battleResult = BattleResult(
                    damageDealt: 0,
                    damageTaken: damage,
                    isCorrect: false,
                    isCritical: false,
                    timeBonus: 0,
                    monsterDefeated: false,
                    playerDefeated: true
                )
                self.screen = .result
            }
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            self.damageDisplay = nil
        }
    }
    
    func handleNext() {
        audioService.playSFX(.select)
        guard let result = battleResult else { return }
        
        if result.playerDefeated {
            screen = .gameover
            return
        }
        
        let nextQIndex = questionsAnswered + 1
        if nextQIndex >= Constants.maxQuestions {
            screen = .clear
            return
        }
        
        if result.monsterDefeated {
            let nextMIndex = monsterIndex + 1
            monsterIndex = nextMIndex
            currentMonster = spawnMonster(index: nextMIndex)
        }
        
        questionsAnswered = nextQIndex
        screen = .battle
        
        Task {
            await loadNextProblem()
        }
    }
}

enum Screen {
    case title, settings, questionTypeSelect, battle, result, gameover, clear, ranking
}
```

---

## フェーズ6: Viewの実装

### BattleView.swift

```swift
struct BattleView: View {
    @EnvironmentObject var viewModel: GameViewModel
    
    var body: some View {
        VStack(spacing: 0) {
            // ヘッダー
            headerView
            
            // メインエリア
            ScrollView {
                VStack(spacing: 20) {
                    // 戦闘シーン
                    if let monster = viewModel.currentMonster {
                        BattleSceneView(
                            monster: monster,
                            playerState: viewModel.playerState,
                            timeRatio: min(1.0, viewModel.timer / viewModel.attackInterval),
                            damageDisplay: viewModel.damageDisplay,
                            isShaking: viewModel.isShaking
                        )
                    }
                    
                    // 問題表示
                    if viewModel.loading {
                        loadingView
                    } else if let problem = viewModel.problem {
                        problemView(problem)
                    }
                }
                .padding()
            }
        }
        .background(Color("SlateBackground"))
        .onAppear {
            viewModel.startTimer()
        }
        .onDisappear {
            viewModel.stopTimer()
        }
    }
    
    private var headerView: some View {
        HStack {
            // 左: ゲーム情報
            HStack(spacing: 10) {
                Text("簿記トレ大戦")
                    .font(.headline)
                    .foregroundColor(.white)
                
                Text(viewModel.difficulty.rawValue)
                    .font(.caption)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(viewModel.difficulty == .hard ? Color.red : Color.green)
                    .cornerRadius(4)
            }
            
            Spacer()
            
            // 右: スコア
            VStack(alignment: .trailing) {
                Text("SCORE")
                    .font(.caption2)
                    .foregroundColor(.gray)
                Text("\\(viewModel.playerState.score)")
                    .font(.title2.bold().monospaced())
                    .foregroundColor(.yellow)
            }
        }
        .padding()
        .background(Color.black.opacity(0.5))
    }
    
    private var loadingView: some View {
        VStack(spacing: 20) {
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: .blue))
                .scaleEffect(2)
            Text("モンスター出現中...")
                .foregroundColor(.blue)
                .font(.headline)
        }
        .frame(height: 300)
    }
    
    private func problemView(_ problem: GeneratedProblem) -> some View {
        VStack(alignment: .leading, spacing: 20) {
            // 問題文
            VStack(alignment: .leading, spacing: 10) {
                Text(problem.type.rawValue)
                    .font(.caption)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.blue.opacity(0.3))
                    .cornerRadius(4)
                
                Text(problem.text)
                    .font(.body)
                    .foregroundColor(.white)
            }
            .padding()
            .background(Color.gray.opacity(0.2))
            .cornerRadius(12)
            
            // 回答フォーム
            JournalEntryFormView(
                problem: problem,
                onSubmit: { answer in
                    viewModel.handleAnswer(answer)
                },
                isSubmitting: viewModel.isSubmitting
            )
        }
    }
}
```

---

## フェーズ7: データ永続化

### CoreDataの使用（オプション）

```swift
// Persistence.swift
import CoreData

struct PersistenceController {
    static let shared = PersistenceController()
    
    let container: NSPersistentContainer
    
    init(inMemory: Bool = false) {
        container = NSPersistentContainer(name: "BokiTraining")
        
        if inMemory {
            container.persistentStoreDescriptions.first?.url = URL(fileURLWithPath: "/dev/null")
        }
        
        container.loadPersistentStores { description, error in
            if let error = error {
                fatalError("Failed to load Core Data: \\(error)")
            }
        }
    }
}
```

---

## フェーズ8: テスト

### ユニットテスト

```swift
import XCTest
@testable import BokiTraining

class ProblemServiceTests: XCTestCase {
    var sut: ProblemService!
    
    override func setUp() {
        super.setUp()
        sut = ProblemService()
    }
    
    func testGenerateAmount() {
        let amount = sut.generateAmount()
        XCTAssertTrue(amount % 12 == 0, "Amount should be divisible by 12")
        XCTAssertGreaterThanOrEqual(amount, 12000)
    }
    
    func testGenerateProblem() async throws {
        let problem = try await sut.generateProblem(difficulty: .easy, allowedTypes: nil)
        XCTAssertNotNil(problem)
    }
}
```

---

## フェーズ9: デプロイ

### TestFlightによるベータテスト

1. **App Store Connect**でアプリ登録
2. **Xcode > Product > Archive**
3. **Distribute App > TestFlight**
4. テスターを招待

### App Storeリリース

1. **App Store Connect**でメタデータ入力
   - アプリ名
   - 説明
   - スクリーンショット
   - カテゴリ
2. **審査提出**
3. **承認後リリース**

---

## まとめ

### 移行の難易度

| 項目 | 難易度 | 説明 |
|---|---|---|
| 型定義 | ★☆☆☆☆ | ほぼ1:1対応 |
| 定数 | ★☆☆☆☆ | 配列・辞書のコピー |
| サービス | ★★★☆☆ | オーディオは音声ファイル必要 |
| ViewModel | ★★★★☆ | タイマー・State管理の書き換え |
| View | ★★★☆☆ | SwiftUIの学習必要 |
| 問題テンプレート | ★★★★★ | 147種すべてSwift化 |

### 推定工数

- **フェーズ1-2**: 1日（型定義）
- **フェーズ3**: 2日（定数・問題テンプレート）
- **フェーズ4**: 3日（サービスレイヤー）
- **フェーズ5**: 5日（ViewModel）
- **フェーズ6**: 7日（View）
- **フェーズ7**: 1日（データ永続化）
- **フェーズ8**: 3日（テスト）
- **フェーズ9**: 2日（デプロイ）

**合計**: 約24日（実働）

### 必要なスキル

- Swift 5.9+
- SwiftUI
- Combine
- AVFoundation
- CoreData（オプション）
- Xcode

---

これで全8ドキュメントが完成しました！iOS版開発に必要なすべての情報を網羅しています。
