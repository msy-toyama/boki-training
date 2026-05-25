import { AttemptRecord, Difficulty, LearningStatsSummary, ProblemTopic, QuestionType, TopicAccuracySummary } from '../types';
import { safeJSONParse, safeLocalStorage } from '../utils/helpers';
import { getLearningTopicLabel } from './learningTopicService';

const STORAGE_KEY_ATTEMPTS = 'boki_game_attempts_v1';
const MAX_ATTEMPTS = 500;

export interface RecordAttemptInput {
  difficulty: Difficulty;
  questionType: QuestionType;
  topic?: ProblemTopic;
  isCorrect: boolean;
  elapsedSeconds?: number;
}

const getDateKey = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const getAttemptHistory = (): AttemptRecord[] => {
  const str = safeLocalStorage.getItem(STORAGE_KEY_ATTEMPTS);
  return str ? safeJSONParse<AttemptRecord[]>(str, []) : [];
};

export const recordAttempt = (input: RecordAttemptInput): boolean => {
  const record: AttemptRecord = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    difficulty: input.difficulty,
    questionType: input.questionType,
    topic: input.topic ?? ProblemTopic.GENERAL,
    isCorrect: input.isCorrect,
    elapsedSeconds: input.elapsedSeconds
  };

  const history = getAttemptHistory();
  return safeLocalStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify([record, ...history].slice(0, MAX_ATTEMPTS)));
};

const calculateStreakDays = (attempts: AttemptRecord[]): number => {
  if (attempts.length === 0) return 0;

  const dateKeys = new Set(attempts.map(attempt => getDateKey(attempt.date)));
  const todayKey = getDateKey(new Date());
  const sortedKeys = Array.from(dateKeys).sort().reverse();
  let cursor = dateKeys.has(todayKey) ? new Date() : new Date(sortedKeys[0]);
  let streak = 0;

  while (dateKeys.has(getDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
};

const summarizeByTopic = (attempts: AttemptRecord[]): TopicAccuracySummary[] => {
  const summaryMap = new Map<ProblemTopic, { attempts: number; correct: number }>();

  attempts.forEach(attempt => {
    const topic = attempt.topic ?? ProblemTopic.GENERAL;
    const current = summaryMap.get(topic) ?? { attempts: 0, correct: 0 };
    summaryMap.set(topic, {
      attempts: current.attempts + 1,
      correct: current.correct + (attempt.isCorrect ? 1 : 0)
    });
  });

  return Array.from(summaryMap.entries())
    .map(([topic, value]) => ({
      topic,
      label: getLearningTopicLabel(topic),
      attempts: value.attempts,
      correct: value.correct,
      accuracy: value.attempts === 0 ? 0 : Math.round((value.correct / value.attempts) * 100)
    }))
    .sort((a, b) => b.attempts - a.attempts || a.accuracy - b.accuracy);
};

export const getLearningStatsSummary = (): LearningStatsSummary => {
  const attempts = getAttemptHistory();
  const now = new Date();
  const sevenDaysAgo = addDays(now, -6);
  sevenDaysAgo.setHours(0, 0, 0, 0);
  const byTopic = summarizeByTopic(attempts);

  return {
    totalAttempts: attempts.length,
    correctAttempts: attempts.filter(attempt => attempt.isCorrect).length,
    last7DaysAttempts: attempts.filter(attempt => new Date(attempt.date) >= sevenDaysAgo).length,
    streakDays: calculateStreakDays(attempts),
    byTopic,
    weakestTopics: byTopic
      .filter(topic => topic.attempts >= 2 && topic.accuracy < 80)
      .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts)
      .slice(0, 3)
  };
};