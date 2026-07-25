import { describe, expect, it } from 'vitest';
import {
  createClosingWorksheetStatementData,
  createFinancialStatementsData,
  createWorksheetStatementData,
} from '../../services/statementProblemFactory';
import { StatementProblemData } from '../../types';

const sumAmounts = (rows: { amount: number }[]) => rows.reduce((total, row) => total + row.amount, 0);
const sumDebits = (rows: { debit?: number }[]) => rows.reduce((total, row) => total + (row.debit ?? 0), 0);
const sumCredits = (rows: { credit?: number }[]) => rows.reduce((total, row) => total + (row.credit ?? 0), 0);

const expectValidIntegratedStatementProblem = (data: StatementProblemData) => {
  expect(data.trialBalance?.length).toBeGreaterThan(0);
  expect(sumDebits(data.trialBalance ?? [])).toBe(sumCredits(data.trialBalance ?? []));
  expect(data.adjustmentItems?.length).toBeGreaterThanOrEqual(4);
  expect(data.blanks.some(blank => blank.section === '決算整理仕訳')).toBe(true);

  for (const entry of data.closingEntries ?? []) {
    expect(sumAmounts(entry.debits)).toBe(sumAmounts(entry.credits));
  }

  for (const blank of data.blanks) {
    expect(data.correctAnswers[blank.id]).toBeGreaterThan(0);
  }

  for (const check of data.integrityChecks ?? []) {
    expect(check.left).toBe(check.right);
  }
};

describe('statementProblemFactory', () => {
  it.each([
    ['決算整理仕訳から精算表', createClosingWorksheetStatementData],
    ['精算表', createWorksheetStatementData],
    ['財務諸表', createFinancialStatementsData],
  ])('%sは試算表・整理仕訳・答案欄の整合が取れている', (_, factory) => {
    for (const base of [12000, 15000, 24000, 120000]) {
      expectValidIntegratedStatementProblem(factory(base, 'テスト商店'));
    }
  });
});
