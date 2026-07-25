// 日商簿記2級の論点（level2Topic）定義。
// QuestionTypeSelector の論点フィルタと、problemService の絞り込みで共有する。
// key は各テンプレートの level2Topic と一致させること。

export interface Level2TopicDefinition {
  key: string;
  label: string;
}

export const LEVEL2_COMMERCIAL_TOPICS: Level2TopicDefinition[] = [
  { key: 'securities', label: '有価証券' },
  { key: 'notes', label: '手形・電子記録債権' },
  { key: 'goods', label: '商品売買' },
  { key: 'fixed-assets', label: '固定資産' },
  { key: 'lease', label: 'リース取引' },
  { key: 'intangibles', label: '無形固定資産・のれん' },
  { key: 'provisions', label: '引当金' },
  { key: 'net-assets', label: '純資産・株式' },
  { key: 'tax', label: '税金・税効果会計' },
  { key: 'forex', label: '外貨建取引' },
  { key: 'branch', label: '本支店会計' },
  { key: 'service-closing', label: 'サービス業・決算' },
  { key: 'consolidation', label: '連結会計' },
];

export const LEVEL2_INDUSTRIAL_TOPICS: Level2TopicDefinition[] = [
  { key: 'materials', label: '材料費' },
  { key: 'labor', label: '労務費' },
  { key: 'expenses', label: '経費' },
  { key: 'overhead', label: '製造間接費' },
  { key: 'department', label: '部門別計算' },
  { key: 'process', label: '総合原価計算' },
  { key: 'individual', label: '個別原価計算・完成と販売' },
  { key: 'standard', label: '標準原価計算' },
  { key: 'direct-costing', label: '直接原価計算・CVP分析' },
  { key: 'factory', label: '本社工場会計' },
];

export const getLevel2Topics = (track: 'commercial' | 'industrial'): Level2TopicDefinition[] =>
  track === 'commercial' ? LEVEL2_COMMERCIAL_TOPICS : LEVEL2_INDUSTRIAL_TOPICS;

const ALL_LEVEL2_TOPICS = [...LEVEL2_COMMERCIAL_TOPICS, ...LEVEL2_INDUSTRIAL_TOPICS];

export const getLevel2TopicLabel = (key: string | undefined): string | undefined =>
  key ? ALL_LEVEL2_TOPICS.find(t => t.key === key)?.label : undefined;
