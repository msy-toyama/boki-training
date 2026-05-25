import { KbLink, ProblemTemplate, ProblemTopic } from '../types';

export interface LearningTopicDefinition {
  topic: ProblemTopic;
  label: string;
  kbLink: KbLink;
  keywords: string[];
  guidance?: {
    what: string;
    why: string;
    trap: string;
  };
}

export const LEARNING_TOPIC_DEFINITIONS: LearningTopicDefinition[] = [
  {
    topic: ProblemTopic.SALES_TAX,
    label: '消費税',
    kbLink: { path: '/kb/adjustments/', label: '消費税と決算整理を復習する' },
    keywords: ['消費税', '仮払消費税', '仮受消費税', '未払消費税', '税抜方式', '税込'],
    guidance: {
      what: '税抜方式では本体価格と消費税を分けて、仕入側は仮払消費税、売上側は仮受消費税で記録します。',
      why: '消費税は最終的に納付額を計算するための一時的な資産・負債であり、売上や仕入そのものとは分ける必要があります。',
      trap: '税込額をそのまま仕入・売上に入れたり、仮払と仮受を左右逆にしたりしないように注意します。'
    }
  },
  {
    topic: ProblemTopic.OVERDRAFT,
    label: '当座借越',
    kbLink: { path: '/kb/mistakes/', label: '当座借越のひっかけを復習する' },
    keywords: ['当座借越', '当座預金残高', '残高不足', '借越'],
    guidance: {
      what: '当座預金が不足した分は、銀行から借りている状態として当座借越で処理します。',
      why: '当座借越は返済義務なので負債です。当座預金という資産のマイナスと混同しないことが重要です。',
      trap: '一勘定制と二勘定制、期中処理と期末振替で科目が変わるため、問題文の指示を先に確認します。'
    }
  },
  {
    topic: ProblemTopic.NOTES,
    label: '手形',
    kbLink: { path: '/kb/shiwake/', label: '手形の仕訳を復習する' },
    keywords: ['受取手形', '支払手形', '約束手形', '裏書', '不渡', '更改', '手形売却損', '割り引き', '割引'],
    guidance: {
      what: '手形取引では、受け取った手形は受取手形、振り出した手形は支払手形として処理します。',
      why: '手形は将来の入金または支払を表す証券なので、現金や売掛金・買掛金とは別の科目で管理します。',
      trap: '裏書譲渡は持っている受取手形を渡す処理、割引は手形を売却する処理です。現金回収と混同しないようにします。'
    }
  },
  {
    topic: ProblemTopic.FIXED_ASSETS,
    label: '固定資産',
    kbLink: { path: '/kb/adjustments/', label: '固定資産と減価償却を復習する' },
    keywords: ['固定資産', '備品', '建物', '車両運搬具', '土地', '減価償却', '減価償却累計額', '固定資産売却益', '固定資産売却損', '固定資産除却損', '帳簿価額'],
    guidance: {
      what: '固定資産の売却・除却では、取得原価と減価償却累計額から帳簿価額を出し、売却額との差額を損益にします。',
      why: '貸借対照表から消える資産の帳簿価額と、実際に受け取る金額の差を損益として認識するためです。',
      trap: '売却価額、手取額、売却費用、帳簿価額を混同しやすいです。まず帳簿価額を計算してから損益を判定します。'
    }
  },
  {
    topic: ProblemTopic.ACCRUALS,
    label: '見越・繰延',
    kbLink: { path: '/kb/adjustments/', label: '見越・繰延を復習する' },
    keywords: ['見越', '繰延', '未払費用', '前払費用', '未収収益', '前受収益', '再振替', '未払利息', '前払', '前受'],
    guidance: {
      what: '見越・繰延は、現金の動きではなく当期に属する収益・費用へそろえる決算整理です。',
      why: '発生主義では、支払った日や受け取った日ではなく、どの会計期間に属するかで損益を計算します。',
      trap: '前払費用と未払費用、未収収益と前受収益を左右逆にしやすいので、当期分か翌期分かを先に区切ります。'
    }
  },
  {
    topic: ProblemTopic.TRIAL_BALANCE,
    label: '試算表・帳簿',
    kbLink: { path: '/kb/trial-balance/', label: '試算表と帳簿を復習する' },
    keywords: ['試算表', '精算表', '帳簿', '転記', '仕訳日計表', '総勘定元帳', '補助簿']
  },
  {
    topic: ProblemTopic.ACCOUNTS,
    label: '勘定科目',
    kbLink: { path: '/kb/accounts/', label: '勘定科目を復習する' },
    keywords: ['資産', '負債', '純資産', '収益', '費用', '勘定科目', '流動資産', '固定資産']
  },
  {
    topic: ProblemTopic.MISTAKES,
    label: 'ひっかけ対策',
    kbLink: { path: '/kb/mistakes/', label: 'よくある間違いを復習する' },
    keywords: ['ひっかけ', '注意', '小切手', '預り金', '月割', '他店振出し', '自己振出し']
  },
  {
    topic: ProblemTopic.CLOSING,
    label: '決算整理',
    kbLink: { path: '/kb/adjustments/', label: '決算整理を復習する' },
    keywords: ['決算整理', '売上原価', '貸倒引当金', 'しーくり', '繰越商品']
  },
  {
    topic: ProblemTopic.JOURNAL_BASICS,
    label: '仕訳基礎',
    kbLink: { path: '/kb/shiwake/', label: '仕訳の基本を復習する' },
    keywords: ['仕訳', '借方', '貸方']
  },
  {
    topic: ProblemTopic.GENERAL,
    label: '簿記3級総合',
    kbLink: { path: '/kb/', label: '簿記3級KBで復習する' },
    keywords: []
  }
];

const PRIORITY_ORDER = [
  ProblemTopic.SALES_TAX,
  ProblemTopic.OVERDRAFT,
  ProblemTopic.NOTES,
  ProblemTopic.FIXED_ASSETS,
  ProblemTopic.ACCRUALS,
  ProblemTopic.TRIAL_BALANCE,
  ProblemTopic.ACCOUNTS,
  ProblemTopic.MISTAKES,
  ProblemTopic.CLOSING,
  ProblemTopic.JOURNAL_BASICS,
  ProblemTopic.GENERAL
];

export const getLearningTopicDefinition = (topic: ProblemTopic): LearningTopicDefinition => (
  LEARNING_TOPIC_DEFINITIONS.find(definition => definition.topic === topic) ??
  LEARNING_TOPIC_DEFINITIONS[LEARNING_TOPIC_DEFINITIONS.length - 1]
);

export const getLearningTopicLabel = (topic?: ProblemTopic): string => (
  getLearningTopicDefinition(topic ?? ProblemTopic.GENERAL).label
);

export const resolveLearningTopic = (template: ProblemTemplate, text: string, explanation: string): LearningTopicDefinition => {
  if (template.topic) {
    return getLearningTopicDefinition(template.topic);
  }

  const haystack = `${text}\n${explanation}`;
  for (const topic of PRIORITY_ORDER) {
    const definition = getLearningTopicDefinition(topic);
    if (definition.keywords.some(keyword => haystack.includes(keyword))) {
      return definition;
    }
  }

  return getLearningTopicDefinition(ProblemTopic.GENERAL);
};

export const createKbLink = (definition: LearningTopicDefinition, template?: ProblemTemplate): KbLink => (
  template?.kbLink ?? definition.kbLink
);

export const enrichExplanation = (explanation: string, definition: LearningTopicDefinition): string => {
  if (!definition.guidance || explanation.includes('復習ポイント：')) {
    return explanation;
  }

  return `${explanation}\n\n復習ポイント：\n・何をするか：${definition.guidance.what}\n・なぜそうするか：${definition.guidance.why}\n・間違いやすい点：${definition.guidance.trap}`;
};