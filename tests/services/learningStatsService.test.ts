import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAttemptHistory, getLearningStatsSummary, recordAttempt } from '../../services/learningStatsService';
import { ProblemTopic, QuestionType } from '../../types';

describe('learningStatsService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('回答履歴を新しい順に保存する', () => {
    recordAttempt({ difficulty: 'Practice', questionType: QuestionType.JOURNAL, topic: ProblemTopic.SALES_TAX, isCorrect: false, elapsedSeconds: 3.2 });
    recordAttempt({ difficulty: 'Practice', questionType: QuestionType.NUMERIC, topic: ProblemTopic.FIXED_ASSETS, isCorrect: true, elapsedSeconds: 5 });

    const history = getAttemptHistory();
    expect(history).toHaveLength(2);
    expect(history[0].topic).toBe(ProblemTopic.FIXED_ASSETS);
    expect(history[1].topic).toBe(ProblemTopic.SALES_TAX);
  });

  it('論点別正答率と苦手トップ3を集計する', () => {
    recordAttempt({ difficulty: 'Easy', questionType: QuestionType.JOURNAL, topic: ProblemTopic.SALES_TAX, isCorrect: false });
    recordAttempt({ difficulty: 'Easy', questionType: QuestionType.JOURNAL, topic: ProblemTopic.SALES_TAX, isCorrect: true });
    recordAttempt({ difficulty: 'Easy', questionType: QuestionType.JOURNAL, topic: ProblemTopic.NOTES, isCorrect: true });
    recordAttempt({ difficulty: 'Easy', questionType: QuestionType.JOURNAL, topic: ProblemTopic.NOTES, isCorrect: true });

    const summary = getLearningStatsSummary();
    const salesTax = summary.byTopic.find(topic => topic.topic === ProblemTopic.SALES_TAX);

    expect(summary.totalAttempts).toBe(4);
    expect(summary.correctAttempts).toBe(3);
    expect(summary.last7DaysAttempts).toBe(4);
    expect(salesTax?.accuracy).toBe(50);
    expect(summary.weakestTopics).toHaveLength(1);
    expect(summary.weakestTopics[0].topic).toBe(ProblemTopic.SALES_TAX);
  });

  it('保存件数は500件に制限する', () => {
    vi.spyOn(crypto, 'randomUUID').mockImplementation(() => '00000000-0000-4000-8000-000000000000');

    for (let index = 0; index < 520; index += 1) {
      recordAttempt({ difficulty: 'Practice', questionType: QuestionType.SELECTION, isCorrect: index % 2 === 0 });
    }

    expect(getAttemptHistory()).toHaveLength(500);
  });
});