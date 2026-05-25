import { describe, expect, it, vi } from 'vitest';
import { GAME_SETTINGS, MONSTERS_LIST } from '../../constants';
import { calculateInterval, spawnMonster } from '../../utils/gameLogic';

describe('gameLogic', () => {
  it('モンスターは周回ごとにHPが増える', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000000');

    const first = spawnMonster(0);
    const looped = spawnMonster(MONSTERS_LIST.length);

    expect(first.id).toBe('00000000-0000-4000-8000-000000000000');
    expect(first.level).toBe(1);
    expect(first.maxHp).toBe(MONSTERS_LIST[0].hp);
    expect(looped.level).toBe(MONSTERS_LIST.length + 1);
    expect(looped.maxHp).toBe(Math.floor(MONSTERS_LIST[0].hp * 1.5));
  });

  it('攻撃間隔は難易度ごとの最小値を下回らない', () => {
    expect(calculateInterval('Easy', 0)).toBe(GAME_SETTINGS.Easy.startInterval);
    expect(calculateInterval('Easy', 1000)).toBe(GAME_SETTINGS.Easy.minInterval);
    expect(calculateInterval('Hard', 1000)).toBe(GAME_SETTINGS.Hard.minInterval);
    expect(calculateInterval('Practice', 50)).toBe(GAME_SETTINGS.Practice.startInterval);
  });
});