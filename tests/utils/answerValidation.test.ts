import { describe, expect, it } from 'vitest';
import { checkAnswer } from '../../utils/answerValidation';
import { GeneratedProblem, QuestionType } from '../../types';

const baseProblem = {
  id: 'test-problem',
  text: 'テスト問題',
  explanation: 'テスト解説',
  difficulty: 'Practice' as const
};

describe('checkAnswer', () => {
  it('仕訳問題は借方・貸方それぞれで行順を無視して正答判定する', () => {
    const problem: GeneratedProblem = {
      ...baseProblem,
      type: QuestionType.JOURNAL,
      correctJournal: {
        debits: [
          { account: '仕入', amount: 1000 },
          { account: '仮払消費税', amount: 100 }
        ],
        credits: [{ account: '買掛金', amount: 1100 }]
      }
    };

    expect(checkAnswer({
      debits: [
        { account: '仮払消費税', amount: 100 },
        { account: '仕入', amount: 1000 }
      ],
      credits: [{ account: '買掛金', amount: 1100 }]
    }, problem)).toBe(true);
  });

  it('仕訳問題は借方と貸方が逆なら不正解にする', () => {
    const problem: GeneratedProblem = {
      ...baseProblem,
      type: QuestionType.JOURNAL,
      correctJournal: {
        debits: [{ account: '現金', amount: 5000 }],
        credits: [{ account: '売掛金', amount: 5000 }]
      }
    };

    expect(checkAnswer({
      debits: [{ account: '売掛金', amount: 5000 }],
      credits: [{ account: '現金', amount: 5000 }]
    }, problem)).toBe(false);
  });

  it('仕訳問題は金額違いや空行を含む回答を不正解にする', () => {
    const problem: GeneratedProblem = {
      ...baseProblem,
      type: QuestionType.JOURNAL,
      correctJournal: {
        debits: [{ account: '現金', amount: 12000 }],
        credits: [{ account: '売上', amount: 12000 }]
      }
    };

    expect(checkAnswer({
      debits: [{ account: '現金', amount: 12001 }],
      credits: [{ account: '売上', amount: 12000 }]
    }, problem)).toBe(false);

    expect(checkAnswer({
      debits: [{ account: '現金', amount: 12000 }, { account: '', amount: 0 }],
      credits: [{ account: '売上', amount: 12000 }]
    }, problem)).toBe(false);
  });

  it('選択問題は完全一致だけを正解にする', () => {
    const problem: GeneratedProblem = {
      ...baseProblem,
      type: QuestionType.SELECTION,
      correctSelection: '資産',
      options: ['資産', '負債', '収益', '費用']
    };

    expect(checkAnswer('資産', problem)).toBe(true);
    expect(checkAnswer('費用', problem)).toBe(false);
    expect(checkAnswer(0, problem)).toBe(false);
  });

  it('数値問題は数値の完全一致だけを正解にする', () => {
    const problem: GeneratedProblem = {
      ...baseProblem,
      type: QuestionType.NUMERIC,
      correctNumeric: 1350,
      amountOptions: [1200, 1350, 1500]
    };

    expect(checkAnswer(1350, problem)).toBe(true);
    expect(checkAnswer(1350.1, problem)).toBe(false);
    expect(checkAnswer('1350', problem)).toBe(false);
  });
});