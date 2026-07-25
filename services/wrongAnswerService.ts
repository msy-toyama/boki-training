import { GeneratedProblem, UserAnswer, WrongAnswerRecord } from '../types';
import { safeJSONParse, safeLocalStorage } from '../utils/helpers';

const STORAGE_KEY_WRONG_ANSWERS = 'boki_wrong_answers_v1';
const MAX_WRONG_ANSWERS = 100;

const getProblemKey = (problem: GeneratedProblem): string => `${problem.type}:${problem.text}`;

export const getWrongAnswerRecords = (): WrongAnswerRecord[] => {
  const str = safeLocalStorage.getItem(STORAGE_KEY_WRONG_ANSWERS);
  return str ? safeJSONParse<WrongAnswerRecord[]>(str, []) : [];
};

export const getPendingWrongAnswerRecords = (): WrongAnswerRecord[] => (
  getWrongAnswerRecords().filter(record => !record.isResolved)
);

export const recordWrongAnswer = (
  problem: GeneratedProblem,
  userAnswer: UserAnswer | null
): boolean => {
  const now = new Date().toISOString();
  const key = getProblemKey(problem);
  const history = getWrongAnswerRecords();
  const existing = history.find(record => !record.isResolved && getProblemKey(record.problem) === key);

  const nextRecord: WrongAnswerRecord = existing
    ? {
        ...existing,
        date: now,
        lastTriedAt: now,
        attempts: existing.attempts + 1,
        problem,
        userAnswer,
        isResolved: false,
      }
    : {
        id: crypto.randomUUID(),
        date: now,
        lastTriedAt: now,
        attempts: 1,
        problem,
        userAnswer,
        isResolved: false,
      };

  const nextHistory = [
    nextRecord,
    ...history.filter(record => record.id !== nextRecord.id),
  ].slice(0, MAX_WRONG_ANSWERS);

  return safeLocalStorage.setItem(STORAGE_KEY_WRONG_ANSWERS, JSON.stringify(nextHistory));
};

export const markWrongAnswerResolved = (recordId: string): boolean => {
  const now = new Date().toISOString();
  const history = getWrongAnswerRecords();
  const nextHistory = history.map(record => (
    record.id === recordId
      ? { ...record, lastTriedAt: now, isResolved: true }
      : record
  ));

  return safeLocalStorage.setItem(STORAGE_KEY_WRONG_ANSWERS, JSON.stringify(nextHistory));
};

export const clearResolvedWrongAnswers = (): boolean => {
  const pending = getWrongAnswerRecords().filter(record => !record.isResolved);
  return safeLocalStorage.setItem(STORAGE_KEY_WRONG_ANSWERS, JSON.stringify(pending));
};
