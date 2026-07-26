
import { ScoreRecord, UserProfile, Difficulty, SoundSettings } from '../types';
import { safeJSONParse, safeLocalStorage } from '../utils/helpers';

const STORAGE_KEY_HISTORY = 'boki_game_history';
const STORAGE_KEY_BEST_EASY = 'boki_game_best_easy';
const STORAGE_KEY_BEST_HARD = 'boki_game_best_hard';
const STORAGE_KEY_PROFILE = 'boki_game_profile';

// --- Sound Settings Defaults & Migration ---

export const DEFAULT_SOUND_SETTINGS: Required<SoundSettings> = {
  bgm: false,
  sfx: true,
  bgmVolume: 0.6,
  sfxVolume: 0.8,
  theme: 'retro',
};

/** 保存済みプロフィールの soundSettings に欠損フィールドがあれば既定値で補完する */
export const normalizeSoundSettings = (settings?: Partial<SoundSettings> | null): Required<SoundSettings> => {
  const clamp = (v: number | undefined, fallback: number): number =>
    typeof v === 'number' && isFinite(v) ? Math.min(1, Math.max(0, v)) : fallback;
  return {
    bgm: settings?.bgm ?? DEFAULT_SOUND_SETTINGS.bgm,
    sfx: settings?.sfx ?? DEFAULT_SOUND_SETTINGS.sfx,
    bgmVolume: clamp(settings?.bgmVolume, DEFAULT_SOUND_SETTINGS.bgmVolume),
    sfxVolume: clamp(settings?.sfxVolume, DEFAULT_SOUND_SETTINGS.sfxVolume),
    theme: settings?.theme ?? DEFAULT_SOUND_SETTINGS.theme,
  };
};

// --- User Profile Management ---

export const saveUserProfile = (profile: UserProfile): void => {
  safeLocalStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
};

export const getUserProfile = (): UserProfile | null => {
  const str = safeLocalStorage.getItem(STORAGE_KEY_PROFILE);
  const profile = str ? safeJSONParse<UserProfile | null>(str, null) : null;
  if (!profile) return null;
  // 後方互換: 旧プロフィール（bgm/sfx のみ）に音量・テーマを補完
  profile.soundSettings = normalizeSoundSettings(profile.soundSettings);
  return profile;
};

// --- Score Management ---

export const saveScore = (record: ScoreRecord): boolean => {
  try {
    // Save to History
    const historyStr = safeLocalStorage.getItem(STORAGE_KEY_HISTORY);
    const history = historyStr ? safeJSONParse<ScoreRecord[]>(historyStr, []) : [];
    
    // Add new record to top
    const newHistory = [record, ...history].slice(0, 100); // 直近100件まで保存
    if (!safeLocalStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(newHistory))) {
      return false;
    }

    if (record.difficulty === 'Practice') {
      return true;
    }

    // Check & Save Best Score per difficulty
    const key = record.difficulty === 'Easy' ? STORAGE_KEY_BEST_EASY : STORAGE_KEY_BEST_HARD;
    const bestStr = safeLocalStorage.getItem(key);
    const currentBest = bestStr ? Number(bestStr) : 0;
    
    if (record.score > currentBest) {
      return safeLocalStorage.setItem(key, String(record.score));
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
    const str = safeLocalStorage.getItem(STORAGE_KEY_HISTORY);
    return str ? safeJSONParse<ScoreRecord[]>(str, []) : [];
  } catch {
    return [];
  }
};

export const getPersonalBest = (difficulty: Difficulty): number => {
  try {
    if (difficulty === 'Practice') {
      return 0;
    }
    const key = difficulty === 'Easy' ? STORAGE_KEY_BEST_EASY : STORAGE_KEY_BEST_HARD;
    return Number(safeLocalStorage.getItem(key) || 0);
  } catch {
    return 0;
  }
};
