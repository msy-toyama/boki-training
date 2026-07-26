
export enum QuestionType {
  JOURNAL = '仕訳問題',
  SELECTION = '選択問題',
  NUMERIC = '計算問題',
  STATEMENT = '決算総合問題',
}

export type Difficulty = 'Easy' | 'Hard' | 'Practice';
export type BookkeepingLevel = 'Level3' | 'Level2';

export enum ProblemScopeTag {
  STANDARD = 'standard',
  ADVANCED = 'advanced',
  LEGACY = 'legacy',
  OUT_OF_SCOPE = 'out_of_scope',
  NEEDS_REVIEW = 'needs_review',
  LEVEL2_COMMERCIAL = 'level2_commercial',
  LEVEL2_INDUSTRIAL = 'level2_industrial',
}

export interface ProblemScopeMetadata {
  tag: ProblemScopeTag;
  label: string;
  reason: string;
  source?: string;
}

export enum ProblemTopic {
  GENERAL = 'general',
  JOURNAL_BASICS = 'journal-basics',
  ACCOUNTS = 'accounts',
  SALES_TAX = 'sales-tax',
  OVERDRAFT = 'overdraft',
  NOTES = 'notes',
  FIXED_ASSETS = 'fixed-assets',
  ACCRUALS = 'accruals',
  CLOSING = 'closing',
  TRIAL_BALANCE = 'trial-balance',
  FINANCIAL_STATEMENTS = 'financial-statements',
  MISTAKES = 'mistakes'
}

export interface KbLink {
  path: string;
  label: string;
}

// 勘定科目の分類（第2問対策用）
export type AccountCategory = 'Asset' | 'Liability' | 'NetAsset' | 'Revenue' | 'Expense';

export interface JournalEntryItem {
  account: string;
  amount: number;
}

export interface JournalEntryAnswer {
  debits: JournalEntryItem[];
  credits: JournalEntryItem[];
}

export type StatementProblemMode = 'closing_entries' | 'worksheet' | 'financial_statements';

export interface StatementMaterial {
  label: string;
  value: number | string;
}

export interface StatementTrialBalanceRow {
  account: string;
  debit?: number;
  credit?: number;
}

export interface StatementAdjustmentItem {
  label: string;
  text: string;
}

export interface StatementBlank {
  id: string;
  section: string;
  label: string;
  account?: string;
  hint?: string;
}

export interface StatementExplanationRow {
  label: string;
  formula: string;
  amount: number;
}

export interface StatementIntegrityCheck {
  label: string;
  left: number;
  right: number;
}

export interface StatementProblemData {
  mode: StatementProblemMode;
  title: string;
  description: string;
  materials: StatementMaterial[];
  trialBalance?: StatementTrialBalanceRow[];
  adjustmentItems?: StatementAdjustmentItem[];
  requirements: string[];
  blanks: StatementBlank[];
  correctAnswers: Record<string, number>;
  closingEntries?: JournalEntryAnswer[];
  explanationRows?: StatementExplanationRow[];
  integrityChecks?: StatementIntegrityCheck[];
}

export interface StatementAnswer {
  kind: 'statement';
  values: Record<string, number>;
}

// Union type for answers
export type UserAnswer = 
  | JournalEntryAnswer 
  | StatementAnswer
  | string  // For selection
  | number; // For numeric input

export interface ProblemTemplate {
  type: QuestionType;
  // 出題級。未指定は3級(Level3)として扱う。
  level?: BookkeepingLevel;
  // 2級の論点タグ（フィルタ用。例: 'securities', 'consolidation'）。
  level2Topic?: string;
  // Text generator
  textTemplate: (amount: number, target?: string) => string;
  // Optional dynamic explanation generator using the same generated amount/context.
  explanationTemplate?: (amount: number, target?: string) => string;
  // Answer generators
  generateJournalAnswer?: (amount: number, target?: string) => JournalEntryAnswer;
  generateSelectionAnswer?: () => { correct: string; options: string[] };
  generateNumericAnswer?: (amount: number) => number;
  generateStatementData?: (amount: number, target?: string) => StatementProblemData;
  explanation: string;
  topic?: ProblemTopic;
  kbLink?: KbLink;
  scope?: ProblemScopeMetadata;
}

export interface GeneratedProblem {
  id: string;
  type: QuestionType;
  level?: BookkeepingLevel;
  level2Topic?: string;
  text: string;
  
  // Correct answers based on type
  correctJournal?: JournalEntryAnswer;
  correctSelection?: string;
  correctNumeric?: number;
  statement?: StatementProblemData;
  
  options?: string[]; // For selection type
  selectableAccounts?: string[]; // For Journal type (subset of all accounts)
  amountOptions?: number[]; // For Journal/Numeric type (choices for amount)
  
  explanation: string;
  difficulty: Difficulty;
  topic?: ProblemTopic;
  kbLink?: KbLink;
  scope?: ProblemScopeMetadata;
}

export interface Monster {
  id: string;
  name: string;
  emoji: string;
  maxHp: number;
  currentHp: number;
  level: number;
}

export interface PlayerState {
  maxHp: number;
  currentHp: number;
  score: number;
  combo: number;
}

export interface BattleResult {
  damageDealt: number;
  damageTaken: number;
  isCorrect: boolean;
  isCritical: boolean;
  timeBonus: number;
  monsterDefeated: boolean;
  playerDefeated: boolean;
  surrendered?: boolean;
}

// --- Sound Types ---

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
  SFX_CANCEL,
  // --- 追加（末尾に追記して既存の数値を維持） ---
  SFX_WRONG,
  SFX_COMBO,
  SFX_RANKUP,
  SFX_REWARD,
  SFX_PAGE,
  SFX_HOVER,
  SFX_COUNTDOWN,
  BGM_BATTLE_NORMAL,
  BGM_BOSS,
  BGM_VICTORY
}

export type SoundTheme = 'retro' | 'soft' | 'cinematic';

export interface SoundSettings {
  bgm: boolean;
  sfx: boolean;
  /** BGM 音量 0.0〜1.0（未設定なら既定値で補完） */
  bgmVolume?: number;
  /** 効果音 音量 0.0〜1.0（未設定なら既定値で補完） */
  sfxVolume?: number;
  /** サウンドテーマ（波形パレット） */
  theme?: SoundTheme;
}

// --- User & Score Types ---

export interface UserProfile {
  name: string;
  prefecture: string;
  soundSettings: SoundSettings;
}

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

export interface AttemptRecord {
  id: string;
  date: string;
  difficulty: Difficulty;
  questionType: QuestionType;
  topic: ProblemTopic;
  isCorrect: boolean;
  elapsedSeconds?: number;
}

export interface WrongAnswerRecord {
  id: string;
  date: string;
  lastTriedAt: string;
  attempts: number;
  problem: GeneratedProblem;
  userAnswer: UserAnswer | null;
  isResolved: boolean;
}

export interface TopicAccuracySummary {
  topic: ProblemTopic;
  label: string;
  attempts: number;
  correct: number;
  accuracy: number;
}

export interface LearningStatsSummary {
  totalAttempts: number;
  correctAttempts: number;
  last7DaysAttempts: number;
  streakDays: number;
  byTopic: TopicAccuracySummary[];
  weakestTopics: TopicAccuracySummary[];
}
