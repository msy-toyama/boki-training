import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getHistory, getPersonalBest, getUserProfile, saveScore, saveUserProfile } from '../../services/scoreService';
import { ScoreRecord, UserProfile } from '../../types';

const makeScore = (score: number, index = score): ScoreRecord => ({
  id: `score-${index}`,
  date: new Date(2026, 0, index + 1).toISOString(),
  score,
  difficulty: index % 2 === 0 ? 'Easy' : 'Hard',
  questionsAnswered: index,
  monsterDefeated: Math.floor(index / 5),
  userName: 'テストユーザー',
  prefecture: '未設定'
});

describe('scoreService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  it('プロフィールを保存して読み戻せる', () => {
    const profile: UserProfile = {
      name: '簿記太郎',
      prefecture: '東京都',
      soundSettings: { bgm: true, sfx: false }
    };

    saveUserProfile(profile);

    expect(getUserProfile()).toEqual(profile);
  });

  it('破損したプロフィールJSONはnullにフォールバックする', () => {
    localStorage.setItem('boki_game_profile', '{broken');

    expect(getUserProfile()).toBeNull();
  });

  it('履歴は新しい順で100件まで保存する', () => {
    for (let index = 0; index < 150; index += 1) {
      expect(saveScore(makeScore(index, index))).toBe(true);
    }

    const history = getHistory();
    expect(history).toHaveLength(100);
    expect(history[0].id).toBe('score-149');
    expect(history[99].id).toBe('score-50');
  });

  it('難易度別ベストスコアは高いスコアだけで更新する', () => {
    saveScore({ ...makeScore(500), difficulty: 'Easy' });
    saveScore({ ...makeScore(300), difficulty: 'Easy' });
    saveScore({ ...makeScore(800), difficulty: 'Hard' });

    expect(getPersonalBest('Easy')).toBe(500);
    expect(getPersonalBest('Hard')).toBe(800);
  });

  it('保存先localStorageが例外を投げてもfalseを返す', () => {
    const setItemSpy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });

    expect(saveScore(makeScore(100))).toBe(false);
    setItemSpy.mockRestore();
  });

  it('破損した履歴JSONは空配列にフォールバックする', () => {
    localStorage.setItem('boki_game_history', '{broken');

    expect(getHistory()).toEqual([]);
  });
});