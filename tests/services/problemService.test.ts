import { describe, expect, it } from 'vitest';
import { generateProblem } from '../../services/problemService';
import { isDefaultExamAccountTitle } from '../../services/problemScopeService';
import { Difficulty, GeneratedProblem, ProblemScopeTag, QuestionType } from '../../types';

const difficulties: Difficulty[] = ['Practice', 'Easy', 'Hard'];
const questionTypes = [QuestionType.JOURNAL, QuestionType.SELECTION, QuestionType.NUMERIC, QuestionType.STATEMENT];

const sumAmounts = (items: { amount: number }[] = []) => items.reduce((total, item) => total + item.amount, 0);
const sumTrialDebits = (items: { debit?: number }[] = []) => items.reduce((total, item) => total + (item.debit ?? 0), 0);
const sumTrialCredits = (items: { credit?: number }[] = []) => items.reduce((total, item) => total + (item.credit ?? 0), 0);

const expectValidGeneratedProblem = (problem: GeneratedProblem) => {
  expect(problem.id).toBeTruthy();
  expect(problem.text).toBeTruthy();
  expect(problem.explanation).toBeTruthy();
  expect(problem.topic).toBeTruthy();
  expect(problem.kbLink?.path).toMatch(/^\/kb\//);
  expect(problem.kbLink?.label).toBeTruthy();
  expect(problem.scope?.tag).toBeTruthy();
  expect(problem.scope?.tag).not.toBe(ProblemScopeTag.LEGACY);
  expect(problem.scope?.tag).not.toBe(ProblemScopeTag.OUT_OF_SCOPE);

  if (problem.type === QuestionType.JOURNAL) {
    expect(problem.correctJournal).toBeTruthy();
    expect(sumAmounts(problem.correctJournal?.debits)).toBe(sumAmounts(problem.correctJournal?.credits));

    const selectableAccounts = problem.selectableAccounts ?? [];
    const amountOptions = problem.amountOptions ?? [];
    expect(selectableAccounts.every(isDefaultExamAccountTitle)).toBe(true);
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

  if (problem.type === QuestionType.STATEMENT) {
    expect(problem.statement?.title).toBeTruthy();
    expect(problem.statement?.materials.length).toBeGreaterThan(0);
    expect(problem.statement?.trialBalance?.length).toBeGreaterThan(0);
    expect(sumTrialDebits(problem.statement?.trialBalance)).toBe(sumTrialCredits(problem.statement?.trialBalance));
    expect(problem.statement?.adjustmentItems?.length).toBeGreaterThanOrEqual(4);
    expect(problem.statement?.requirements.length).toBeGreaterThan(0);
    expect(problem.statement?.blanks.length).toBeGreaterThan(0);
    expect(new Set(problem.statement?.blanks.map(blank => blank.id)).size).toBe(problem.statement?.blanks.length);
    for (const entry of problem.statement?.closingEntries ?? []) {
      expect(sumAmounts(entry.debits)).toBe(sumAmounts(entry.credits));
    }
    for (const check of problem.statement?.integrityChecks ?? []) {
      expect(check.left).toBe(check.right);
    }
    for (const blank of problem.statement?.blanks ?? []) {
      expect(problem.statement?.correctAnswers[blank.id]).toBeGreaterThan(0);
      expect(problem.amountOptions).toContain(problem.statement?.correctAnswers[blank.id]);
    }
    expect(problem.statement?.blanks.some(blank => blank.section === '決算整理仕訳')).toBe(true);
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
