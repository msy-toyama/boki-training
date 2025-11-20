
export enum QuestionType {
  JOURNAL = '仕訳問題',
  SELECTION = '選択問題',
  NUMERIC = '計算問題',
}

export type Difficulty = 'Easy' | 'Hard';
export type BookkeepingLevel = 'Level3' | 'Level2';

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

// Union type for answers
export type UserAnswer = 
  | JournalEntryAnswer 
  | string  // For selection
  | number; // For numeric input

export interface ProblemTemplate {
  type: QuestionType;
  // Text generator
  textTemplate: (amount: number, target?: string) => string;
  // Answer generators
  generateJournalAnswer?: (amount: number, target?: string) => JournalEntryAnswer;
  generateSelectionAnswer?: () => { correct: string; options: string[] };
  generateNumericAnswer?: (amount: number) => number;
  explanation: string;
}

export interface GeneratedProblem {
  id: string;
  type: QuestionType;
  text: string;
  
  // Correct answers based on type
  correctJournal?: JournalEntryAnswer;
  correctSelection?: string;
  correctNumeric?: number;
  
  options?: string[]; // For selection type
  selectableAccounts?: string[]; // For Journal type (subset of all accounts)
  amountOptions?: number[]; // For Journal/Numeric type (choices for amount)
  
  explanation: string;
  difficulty: Difficulty;
}

export interface GeminiResponseSchema {
  questionText: string;
  debits: { accountName: string; amount: number }[];
  credits: { accountName: string; amount: number }[];
  explanation: string;
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
  SFX_CANCEL
}

export interface SoundSettings {
  bgm: boolean;
  sfx: boolean;
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
