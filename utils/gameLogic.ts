import { GAME_SETTINGS, MAX_QUESTIONS, MONSTERS_LIST } from '../constants';
import { Difficulty, Monster } from '../types';

export const spawnMonster = (index: number): Monster => {
  const baseMonster = MONSTERS_LIST[index % MONSTERS_LIST.length];
  const loopCount = Math.floor(index / MONSTERS_LIST.length);
  const multiplier = 1 + (loopCount * 0.5);
  const hp = Math.floor(baseMonster.hp * multiplier);

  return {
    ...baseMonster,
    id: crypto.randomUUID(),
    maxHp: hp,
    currentHp: hp,
    level: index + 1
  };
};

export const calculateInterval = (difficulty: Difficulty, questionIndex: number): number => {
  const settings = GAME_SETTINGS[difficulty];
  const progress = Math.min(questionIndex / MAX_QUESTIONS, 1);
  const current = settings.startInterval - (progress * (settings.startInterval - settings.minInterval));

  return Math.max(settings.minInterval, current);
};