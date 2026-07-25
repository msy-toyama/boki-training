import { ProblemTemplate, QuestionType } from '../../types';
import { yen, floor, makeIndustrial } from './level2Helpers';

// 論点タグ別のファクトリ。level2Topic は QuestionTypeSelector の論点フィルタと対応する。
const materials = makeIndustrial('materials');
const labor = makeIndustrial('labor');
const expenses = makeIndustrial('expenses');
const overhead = makeIndustrial('overhead');
const department = makeIndustrial('department');
const process = makeIndustrial('process');
const individual = makeIndustrial('individual');
const standard = makeIndustrial('standard');
const directCosting = makeIndustrial('direct-costing');
const factory = makeIndustrial('factory');

export const LEVEL2_INDUSTRIAL_TEMPLATES: ProblemTemplate[] = [
  // ==================================================================
  // 材料費（materials）
  // ==================================================================
  materials({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `材料${yen(a)}を掛けで購入し、引取運賃${yen(floor(a * 0.05))}を現金で支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '材料', amount: a + floor(a * 0.05) }],
      credits: [
        { account: '買掛金', amount: a },
        { account: '現金', amount: floor(a * 0.05) },
      ],
    }),
    explanation: '材料の購入原価は、購入代価に引取運賃などの付随費用を加えた金額とします。',
  }),
  materials({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `材料${yen(a)}を掛けで購入した。購入に際し、材料副費を購入代価の5%として予定配賦する。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '材料', amount: a + floor(a * 0.05) }],
      credits: [
        { account: '買掛金', amount: a },
        { account: '材料副費', amount: floor(a * 0.05) },
      ],
    }),
    explanation: '材料副費を予定配賦する場合、材料の購入原価に予定配賦額を加え、相手勘定は「材料副費」とします。',
  }),
  materials({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `当月、材料${yen(a)}を消費した。このうち${yen(floor(a * 0.8))}は直接材料費、残りは間接材料費であった。`,
    generateJournalAnswer: (a) => ({
      debits: [
        { account: '仕掛品', amount: floor(a * 0.8) },
        { account: '製造間接費', amount: a - floor(a * 0.8) },
      ],
      credits: [{ account: '材料', amount: a }],
    }),
    explanation: '直接材料費は仕掛品へ、間接材料費は製造間接費へ振り替え、消費した材料を減少させます。',
  }),
  materials({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `月末に材料の実地棚卸を行ったところ、帳簿棚卸高より${yen(floor(a * 0.05))}の棚卸減耗が生じていた（正常な範囲）。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '製造間接費', amount: floor(a * 0.05) }],
      credits: [{ account: '材料', amount: floor(a * 0.05) }],
    }),
    explanation: '正常な材料の棚卸減耗は間接経費として「製造間接費」に振り替えます。',
  }),
  materials({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `材料の予定消費価格による消費額は${yen(a)}であったが、実際消費額は${yen(a + floor(a * 0.05))}であった。材料消費価格差異を計上する。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '材料消費価格差異', amount: floor(a * 0.05) }],
      credits: [{ account: '材料', amount: floor(a * 0.05) }],
    }),
    explanation: '実際消費額が予定消費額を上回る不利差異は、「材料消費価格差異」（借方）として把握します。',
  }),

  // ==================================================================
  // 労務費（labor）
  // ==================================================================
  labor({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `当月の賃金消費額は${yen(a)}であった。このうち${yen(floor(a * 0.7))}は直接労務費、残りは間接労務費であった。`,
    generateJournalAnswer: (a) => ({
      debits: [
        { account: '仕掛品', amount: floor(a * 0.7) },
        { account: '製造間接費', amount: a - floor(a * 0.7) },
      ],
      credits: [{ account: '賃金', amount: a }],
    }),
    explanation: '直接労務費は仕掛品へ、間接労務費は製造間接費へ振り替え、消費した賃金を減少させます。',
  }),
  labor({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `当月の賃金${yen(a)}を、現金で支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '賃金', amount: a }],
      credits: [{ account: '現金', amount: a }],
    }),
    explanation: '賃金を支払ったときは「賃金」勘定の借方に記入します。',
  }),
  labor({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `予定賃率による直接工の賃金消費額は${yen(a)}であったが、実際賃率による消費額は${yen(a + floor(a * 0.05))}であった。賃率差異を計上する。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '賃率差異', amount: floor(a * 0.05) }],
      credits: [{ account: '賃金', amount: floor(a * 0.05) }],
    }),
    explanation: '実際賃率による消費額が予定を上回る不利差異は、「賃率差異」（借方）として把握します。',
  }),

  // ==================================================================
  // 経費（expenses）
  // ==================================================================
  expenses({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `当月の工場の電力料${yen(a)}を当座預金から支払った。これは間接経費である。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '製造間接費', amount: a }],
      credits: [{ account: '当座預金', amount: a }],
    }),
    explanation: '電力料などの間接経費は、「製造間接費」に集計します。',
  }),
  expenses({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算にあたり、工場設備の減価償却費${yen(a)}を計上した（間接法）。これは間接経費である。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '製造間接費', amount: a }],
      credits: [{ account: '減価償却累計額', amount: a }],
    }),
    explanation: '工場設備の減価償却費は間接経費として「製造間接費」に集計します。',
  }),

  // ==================================================================
  // 製造間接費（overhead）
  // ==================================================================
  overhead({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `当月の製造間接費${yen(a)}を、直接作業時間にもとづき各製品（仕掛品）へ予定配賦した。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '仕掛品', amount: a }],
      credits: [{ account: '製造間接費', amount: a }],
    }),
    explanation: '製造間接費を予定配賦すると、製造間接費勘定から仕掛品勘定へ振り替えます。',
  }),
  overhead({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `製造間接費の予定配賦額は${yen(a)}であったが、実際発生額は${yen(a + floor(a * 0.1))}であった。配賦差異を計上する。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '製造間接費配賦差異', amount: floor(a * 0.1) }],
      credits: [{ account: '製造間接費', amount: floor(a * 0.1) }],
    }),
    explanation: '実際発生額が予定配賦額を上回る不利差異は、製造間接費勘定から配賦差異勘定（借方）へ振り替えます。',
  }),
  overhead({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `当月の製造間接費の実際発生額${yen(a)}を集計した。内訳は間接材料費${yen(floor(a * 0.3))}、間接労務費${yen(floor(a * 0.4))}、間接経費（現金払い）残額である。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '製造間接費', amount: a }],
      credits: [
        { account: '材料', amount: floor(a * 0.3) },
        { account: '賃金', amount: floor(a * 0.4) },
        { account: '現金', amount: a - floor(a * 0.3) - floor(a * 0.4) },
      ],
    }),
    explanation: '間接材料費・間接労務費・間接経費を「製造間接費」勘定の借方に集計します。',
  }),

  // ==================================================================
  // 部門別計算（department）
  // ==================================================================
  department({
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `補助部門費${yen(a)}を、直接配賦法により製造部門A（配賦割合60%）と製造部門B（配賦割合40%）へ配賦する。製造部門Aへの配賦額はいくらか（単位：円）。`,
    generateNumericAnswer: (a) => floor(a * 0.6),
    explanation: '直接配賦法では、補助部門費を製造部門のみへ配賦割合に応じて配賦します（A＝補助部門費×60%）。',
  }),
  department({
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `製造部門Aの部門個別費は${yen(a)}、補助部門からの配賦額は${yen(floor(a * 0.3))}であった。製造部門Aの部門費合計はいくらか（単位：円）。`,
    generateNumericAnswer: (a) => a + floor(a * 0.3),
    explanation: '製造部門費合計＝部門個別費＋補助部門からの配賦額で計算します。',
  }),

  // ==================================================================
  // 総合原価計算（process）
  // ==================================================================
  process({
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `当月の製造費用は、直接材料費${yen(a)}、直接労務費${yen(floor(a * 0.6))}、製造間接費${yen(floor(a * 0.4))}であった。当月製造費用の合計はいくらか（単位：円）。`,
    generateNumericAnswer: (a) => a + floor(a * 0.6) + floor(a * 0.4),
    explanation: '当月製造費用＝直接材料費＋直接労務費＋製造間接費で計算します。',
  }),
  process({
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `月初仕掛品原価${yen(floor(a * 0.2))}、当月製造費用${yen(a)}、月末仕掛品原価${yen(floor(a * 0.15))}であった。当月の完成品総合原価はいくらか（単位：円）。`,
    generateNumericAnswer: (a) => floor(a * 0.2) + a - floor(a * 0.15),
    explanation: '完成品総合原価＝月初仕掛品原価＋当月製造費用－月末仕掛品原価で計算します。',
  }),
  process({
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `平均法による。当月の材料費は${yen(a)}（材料は工程始点で投入）、完成品数量80個、月末仕掛品数量20個であった。月末仕掛品に含まれる材料費はいくらか（単位：円）。`,
    generateNumericAnswer: (a) => floor(a * 0.2),
    explanation: '材料が始点投入の場合、月末仕掛品の材料費＝材料費合計×月末仕掛品数量÷（完成品数量＋月末仕掛品数量）＝材料費×20/100で計算します。',
  }),

  // ==================================================================
  // 個別原価計算・完成と販売（individual）
  // ==================================================================
  individual({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `当月に完成した製品の製造原価は${yen(a)}であった。完成品を製品勘定へ振り替える。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '製品', amount: a }],
      credits: [{ account: '仕掛品', amount: a }],
    }),
    explanation: '製品が完成すると、その製造原価を仕掛品勘定から製品勘定へ振り替えます。',
  }),
  individual({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `製品（製造原価${yen(a)}）を${yen(a + floor(a * 0.4))}で掛け販売した。売上原価も同時に計上する。`,
    generateJournalAnswer: (a) => ({
      debits: [
        { account: '売掛金', amount: a + floor(a * 0.4) },
        { account: '売上原価', amount: a },
      ],
      credits: [
        { account: '売上', amount: a + floor(a * 0.4) },
        { account: '製品', amount: a },
      ],
    }),
    explanation: '製品の販売時は、売上を計上すると同時に、引き渡した製品の原価を製品勘定から売上原価へ振り替えます。',
  }),
  individual({
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `当月の売上高は${yen(a + floor(a * 0.5))}、売上原価は${yen(a)}であった。売上総利益はいくらか（単位：円）。`,
    generateNumericAnswer: (a) => floor(a * 0.5),
    explanation: '売上総利益＝売上高－売上原価で計算します。',
  }),

  // ==================================================================
  // 標準原価計算（standard）
  // ==================================================================
  standard({
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `標準原価計算による。当月投入分の標準直接材料費は${yen(a)}、実際直接材料費は${yen(a + floor(a * 0.05))}であった。直接材料費の総差異（不利差異）はいくらか（単位：円）。`,
    generateNumericAnswer: (a) => floor(a * 0.05),
    explanation: '直接材料費差異＝実際直接材料費－標準直接材料費で計算し、実際が大きければ不利差異です。',
  }),
  standard({
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `標準原価計算による。当月投入分の標準直接労務費は${yen(a)}、実際直接労務費は${yen(a + floor(a * 0.04))}であった。直接労務費の総差異（不利差異）はいくらか（単位：円）。`,
    generateNumericAnswer: (a) => floor(a * 0.04),
    explanation: '直接労務費差異＝実際直接労務費－標準直接労務費で計算し、実際が大きければ不利差異です。',
  }),
  standard({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `パーシャル・プランによる。当月の直接材料費について、標準消費額${yen(a)}を仕掛品に振り替える（実際消費額は材料勘定に計上済み）。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '仕掛品', amount: a }],
      credits: [{ account: '材料', amount: a }],
    }),
    explanation: 'パーシャル・プランでは、仕掛品勘定の借方に標準原価を記入し、差異は仕掛品勘定で把握します。',
  }),

  // ==================================================================
  // 直接原価計算・CVP分析（direct-costing）
  // ==================================================================
  directCosting({
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `当月の売上高は${yen(a)}、変動費は${yen(floor(a * 0.6))}であった。貢献利益はいくらか（単位：円）。`,
    generateNumericAnswer: (a) => a - floor(a * 0.6),
    explanation: '貢献利益＝売上高－変動費で計算します。',
  }),
  directCosting({
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `当月の売上高は${yen(a)}、変動費は${yen(floor(a * 0.6))}、固定費は${yen(floor(a * 0.2))}であった。直接原価計算による営業利益はいくらか（単位：円）。`,
    generateNumericAnswer: (a) => a - floor(a * 0.6) - floor(a * 0.2),
    explanation: '営業利益＝売上高－変動費－固定費（＝貢献利益－固定費）で計算します。',
  }),
  directCosting({
    type: QuestionType.NUMERIC,
    textTemplate: (a) => `当社の固定費は${yen(a)}、貢献利益率は40%である。損益分岐点売上高はいくらか（単位：円）。`,
    generateNumericAnswer: (a) => floor(a * 2.5),
    explanation: '損益分岐点売上高＝固定費÷貢献利益率で計算します（固定費÷0.4＝固定費×2.5）。',
  }),

  // ==================================================================
  // 本社工場会計（factory）
  // ==================================================================
  factory({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `工場会計が独立している。工場は材料${yen(a)}を掛けで購入した（買掛金は本社が管理する）。工場側の仕訳を示しなさい。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '材料', amount: a }],
      credits: [{ account: '本社', amount: a }],
    }),
    explanation: '工場側では、本社が管理する買掛金の代わりに「本社」勘定を用いて記帳します。',
  }),
  factory({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `工場会計が独立している。工場が掛けで購入した材料${yen(a)}について、本社側の仕訳を示しなさい。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '工場', amount: a }],
      credits: [{ account: '買掛金', amount: a }],
    }),
    explanation: '本社側では、工場の資産増加に対応して「工場」勘定を用い、買掛金を計上します。',
  }),
  factory({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `工場会計が独立している。工場で製品（製造原価${yen(a)}）が完成し、本社の倉庫へ納入した。工場側の仕訳を示しなさい。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '本社', amount: a }],
      credits: [{ account: '仕掛品', amount: a }],
    }),
    explanation: '完成品を本社へ引き渡したときは、工場側で仕掛品を減少させ「本社」勘定を用いて記帳します。',
  }),
];
