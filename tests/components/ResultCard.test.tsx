import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ResultCard from '../../components/ResultCard';
import { BattleResult, GeneratedProblem, QuestionType } from '../../types';

const problem: GeneratedProblem = {
  id: 'result-card-test',
  type: QuestionType.NUMERIC,
  text: '計算結果を答えなさい。',
  correctNumeric: 1000,
  amountOptions: [1000, 2000, 3000],
  explanation: 'テスト解説です。',
  difficulty: 'Practice'
};

const baseResult: BattleResult = {
  damageDealt: 0,
  damageTaken: 10,
  isCorrect: false,
  isCritical: false,
  timeBonus: 0,
  monsterDefeated: false,
  playerDefeated: false
};

describe('ResultCard', () => {
  it('時間切れなどの敗北は降参ではなくYOU DIEDとして表示する', () => {
    render(
      <ResultCard
        problem={problem}
        userAnswer={null}
        result={{ ...baseResult, playerDefeated: true }}
        onNext={vi.fn()}
        isGameOver
      />
    );

    expect(screen.getByText('YOU DIED')).toBeInTheDocument();
    expect(screen.queryByText('RETIRED')).not.toBeInTheDocument();
  });

  it('明示的な降参はRETIREDとして表示する', () => {
    render(
      <ResultCard
        problem={problem}
        userAnswer={null}
        result={{ ...baseResult, playerDefeated: true, surrendered: true }}
        onNext={vi.fn()}
        isGameOver
      />
    );

    expect(screen.getByText('RETIRED')).toBeInTheDocument();
  });

  it('決算総合問題のユーザー回答と正解を表示する', () => {
    const statementProblem: GeneratedProblem = {
      ...problem,
      type: QuestionType.STATEMENT,
      statement: {
        mode: 'financial_statements',
        title: '財務諸表',
        description: 'テスト',
        materials: [{ label: '売上高', value: 90000 }],
        requirements: ['作成する'],
        blanks: [{ id: 'net-income', section: '損益計算書', label: '当期純利益' }],
        correctAnswers: { 'net-income': 27000 }
      }
    };

    render(
      <ResultCard
        problem={statementProblem}
        userAnswer={{ kind: 'statement', values: { 'net-income': 26000 } }}
        result={{ ...baseResult, damageTaken: 15 }}
        onNext={vi.fn()}
        isGameOver={false}
      />
    );

    expect(screen.getAllByText('当期純利益')).toHaveLength(2);
    expect(screen.getByText('¥26,000')).toBeInTheDocument();
    expect(screen.getByText('¥27,000')).toBeInTheDocument();
  });
});
