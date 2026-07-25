import { ProblemScopeMetadata, ProblemScopeTag, ProblemTemplate } from '../types';
import { LEVEL2_ACCOUNT_TITLES } from '../data/level2/accounts';

export const DEFAULT_EXAM_SCOPE_TAGS = [
  ProblemScopeTag.STANDARD,
  ProblemScopeTag.ADVANCED,
];

const DEFAULT_EXAM_EXCLUDED_ACCOUNT_TITLES = new Set([
  '売買目的有価証券',
  '有価証券売却益',
  '有価証券売却損',
  '手形売却損',
  '引出金',
  // 2級で新たに登場する勘定は3級の誤答選択肢に一切登場させない。
  ...LEVEL2_ACCOUNT_TITLES,
]);

const SCOPE_LABELS: Record<ProblemScopeTag, string> = {
  [ProblemScopeTag.STANDARD]: '現行3級 標準',
  [ProblemScopeTag.ADVANCED]: '現行3級 発展',
  [ProblemScopeTag.LEGACY]: '旧範囲・旧処理',
  [ProblemScopeTag.OUT_OF_SCOPE]: '現行3級 範囲外',
  [ProblemScopeTag.NEEDS_REVIEW]: '要確認',
  [ProblemScopeTag.LEVEL2_COMMERCIAL]: '簿記2級 商業簿記',
  [ProblemScopeTag.LEVEL2_INDUSTRIAL]: '簿記2級 工業簿記',
};

interface ScopeRule {
  tag: ProblemScopeTag;
  reason: string;
  source?: string;
  keywords?: string[];
  patterns?: RegExp[];
}

const SOURCE_2026_SCOPE =
  '日本商工会議所 2026年度は2022年度適用の出題区分表を適用';
const SOURCE_2019_REVISION =
  '日本商工会議所 2019年度改定: 3級は小規模株式会社前提へ変更';

const OUT_OF_SCOPE_RULES: ScopeRule[] = [
  {
    tag: ProblemScopeTag.OUT_OF_SCOPE,
    keywords: ['売買目的有価証券', '有価証券売却益', '有価証券売却損'],
    reason: '有価証券の売買は2019年度改定で3級から2級以上へ移行した論点です。',
    source: SOURCE_2019_REVISION,
  },
  {
    tag: ProblemScopeTag.OUT_OF_SCOPE,
    keywords: ['裏書譲渡', '手形売却損', '割り引き', '割引料', '割引'],
    reason: '手形の裏書譲渡・割引は現行3級の中心範囲から外れるため、通常演習から除外します。',
    source: SOURCE_2019_REVISION,
  },
  {
    tag: ProblemScopeTag.OUT_OF_SCOPE,
    keywords: ['貸倒懸念債権', '流動比率', '自己資本比率'],
    reason: '財務分析や個別評価寄りの貸倒見積りは、現行3級対策としては発展を超えた論点です。',
    source: SOURCE_2026_SCOPE,
  },
  {
    tag: ProblemScopeTag.OUT_OF_SCOPE,
    keywords: ['自己受託裏書'],
    reason: '手形の特殊な裏書処理であり、現行3級対策からは外します。',
    source: SOURCE_2019_REVISION,
  },
];

const LEGACY_RULES: ScopeRule[] = [
  {
    tag: ProblemScopeTag.LEGACY,
    keywords: ['個人商店', '店主', '自家で消費', '引出金'],
    reason: '2019年度改定後の3級は小規模株式会社を前提とするため、個人商店前提の処理は旧範囲扱いです。',
    source: SOURCE_2019_REVISION,
  },
  {
    tag: ProblemScopeTag.LEGACY,
    keywords: ['二勘定制'],
    reason: '当座借越の一勘定制・二勘定制の使い分けは旧処理寄りです。現行対策では期中は当座預金、期末振替を中心に扱います。',
    source: SOURCE_2019_REVISION,
  },
];

const ADVANCED_RULES: ScopeRule[] = [
  {
    tag: ProblemScopeTag.ADVANCED,
    keywords: ['複合', '①', '②', '③'],
    reason: '複数論点を同時に処理する実戦寄りの問題です。',
    source: SOURCE_2026_SCOPE,
  },
  {
    tag: ProblemScopeTag.ADVANCED,
    keywords: ['営業利益', '経常利益', '税引前利益', '当期純利益', '精算表', '財務諸表', '損益計算書', '貸借対照表'],
    reason: '財務諸表作成・利益計算に近い発展問題です。',
    source: SOURCE_2026_SCOPE,
  },
  {
    tag: ProblemScopeTag.ADVANCED,
    keywords: ['洗替法', '差額補充法', '除却', '改良', '資本的支出', '分割払い'],
    reason: '現行3級の基礎を固めた後に取り組みたい発展論点です。',
    source: SOURCE_2026_SCOPE,
  },
  {
    tag: ProblemScopeTag.ADVANCED,
    keywords: ['法人税、住民税及び事業税', '利益準備金', '資本準備金'],
    reason: '小規模株式会社前提で出題されるが、初学者には難度が高い論点です。',
    source: SOURCE_2019_REVISION,
  },
];

const RULE_GROUPS = [OUT_OF_SCOPE_RULES, LEGACY_RULES, ADVANCED_RULES];

const renderTemplateText = (template: ProblemTemplate): string => {
  try {
    return template.textTemplate(12000, 'テスト商店');
  } catch {
    return '';
  }
};

const getTemplateHaystack = (template: ProblemTemplate, text?: string, explanation?: string): string => {
  const generatedText = text ?? renderTemplateText(template);
  const generatedExplanation = explanation ?? template.explanation;
  const templateSource = template.textTemplate.toString();
  const answerSource = [
    template.generateJournalAnswer?.toString(),
    template.generateSelectionAnswer?.toString(),
    template.generateNumericAnswer?.toString(),
  ].filter(Boolean).join('\n');

  return `${generatedText}\n${generatedExplanation}\n${templateSource}\n${answerSource}`;
};

const ruleMatches = (rule: ScopeRule, haystack: string): boolean => {
  const keywordMatched = rule.keywords?.some(keyword => haystack.includes(keyword)) ?? false;
  const patternMatched = rule.patterns?.some(pattern => pattern.test(haystack)) ?? false;
  return keywordMatched || patternMatched;
};

const toMetadata = (tag: ProblemScopeTag, reason: string, source?: string): ProblemScopeMetadata => ({
  tag,
  label: SCOPE_LABELS[tag],
  reason,
  source,
});

export const resolveProblemScope = (
  template: ProblemTemplate,
  text?: string,
  explanation?: string
): ProblemScopeMetadata => {
  if (template.scope) {
    return template.scope;
  }

  const haystack = getTemplateHaystack(template, text, explanation);

  for (const rules of RULE_GROUPS) {
    const matched = rules.find(rule => ruleMatches(rule, haystack));
    if (matched) {
      return toMetadata(matched.tag, matched.reason, matched.source);
    }
  }

  return toMetadata(
    ProblemScopeTag.STANDARD,
    '現行3級の標準演習として扱う問題です。',
    SOURCE_2026_SCOPE
  );
};

export const isDefaultExamScope = (scope: ProblemScopeMetadata): boolean => (
  DEFAULT_EXAM_SCOPE_TAGS.includes(scope.tag)
);

export const isDefaultExamAccountTitle = (accountTitle: string): boolean => (
  !DEFAULT_EXAM_EXCLUDED_ACCOUNT_TITLES.has(accountTitle)
);
