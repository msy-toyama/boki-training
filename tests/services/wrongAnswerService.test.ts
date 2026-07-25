import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearResolvedWrongAnswers,
  getPendingWrongAnswerRecords,
  getWrongAnswerRecords,
  markWrongAnswerResolved,
  recordWrongAnswer
} from '../../services/wrongAnswerService';
import { GeneratedProblem, QuestionType } from '../../types';

const makeProblem = (text = '商品を現金で売り上げた。'): GeneratedProblem => ({
  id: crypto.randomUUID(),
  type: QuestionType.JOURNAL,
  text,
  correctJournal: {
    debits: [{ account: '現金', amount: 1000 }],
    credits: [{ account: '売上', amount: 1000 }]
  },
  selectableAccounts: ['現金', '売上', '仕入'],
  amountOptions: [1000, 2000, 3000],
  explanation: '現金売上の基本仕訳です。',
  difficulty: 'Practice'
});

describe('wrongAnswerService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('間違えた問題を正答つきで保存できる', () => {
    const problem = makeProblem();
    const userAnswer = {
      debits: [{ account: '売上', amount: 1000 }],
      credits: [{ account: '現金', amount: 1000 }]
    };

    expect(recordWrongAnswer(problem, userAnswer)).toBe(true);

    const records = getWrongAnswerRecords();
    expect(records).toHaveLength(1);
    expect(records[0].problem.text).toBe(problem.text);
    expect(records[0].problem.correctJournal).toEqual(problem.correctJournal);
    expect(records[0].userAnswer).toEqual(userAnswer);
    expect(records[0].isResolved).toBe(false);
  });

  it('同じexact textの未解決問題は重複せず試行回数を増やす', () => {
    const problem = makeProblem();

    recordWrongAnswer(problem, null);
    recordWrongAnswer(problem, null);

    const records = getWrongAnswerRecords();
    expect(records).toHaveLength(1);
    expect(records[0].attempts).toBe(2);
  });

  it('正解済みにして未解決一覧から除外できる', () => {
    const problem = makeProblem();
    recordWrongAnswer(problem, null);
    const record = getWrongAnswerRecords()[0];

    expect(markWrongAnswerResolved(record.id)).toBe(true);
    expect(getPendingWrongAnswerRecords()).toEqual([]);
    expect(getWrongAnswerRecords()[0].isResolved).toBe(true);
  });

  it('解決済みの履歴だけを掃除できる', () => {
    recordWrongAnswer(makeProblem('A'), null);
    recordWrongAnswer(makeProblem('B'), null);
    markWrongAnswerResolved(getWrongAnswerRecords()[0].id);

    expect(clearResolvedWrongAnswers()).toBe(true);
    expect(getWrongAnswerRecords()).toHaveLength(1);
    expect(getWrongAnswerRecords()[0].problem.text).toBe('A');
  });
});
