
import { ProblemTemplate, QuestionType } from './types';

// 勘定科目とカテゴリー定義 (第2問理論対策用)
export const ACCOUNT_DEFINITIONS: { name: string; category: 'Asset' | 'Liability' | 'NetAsset' | 'Revenue' | 'Expense' }[] = [
  // 資産 (Assets)
  { name: '現金', category: 'Asset' }, { name: '小口現金', category: 'Asset' },
  { name: '普通預金', category: 'Asset' }, { name: '当座預金', category: 'Asset' }, { name: '定期預金', category: 'Asset' },
  { name: '受取手形', category: 'Asset' }, { name: '売掛金', category: 'Asset' },
  { name: '電子記録債権', category: 'Asset' }, { name: 'クレジット売掛金', category: 'Asset' },
  { name: '貸付金', category: 'Asset' }, { name: '手形貸付金', category: 'Asset' },
  { name: '仮払金', category: 'Asset' }, { name: '立替金', category: 'Asset' }, { name: '前払金', category: 'Asset' },
  { name: '未収金', category: 'Asset' }, { name: '差入保証金', category: 'Asset' },
  { name: '受取商品券', category: 'Asset' }, { name: '不渡手形', category: 'Asset' },
  { name: '売買目的有価証券', category: 'Asset' },
  { name: '商品', category: 'Asset' }, { name: '貯蔵品', category: 'Asset' }, { name: '消耗品', category: 'Asset' },
  { name: '建物', category: 'Asset' }, { name: '備品', category: 'Asset' }, { name: '車両運搬具', category: 'Asset' }, { name: '土地', category: 'Asset' },
  { name: '前払費用', category: 'Asset' }, { name: '未収収益', category: 'Asset' }, { name: '仮払法人税等', category: 'Asset' }, { name: '仮払消費税', category: 'Asset' },

  // 負債 (Liabilities)
  { name: '買掛金', category: 'Liability' }, { name: '支払手形', category: 'Liability' },
  { name: '電子記録債務', category: 'Liability' }, { name: '未払金', category: 'Liability' },
  { name: '借入金', category: 'Liability' }, { name: '手形借入金', category: 'Liability' },
  { name: '当座借越', category: 'Liability' }, { name: '前受金', category: 'Liability' },
  { name: '預り金', category: 'Liability' }, { name: '仮受金', category: 'Liability' },
  { name: '所得税預り金', category: 'Liability' }, { name: '社会保険料預り金', category: 'Liability' },
  { name: '未払法人税等', category: 'Liability' }, { name: '未払配当金', category: 'Liability' }, { name: '未払消費税', category: 'Liability' },
  { name: '商品券', category: 'Liability' },
  { name: '未払費用', category: 'Liability' }, { name: '前受収益', category: 'Liability' }, { name: '仮受消費税', category: 'Liability' },

  // 純資産 (Net Assets)
  { name: '資本金', category: 'NetAsset' }, { name: '資本準備金', category: 'NetAsset' }, { name: '利益準備金', category: 'NetAsset' }, { name: '繰越利益剰余金', category: 'NetAsset' },

  // 収益 (Revenues)
  { name: '売上', category: 'Revenue' }, { name: '受取利息', category: 'Revenue' }, { name: '受取家賃', category: 'Revenue' },
  { name: '受取配当金', category: 'Revenue' }, { name: '受取手数料', category: 'Revenue' }, { name: '雑収入', category: 'Revenue' },
  { name: '償却債権取立益', category: 'Revenue' }, { name: '固定資産売却益', category: 'Revenue' }, { name: '貸倒引当金戻入', category: 'Revenue' },
  { name: '有価証券売却益', category: 'Revenue' },

  // 費用 (Expenses)
  { name: '仕入', category: 'Expense' }, { name: '給料', category: 'Expense' }, { name: '法定福利費', category: 'Expense' },
  { name: '旅費交通費', category: 'Expense' }, { name: '通信費', category: 'Expense' }, { name: '水道光熱費', category: 'Expense' },
  { name: '広告宣伝費', category: 'Expense' }, { name: '消耗品費', category: 'Expense' }, { name: '支払家賃', category: 'Expense' },
  { name: '支払地代', category: 'Expense' }, { name: '支払利息', category: 'Expense' }, { name: '支払手数料', category: 'Expense' },
  { name: '租税公課', category: 'Expense' }, { name: '貸倒損失', category: 'Expense' }, { name: '雑費', category: 'Expense' },
  { name: '雑損', category: 'Expense' }, { name: '現金過不足', category: 'Expense' }, 
  { name: '減価償却費', category: 'Expense' }, { name: '貸倒引当金繰入', category: 'Expense' },
  { name: '固定資産売却損', category: 'Expense' }, { name: '固定資産除却損', category: 'Expense' },
  { name: '有価証券売却損', category: 'Expense' },
  { name: '法人税、住民税及び事業税', category: 'Expense' },

  // 評価勘定 (Evaluation - Treated as special assets/liabilities contextually but here simplified)
  // ※ 貸倒引当金と減価償却累計額は資産のマイナスだが、選択問題では文脈による。
  // アプリの仕様上、仕訳入力のためにリスト化
];

// 単純な文字列リスト（セレクトボックス用）
export const ACCOUNT_TITLES = [
  ...ACCOUNT_DEFINITIONS.map(d => d.name),
  '貸倒引当金', '減価償却累計額', '損益'
];

export const MONSTERS_LIST = [
  { name: 'スライム', emoji: '💧', hp: 30 },
  { name: 'バット', emoji: '🦇', hp: 40 },
  { name: 'スケルトン', emoji: '💀', hp: 50 },
  { name: 'ゴースト', emoji: '👻', hp: 60 },
  { name: 'オーク', emoji: '👹', hp: 80 },
  { name: 'ミミック', emoji: '📦', hp: 90 },
  { name: 'ゴーレム', emoji: '🗿', hp: 100 },
  { name: 'ケルベロス', emoji: '🐺', hp: 120 },
  { name: 'サイクロプス', emoji: '👁️', hp: 150 },
  { name: 'ドラゴン', emoji: '🐉', hp: 200 },
  { name: 'キングデーモン', emoji: '👿', hp: 250 },
  { name: '魔王', emoji: '👑', hp: 300 },
];

export const MAX_QUESTIONS = 100;

export const GAME_SETTINGS = {
  Easy: {
    playerHp: 300,
    startInterval: 30,
    minInterval: 10,
  },
  Hard: {
    playerHp: 100,
    startInterval: 20,
    minInterval: 5,
  },
  Practice: {
    playerHp: 999999, // 実質無限
    startInterval: 999999, // タイマー進行しない
    minInterval: 999999,
  }
};

// ==========================================
// 問題テンプレート群 (Problem Templates)
// ==========================================

export const PROBLEM_TEMPLATES: ProblemTemplate[] = [
  // ##########################################
  // 第1問対策：仕訳問題 (Journal Entries)
  // ##########################################

  // --- 1. 現金・預金 (Cash & Deposits) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a, t) => `${t}より売掛金の回収として、同店振出しの小切手${a.toLocaleString()}円を受け取った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '現金', amount: a }],
      credits: [{ account: '売掛金', amount: a }]
    }),
    explanation: "他店振出しの小切手は、通貨代用証券として「現金」勘定で処理します。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `当座預金口座から${a.toLocaleString()}円を引き出し、小口現金係に手渡した。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '小口現金', amount: a }],
      credits: [{ account: '当座預金', amount: a }]
    }),
    explanation: "小口現金の資金を補給する取引です。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a, t) => `${t}に対する買掛金${a.toLocaleString()}円を支払うため、当座預金口座から振り込んだ。なお、振込手数料${(660).toLocaleString()}円は当方負担とし、普通預金から支払われた。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '買掛金', amount: a }, { account: '支払手数料', amount: 660 }],
      credits: [{ account: '当座預金', amount: a }, { account: '普通預金', amount: 660 }]
    }),
    explanation: "振込手数料は「支払手数料」として処理します。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a, t) => `${t}へ商品${a.toLocaleString()}円を売り上げ、代金は掛けとした。なお、発送費${(a*0.05).toLocaleString()}円を現金で立替払いした。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '売掛金', amount: a }, { account: '立替金', amount: a * 0.05 }],
      credits: [{ account: '売上', amount: a }, { account: '現金', amount: a * 0.05 }]
    }),
    explanation: "先方負担の発送費を立て替えた場合、「立替金」または「売掛金」に含めて処理します（ここでは立替金勘定を使用）。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算において、現金の実際有高が帳簿残高より${Math.floor(a * 0.01).toLocaleString()}円不足していた。原因は不明である。（期中に現金過不足勘定は使用していない）`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '雑損', amount: Math.floor(a * 0.01) }],
      credits: [{ account: '現金', amount: Math.floor(a * 0.01) }]
    }),
    explanation: "決算において現金不足の原因が不明な場合、「雑損」（または雑費）として処理します。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a, t) => `当座預金の残高は${(a-50000).toLocaleString()}円であったが、${t}からの買掛金の支払いとして小切手${a.toLocaleString()}円を振り出した。なお、銀行とは当座借越契約（限度額あり）を結んでいる。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '買掛金', amount: a }],
      credits: [{ account: '当座預金', amount: a }]
    }),
    explanation: "「当座借越」勘定を用いない場合（一勘定制）や、期中は当座預金勘定をマイナスにする方法があります。3級では貸方を当座預金として処理するのが一般的です。"
  },

  // --- 2. 商品売買 (Merchandise: Returns, Advances, etc.) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a, t) => `${t}より仕入れた商品の一部に傷があったため返品した。代金${a.toLocaleString()}円は買掛金から減額することとした。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '買掛金', amount: a }],
      credits: [{ account: '仕入', amount: a }]
    }),
    explanation: "仕入戻し（返品）の処理です。仕入勘定の貸方に記入して、仕入原価を減額します。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a, t) => `${t}に対し商品${a.toLocaleString()}円を注文し、手付金として${(a*0.1).toLocaleString()}円を現金で支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '前払金', amount: a * 0.1 }],
      credits: [{ account: '現金', amount: a * 0.1 }]
    }),
    explanation: "商品を注文し代金の一部を先に支払った場合は「前払金」勘定で処理します。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a, t) => `以前${t}に注文していた商品${a.toLocaleString()}円を受け取った。代金は、先に支払った手付金${(a*0.1).toLocaleString()}円を充当し、残額は掛けとした。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '仕入', amount: a }],
      credits: [{ account: '前払金', amount: a * 0.1 }, { account: '買掛金', amount: a * 0.9 }]
    }),
    explanation: "商品の引き渡しを受けた際、前払金を振り替え、残額を買掛金とします。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a, t) => `${t}より商品券${(a * 0.1).toLocaleString()}円を受け取り、商品${(a * 0.1).toLocaleString()}円を売り上げた。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '受取商品券', amount: a * 0.1 }],
      credits: [{ account: '売上', amount: a * 0.1 }]
    }),
    explanation: "他店発行の商品券を受け取った場合は「受取商品券」（資産）で処理しますが、3級科目リストの制約上「他店商品券」や「現金」等の指示に従います。ここでは基本通り。"
  },
  // クレジット売掛金、消費税は既存分+以下で補強

  // --- 3. 手形・電子記録債権 (Notes & Claims) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a, t) => `${t}振出しの約束手形${a.toLocaleString()}円が満期となり、当座預金口座に入金された。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '当座預金', amount: a }],
      credits: [{ account: '受取手形', amount: a }]
    }),
    explanation: "手形代金の回収処理です。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a, t) => `${t}に対する買掛金の支払いとして、かねて売掛金の回収として受け取っていた${t}振出しの約束手形${a.toLocaleString()}円を裏書譲渡した。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '買掛金', amount: a }],
      credits: [{ account: '受取手形', amount: a }]
    }),
    explanation: "手形の裏書譲渡。自己保有の受取手形を渡すため、貸方は受取手形です。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a, t) => `所有する${t}振出しの約束手形${a.toLocaleString()}円が不渡りとなった。なお、償還請求費用${Math.floor(a * 0.001).toLocaleString()}円を現金で支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '不渡手形', amount: a + Math.floor(a * 0.001) }],
      credits: [{ account: '受取手形', amount: a }, { account: '現金', amount: Math.floor(a * 0.001) }]
    }),
    explanation: "手形が不渡りとなった場合、額面金額＋諸費用を「不渡手形」勘定に振り替えます。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a, t) => `${t}に対する買掛金の支払期日を延長してもらうため、かねて振り出していた約束手形${a.toLocaleString()}円を書き換えることになった。新たな手形${(a+500).toLocaleString()}円（利息を含む）を振り出して旧手形と交換した。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '支払手形', amount: a }, { account: '支払利息', amount: 500 }],
      credits: [{ account: '支払手形', amount: a + 500 }]
    }),
    explanation: "手形の更改（書き換え）です。旧手形を消滅させ、利息を加えた新手形を計上します。"
  },

  // --- 4. 有価証券・固定資産 (Securities & Fixed Assets) ---
  // 固定資産の購入等は既存にあり。除却と売却損益を追加。
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `使用していた備品（取得原価${a.toLocaleString()}円、減価償却累計額${(a*0.9).toLocaleString()}円、間接法）が使用不能となったため廃棄した。処分価額はゼロである。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '減価償却累計額', amount: a * 0.9 }, { account: '固定資産除却損', amount: a * 0.1 }],
      credits: [{ account: '備品', amount: a }]
    }),
    explanation: "固定資産を除却（廃棄）した場合、帳簿価額（原価-累計額）を「固定資産除却損」として計上します。"
  },

  // --- 5. 税金・給与 (Taxes & Payroll) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `収入印紙${Math.floor(a * 0.02).toLocaleString()}円と郵便切手${Math.floor(a * 0.01).toLocaleString()}円を現金で購入し、ただちに使用した。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '租税公課', amount: Math.floor(a * 0.02) }, { account: '通信費', amount: Math.floor(a * 0.01) }],
      credits: [{ account: '現金', amount: Math.floor(a * 0.03) }]
    }),
    explanation: "収入印紙は「租税公課」、切手は「通信費」で処理します。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `固定資産税の納付書を受け取り、第1期分${a.toLocaleString()}円を現金で納付した。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '租税公課', amount: a }],
      credits: [{ account: '現金', amount: a }]
    }),
    explanation: "固定資産税、自動車税などは「租税公課」で処理します。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `商品${a.toLocaleString()}円（税抜）を仕入れ、消費税10%を含めた代金を掛けとした。（税抜方式）`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '仕入', amount: a }, { account: '仮払消費税', amount: a * 0.1 }],
      credits: [{ account: '買掛金', amount: a * 1.1 }]
    }),
    explanation: "税抜方式では、仕入時に支払った消費税を「仮払消費税」（資産）として処理します。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `商品${a.toLocaleString()}円（税抜）を売上げ、消費税10%を含めた代金を掛けとした。（税抜方式）`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '売掛金', amount: a * 1.1 }],
      credits: [{ account: '売上', amount: a }, { account: '仮受消費税', amount: a * 0.1 }]
    }),
    explanation: "税抜方式では、売上時に受け取った消費税を「仮受消費税」（負債）として処理します。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算につき、消費税の納付額を確定した。当期の仮受消費税は${(a*1.1).toLocaleString()}円、仮払消費税は${a.toLocaleString()}円であった。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '仮受消費税', amount: a * 1.1 }],
      credits: [{ account: '仮払消費税', amount: a }, { account: '未払消費税', amount: a * 0.1 }]
    }),
    explanation: "仮受消費税と仮払消費税を相殺し、差額（納付額）を「未払消費税」として計上します。"
  },

  // --- 6. 決算整理 (Closing Entries) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `期首に再振替仕訳を行う。前期末に計上した借入金の未払利息${a.toLocaleString()}円を振り替える。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '未払費用', amount: a }],
      credits: [{ account: '支払利息', amount: a }]
    }),
    explanation: "再振替仕訳です。前期末の逆仕訳を行い、当期の費用処理を正常化します。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算につき、売掛金の期末残高${a.toLocaleString()}円に対して2%の貸倒引当金を設定する。なお、貸倒引当金の残高は${(a*0.01).toLocaleString()}円ある。（差額補充法）`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '貸倒引当金繰入', amount: Math.floor(a * 0.01) }],
      credits: [{ account: '貸倒引当金', amount: Math.floor(a * 0.01) }]
    }),
    explanation: "目標額(2%) - 前期残高(1%) = 繰入額(1%)。差額を繰り入れます。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `株式会社の設立にあたり、株式100株を1株${(a * 10).toLocaleString()}円で発行し、全額の払込みを受け、当座預金とした。なお、資本金は会社法で認められる最低額とする。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '当座預金', amount: a * 1000 }],
      credits: [{ account: '資本金', amount: a * 500 }, { account: '資本準備金', amount: a * 500 }]
    }),
    explanation: "払込金額の2分の1を超えない額を資本金に計上せず、資本準備金とすることができます。（※3級範囲では全額資本金が基本ですが、準備金計上の知識も問われることがあります。ただし3級の基本は全額資本金のため、本問は発展的です）"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `株主総会において、繰越利益剰余金を財源として配当金${a.toLocaleString()}円を支払い、利益準備金${(a*0.1).toLocaleString()}円を積み立てることを決議した。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '繰越利益剰余金', amount: a * 1.1 }],
      credits: [{ account: '未払配当金', amount: a }, { account: '利益準備金', amount: a * 0.1 }]
    }),
    explanation: "純資産の減少（借方：繰越利益剰余金）と、未払配当金（負債）・利益準備金（純資産）の増加を記録します。"
  },

  // ##########################################
  // 第2問対策：理論・選択問題 (Theory & Selection)
  // ##########################################
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "次の勘定科目のうち、「資産」に分類されるものはどれか。",
    generateSelectionAnswer: () => {
      // ロジックはproblemService側で補完されるが、静的定義として例示
      return { correct: "前払金", options: ["前払金", "前受金", "借入金", "受取利息"] };
    },
    explanation: "前払金は、商品を受け取る権利を表すため「資産」です。前受金・借入金は負債、受取利息は収益です。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "次の勘定科目のうち、「負債」に分類されるものはどれか。",
    generateSelectionAnswer: () => ({ correct: "未払法人税等", options: ["未払法人税等", "仮払法人税等", "租税公課", "未収金"] }),
    explanation: "未払〜は後で支払う義務のため「負債」です。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "商品の仕入取引（掛け仕入）を記録するために、必ず記入しなければならない補助簿はどれか。",
    generateSelectionAnswer: () => ({ correct: "仕入帳・買掛金元帳", options: ["仕入帳・買掛金元帳", "売上帳・売掛金元帳", "現金出納帳", "受取手形記入帳"] }),
    explanation: "掛け仕入に関係するのは「仕入帳」（仕入の明細）と「買掛金元帳」（仕入先ごとの債務管理）です。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "3伝票制において、「現金の入出金を伴わない取引」を起票する伝票はどれか。",
    generateSelectionAnswer: () => ({ correct: "振替伝票", options: ["振替伝票", "入金伝票", "出金伝票", "売上伝票"] }),
    explanation: "入金伝票は現金受入、出金伝票は現金支払、それ以外は全て振替伝票を使用します。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "決算において、収益・費用の各勘定残高を振り替えるために設ける勘定はどれか。",
    generateSelectionAnswer: () => ({ correct: "損益", options: ["損益", "残高", "繰越利益剰余金", "資本金"] }),
    explanation: "収益と費用は「損益」勘定に集められ、当期純損益が計算されます。"
  },

  // ##########################################
  // 追加：第2問強化理論問題 (Phase 4)
  // ##########################################
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "次の勘定科目のうち、「収益」に分類されるものはどれか。",
    generateSelectionAnswer: () => ({ correct: "受取配当金", options: ["受取配当金", "未収金", "前受金", "貸付金"] }),
    explanation: "受取配当金は収益です。未収金・貸付金は資産、前受金は負債です。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "次の勘定科目のうち、「費用」に分類されるものはどれか。",
    generateSelectionAnswer: () => ({ correct: "支払利息", options: ["支払利息", "受取利息", "未払金", "借入金"] }),
    explanation: "支払利息は費用です。受取利息は収益、未払金・借入金は負債です。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "次の勘定科目のうち、貸借対照表の「流動資産」に分類されるものはどれか。",
    generateSelectionAnswer: () => ({ correct: "売掛金", options: ["売掛金", "建物", "土地", "備品"] }),
    explanation: "売掛金は1年以内に現金化される流動資産です。建物・土地・備品は固定資産です。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "次の勘定科目のうち、貸借対照表の「固定資産」に分類されるものはどれか。",
    generateSelectionAnswer: () => ({ correct: "車両運搬具", options: ["車両運搬具", "商品", "現金", "売掛金"] }),
    explanation: "車両運搬具は長期間使用する固定資産です。商品・現金・売掛金は流動資産です。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "次の帳簿のうち、「主要簿」に該当するものはどれか。",
    generateSelectionAnswer: () => ({ correct: "仕訳帳・総勘定元帳", options: ["仕訳帳・総勘定元帳", "現金出納帳・売掛金元帳", "仕入帳・売上帳", "受取手形記入帳"] }),
    explanation: "主要簿は「仕訳帳」と「総勘定元帳」の2つです。それ以外は全て補助簿です。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "次の帳簿のうち、「補助記入帳」に該当するものはどれか。",
    generateSelectionAnswer: () => ({ correct: "売上帳", options: ["売上帳", "仕訳帳", "総勘定元帳", "損益勘定"] }),
    explanation: "補助記入帳には、現金出納帳、仕入帳、売上帳、受取手形記入帳、支払手形記入帳などがあります。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "商品を掛けで販売したとき、記入すべき補助簿の組み合わせとして正しいものはどれか。",
    generateSelectionAnswer: () => ({ correct: "売上帳・売掛金元帳", options: ["売上帳・売掛金元帳", "仕入帳・買掛金元帳", "現金出納帳", "当座預金出納帳"] }),
    explanation: "掛け販売は「売上帳」（売上の明細）と「売掛金元帳」（得意先別の債権管理）に記入します。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "次の証ひょうのうち、入金を証明する証ひょうはどれか。",
    generateSelectionAnswer: () => ({ correct: "領収証", options: ["領収証", "請求書", "納品書", "注文書"] }),
    explanation: "領収証は代金の受取を証明する証ひょうです。請求書・納品書・注文書は入金証明ではありません。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "5伝票制における伝票の組み合わせとして正しいものはどれか。",
    generateSelectionAnswer: () => ({ correct: "入金・出金・振替・仕入・売上", options: ["入金・出金・振替・仕入・売上", "入金・出金・振替のみ", "入金・出金・当座預金・仕入・売上", "現金・預金・振替・仕入・売上"] }),
    explanation: "5伝票制は、入金伝票、出金伝票、振替伝票、仕入伝票、売上伝票の5種類です。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "仕訳日計表の役割として正しいものはどれか。",
    generateSelectionAnswer: () => ({ correct: "伝票を日付順に集計し総勘定元帳への転記を容易にする", options: ["伝票を日付順に集計し総勘定元帳への転記を容易にする", "取引を発生順に記録する", "各勘定科目の残高を計算する", "決算整理仕訳を行う"] }),
    explanation: "仕訳日計表は、1日分の伝票を集計し、総勘定元帳への転記作業を効率化するための帳簿です。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "当座預金出納帳の借方残高が示すものはどれか。",
    generateSelectionAnswer: () => ({ correct: "当座預金の残高（資産）", options: ["当座預金の残高（資産）", "当座借越の残高（負債）", "現金の残高", "普通預金の残高"] }),
    explanation: "当座預金出納帳の借方残高は、当座預金勘定（資産）の残高を示します。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "小口現金出納帳を作成する際の記帳方法として正しいものはどれか。",
    generateSelectionAnswer: () => ({ correct: "定額資金前渡制（インプレスト・システム）", options: ["定額資金前渡制（インプレスト・システム）", "随時資金前渡制", "小切手振出制", "現金過不足制"] }),
    explanation: "小口現金出納帳は通常、定額資金前渡制（インプレスト・システム）で管理します。一定額を前渡しし、使用分を補給する方法です。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "次の勘定記入のうち、「再振替仕訳」が必要となるものはどれか。",
    generateSelectionAnswer: () => ({ correct: "費用の見越し・収益の繰延べ", options: ["費用の見越し・収益の繰延べ", "減価償却", "貸倒引当金の設定", "消耗品の期末整理"] }),
    explanation: "費用の見越し・収益の繰延べは、翌期首に再振替仕訳（逆仕訳）が必要です。減価償却等は再振替不要です。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "試算表の種類として正しいものはどれか。",
    generateSelectionAnswer: () => ({ correct: "合計試算表・残高試算表・合計残高試算表", options: ["合計試算表・残高試算表・合計残高試算表", "仕訳試算表・総勘定試算表", "月次試算表・年次試算表", "貸借試算表・損益試算表"] }),
    explanation: "試算表には、合計試算表、残高試算表、合計残高試算表の3種類があります。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "精算表の記入欄の順序として正しいものはどれか。",
    generateSelectionAnswer: () => ({ correct: "試算表→整理記入→損益計算書→貸借対照表", options: ["試算表→整理記入→損益計算書→貸借対照表", "試算表→損益計算書→整理記入→貸借対照表", "整理記入→試算表→貸借対照表→損益計算書", "損益計算書→貸借対照表→試算表→整理記入"] }),
    explanation: "精算表は、左から「試算表」→「整理記入」→「損益計算書」→「貸借対照表」の順に記入します。"
  },

  // ##########################################
  // 第3問対策：計算・集計問題 (Calculations & Financials)
  // ##########################################
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `期首の建物取得原価は${(a * 30).toLocaleString()}円、減価償却累計額は${(a * 10).toLocaleString()}円である。耐用年数30年、残存価額ゼロ、定額法により減価償却を行う場合、当期の減価償却費はいくらか。`,
    generateNumericAnswer: (a) => a, // a * 30 ÷ 30年 = a
    explanation: "取得原価 ÷ 耐用年数。累計額は計算に関係ありません（定額法の場合）。"
  },
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `決算整理前の消耗品勘定の残高は${(a).toLocaleString()}円である。期末の消耗品棚卸高が${(a*0.3).toLocaleString()}円であった場合、P/Lに計上される消耗品費はいくらか。なお、購入時は全額資産（消耗品）処理している。`,
    generateNumericAnswer: (a) => a * 0.7,
    explanation: "資産計上法の場合、使用分（期首＋当期購入－期末残）を費用に振り替えます。ここでの「勘定残高」は購入額全額を指すため、購入額 - 期末残高 = 使用額（費用）となります。"
  },
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `次のデータに基づき、売上総利益を計算せよ。売上高：${(a).toLocaleString()}、期首商品：${(a*0.1).toLocaleString()}、当期仕入：${(a*0.7).toLocaleString()}、期末商品：${(a*0.15).toLocaleString()}。`,
    generateNumericAnswer: (a) => Math.floor(a - ( (a*0.1) + (a*0.7) - (a*0.15) )),
    explanation: "売上総利益 ＝ 売上高 － 売上原価。売上原価 ＝ 期首 ＋ 仕入 － 期末。よって、売上 － (期首＋仕入－期末)。"
  },
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `決算整理前試算表の「前受地代」残高は${(a * 0.06).toLocaleString()}円である（全額が当期首に受け取った1年分）。決算日が3月末で、地代の契約期間が4月1日から翌年3月31日までの場合、決算整理仕訳後の「受取地代」はいくらか。`,
    generateNumericAnswer: (a) => a * 0.06,
    explanation: "期首に1年分を受け取り「前受地代」（負債）としていた場合、決算ですべて経過しているため、全額を「受取地代」（収益）に振り替えます。"
  },
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `貸倒引当金勘定の決算整理前残高は${(a).toLocaleString()}円である。期末売掛金残高${(a*100).toLocaleString()}円に対し3%の貸倒引当金を設定する場合（差額補充法）、貸倒引当金繰入の金額はいくらか。`,
    generateNumericAnswer: (a) => (a*100 * 0.03) - a,
    explanation: "設定目標額（売掛金×3%）と前残高との差額を計算します。"
  },

  // ##########################################
  // 追加：不足していた重要論点 (Phase 2)
  // ##########################################

  // --- 7. 有価証券取引 (Securities Transactions) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `A社株式（売買目的有価証券）を1株${(a/100).toLocaleString()}円で100株購入し、代金は証券会社への手数料${(a*0.02).toLocaleString()}円とともに普通預金から支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '売買目的有価証券', amount: a + (a * 0.02) }],
      credits: [{ account: '普通預金', amount: a + (a * 0.02) }]
    }),
    explanation: "有価証券の取得原価には、購入代価に付随費用（手数料等）を加算します。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `保有するB社株式（売買目的有価証券、取得原価${a.toLocaleString()}円）を${(a*1.2).toLocaleString()}円で売却し、代金は普通預金に振り込まれた。なお、売却手数料${(a*0.01).toLocaleString()}円が差し引かれている。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '普通預金', amount: a * 1.2 - a * 0.01 }, { account: '支払手数料', amount: a * 0.01 }],
      credits: [{ account: '売買目的有価証券', amount: a }, { account: '有価証券売却益', amount: a * 0.2 }]
    }),
    explanation: "売却価額と取得原価の差額が売却損益となります。売却手数料は「支払手数料」で処理します。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `保有するC社株式（売買目的有価証券、取得原価${a.toLocaleString()}円）を${(a*0.85).toLocaleString()}円で売却し、代金は普通預金に振り込まれた。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '普通預金', amount: a * 0.85 }, { account: '有価証券売却損', amount: a * 0.15 }],
      credits: [{ account: '売買目的有価証券', amount: a }]
    }),
    explanation: "売却価額が取得原価を下回った場合、その差額を「有価証券売却損」として計上します。"
  },

  // --- 8. 定期預金の利息 (Time Deposit Interest) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `定期預金${a.toLocaleString()}円を預け入れた。預入期間は1年、年利率2%である。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '定期預金', amount: a }],
      credits: [{ account: '普通預金', amount: a }]
    }),
    explanation: "定期預金への預け入れ時は、預金科目の振替のみ行います（利息は決算時または満期時に計上）。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算日（3月31日）において、定期預金${a.toLocaleString()}円（預入日：1月1日、預入期間1年、年利率2%）の利息の未収分を計上する。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '未収収益', amount: Math.floor(a * 0.02 * 3 / 12) }],
      credits: [{ account: '受取利息', amount: Math.floor(a * 0.02 * 3 / 12) }]
    }),
    explanation: "決算日に未経過分の利息を「未収収益」として計上します（見越し）。計算：元金×2%×3ヶ月/12ヶ月。"
  },

  // --- 9. 訂正仕訳 (Correcting Entries) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `${a.toLocaleString()}円の給料支払いを、誤って「旅費交通費」として処理していたことが判明した。これを訂正する。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '給料', amount: a }],
      credits: [{ account: '旅費交通費', amount: a }]
    }),
    explanation: "訂正仕訳は、誤った仕訳の逆仕訳と正しい仕訳を合成したものです。ここでは費用科目間の振替のみで済みます。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `${a.toLocaleString()}円の売掛金回収を、誤って${(a*0.1).toLocaleString()}円と記帳していたことが判明した。これを訂正する。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '現金', amount: a * 0.9 }],
      credits: [{ account: '売掛金', amount: a * 0.9 }]
    }),
    explanation: "金額の誤記の場合、不足分（正しい金額－誤った金額）を追加仕訳します。"
  },

  // --- 10. 貸倒れの実際発生 (Actual Bad Debts) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `D商店に対する売掛金${a.toLocaleString()}円が回収不能となった。なお、貸倒引当金の残高は${(a*1.5).toLocaleString()}円ある。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '貸倒引当金', amount: a }],
      credits: [{ account: '売掛金', amount: a }]
    }),
    explanation: "貸倒引当金が設定されている場合、実際の貸倒れは引当金から取り崩します。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `E商店に対する売掛金${a.toLocaleString()}円が回収不能となった。なお、貸倒引当金の残高は${(a*0.6).toLocaleString()}円である。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '貸倒引当金', amount: a * 0.6 }, { account: '貸倒損失', amount: a * 0.4 }],
      credits: [{ account: '売掛金', amount: a }]
    }),
    explanation: "貸倒額が引当金を超える場合、超過分を「貸倒損失」として計上します。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `過年度に貸倒処理したF商店に対する売掛金${a.toLocaleString()}円が回収された。代金は現金で受け取った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '現金', amount: a }],
      credits: [{ account: '償却債権取立益', amount: a }]
    }),
    explanation: "過去に貸倒処理した債権を回収した場合は「償却債権取立益」（収益）で処理します。"
  },

  // --- 11. 当座借越（二勘定制） (Overdraft - Two-Account Method) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `当座預金の残高は${(a*0.8).toLocaleString()}円であるが、買掛金の支払いとして小切手${a.toLocaleString()}円を振り出した。なお、銀行とは当座借越契約（限度額${(a*2).toLocaleString()}円）を締結しており、二勘定制で処理している。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '買掛金', amount: a }],
      credits: [{ account: '当座預金', amount: a * 0.8 }, { account: '当座借越', amount: a * 0.2 }]
    }),
    explanation: "二勘定制では、当座預金の残高を超えた部分を「当座借越」勘定（負債）に計上します。"
  },

  // --- 12. 固定資産の購入（付随費用含む） (Fixed Asset Acquisition with Additional Costs) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `備品${a.toLocaleString()}円を購入し、引取運賃${(a*0.03).toLocaleString()}円、据付費用${(a*0.02).toLocaleString()}円とともに現金で支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '備品', amount: a * 1.05 }],
      credits: [{ account: '現金', amount: a * 1.05 }]
    }),
    explanation: "固定資産の取得原価には、購入代価に引取運賃、据付費など事業の用に供するまでに要した付随費用を加算します。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `建物${(a * 300).toLocaleString()}円を購入し、仲介手数料${(a * 9).toLocaleString()}円、不動産取得税${(a * 6).toLocaleString()}円とともに普通預金から支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '建物', amount: a * 315 }],
      credits: [{ account: '普通預金', amount: a * 315 }]
    }),
    explanation: "建物の取得原価には、購入代価、仲介手数料、登記費用、不動産取得税などの付随費用を含めます。"
  },

  // --- 13. 現金過不足（原因判明・期中処理） (Cash Shortage - Cause Identified) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `現金の実際有高が帳簿残高より${Math.floor(a * 0.002).toLocaleString()}円不足していたため、現金過不足勘定で処理していたが、その後、通信費の記帳漏れであることが判明した。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '通信費', amount: Math.floor(a * 0.002) }],
      credits: [{ account: '現金過不足', amount: Math.floor(a * 0.002) }]
    }),
    explanation: "現金過不足の原因が判明した場合、該当する勘定科目に振り替えます。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `現金の実際有高が帳簿残高より${Math.floor(a * 0.005).toLocaleString()}円多かったため、現金過不足勘定で処理していたが、その後、売掛金の回収の記帳漏れであることが判明した。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '現金過不足', amount: Math.floor(a * 0.005) }],
      credits: [{ account: '売掛金', amount: Math.floor(a * 0.005) }]
    }),
    explanation: "現金過剰の原因が売掛金回収の記帳漏れの場合、現金過不足を取り崩して売掛金を減額します。"
  },

  // --- 14. 手形の割引 (Note Discounting) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `得意先振出しの約束手形${a.toLocaleString()}円を銀行で割り引き、割引料${(a*0.02).toLocaleString()}円を差し引かれた手取金が当座預金に入金された。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '当座預金', amount: a * 0.98 }, { account: '手形売却損', amount: a * 0.02 }],
      credits: [{ account: '受取手形', amount: a }]
    }),
    explanation: "手形の割引は「手形の譲渡」として処理します（3級では手形売却損勘定を使用）。割引料は「手形売却損」で処理します。"
  },

  // --- 15. 給料の支払い（源泉徴収・社会保険料） (Payroll with Withholdings) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `当月分の給料${a.toLocaleString()}円から、所得税の源泉徴収額${(a*0.05).toLocaleString()}円と社会保険料${(a*0.1).toLocaleString()}円を差し引き、残額を現金で支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '給料', amount: a }],
      credits: [{ account: '所得税預り金', amount: a * 0.05 }, { account: '社会保険料預り金', amount: a * 0.1 }, { account: '現金', amount: a * 0.85 }]
    }),
    explanation: "給料支給時に源泉徴収する所得税と社会保険料は「預り金」（負債）として処理します。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `従業員から預かっていた所得税${(a*0.05).toLocaleString()}円と社会保険料${(a*0.1).toLocaleString()}円を現金で納付した。なお、社会保険料のうち会社負担分は${(a*0.1).toLocaleString()}円である。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '所得税預り金', amount: a * 0.05 }, { account: '社会保険料預り金', amount: a * 0.1 }, { account: '法定福利費', amount: a * 0.1 }],
      credits: [{ account: '現金', amount: a * 0.25 }]
    }),
    explanation: "預り金の納付時に、会社負担分の社会保険料は「法定福利費」として計上します。"
  },

  // --- 16. 電子記録債権・債務 (Electronically Recorded Monetary Claims) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a, t) => `${t}に対する売掛金${a.toLocaleString()}円を電子記録債権とすることについて、債務者の承諾を得た。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '電子記録債権', amount: a }],
      credits: [{ account: '売掛金', amount: a }]
    }),
    explanation: "売掛金を電子記録債権に転換した場合、勘定科目を振り替えます。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a, t) => `${t}に対する買掛金${a.toLocaleString()}円を電子記録債務とすることについて、債権者の請求を承諾した。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '買掛金', amount: a }],
      credits: [{ account: '電子記録債務', amount: a }]
    }),
    explanation: "買掛金を電子記録債務に転換した場合、勘定科目を振り替えます。"
  },

  // --- 17. クレジット売上 (Credit Card Sales) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `商品${a.toLocaleString()}円を販売し、代金はクレジットカードで受け取った。なお、信販会社への手数料は販売代金の3%である。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: 'クレジット売掛金', amount: a * 0.97 }, { account: '支払手数料', amount: a * 0.03 }],
      credits: [{ account: '売上', amount: a }]
    }),
    explanation: "クレジット売上時に、手数料相当額を「支払手数料」として計上し、手取額を「クレジット売掛金」とします。"
  },

  // --- 18. 貸付金と借入金の利息 (Loan Interest) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `G社に現金${(a * 0.5).toLocaleString()}円を貸し付け、3ヶ月後に元金とともに利息（年利率4%）を受け取る約束をした。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '貸付金', amount: a * 0.5 }],
      credits: [{ account: '現金', amount: a * 0.5 }]
    }),
    explanation: "貸付時は元本のみ記録します。利息は受取時または決算時に計上します。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `H社への貸付金${(a * 0.5).toLocaleString()}円について、3ヶ月分の利息（年利率4%）とともに元金を現金で受け取った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '現金', amount: Math.floor(a * 0.5 + a * 0.5 * 0.04 * 3 / 12) }],
      credits: [{ account: '貸付金', amount: a * 0.5 }, { account: '受取利息', amount: Math.floor(a * 0.5 * 0.04 * 3 / 12) }]
    }),
    explanation: "貸付金の回収時に、元本と利息を区分して処理します。利息計算：元金×4%×3/12。"
  },

  // ##########################################
  // 追加：第3問強化計算問題 (Phase 3)
  // ##########################################

  // --- 19. 減価償却の各種計算 (Depreciation Calculations) ---
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `備品（取得原価${(a * 1.2).toLocaleString()}円、耐用年数5年、残存価額は取得原価の10%、定額法）の第3年度の減価償却費はいくらか。`,
    generateNumericAnswer: (a) => Math.floor((a * 1.2 - a * 0.12) / 5), // (取得原価 - 残存価額) ÷ 5
    explanation: "定額法：(取得原価 - 残存価額) ÷ 耐用年数。毎年同額です。"
  },
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `車両運搬具（取得原価${(a * 2.4).toLocaleString()}円）を期首に購入。耐用年数6年、残存価額ゼロ、定額法の場合、第1年度末の減価償却累計額はいくらか。`,
    generateNumericAnswer: (a) => Math.floor(a * 2.4 / 6), // 取得原価 ÷ 6
    explanation: "定額法（残存価額ゼロ）：取得原価 ÷ 耐用年数。"
  },
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `建物（取得原価${(a * 36).toLocaleString()}円、減価償却累計額${(a * 12).toLocaleString()}円）の帳簿価額（未償却残高）はいくらか。`,
    generateNumericAnswer: (a) => a * 24, // 36a - 12a
    explanation: "帳簿価額 = 取得原価 - 減価償却累計額。"
  },

  // --- 20. 貸倒引当金の各種パターン (Bad Debt Allowance Calculations) ---
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `売掛金の期末残高${(a * 50).toLocaleString()}円、受取手形の期末残高${(a * 30).toLocaleString()}円に対し、2%の貸倒引当金を設定する。貸倒引当金の前期末残高は${(a * 1.2).toLocaleString()}円である。差額補充法の場合、当期の貸倒引当金繰入額はいくらか。`,
    generateNumericAnswer: (a) => Math.floor((a * 50 + a * 30) * 0.02 - a * 1.2), // (売掛金 + 受取手形) × 2% - 前期末残高
    explanation: "設定目標額 = (売掛金 + 受取手形) × 2%。繰入額 = 設定目標額 - 前期末残高。"
  },
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `売掛金の期末残高${(a * 40).toLocaleString()}円に対し3%の貸倒引当金を設定する。前期末残高は${(a * 1.5).toLocaleString()}円である。洗替法の場合、当期の貸倒引当金繰入額はいくらか。`,
    generateNumericAnswer: (a) => Math.floor(a * 40 * 0.03), // 売掛金 × 3%（洗替法は前期残高を戻入後、新たに全額設定）
    explanation: "洗替法では、期首に前期末残高を戻入し（貸倒引当金 / 貸倒引当金戻入）、期末に新たに全額を繰り入れます。繰入額 = 売掛金 × 3%。"
  },
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `売掛金${(a * 80).toLocaleString()}円（貸倒懸念債権${(a * 5).toLocaleString()}円を含む）の貸倒引当金を設定する。一般債権は2%、貸倒懸念債権は50%とする場合、貸倒引当金の設定額はいくらか。なお、前期末残高はゼロとする。`,
    generateNumericAnswer: (a) => a * 4, // (a*80 - a*5) × 2% + a*5 × 50% = a*1.5 + a*2.5 = a*4
    explanation: "一般債権分：（総額 - 貸倒懸念債権） × 2%。貸倒懸念債権分：金額 × 50%。合計が設定額。"
  },

  // --- 21. 売上原価・商品関連の計算 (Cost of Goods Sold) ---
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `期首商品棚卸高${(a * 0.8).toLocaleString()}円、当期商品仕入高${(a * 6).toLocaleString()}円、期末商品棚卸高${a.toLocaleString()}円の場合、売上原価はいくらか。`,
    generateNumericAnswer: (a) => Math.floor(a * 0.8 + a * 6 - a), // 期首 + 仕入 - 期末
    explanation: "売上原価 = 期首商品 + 当期仕入 - 期末商品。"
  },
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `売上高${(a * 100).toLocaleString()}円、売上原価${(a * 60).toLocaleString()}円、販貣費及び一般管理費${(a * 25).toLocaleString()}円の場合、営業利益はいくらか。`,
    generateNumericAnswer: (a) => a * 15, // 100a - 60a - 25a
    explanation: "営業利益 = 売上高 - 売上原価 - 販管費。"
  },
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `売上高${(a * 150).toLocaleString()}円、期首商品${(a * 12).toLocaleString()}円、当期仕入${(a * 90).toLocaleString()}円、期末商品${(a * 18).toLocaleString()}円の場合、売上総利益はいくらか。`,
    generateNumericAnswer: (a) => a * 66, // a*150 - (a*12 + a*90 - a*18) = a*150 - a*84 = a*66
    explanation: "売上原価 = 期首商品 + 当期仕入 - 期末商品。売上総利益 = 売上高 - 売上原価。"
  },

  // --- 22. 決算整理の複合計算 (Complex Closing Adjustments) ---
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `決算整理前試算表の「受取家賃」は${(a * 0.36).toLocaleString()}円（当期4/1受取の1年分）である。決算日は3/31である。決算整理後の「受取家賃」（P/L計上額）はいくらか。`,
    generateNumericAnswer: (a) => a * 0.36, // 4/1から翌年3/31まで丸1年分経過しているため全額収益
    explanation: "4/1に1年分（4/1～翌3/31）を受け取っているため、決算日3/31時点で全額が経過済みです。よって全額が当期の収益となります。"
  },
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `決算整理前試算表の「支払家賃」は${(a * 0.54).toLocaleString()}円（当期分9ヶ月分）である。年間家賃は${(a * 0.72).toLocaleString()}円、決算日は3/31である。決算整理後の「支払家賃」（P/L計上額）はいくらか。`,
    generateNumericAnswer: (a) => a * 0.72, // 9ヶ月分が計上済み、残り3ヶ月分を見越計上して合計年額
    explanation: "年間家賃のうち、既に9ヶ月分が支払済み。残り3ヶ月分を未払費用として見越し計上。合計で年間家賃の全額が当期費用となります。"
  },
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `決算整理前の消耗品費勘定残高は${(a * 0.06).toLocaleString()}円、期末実地棚卸高は${(a * 0.018).toLocaleString()}円である。購入時に全額費用処理している場合、決算整理後のP/Lに計上される消耗品費はいくらか。`,
    generateNumericAnswer: (a) => a * 0.042, // a*0.06 - a*0.018 = a*0.042
    explanation: "費用処理法（購入時に全額費用計上）の場合、決算で期末残高を資産に振り替えます。P/L計上額 = 期首残高 - 期末残高。",
  },

  // --- 23. 利息・手数料の計算 (Interest & Fee Calculations) ---
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `借入金${(a * 3.6).toLocaleString()}円（年利率3%）について、決算日（3/31）時点で6ヶ月分の利息が未払いとなっている。未払利息はいくらか。`,
    generateNumericAnswer: (a) => Math.floor(a * 3.6 * 0.03 * 0.5), // a*3.6 × 3% × 6/12
    explanation: "利息計算：元金 × 年利率 × 期間。未払利息 = 借入金 × 3% × 6/12。"
  },
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `定期預金${(a * 2.4).toLocaleString()}円（預入期間1年、年利率2%）を9月1日に預け入れた。決算日3月31日時点での未収利息はいくらか。`,
    generateNumericAnswer: (a) => Math.floor(a * 2.4 * 0.02 * 7 / 12), // a*2.4 × 2% × 7/12
    explanation: "9月1日～翌年3月31日 = 7ヶ月。利息計算：定期預金 × 2% × 7/12。"
  },

  // --- 24. 当期純利益の計算 (Net Income Calculation) ---
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `売上高${(a * 200).toLocaleString()}円、売上原価${(a * 120).toLocaleString()}円、販管費${(a * 50).toLocaleString()}円、営業外収益${(a * 5).toLocaleString()}円、営業外費用${(a * 3).toLocaleString()}円の場合、経常利益はいくらか。`,
    generateNumericAnswer: (a) => a * 32, // (200a - 120a - 50a) + 5a - 3a
    explanation: "営業利益 = 売上高 - 売上原価 - 販管費。経常利益 = 営業利益 + 営業外収益 - 営業外費用。"
  },

  // ##########################################
  // 追加：Hard難易度複合仕訳 (Phase 5)
  // ##########################################

  // --- 25. 消費税を含む複合取引 (Complex Transactions with Tax) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `商品${a.toLocaleString()}円（税抜）を仕入れ、代金は消費税10%とともに掛けとした。なお、引取運賃${(a*0.05).toLocaleString()}円（税抜）を現金で支払った。（税抜方式）`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '仕入', amount: a + Math.floor(a * 0.05) }, { account: '仮払消費税', amount: Math.floor(a * 0.1) + Math.floor(a * 0.005) }],
      credits: [{ account: '買掛金', amount: Math.floor(a * 1.1) }, { account: '現金', amount: Math.floor(a * 0.055) }]
    }),
    explanation: "商品仕入と引取運賃（付随費用）を合算して仕入原価とします。消費税は仮払消費税で処理。引取運賃の税抜額を仕入に加算。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `商品${a.toLocaleString()}円（税抜）を売り上げ、代金は消費税10%とともに掛けとした。なお、先方負担の発送費${Math.floor(a * 0.02).toLocaleString()}円（消費税込み${Math.floor(a * 0.022).toLocaleString()}円）を立替払いし、現金で支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '売掛金', amount: Math.floor(a * 1.1) }, { account: '立替金', amount: Math.floor(a * 0.022) }],
      credits: [{ account: '売上', amount: a }, { account: '仮受消費税', amount: Math.floor(a * 0.1) }, { account: '現金', amount: Math.floor(a * 0.022) }]
    }),
    explanation: "売上取引と立替金を別々に処理します。発送費は先方負担のため売掛金に含めるか立替金とします（ここでは立替金勘定使用）。"
  },

  // --- 26. 決算整理の複合処理 (Complex Closing Adjustments) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算日（3/31）において次の整理を行う。①建物（取得原価${(a * 240).toLocaleString()}円、耐用年数30年、残存価額ゼロ、定額法、間接法）の減価償却、②借入金${(a * 120).toLocaleString()}円（年利率4%）の利息6ヶ月分の見越し計上。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '減価償却費', amount: a * 8 }, { account: '支払利息', amount: Math.floor(a * 2.4) }],
      credits: [{ account: '減価償却累計額', amount: a * 8 }, { account: '未払費用', amount: Math.floor(a * 2.4) }]
    }),
    explanation: "①減価償却：取得原価÷30年。②利息見越し：借入金×4%×6/12。２つの決算整理を1つの仕訳で処理。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算日（12/31）において次の整理を行う。①貸付金${(a * 60).toLocaleString()}円（10/1貸付、年利率3%）の利息3ヶ月分の見越し計上、②保険料${(a * 1.2).toLocaleString()}円（4/1支払、1年分前払）の繰延べ処理。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '未収収益', amount: Math.floor(a * 0.45) }, { account: '前払費用', amount: Math.floor(a * 0.3) }],
      credits: [{ account: '受取利息', amount: Math.floor(a * 0.45) }, { account: '支払保険料', amount: Math.floor(a * 0.3) }]
    }),
    explanation: "①利息見越し：貸付金×3%×3/12。②保険料繰延べ：年額×3/12（1/1～3/31の3ヶ月分を翌期へ繰延）。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算日において次の整理を行う。①期末商品棚卸高${(a*1.5).toLocaleString()}円（期首商品は${a.toLocaleString()}円）、②売掛金${(a*20).toLocaleString()}円と受取手形${(a*10).toLocaleString()}円に対し2%の貸倒引当金を設定（前期末残高${(a*0.5).toLocaleString()}円、差額補充法）。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '仕入', amount: a }, { account: '繰越商品', amount: a * 1.5 }, { account: '貸倒引当金繰入', amount: a * 0.1 }],
      credits: [{ account: '繰越商品', amount: a }, { account: '仕入', amount: a * 1.5 }, { account: '貸倒引当金', amount: a * 0.1 }]
    }),
    explanation: "①商品：借方に期首a円・貸方に期末a×1.5、純額で仕入減額a×0.5。②貸倒引当金：(a×20+a×10)×2%=a×0.6、差額a×0.6-a×0.5=a×0.1を繰入。"
  },

  // --- 27. 固定資産の売却（複合仕訳） (Fixed Asset Disposal) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `備品（取得原価${a.toLocaleString()}円、減価償却累計額${(a*0.7).toLocaleString()}円、間接法）を${(a*0.2).toLocaleString()}円で売却し、代金は翌月末受取りとした。なお、売却時に運搬費${(a*0.01).toLocaleString()}円を現金で支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '減価償却累計額', amount: a * 0.7 }, { account: '未収金', amount: a * 0.2 }, { account: '固定資産売却損', amount: a * 0.11 }],
      credits: [{ account: '備品', amount: a }, { account: '現金', amount: a * 0.01 }]
    }),
    explanation: "帳簿価額=取得原価a-減価償却累計額0.7a=0.3a。売却損=帳簿価額0.3a-売却価額0.2a=0.1a。これに売却時の運搬費0.01aを加算し、固定資産売却損は0.11aとなります。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `車両運搬具（取得原価${(a * 36).toLocaleString()}円、減価償却累計額${(a * 24).toLocaleString()}円）を${(a * 15).toLocaleString()}円で売却し、代金は普通預金に振り込まれた。なお、売却費用${(a * 0.5).toLocaleString()}円は普通預金から支払われた。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '減価償却累計額', amount: a * 24 }, { account: '普通預金', amount: a * 14.5 }, { account: '支払手数料', amount: a * 0.5 }],
      credits: [{ account: '車両運搬具', amount: a * 36 }, { account: '固定資産売却益', amount: a * 3 }]
    }),
    explanation: "帳簿価額=取得原価-減価償却累計額。売却益=売却価額-帳簿価額。手取額=売却価額-費用。"
  },

  // --- 28. 複雑な給与計算 (Complex Payroll) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `当月分の給料総額${a.toLocaleString()}円から、所得税${(a*0.08).toLocaleString()}円、住民税${(a*0.06).toLocaleString()}円、健康保険料${(a*0.05).toLocaleString()}円、厚生年金保険料${(a*0.09).toLocaleString()}円を差し引き、残額を普通預金から各人の口座に振り込んだ。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '給料', amount: a }],
      credits: [{ account: '所得税預り金', amount: a * 0.08 }, { account: '住民税預り金', amount: a * 0.06 }, { account: '社会保険料預り金', amount: a * 0.14 }, { account: '普通預金', amount: a * 0.72 }]
    }),
    explanation: "給料総額から各種控除を差し引いた手取額（72%）を支払います。社会保険料=健康保険5%+厚生年金9%=14%。"
  },

  // --- 29. 期中の複合取引 (Mid-Period Complex Transactions) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `当座預金の残高は${(a*0.6).toLocaleString()}円であったが、次の取引を行った。①買掛金${a.toLocaleString()}円の支払いとして小切手を振り出した、②得意先から売掛金${(a*0.3).toLocaleString()}円の回収として小切手を受け取り、ただちに当座預金に預け入れた。なお、当座借越契約（二勘定制）を締結している。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '買掛金', amount: a }],
      credits: [{ account: '当座預金', amount: a * 0.6 }, { account: '当座借越', amount: a * 0.1 }, { account: '売掛金', amount: a * 0.3 }]
    }),
    explanation: "①支払：残高a×0.6を超える部分a×0.4が当座借越となります。②入金：a×0.3を預け入れ、当座借越を減少させます。結果として、当座借越の残高はa×0.1（貸方）となります。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `次の取引を行った。①商品${a.toLocaleString()}円（税抜）を仕入れ、代金は約束手形を振り出して支払った（税抜方式）、②従業員の出張旅費として概算額${(a*0.1).toLocaleString()}円を現金で渡した、③事務用消耗品${(a*0.05).toLocaleString()}円を購入し、代金は現金で支払った（購入時費用処理）。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '仕入', amount: a }, { account: '仮払消費税', amount: a * 0.1 }, { account: '仮払金', amount: a * 0.1 }, { account: '消耗品費', amount: a * 0.05 }],
      credits: [{ account: '支払手形', amount: a * 1.1 }, { account: '現金', amount: a * 0.15 }]
    }),
    explanation: "①仕入：税抜方式のため仮払消費税を分けて計上し、支払手形は税込額。②仮払金：概算払い。③消耗品費：費用処理法。"
  },

  // ##########################################
  // Phase 6: 実践強化問題（20問追加）
  // ##########################################

  // --- 30. 固定資産の修繕と改良 (Repairs & Improvements) ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `建物の外壁塗装工事を行い、${(a * 1.5).toLocaleString()}円を現金で支払った。このうち${(a).toLocaleString()}円は機能向上のための資本的支出、残りは通常の修繕である。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '建物', amount: a }, { account: '修繕費', amount: a * 0.5 }],
      credits: [{ account: '現金', amount: a * 1.5 }]
    }),
    explanation: "資本的支出（機能向上・耐用年数延長）は資産計上、収益的支出（原状回復）は修繕費として費用計上します。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `機械の定期点検費用${(a * 0.08).toLocaleString()}円を現金で支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '修繕費', amount: Math.floor(a * 0.08) }],
      credits: [{ account: '現金', amount: Math.floor(a * 0.08) }]
    }),
    explanation: "定期点検・日常メンテナンスは収益的支出として修繕費で処理します。"
  },

  // --- 31. 勘定記入の理解（選択問題） ---
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "売掛金勘定の借方に記入されるのはどの取引か。",
    generateSelectionAnswer: () => ({ 
      correct: "商品を掛けで売り上げた", 
      options: ["商品を掛けで売り上げた", "掛代金を現金で回収した", "売掛金を貸倒れで処理した", "返品を受けた"] 
    }),
    explanation: "売掛金勘定の借方（増加側）は、掛販売による債権の発生時です。回収・貸倒・返品は貸方（減少側）。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "買掛金勘定の貸方に記入されるのはどの取引か。",
    generateSelectionAnswer: () => ({ 
      correct: "商品を掛けで仕入れた", 
      options: ["商品を掛けで仕入れた", "掛代金を現金で支払った", "仕入先に商品を返品した", "買掛金を手形で決済した"] 
    }),
    explanation: "買掛金勘定の貸方（増加側）は、掛仕入による債務の発生時です。支払・返品・手形決済は借方（減少側）。"
  },

  // --- 32. 補助簿の詳細理解（選択問題） ---
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "現金出納帳に記入すべき取引はどれか。",
    generateSelectionAnswer: () => ({ 
      correct: "現金で消耗品を購入した", 
      options: ["現金で消耗品を購入した", "掛けで商品を仕入れた", "当座預金から引き出した", "手形を受け取った"] 
    }),
    explanation: "現金出納帳は現金の入出金取引のみを記入します。掛取引・預金取引・手形取引は他の補助簿で記入します。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "商品有高帳（先入先出法）で払出単価を決定する際の原則はどれか。",
    generateSelectionAnswer: () => ({ 
      correct: "古く仕入れたものから順に払い出す", 
      options: ["古く仕入れたものから順に払い出す", "新しく仕入れたものから順に払い出す", "平均単価で払い出す", "最終仕入単価で払い出す"] 
    }),
    explanation: "先入先出法は、先に仕入れたものから先に払い出すと仮定する方法です。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "固定資産台帳に記録する内容として適切でないものはどれか。",
    generateSelectionAnswer: () => ({ 
      correct: "毎日の現金残高", 
      options: ["毎日の現金残高", "取得年月日", "取得原価", "減価償却累計額"] 
    }),
    explanation: "固定資産台帳は各固定資産の取得・減価償却・除売却を管理します。現金残高は現金出納帳の記録事項です。"
  },

  // --- 33. 精算表の理解（選択問題） ---
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "精算表の「整理記入」欄に記入する内容はどれか。",
    generateSelectionAnswer: () => ({ 
      correct: "決算整理仕訳", 
      options: ["決算整理仕訳", "期中の取引仕訳", "前期繰越の金額", "当期純利益"] 
    }),
    explanation: "整理記入欄には、減価償却・貸倒引当金設定・費用収益の見越繰延など決算整理仕訳を記入します。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "精算表の「損益計算書」欄に記入される勘定科目はどれか。",
    generateSelectionAnswer: () => ({ 
      correct: "売上", 
      options: ["売上", "売掛金", "建物", "資本金"] 
    }),
    explanation: "損益計算書欄には収益・費用の勘定科目が記入されます。売掛金・建物・資本金は貸借対照表欄に記入します。"
  },

  // --- 34. 財務諸表の詳細（計算問題） ---
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `次の資料から流動比率を計算せよ。流動資産${(a * 120).toLocaleString()}円、流動負債${(a * 80).toLocaleString()}円。（小数点以下切り捨て）`,
    generateNumericAnswer: (a) => Math.floor((120 / 80) * 100), // 動的に計算：常に150%
    explanation: "流動比率 = (流動資産 ÷ 流動負債) × 100。企業の短期的な支払能力を示す指標です。計算式：120 ÷ 80 × 100 = 150%。"
  },
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `次の資料から自己資本比率を計算せよ。総資産${(a * 200).toLocaleString()}円、純資産${(a * 80).toLocaleString()}円。（小数点以下切り捨て）`,
    generateNumericAnswer: (a) => Math.floor((80 / 200) * 100), // 動的に計算：常に40%
    explanation: "自己資本比率 = (純資産 ÷ 総資産) × 100。企業の財務の安全性を示す指標です。計算式：80 ÷ 200 × 100 = 40%。"
  },

  // --- 35. 複合的な決算整理（仕訳問題） ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算日において次の整理を行う。①売掛金${(a * 50).toLocaleString()}円と受取手形${(a * 30).toLocaleString()}円に対し2%の貸倒引当金を設定（前残高${(a * 0.8).toLocaleString()}円、差額補充法）、②消耗品の期末実地棚卸高${(a * 0.3).toLocaleString()}円（購入時費用処理）、③期末商品棚卸高${(a * 15).toLocaleString()}円（期首商品は${(a * 12).toLocaleString()}円）。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '貸倒引当金繰入', amount: Math.floor(a * 0.8) }, { account: '貯蔵品', amount: Math.floor(a * 0.3) }, { account: '仕入', amount: a * 12 }, { account: '繰越商品', amount: a * 15 }],
      credits: [{ account: '貸倒引当金', amount: Math.floor(a * 0.8) }, { account: '消耗品費', amount: Math.floor(a * 0.3) }, { account: '繰越商品', amount: a * 12 }, { account: '仕入', amount: a * 15 }]
    }),
    explanation: "①貸倒引当金：(50a+30a)×2%=1.6a、設定額1.6a-前残高0.8a=0.8a繰入。②貯蔵品：期末残高を資産計上。③繰越商品：期首商品を仕入に振替（しーくりくりしー）の借方側。"
  },
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算日において次の整理を行う。①車両運搬具（取得原価${(a * 24).toLocaleString()}円、耐用年数6年、残存価額ゼロ、定額法、間接法）の減価償却、②保険料の前払分${(a * 0.4).toLocaleString()}円の繰延べ、③家賃の未払分${(a * 0.6).toLocaleString()}円の見越し計上。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '減価償却費', amount: a * 4 }, { account: '前払費用', amount: Math.floor(a * 0.4) }, { account: '支払家賃', amount: Math.floor(a * 0.6) }],
      credits: [{ account: '減価償却累計額', amount: a * 4 }, { account: '支払保険料', amount: Math.floor(a * 0.4) }, { account: '未払費用', amount: Math.floor(a * 0.6) }]
    }),
    explanation: "①減価償却：取得原価÷耐用年数。②前払費用：翌期分を繰延。③未払費用：当期分の未払を見越し計上。"
  },

  // --- 36. 伝票会計の応用（仕訳問題） ---
  {
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `3伝票制において、商品${a.toLocaleString()}円を仕入れ、代金のうち${(a * 0.3).toLocaleString()}円を現金で支払い、残額は掛けとした。この取引を仕訳しなさい。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '仕入', amount: a }],
      credits: [{ account: '現金', amount: Math.floor(a * 0.3) }, { account: '買掛金', amount: Math.floor(a * 0.7) }]
    }),
    explanation: "3伝票制でも仕訳は通常通り行います。現金支払分は出金伝票、掛分は振替伝票で起票します。"
  },

  // --- 37. 消費税の処理（Tax Accounting） ---
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "消費税の仮払消費税と仮受消費税の差額を決算時に処理する勘定科目はどれか。",
    generateSelectionAnswer: () => ({ 
      correct: "未払消費税（または未収消費税）", 
      options: ["未払消費税（または未収消費税）", "租税公課", "雑収入", "消費税"] 
    }),
    explanation: "仮受消費税が仮払消費税より多い場合は「未払消費税」（負債）、少ない場合は「未収消費税」（資産）で処理します。"
  },

  // --- 38. 帳簿組織の理解（選択問題） ---
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "主要簿に分類されるものはどれか。",
    generateSelectionAnswer: () => ({ 
      correct: "総勘定元帳", 
      options: ["総勘定元帳", "現金出納帳", "仕入帳", "売上帳"] 
    }),
    explanation: "主要簿は「仕訳帳」と「総勘定元帳」の2つです。現金出納帳・仕入帳・売上帳は補助簿（補助記入帳）です。"
  },
  {
    type: QuestionType.SELECTION,
    textTemplate: () => "補助元帳に分類されるものはどれか。",
    generateSelectionAnswer: () => ({ 
      correct: "買掛金元帳", 
      options: ["買掛金元帳", "仕訳帳", "総勘定元帳", "試算表"] 
    }),
    explanation: "補助元帳には、売掛金元帳・買掛金元帳・商品有高帳などがあります。各勘定の明細を管理します。"
  },

  // --- 39. 実践的な計算問題 ---
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `決算整理前の消耗品費勘定残高は${(a * 0.8).toLocaleString()}円、期末実地棚卸高は${(a * 0.2).toLocaleString()}円である。購入時に全額費用処理している場合、決算整理後のP/Lに計上される消耗品費はいくらか。`,
    generateNumericAnswer: (a) => Math.floor(a * 0.6), // 0.8 - 0.2 = 0.6
    explanation: "費用処理法の場合、期末残高を資産（貯蔵品）に振り替えます。P/L計上額 = 期首残高 - 期末残高。"
  },
  {
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `決算整理前試算表の「前払保険料」は${(a * 0.6).toLocaleString()}円（当期7/1支払、1年分）である。決算日は翌年3/31である。決算整理後の「前払保険料」（B/S計上額）はいくらか。`,
    generateNumericAnswer: (a) => Math.floor(a * 0.15), // 0.6 × 3/12 = 0.15（4/1～6/30の3ヶ月分）
    explanation: "7/1支払の1年分（7/1～翌6/30）のうち、3/31時点で未経過なのは4/1～6/30の3ヶ月分です。"
  }
];
