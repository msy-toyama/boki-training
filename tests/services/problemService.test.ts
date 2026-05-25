import { describe, expect, it } from 'vitest';
import { generateProblem } from '../../services/problemService';
import { Difficulty, GeneratedProblem, QuestionType } from '../../types';

const difficulties: Difficulty[] = ['Practice', 'Easy', 'Hard'];
const questionTypes = [QuestionType.JOURNAL, QuestionType.SELECTION, QuestionType.NUMERIC];

const sumAmounts = (items: { amount: number }[] = []) => items.reduce((total, item) => total + item.amount, 0);

const expectValidGeneratedProblem = (problem: GeneratedProblem) => {
  expect(problem.id).toBeTruthy();
  expect(problem.text).toBeTruthy();
  expect(problem.explanation).toBeTruthy();
  expect(problem.topic).toBeTruthy();
  expect(problem.kbLink?.path).toMatch(/^\/kb\//);
  expect(problem.kbLink?.label).toBeTruthy();

  if (problem.type === QuestionType.JOURNAL) {
    expect(problem.correctJournal).toBeTruthy();
    expect(sumAmounts(problem.correctJournal?.debits)).toBe(sumAmounts(problem.correctJournal?.credits));

    const selectableAccounts = problem.selectableAccounts ?? [];
    const amountOptions = problem.amountOptions ?? [];
    for (const item of [...(problem.correctJournal?.debits ?? []), ...(problem.correctJournal?.credits ?? [])]) {
      expect(selectableAccounts).toContain(item.account);
      expect(amountOptions).toContain(item.amount);
    }
  }

  if (problem.type === QuestionType.SELECTION) {
    expect(problem.correctSelection).toBeTruthy();
    expect(problem.options).toContain(problem.correctSelection);
    expect(new Set(problem.options).size).toBe(problem.options?.length);
  }

  if (problem.type === QuestionType.NUMERIC) {
    expect(problem.correctNumeric).toBeGreaterThan(0);
    expect(problem.amountOptions).toContain(problem.correctNumeric);
    expect(new Set(problem.amountOptions).size).toBe(problem.amountOptions?.length);
  }
};

describe('generateProblem', () => {
  it.each(difficulties)('%sで各問題タイプを生成できる', async (difficulty) => {
    for (const type of questionTypes) {
      const problem = await generateProblem(difficulty, [type]);
      expect(problem.difficulty).toBe(difficulty);
      expect(problem.type).toBe(type);
      expectValidGeneratedProblem(problem);
    }
  });

  it('topic指定でも安全に問題を生成できる', async () => {
    for (const topic of ['closing', 'trial-balance', 'mistakes']) {
      const problem = await generateProblem('Practice', undefined, topic);
      expectValidGeneratedProblem(problem);
    }
  });

  it('許可された問題タイプが空ならエラーにする', async () => {
    await expect(generateProblem('Practice', [])).rejects.toThrow('No templates available');
  });
});