import { describe, expect, it } from 'vitest';
import { enrichExplanation, getLearningTopicDefinition, resolveLearningTopic } from '../../services/learningTopicService';
import { ProblemTemplate, ProblemTopic, QuestionType } from '../../types';

const makeTemplate = (explanation: string): ProblemTemplate => ({
  type: QuestionType.JOURNAL,
  textTemplate: () => 'テスト問題',
  generateJournalAnswer: () => ({
    debits: [{ account: '仕入', amount: 1000 }],
    credits: [{ account: '買掛金', amount: 1000 }]
  }),
  explanation
});

describe('learningTopicService', () => {
  it('消費税の論点を推定してKBリンクを返す', () => {
    const template = makeTemplate('税抜方式では仮払消費税と仮受消費税を分けます。');
    const topic = resolveLearningTopic(template, '商品を税抜で仕入れ、消費税10%を含めて掛けとした。', template.explanation);

    expect(topic.topic).toBe(ProblemTopic.SALES_TAX);
    expect(topic.kbLink.path).toBe('/kb/adjustments/');
  });

  it('当座借越の論点をひっかけ対策へ紐づける', () => {
    const template = makeTemplate('当座借越は負債として処理します。');
    const topic = resolveLearningTopic(template, '当座預金残高を超えて小切手を振り出した。', template.explanation);

    expect(topic.topic).toBe(ProblemTopic.OVERDRAFT);
    expect(topic.kbLink.path).toBe('/kb/mistakes/');
  });

  it('固定資産売却の解説に復習ポイントを追加する', () => {
    const definition = getLearningTopicDefinition(ProblemTopic.FIXED_ASSETS);
    const explanation = enrichExplanation('帳簿価額との差額を固定資産売却損益にします。', definition);

    expect(explanation).toContain('復習ポイント：');
    expect(explanation).toContain('帳簿価額');
    expect(enrichExplanation(explanation, definition)).toBe(explanation);
  });
});