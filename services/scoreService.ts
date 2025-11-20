
import { ScoreRecord, UserProfile, Difficulty } from '../types';

const STORAGE_KEY_HISTORY = 'boki_game_history';
const STORAGE_KEY_BEST_EASY = 'boki_game_best_easy';
const STORAGE_KEY_BEST_HARD = 'boki_game_best_hard';
const STORAGE_KEY_PROFILE = 'boki_game_profile';

// --- User Profile Management ---

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
};

export const getUserProfile = (): UserProfile | null => {
  const str = localStorage.getItem(STORAGE_KEY_PROFILE);
  return str ? JSON.parse(str) : null;
};

// --- Score Management ---

export const saveScore = (record: ScoreRecord): boolean => {
  try {
    // Save to History
    const historyStr = localStorage.getItem(STORAGE_KEY_HISTORY);
    const history: ScoreRecord[] = historyStr ? JSON.parse(historyStr) : [];
    
    // Add new record to top
    const newHistory = [record, ...history].slice(0, 100); // 直近100件まで保存
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(newHistory));

    // Check & Save Best Score per difficulty
    const key = record.difficulty === 'Easy' ? STORAGE_KEY_BEST_EASY : STORAGE_KEY_BEST_HARD;
    const bestStr = localStorage.getItem(key);
    const currentBest = bestStr ? Number(bestStr) : 0;
    
    if (record.score > currentBest) {
      localStorage.setItem(key, String(record.score));
    }
    return true;
  } catch (e) {
    console.error("Failed to save score", e);
    // ブラウザがプライベートモードまたはLocalStorageが無効の可能性
    return false;
  }
};

export const getHistory = (): ScoreRecord[] => {
  try {
    const str = localStorage.getItem(STORAGE_KEY_HISTORY);
    return str ? JSON.parse(str) : [];
  } catch {
    return [];
  }
};

export const getPersonalBest = (difficulty: Difficulty): number => {
  try {
    const key = difficulty === 'Easy' ? STORAGE_KEY_BEST_EASY : STORAGE_KEY_BEST_HARD;
    return Number(localStorage.getItem(key) || 0);
  } catch {
    return 0;
  }
};
