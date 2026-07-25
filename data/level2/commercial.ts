import { ProblemTemplate, QuestionType } from '../../types';
import { yen, floor, makeCommercial } from './level2Helpers';

// 論点タグ別のファクトリ。level2Topic は QuestionTypeSelector の論点フィルタと対応する。
const securities = makeCommercial('securities');
const notes = makeCommercial('notes');
const goods = makeCommercial('goods');
const fixedAssets = makeCommercial('fixed-assets');
const lease = makeCommercial('lease');
const intangibles = makeCommercial('intangibles');
const provisions = makeCommercial('provisions');
const netAssets = makeCommercial('net-assets');
const tax = makeCommercial('tax');
const forex = makeCommercial('forex');
const branch = makeCommercial('branch');
const service = makeCommercial('service-closing');
const consolidation = makeCommercial('consolidation');

export const LEVEL2_COMMERCIAL_TEMPLATES: ProblemTemplate[] = [
  // ==================================================================
  // 有価証券（securities）
  // ==================================================================
  securities({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `売買目的で有価証券を${yen(a)}で購入し、購入手数料${yen(floor(a * 0.02))}とともに、代金を当座預金から支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '売買目的有価証券', amount: a + floor(a * 0.02) }],
      credits: [{ account: '当座預金', amount: a + floor(a * 0.02) }],
    }),
    explanation: '売買目的有価証券の取得原価は、購入代価に購入手数料などの付随費用を加えた金額とします。',
  }),
  securities({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `売買目的で保有する有価証券（帳簿価額${yen(a)}）を${yen(a + floor(a * 0.1))}で売却し、代金は当座預金に預け入れた。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '当座預金', amount: a + floor(a * 0.1) }],
      credits: [
        { account: '売買目的有価証券', amount: a },
        { account: '有価証券売却益', amount: floor(a * 0.1) },
      ],
    }),
    explanation: '売却価額が帳簿価額を上回る差額は「有価証券売却益」（収益）として計上します。',
  }),
  securities({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `売買目的で保有する有価証券（帳簿価額${yen(a)}）を${yen(a - floor(a * 0.1))}で売却し、代金は当座預金に預け入れた。`,
    generateJournalAnswer: (a) => ({
      debits: [
        { account: '当座預金', amount: a - floor(a * 0.1) },
        { account: '有価証券売却損', amount: floor(a * 0.1) },
      ],
      credits: [{ account: '売買目的有価証券', amount: a }],
    }),
    explanation: '売却価額が帳簿価額を下回る差額は「有価証券売却損」（費用）として計上します。',
  }),
  securities({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `満期まで保有する目的で額面${yen(a)}の社債を、額面100円につき98円で購入し、代金は当座預金から支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '満期保有目的債券', amount: floor(a * 0.98) }],
      credits: [{ account: '当座預金', amount: floor(a * 0.98) }],
    }),
    explanation: '満期保有目的の債券は、額面ではなく実際の購入価額（取得原価）で「満期保有目的債券」に計上します。',
  }),
  securities({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算にあたり、売買目的有価証券（帳簿価額${yen(a)}）を時価${yen(a + floor(a * 0.1))}に評価替えした。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '売買目的有価証券', amount: floor(a * 0.1) }],
      credits: [{ account: '有価証券評価益', amount: floor(a * 0.1) }],
    }),
    explanation: '売買目的有価証券は決算時に時価評価し、時価が帳簿価額を上回る差額は「有価証券評価益」とします。',
  }),
  securities({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算にあたり、売買目的有価証券（帳簿価額${yen(a)}）を時価${yen(a - floor(a * 0.1))}に評価替えした。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '有価証券評価損', amount: floor(a * 0.1) }],
      credits: [{ account: '売買目的有価証券', amount: floor(a * 0.1) }],
    }),
    explanation: '売買目的有価証券は決算時に時価評価し、時価が帳簿価額を下回る差額は「有価証券評価損」とします。',
  }),
  securities({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算にあたり、その他有価証券（取得原価${yen(a)}）を時価${yen(a + floor(a * 0.1))}に評価替えした（全部純資産直入法・税効果は考慮しない）。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: 'その他有価証券', amount: floor(a * 0.1) }],
      credits: [{ account: 'その他有価証券評価差額金', amount: floor(a * 0.1) }],
    }),
    explanation: 'その他有価証券の評価差額は損益とせず、「その他有価証券評価差額金」（純資産）として計上します。',
  }),
  securities({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `他社を支配する目的でその発行済株式の過半数を取得し、代金${yen(a)}を当座預金から支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '子会社株式', amount: a }],
      credits: [{ account: '当座預金', amount: a }],
    }),
    explanation: '支配目的で取得した株式は「子会社株式」（投資その他の資産）として取得原価で計上します。',
  }),
  securities({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `売買目的で額面${yen(a)}の社債を額面100円につき100円で購入し、端数利息${yen(floor(a * 0.01))}とともに代金を当座預金から支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [
        { account: '売買目的有価証券', amount: a },
        { account: '有価証券利息', amount: floor(a * 0.01) },
      ],
      credits: [{ account: '当座預金', amount: a + floor(a * 0.01) }],
    }),
    explanation: '公社債を利払日の間に購入した場合、直前の利払日から購入日までの端数利息は「有価証券利息」で処理します。',
  }),
  securities({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `保有する社債について、利札の期限が到来し、利息${yen(a)}を現金で受け取った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '現金', amount: a }],
      credits: [{ account: '有価証券利息', amount: a }],
    }),
    explanation: '社債など公社債から得た利息は「有価証券利息」（収益）として計上します。',
  }),

  // ==================================================================
  // 手形・電子記録債権（notes）
  // ==================================================================
  notes({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `かねて受け取っていた約束手形${yen(a)}を取引銀行で割り引き、割引料${yen(floor(a * 0.02))}を差し引かれた残額を当座預金とした。`,
    generateJournalAnswer: (a) => ({
      debits: [
        { account: '当座預金', amount: a - floor(a * 0.02) },
        { account: '手形売却損', amount: floor(a * 0.02) },
      ],
      credits: [{ account: '受取手形', amount: a }],
    }),
    explanation: '手形の割引では、受取手形を減少させ、割引料は「手形売却損」（費用）として処理します。',
  }),
  notes({
    type: QuestionType.JOURNAL,
    textTemplate: (a, t) => `${t ?? '仕入先'}に対する買掛金${yen(a)}の支払いのため、かねて受け取っていた約束手形${yen(a)}を裏書譲渡した。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '買掛金', amount: a }],
      credits: [{ account: '受取手形', amount: a }],
    }),
    explanation: '手形の裏書譲渡では、所有する受取手形を減少させ、支払いに充てた債務（買掛金）を消去します。',
  }),
  notes({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `電子記録債権${yen(a)}を取引銀行に譲渡（割引）し、譲渡代金${yen(a - floor(a * 0.03))}が当座預金に振り込まれた。`,
    generateJournalAnswer: (a) => ({
      debits: [
        { account: '当座預金', amount: a - floor(a * 0.03) },
        { account: '電子記録債権売却損', amount: floor(a * 0.03) },
      ],
      credits: [{ account: '電子記録債権', amount: a }],
    }),
    explanation: '電子記録債権を額面より低い金額で譲渡したときの差額は「電子記録債権売却損」で処理します。',
  }),
  notes({
    type: QuestionType.JOURNAL,
    textTemplate: (a, t) => `${t ?? '得意先'}に対する売掛金${yen(a)}について、取引銀行を通じて電子記録債権の発生記録が行われた。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '電子記録債権', amount: a }],
      credits: [{ account: '売掛金', amount: a }],
    }),
    explanation: '売掛金について発生記録が行われると、債権者は売掛金を「電子記録債権」に振り替えます。',
  }),
  notes({
    type: QuestionType.JOURNAL,
    textTemplate: (a, t) => `${t ?? '仕入先'}に対する買掛金${yen(a)}について、取引銀行を通じて電子記録債務の発生記録が行われた。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '買掛金', amount: a }],
      credits: [{ account: '電子記録債務', amount: a }],
    }),
    explanation: '買掛金について発生記録が行われると、債務者は買掛金を「電子記録債務」に振り替えます。',
  }),
  notes({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `所有する約束手形${yen(a)}が満期日に決済されず不渡りとなったため、償還請求のための費用${yen(floor(a * 0.01))}を現金で支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '不渡手形', amount: a + floor(a * 0.01) }],
      credits: [
        { account: '受取手形', amount: a },
        { account: '現金', amount: floor(a * 0.01) },
      ],
    }),
    explanation: '手形が不渡りとなった場合、償還請求費用を含めて「不渡手形」勘定に振り替えます。',
  }),
  notes({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `備品${yen(a)}を売却し、代金として相手先振出しの約束手形を受け取った（帳簿価額と同額で売却）。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '営業外受取手形', amount: a }],
      credits: [{ account: '備品', amount: a }],
    }),
    explanation: '商品売買以外の取引で受け取った手形は、通常の受取手形と区別して「営業外受取手形」で処理します。',
  }),
  notes({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `備品${yen(a)}を購入し、代金として約束手形を振り出した。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '備品', amount: a }],
      credits: [{ account: '営業外支払手形', amount: a }],
    }),
    explanation: '商品売買以外の取引で振り出した手形は、通常の支払手形と区別して「営業外支払手形」で処理します。',
  }),

  // ==================================================================
  // 商品売買（goods）
  // ==================================================================
  goods({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `商品${yen(a)}をクレジットカード払いの条件で販売した。信販会社への手数料（販売代金の4%）を計上する。`,
    generateJournalAnswer: (a) => ({
      debits: [
        { account: 'クレジット売掛金', amount: a - floor(a * 0.04) },
        { account: '支払手数料', amount: floor(a * 0.04) },
      ],
      credits: [{ account: '売上', amount: a }],
    }),
    explanation: 'クレジット販売では、信販会社への手数料を差し引いた純額を「クレジット売掛金」として計上します。',
  }),
  goods({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `商品（原価${yen(floor(a * 0.7))}）を${yen(a)}で掛け販売した。当社は売上原価対立法により記帳している。`,
    generateJournalAnswer: (a) => ({
      debits: [
        { account: '売掛金', amount: a },
        { account: '売上原価', amount: floor(a * 0.7) },
      ],
      credits: [
        { account: '売上', amount: a },
        { account: '商品', amount: floor(a * 0.7) },
      ],
    }),
    explanation: '売上原価対立法では、販売のつど売上を計上するとともに、商品を売上原価へ振り替えます。',
  }),
  goods({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `商品${yen(a)}を掛けで仕入れた。当社は売上原価対立法により、商品勘定で記帳している。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '商品', amount: a }],
      credits: [{ account: '買掛金', amount: a }],
    }),
    explanation: '売上原価対立法では、仕入時に商品（資産）を計上し、販売時に売上原価へ振り替えます。',
  }),

  // ==================================================================
  // 固定資産（fixed-assets）
  // ==================================================================
  fixedAssets({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `建物の建設を請け負わせ、工事代金の一部${yen(a)}を当座預金から支払った（工事は未完成）。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '建設仮勘定', amount: a }],
      credits: [{ account: '当座預金', amount: a }],
    }),
    explanation: '建設中の固定資産に対する支出は、完成までの間「建設仮勘定」で処理します。',
  }),
  fixedAssets({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `かねて建設中であった建物が完成して引き渡しを受けた。すでに建設仮勘定に${yen(a)}を計上している。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '建物', amount: a }],
      credits: [{ account: '建設仮勘定', amount: a }],
    }),
    explanation: '建設が完成し引渡しを受けたときは、建設仮勘定から「建物」など本来の固定資産勘定へ振り替えます。',
  }),
  fixedAssets({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `国庫補助金${yen(a)}を受けて取得した建物について、直接減額方式により圧縮記帳を行った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '固定資産圧縮損', amount: a }],
      credits: [{ account: '建物', amount: a }],
    }),
    explanation: '直接減額方式による圧縮記帳では、補助金相当額を「固定資産圧縮損」として計上し、固定資産の帳簿価額を減額します。',
  }),
  fixedAssets({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `火災により建物（帳簿価額${yen(a)}）が焼失した。この建物には火災保険が付されている。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '未決算', amount: a }],
      credits: [{ account: '建物', amount: a }],
    }),
    explanation: '保険が付された資産が焼失し保険金額が未確定のときは、帳簿価額を「未決算」勘定に振り替えます。',
  }),
  fixedAssets({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `火災で焼失した建物（未決算${yen(a)}）について、保険会社から保険金${yen(a + floor(a * 0.1))}を支払う旨の連絡を受けた。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '未収金', amount: a + floor(a * 0.1) }],
      credits: [
        { account: '未決算', amount: a },
        { account: '保険差益', amount: floor(a * 0.1) },
      ],
    }),
    explanation: '確定した保険金額が未決算の金額を上回る差額は「保険差益」（収益）として計上します。',
  }),

  // ==================================================================
  // リース取引（lease）
  // ==================================================================
  lease({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `備品についてファイナンス・リース契約を結んだ。リース料総額は${yen(a)}である（利子込み法）。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: 'リース資産', amount: a }],
      credits: [{ account: 'リース債務', amount: a }],
    }),
    explanation: '利子込み法では、リース料総額をもって「リース資産」と「リース債務」を計上します。',
  }),
  lease({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `ファイナンス・リース契約にもとづき、リース料${yen(a)}を当座預金から支払った（利子込み法）。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: 'リース債務', amount: a }],
      credits: [{ account: '当座預金', amount: a }],
    }),
    explanation: '利子込み法では、リース料の支払いによってリース債務を減少させます。',
  }),
  lease({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `オペレーティング・リース契約にもとづき、当期分のリース料${yen(a)}を当座預金から支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '支払リース料', amount: a }],
      credits: [{ account: '当座預金', amount: a }],
    }),
    explanation: 'オペレーティング・リースでは、資産・負債を計上せず、支払額を「支払リース料」（費用）として処理します。',
  }),
  lease({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算にあたり、ファイナンス・リースにより計上したリース資産について、減価償却費${yen(a)}を間接法で計上した。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '減価償却費', amount: a }],
      credits: [{ account: '減価償却累計額', amount: a }],
    }),
    explanation: 'リース資産も自己所有の固定資産と同様に減価償却を行います。',
  }),

  // ==================================================================
  // 無形固定資産・のれん（intangibles）
  // ==================================================================
  intangibles({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `自社利用目的のソフトウェア${yen(a)}を取得し、代金は当座預金から支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: 'ソフトウェア', amount: a }],
      credits: [{ account: '当座預金', amount: a }],
    }),
    explanation: '自社利用のソフトウェアは、無形固定資産として「ソフトウェア」勘定に計上します。',
  }),
  intangibles({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `ソフトウェアの制作を外部に依頼し、制作代金の一部${yen(a)}を当座預金から支払った（制作は未完成）。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: 'ソフトウェア仮勘定', amount: a }],
      credits: [{ account: '当座預金', amount: a }],
    }),
    explanation: '制作途中のソフトウェアに対する支出は、完成までの間「ソフトウェア仮勘定」で処理します。',
  }),
  intangibles({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `依頼していたソフトウェアが完成し使用を開始した。ソフトウェア仮勘定${yen(a)}を本勘定へ振り替える。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: 'ソフトウェア', amount: a }],
      credits: [{ account: 'ソフトウェア仮勘定', amount: a }],
    }),
    explanation: 'ソフトウェアが完成し使用を開始したときは、仮勘定から「ソフトウェア」へ振り替えます。',
  }),
  intangibles({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算にあたり、自社利用のソフトウェア（帳簿価額）について当期償却額${yen(a)}を計上した。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: 'ソフトウェア償却', amount: a }],
      credits: [{ account: 'ソフトウェア', amount: a }],
    }),
    explanation: 'ソフトウェアの償却は、直接法により「ソフトウェア償却」を計上し帳簿価額を直接減額します。',
  }),
  intangibles({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算にあたり、のれん（帳簿価額）について当期償却額${yen(a)}を計上した。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: 'のれん償却', amount: a }],
      credits: [{ account: 'のれん', amount: a }],
    }),
    explanation: 'のれんは取得後20年以内に定額法などで償却し、「のれん償却」を計上します。',
  }),
  intangibles({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `新製品の研究開発のための費用${yen(a)}を当座預金から支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '研究開発費', amount: a }],
      credits: [{ account: '当座預金', amount: a }],
    }),
    explanation: '研究開発に要した支出は、資産計上せず「研究開発費」（費用）として処理します。',
  }),

  // ==================================================================
  // 引当金（provisions）
  // ==================================================================
  provisions({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算にあたり、当期の負担に属する退職給付費用${yen(a)}を退職給付引当金に繰り入れた。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '退職給付費用', amount: a }],
      credits: [{ account: '退職給付引当金', amount: a }],
    }),
    explanation: '退職給付の当期負担分は「退職給付費用」として計上し、「退職給付引当金」を積み立てます。',
  }),
  provisions({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `従業員が退職し、退職一時金${yen(a)}を当座預金から支払った。退職給付引当金の残高は十分にある。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '退職給付引当金', amount: a }],
      credits: [{ account: '当座預金', amount: a }],
    }),
    explanation: '退職金の支払いは、すでに積み立てている「退職給付引当金」を取り崩して充当します。',
  }),
  provisions({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算にあたり、翌期に支給する賞与のうち当期負担分${yen(a)}を賞与引当金に繰り入れた。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '賞与引当金繰入', amount: a }],
      credits: [{ account: '賞与引当金', amount: a }],
    }),
    explanation: '翌期に支給する賞与の当期負担分は「賞与引当金繰入」を計上し、「賞与引当金」を設定します。',
  }),
  provisions({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算にあたり、翌期に予定される修繕に備えて修繕引当金${yen(a)}を設定した。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '修繕引当金繰入', amount: a }],
      credits: [{ account: '修繕引当金', amount: a }],
    }),
    explanation: '将来の修繕に備える見積額は「修繕引当金繰入」を計上し、「修繕引当金」を設定します。',
  }),
  provisions({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `建物の修繕を行い、代金${yen(a + floor(a * 0.2))}を当座預金から支払った。修繕引当金の残高は${yen(a)}である。`,
    generateJournalAnswer: (a) => ({
      debits: [
        { account: '修繕引当金', amount: a },
        { account: '修繕費', amount: floor(a * 0.2) },
      ],
      credits: [{ account: '当座預金', amount: a + floor(a * 0.2) }],
    }),
    explanation: '修繕を実施したときは、引当金を取り崩し、不足額は「修繕費」（費用）として処理します。',
  }),
  provisions({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算にあたり、販売した商品の品質保証に備えて商品保証引当金${yen(a)}を設定した。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '商品保証引当金繰入', amount: a }],
      credits: [{ account: '商品保証引当金', amount: a }],
    }),
    explanation: '将来の無償修理に備える見積額は「商品保証引当金繰入」を計上し、「商品保証引当金」を設定します。',
  }),
  provisions({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `販売済み商品について無償修理を行い、費用${yen(a)}を現金で支払った。商品保証引当金の残高は十分にある。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '商品保証引当金', amount: a }],
      credits: [{ account: '現金', amount: a }],
    }),
    explanation: '保証にもとづく無償修理費用は、設定済みの「商品保証引当金」を取り崩して充当します。',
  }),

  // ==================================================================
  // 純資産・株式（net-assets）
  // ==================================================================
  netAssets({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `新株を発行し、払込金${yen(a)}が当座預金に払い込まれた。会社法が認める最低限度額を資本金とし、残額は資本準備金とした。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '当座預金', amount: a }],
      credits: [
        { account: '資本金', amount: a - floor(a / 2) },
        { account: '資本準備金', amount: floor(a / 2) },
      ],
    }),
    explanation: '会社法では払込金額の2分の1までを資本金としないことが認められ、その額は「資本準備金」とします。',
  }),
  netAssets({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `株主総会において、繰越利益剰余金を財源として配当金${yen(a)}の支払いと、利益準備金${yen(floor(a * 0.1))}の積立てを決議した。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '繰越利益剰余金', amount: a + floor(a * 0.1) }],
      credits: [
        { account: '未払配当金', amount: a },
        { account: '利益準備金', amount: floor(a * 0.1) },
      ],
    }),
    explanation: '配当の決議時は未払配当金（負債）を計上し、あわせて利益準備金を積み立て、繰越利益剰余金を取り崩します。',
  }),
  netAssets({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `会社の設立にあたり、株式を発行して払込金${yen(a)}が当座預金に払い込まれた。払込金の全額を資本金とする。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '当座預金', amount: a }],
      credits: [{ account: '資本金', amount: a }],
    }),
    explanation: '原則として払込金額の全額を資本金とします。',
  }),
  netAssets({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `会社の設立準備のために要した諸費用${yen(a)}を現金で支払った。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '創立費', amount: a }],
      credits: [{ account: '現金', amount: a }],
    }),
    explanation: '会社設立までに要した費用は「創立費」として処理します。',
  }),
  netAssets({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `増資のため新株を発行するにあたり、申込証拠金${yen(a)}を受け取り、別段預金とした。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '別段預金', amount: a }],
      credits: [{ account: '株式申込証拠金', amount: a }],
    }),
    explanation: '株式の申込時に受け取った証拠金は「株式申込証拠金」とし、払込金は「別段預金」で管理します。',
  }),
  netAssets({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `株式の払込期日となり、株式申込証拠金${yen(a)}を全額資本金に振り替えた。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '株式申込証拠金', amount: a }],
      credits: [{ account: '資本金', amount: a }],
    }),
    explanation: '払込期日に、株式申込証拠金を資本金（および資本準備金）へ振り替えます。',
  }),
  netAssets({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `株式の発行に直接要した費用${yen(a)}を当座預金から支払った（増資に伴うもの）。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '株式交付費', amount: a }],
      credits: [{ account: '当座預金', amount: a }],
    }),
    explanation: '増資などで株式を発行する際に直接要した費用は「株式交付費」として処理します。',
  }),
  netAssets({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `株主総会において、繰越利益剰余金${yen(a)}を別途積立金として積み立てることを決議した。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '繰越利益剰余金', amount: a }],
      credits: [{ account: '別途積立金', amount: a }],
    }),
    explanation: '任意積立金である「別途積立金」を積み立てるときは、繰越利益剰余金を振り替えます。',
  }),

  // ==================================================================
  // 税金・税効果会計（tax）
  // ==================================================================
  tax({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算において、損金不算入となる将来減算一時差異${yen(a)}が生じた。法定実効税率30%として税効果会計を適用する。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '繰延税金資産', amount: floor(a * 0.3) }],
      credits: [{ account: '法人税等調整額', amount: floor(a * 0.3) }],
    }),
    explanation: '将来減算一時差異に実効税率を乗じた額を「繰延税金資産」とし、相手勘定は「法人税等調整額」とします。',
  }),
  tax({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算にあたり、その他有価証券（取得原価${yen(a)}）を時価${yen(a + floor(a * 0.1))}に評価替えした。実効税率30%で税効果を適用する（全部純資産直入法）。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: 'その他有価証券', amount: floor(a * 0.1) }],
      credits: [
        { account: '繰延税金負債', amount: floor(floor(a * 0.1) * 0.3) },
        { account: 'その他有価証券評価差額金', amount: floor(a * 0.1) - floor(floor(a * 0.1) * 0.3) },
      ],
    }),
    explanation: 'その他有価証券の評価差益に対しては、税効果分を「繰延税金負債」とし、残額を評価差額金とします。',
  }),
  tax({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `商品${yen(a)}を掛けで販売し、消費税10%を含めて請求した（税抜方式）。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '売掛金', amount: a + floor(a * 0.1) }],
      credits: [
        { account: '売上', amount: a },
        { account: '仮受消費税', amount: floor(a * 0.1) },
      ],
    }),
    explanation: '税抜方式では、受け取った消費税を「仮受消費税」として売上と区分して計上します。',
  }),
  tax({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `商品${yen(a)}を掛けで仕入れ、消費税10%を含めて支払う（税抜方式）。`,
    generateJournalAnswer: (a) => ({
      debits: [
        { account: '仕入', amount: a },
        { account: '仮払消費税', amount: floor(a * 0.1) },
      ],
      credits: [{ account: '買掛金', amount: a + floor(a * 0.1) }],
    }),
    explanation: '税抜方式では、支払った消費税を「仮払消費税」として仕入と区分して計上します。',
  }),
  tax({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `税務調査により、前期の法人税${yen(a)}の追徴を受け、後日納付することとした。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '法人税、住民税及び事業税', amount: a }],
      credits: [{ account: '未払法人税等', amount: a }],
    }),
    explanation: '過年度の法人税の追徴額は「法人税、住民税及び事業税」に含めて計上し、未納額は「未払法人税等」とします。',
  }),

  // ==================================================================
  // 外貨建取引（forex）
  // ==================================================================
  forex({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `外貨建ての買掛金${yen(a)}を当座預金から決済した。取引時より円高が進み、決済額は${yen(a - floor(a * 0.05))}であった。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '買掛金', amount: a }],
      credits: [
        { account: '当座預金', amount: a - floor(a * 0.05) },
        { account: '為替差損益', amount: floor(a * 0.05) },
      ],
    }),
    explanation: '外貨建債務の決済で支払額が帳簿価額より少なくなった差額は、為替差益（為替差損益の貸方）とします。',
  }),
  forex({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `外貨建ての買掛金${yen(a)}を当座預金から決済した。取引時より円安が進み、決済額は${yen(a + floor(a * 0.05))}であった。`,
    generateJournalAnswer: (a) => ({
      debits: [
        { account: '買掛金', amount: a },
        { account: '為替差損益', amount: floor(a * 0.05) },
      ],
      credits: [{ account: '当座預金', amount: a + floor(a * 0.05) }],
    }),
    explanation: '外貨建債務の決済で支払額が帳簿価額より多くなった差額は、為替差損（為替差損益の借方）とします。',
  }),
  forex({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算にあたり、外貨建ての売掛金（帳簿価額${yen(a)}）を決算時の為替相場で換算替えした。換算後の金額は${yen(a + floor(a * 0.05))}である。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '売掛金', amount: floor(a * 0.05) }],
      credits: [{ account: '為替差損益', amount: floor(a * 0.05) }],
    }),
    explanation: '決算時に外貨建金銭債権債務を換算替えし、生じた差額は「為替差損益」で処理します。',
  }),
  forex({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `決算にあたり、外貨建ての買掛金（帳簿価額${yen(a)}）を決算時の為替相場で換算替えした。円安により換算後の金額は${yen(a + floor(a * 0.05))}となった。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '為替差損益', amount: floor(a * 0.05) }],
      credits: [{ account: '買掛金', amount: floor(a * 0.05) }],
    }),
    explanation: '決算時に外貨建買掛金が円安で増加した差額は、為替差損（為替差損益の借方）として処理します。',
  }),

  // ==================================================================
  // 本支店会計（branch）
  // ==================================================================
  branch({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `本店は、支店の運営資金として現金${yen(a)}を支店へ送付した。（本店側の仕訳）`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '支店', amount: a }],
      credits: [{ account: '現金', amount: a }],
    }),
    explanation: '本支店会計では、本店が支店へ資産を送付すると、本店側は「支店」勘定（資産）を増加させます。',
  }),
  branch({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `支店は、本店から運営資金として現金${yen(a)}の送付を受けた。（支店側の仕訳）`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '現金', amount: a }],
      credits: [{ account: '本店', amount: a }],
    }),
    explanation: '支店側では、本店から資産の送付を受けると「本店」勘定（本店に対する持分）を増加させます。',
  }),
  branch({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `本店は、商品（原価${yen(a)}）を支店へ発送した。当社は原価で振り替えている。（本店側の仕訳）`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '支店', amount: a }],
      credits: [{ account: '仕入', amount: a }],
    }),
    explanation: '本店が支店へ商品を原価で送付したときは、本店側で仕入を減少させ「支店」勘定を増加させます。',
  }),
  branch({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `支店は、本店の買掛金${yen(a)}を現金で立替払いした。（支店側の仕訳）`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '本店', amount: a }],
      credits: [{ account: '現金', amount: a }],
    }),
    explanation: '支店が本店の債務を支払ったときは、支店側で「本店」勘定を減少させます。',
  }),

  // ==================================================================
  // サービス業・決算（service-closing）
  // ==================================================================
  service({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `かねて仕掛品として計上していた役務提供が完了し、対価${yen(a)}を現金で受け取った。あわせて対応する役務原価${yen(floor(a * 0.6))}を仕掛品から振り替える。`,
    generateJournalAnswer: (a) => ({
      debits: [
        { account: '現金', amount: a },
        { account: '役務原価', amount: floor(a * 0.6) },
      ],
      credits: [
        { account: '役務収益', amount: a },
        { account: '仕掛品', amount: floor(a * 0.6) },
      ],
    }),
    explanation: 'サービス業では、役務の提供完了時に役務収益を計上し、対応するコストを仕掛品から役務原価へ振り替えます。',
  }),
  service({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `サービスの提供に先立ち、顧客から対価${yen(a)}を現金で受け取った（役務は未提供）。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '現金', amount: a }],
      credits: [{ account: '前受金', amount: a }],
    }),
    explanation: '役務の提供前に受け取った対価は、収益ではなく「前受金」（負債）として計上します。',
  }),
  service({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `役務の提供のために直接要した給料${yen(a)}を仕掛品に振り替えた。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '仕掛品', amount: a }],
      credits: [{ account: '給料', amount: a }],
    }),
    explanation: '役務提供のために直接要したコストは、いったん「仕掛品」に集計します。',
  }),

  // ==================================================================
  // 連結会計（consolidation）
  // ==================================================================
  consolidation({
    type: QuestionType.JOURNAL,
    textTemplate: (a) =>
      `支配獲得日における連結修正仕訳を行う。S社（100%子会社）の資本は資本金${yen(a)}・資本剰余金${yen(floor(a * 0.3))}・利益剰余金${yen(floor(a * 0.2))}であり、P社はS社株式を${yen(a + floor(a * 0.3) + floor(a * 0.2) + floor(a * 0.1))}で取得している。`,
    generateJournalAnswer: (a) => ({
      debits: [
        { account: '資本金', amount: a },
        { account: '資本剰余金', amount: floor(a * 0.3) },
        { account: '利益剰余金', amount: floor(a * 0.2) },
        { account: 'のれん', amount: floor(a * 0.1) },
      ],
      credits: [{ account: '子会社株式', amount: a + floor(a * 0.3) + floor(a * 0.2) + floor(a * 0.1) }],
    }),
    explanation: '投資と資本の相殺消去では、子会社の資本と子会社株式を相殺し、差額を「のれん」とします。',
  }),
  consolidation({
    type: QuestionType.JOURNAL,
    textTemplate: (a) =>
      `支配獲得日の連結修正仕訳を行う。S社の資本合計は${yen(a)}（すべて資本金）であり、P社は80%を${yen(floor(a * 0.8) + floor(a * 0.05))}で取得した。`,
    generateJournalAnswer: (a) => ({
      debits: [
        { account: '資本金', amount: a },
        { account: 'のれん', amount: floor(a * 0.05) },
      ],
      credits: [
        { account: '子会社株式', amount: floor(a * 0.8) + floor(a * 0.05) },
        { account: '非支配株主持分', amount: a - floor(a * 0.8) },
      ],
    }),
    explanation: '子会社の資本のうち親会社持分を子会社株式と相殺し、非支配株主持分を計上、差額をのれんとします。',
  }),
  consolidation({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `連結決算にあたり、支配獲得時に計上したのれんについて、当期償却額${yen(a)}を計上する。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: 'のれん償却', amount: a }],
      credits: [{ account: 'のれん', amount: a }],
    }),
    explanation: '連結上ののれんは、原則として20年以内に定額法で償却し「のれん償却」を計上します。',
  }),
  consolidation({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `連結決算にあたり、S社（P社の80%子会社）が計上した当期純利益${yen(a)}のうち、非支配株主に帰属する部分を振り替える。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '非支配株主に帰属する当期純利益', amount: floor(a * 0.2) }],
      credits: [{ account: '非支配株主持分', amount: floor(a * 0.2) }],
    }),
    explanation: '子会社の当期純利益のうち非支配株主の持分割合を、非支配株主持分へ振り替えます。',
  }),
  consolidation({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `連結決算にあたり、S社（P社の80%子会社）が行った配当金${yen(a)}の修正を行う。`,
    generateJournalAnswer: (a) => ({
      debits: [
        { account: '受取配当金', amount: floor(a * 0.8) },
        { account: '非支配株主持分', amount: a - floor(a * 0.8) },
      ],
      credits: [{ account: '利益剰余金', amount: a }],
    }),
    explanation: '子会社の配当は、親会社の受取配当金と非支配株主持分を相殺し、剰余金の減少を取り消します。',
  }),
  consolidation({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `連結決算にあたり、当期のP社からS社への売上高${yen(a)}（連結会社間の内部取引）を相殺消去する。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '売上', amount: a }],
      credits: [{ account: '売上原価', amount: a }],
    }),
    explanation: '連結会社間の商品売買は内部取引のため、売上高と売上原価を相殺消去します。',
  }),
  consolidation({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `連結決算にあたり、S社の期末商品に含まれるP社からの仕入分に係る未実現利益${yen(floor(a * 0.2))}を消去する。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '売上原価', amount: floor(a * 0.2) }],
      credits: [{ account: '商品', amount: floor(a * 0.2) }],
    }),
    explanation: '連結会社から仕入れた期末商品に含まれる未実現利益は、売上原価を増加させ商品を減額して消去します。',
  }),
  consolidation({
    type: QuestionType.JOURNAL,
    textTemplate: (a) => `連結決算にあたり、連結会社間の債権債務（P社の売掛金とS社の買掛金）${yen(a)}を相殺消去する。`,
    generateJournalAnswer: (a) => ({
      debits: [{ account: '買掛金', amount: a }],
      credits: [{ account: '売掛金', amount: a }],
    }),
    explanation: '連結会社間の債権債務は、連結上は存在しないため相殺消去します。',
  }),
];
