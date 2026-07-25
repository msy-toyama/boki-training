import { ProblemScopeMetadata, ProblemScopeTag, ProblemTemplate } from '../../types';

// 2級テンプレート共通ヘルパー。すべての金額はランダム生成の amount を基準に、
// 端数は「残差方式」で算出することで、どの金額でも借方合計＝貸方合計を機械的に保証する。
export const yen = (amount: number): string => `${Math.round(amount).toLocaleString()}円`;
export const floor = (amount: number): number => Math.floor(amount);
export const round = (amount: number): number => Math.round(amount);

export const COMMERCIAL_SCOPE: ProblemScopeMetadata = {
  tag: ProblemScopeTag.LEVEL2_COMMERCIAL,
  label: '簿記2級 商業簿記',
  reason: '日商簿記2級 商業簿記の論点です。',
  source: '日本商工会議所 簿記検定2級 出題区分表',
};

export const INDUSTRIAL_SCOPE: ProblemScopeMetadata = {
  tag: ProblemScopeTag.LEVEL2_INDUSTRIAL,
  label: '簿記2級 工業簿記',
  reason: '日商簿記2級 工業簿記の論点です。',
  source: '日本商工会議所 簿記検定2級 出題区分表',
};

type RawTemplate = Omit<ProblemTemplate, 'level' | 'scope' | 'level2Topic'>;

// 論点タグ付きで商業2級テンプレートを生成するファクトリ。
export const makeCommercial = (level2Topic: string) => (template: RawTemplate): ProblemTemplate => ({
  ...template,
  level: 'Level2',
  scope: COMMERCIAL_SCOPE,
  level2Topic,
});

// 論点タグ付きで工業2級テンプレートを生成するファクトリ。
export const makeIndustrial = (level2Topic: string) => (template: RawTemplate): ProblemTemplate => ({
  ...template,
  level: 'Level2',
  scope: INDUSTRIAL_SCOPE,
  level2Topic,
});
