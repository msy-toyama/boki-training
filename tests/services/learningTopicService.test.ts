import { describe, expect, it } from 'vitest';
import { createKbLink, enrichExplanation, getLearningTopicDefinition, resolveLearningTopic } from '../../services/learningTopicService';
import { LEVEL2_COMMERCIAL_TOPICS, LEVEL2_INDUSTRIAL_TOPICS } from '../../services/level2TopicService';
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

  describe('2級テンプレートのKBリンク', () => {
    const definition = getLearningTopicDefinition(ProblemTopic.GENERAL);

    it('商業簿記の論点は対応する2級KBページへリンクする', () => {
      const template: ProblemTemplate = {
        ...makeTemplate('有価証券の売却損益を計上します。'),
        level: 'Level2',
        level2Topic: 'securities',
      };
      const link = createKbLink(definition, template);
      expect(link.path).toBe('/kb/level2/commercial/securities/');
      expect(link.label).toContain('有価証券');
    });

    it('工業簿記の論点は工業簿記の2級KBページへリンクする', () => {
      const template: ProblemTemplate = {
        ...makeTemplate('材料費の消費を計上します。'),
        level: 'Level2',
        level2Topic: 'materials',
      };
      const link = createKbLink(definition, template);
      expect(link.path).toBe('/kb/level2/industrial/materials/');
      expect(link.label).toContain('材料費');
    });

    it('全ての2級論点キーが存在するKBパスへ解決される', () => {
      const cases: Array<[string, 'commercial' | 'industrial']> = [
        ...LEVEL2_COMMERCIAL_TOPICS.map(t => [t.key, 'commercial'] as [string, 'commercial']),
        ...LEVEL2_INDUSTRIAL_TOPICS.map(t => [t.key, 'industrial'] as [string, 'industrial']),
      ];
      for (const [key, track] of cases) {
        const template: ProblemTemplate = {
          ...makeTemplate('テスト解説'),
          level: 'Level2',
          level2Topic: key,
        };
        const link = createKbLink(definition, template);
        expect(link.path).toBe(`/kb/level2/${track}/${key}/`);
      }
    });

    it('template.kbLink が優先される', () => {
      const template: ProblemTemplate = {
        ...makeTemplate('テスト'),
        level: 'Level2',
        level2Topic: 'securities',
        kbLink: { path: '/kb/custom/', label: 'カスタム' },
      };
      const link = createKbLink(definition, template);
      expect(link.path).toBe('/kb/custom/');
    });

    it('level2Topic が無い3級テンプレートは論点定義のKBリンクを使う', () => {
      const template = makeTemplate('3級のテスト');
      const link = createKbLink(definition, template);
      expect(link.path).toBe(definition.kbLink.path);
    });
  });
});