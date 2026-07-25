import { GeneratedProblem, JournalEntryAnswer, QuestionType, StatementAnswer, UserAnswer } from '../types';

const isJournalEntryAnswer = (answer: UserAnswer): answer is JournalEntryAnswer => (
  typeof answer === 'object' &&
  answer !== null &&
  'debits' in answer &&
  'credits' in answer &&
  Array.isArray((answer as JournalEntryAnswer).debits) &&
  Array.isArray((answer as JournalEntryAnswer).credits)
);

const normalizeJournalItems = (items: { account: string; amount: number }[]): string => (
  items.map(item => `${item.account}:${item.amount}`).sort().join('|')
);

const isStatementAnswer = (answer: UserAnswer): answer is StatementAnswer => (
  typeof answer === 'object' &&
  answer !== null &&
  'kind' in answer &&
  (answer as StatementAnswer).kind === 'statement' &&
  typeof (answer as StatementAnswer).values === 'object' &&
  (answer as StatementAnswer).values !== null
);

export const checkAnswer = (userAnswer: UserAnswer, problem: GeneratedProblem): boolean => {
  if (problem.type === QuestionType.SELECTION) {
    return typeof userAnswer === 'string' && userAnswer === problem.correctSelection;
  }

  if (problem.type === QuestionType.NUMERIC) {
    return typeof userAnswer === 'number' && userAnswer === problem.correctNumeric;
  }

  if (problem.type === QuestionType.JOURNAL && problem.correctJournal && isJournalEntryAnswer(userAnswer)) {
    return normalizeJournalItems(userAnswer.debits) === normalizeJournalItems(problem.correctJournal.debits) &&
      normalizeJournalItems(userAnswer.credits) === normalizeJournalItems(problem.correctJournal.credits);
  }

  if (problem.type === QuestionType.STATEMENT && problem.statement && isStatementAnswer(userAnswer)) {
    return problem.statement.blanks.every(blank =>
      userAnswer.values[blank.id] === problem.statement?.correctAnswers[blank.id]
    );
  }

  return false;
};
