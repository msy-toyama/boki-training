import { describe, expect, it } from 'vitest';
import { PROBLEM_TEMPLATES } from '../../constants';
import { generateProblem } from '../../services/problemService';
import { isDefaultExamAccountTitle, isDefaultExamScope, resolveProblemScope } from '../../services/problemScopeService';
import { ProblemScopeTag, QuestionType } from '../../types';

describe('problemScopeService', () => {
  it('すべてのテンプレートに範囲タグを解決できる', () => {
    const scopes = PROBLEM_TEMPLATES.map(template => resolveProblemScope(template));

    expect(scopes).toHaveLength(PROBLEM_TEMPLATES.length);
    expect(scopes.every(scope => scope.tag && scope.label && scope.reason)).toBe(true);
  });

  it('有価証券・個人商店・二勘定制を通常演習から分離する', () => {
    const securitiesTemplate = PROBLEM_TEMPLATES.find(template =>
      template.textTemplate(12000).includes('売買目的有価証券')
    );
    const ownerDrawingTemplate = PROBLEM_TEMPLATES.find(template =>
      template.textTemplate(12000).includes('個人商店')
    );
    const overdraftTemplate = PROBLEM_TEMPLATES.find(template =>
      template.textTemplate(12000).includes('二勘定制')
    );

    expect(securitiesTemplate && resolveProblemScope(securitiesTemplate).tag).toBe(ProblemScopeTag.OUT_OF_SCOPE);
    expect(ownerDrawingTemplate && resolveProblemScope(ownerDrawingTemplate).tag).toBe(ProblemScopeTag.LEGACY);
    expect(overdraftTemplate && resolveProblemScope(overdraftTemplate).tag).toBe(ProblemScopeTag.LEGACY);
  });

  it('デフォルト生成では旧範囲・範囲外を出題しない', async () => {
    for (let index = 0; index < 20; index += 1) {
      const problem = await generateProblem('Practice', [QuestionType.JOURNAL]);
      expect(problem.scope).toBeTruthy();
      expect(isDefaultExamScope(problem.scope!)).toBe(true);
    }
  });

  it('通常演習のダミー勘定科目から範囲外・旧範囲科目を除外する', () => {
    expect(isDefaultExamAccountTitle('現金')).toBe(true);
    expect(isDefaultExamAccountTitle('売買目的有価証券')).toBe(false);
    expect(isDefaultExamAccountTitle('有価証券売却益')).toBe(false);
    expect(isDefaultExamAccountTitle('有価証券売却損')).toBe(false);
    expect(isDefaultExamAccountTitle('手形売却損')).toBe(false);
    expect(isDefaultExamAccountTitle('引出金')).toBe(false);
  });
});
