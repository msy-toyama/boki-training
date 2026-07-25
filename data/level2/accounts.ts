import { AccountCategory } from '../../types';

// 日商簿記2級で新たに登場する勘定科目（3級には無いもののみ）。
// 3級と共通の勘定（現金・売掛金・仕入・売上・当座預金・受取手形 等）はここには含めない。
// また、3級の ACCOUNT_DEFINITIONS に既にある2級寄りの勘定
// （売買目的有価証券・有価証券売却益/損・手形売却損・電子記録債権/債務・資本金・
//  資本準備金・利益準備金・繰越利益剰余金・未払配当金・クレジット売掛金・不渡手形・
//  受取配当金・償却債権取立益・商品 等）もここには重複記載しない。
//
// ここに列挙した勘定は constants.ts の ACCOUNT_TITLES へ統合され、
// かつ problemScopeService の3級除外セットにも自動登録されることで、
// 3級モードの誤答選択肢には一切登場しないよう保証する。
export const LEVEL2_ACCOUNT_DEFINITIONS: { name: string; category: AccountCategory }[] = [
  // ===== 資産 =====
  // 有価証券・投資
  { name: '満期保有目的債券', category: 'Asset' },
  { name: '子会社株式', category: 'Asset' },
  { name: '関連会社株式', category: 'Asset' },
  { name: 'その他有価証券', category: 'Asset' },
  { name: '投資有価証券', category: 'Asset' },
  // 税効果
  { name: '繰延税金資産', category: 'Asset' },
  { name: '未収還付法人税等', category: 'Asset' },
  // 債権・手形
  { name: '営業外受取手形', category: 'Asset' },
  // 固定資産・無形固定資産
  { name: '建設仮勘定', category: 'Asset' },
  { name: 'リース資産', category: 'Asset' },
  { name: 'ソフトウェア', category: 'Asset' },
  { name: 'ソフトウェア仮勘定', category: 'Asset' },
  { name: 'のれん', category: 'Asset' },
  { name: '未決算', category: 'Asset' },
  { name: '別段預金', category: 'Asset' },
  // 本支店会計（本店から見た支店）
  { name: '支店', category: 'Asset' },
  // 工業簿記（棚卸資産・原価）
  { name: '材料', category: 'Asset' },
  { name: '仕掛品', category: 'Asset' },
  { name: '製品', category: 'Asset' },
  { name: '副産物', category: 'Asset' },
  // 本社工場会計（本社から見た工場）
  { name: '工場', category: 'Asset' },

  // ===== 負債 =====
  { name: '営業外支払手形', category: 'Liability' },
  { name: 'リース債務', category: 'Liability' },
  { name: '繰延税金負債', category: 'Liability' },
  { name: '修繕引当金', category: 'Liability' },
  { name: '賞与引当金', category: 'Liability' },
  { name: '退職給付引当金', category: 'Liability' },
  { name: '商品保証引当金', category: 'Liability' },

  // ===== 純資産 =====
  { name: 'その他資本剰余金', category: 'NetAsset' },
  { name: '資本剰余金', category: 'NetAsset' },
  { name: '利益剰余金', category: 'NetAsset' },
  { name: '別途積立金', category: 'NetAsset' },
  { name: '新築積立金', category: 'NetAsset' },
  { name: '非支配株主持分', category: 'NetAsset' },
  { name: 'その他有価証券評価差額金', category: 'NetAsset' },
  { name: '株式申込証拠金', category: 'NetAsset' },
  // 本支店会計（支店から見た本店）
  { name: '本店', category: 'NetAsset' },
  // 本社工場会計（工場から見た本社）
  { name: '本社', category: 'NetAsset' },

  // ===== 収益 =====
  { name: '役務収益', category: 'Revenue' },
  { name: '有価証券利息', category: 'Revenue' },
  { name: '有価証券評価益', category: 'Revenue' },
  { name: '保険差益', category: 'Revenue' },
  { name: '負ののれん発生益', category: 'Revenue' },

  // ===== 費用 =====
  // 商業（有価証券・無形固定資産・引当金・純資産・税・外貨）
  { name: '役務原価', category: 'Expense' },
  { name: '電子記録債権売却損', category: 'Expense' },
  { name: '法人税等調整額', category: 'Expense' },
  { name: '有価証券評価損', category: 'Expense' },
  { name: 'のれん償却', category: 'Expense' },
  { name: 'ソフトウェア償却', category: 'Expense' },
  { name: '研究開発費', category: 'Expense' },
  { name: '退職給付費用', category: 'Expense' },
  { name: '賞与引当金繰入', category: 'Expense' },
  { name: '修繕引当金繰入', category: 'Expense' },
  { name: '商品保証引当金繰入', category: 'Expense' },
  { name: '支払リース料', category: 'Expense' },
  { name: '固定資産圧縮損', category: 'Expense' },
  { name: '火災損失', category: 'Expense' },
  { name: '創立費', category: 'Expense' },
  { name: '開業費', category: 'Expense' },
  { name: '株式交付費', category: 'Expense' },
  { name: '為替差損益', category: 'Expense' },
  // 連結会計
  { name: '非支配株主に帰属する当期純利益', category: 'Expense' },
  // 工業（原価・差異）
  { name: '製造間接費', category: 'Expense' },
  { name: '賃金', category: 'Expense' },
  { name: '売上原価', category: 'Expense' },
  { name: '材料副費', category: 'Expense' },
  { name: '製造間接費配賦差異', category: 'Expense' },
  { name: '賃率差異', category: 'Expense' },
  { name: '材料消費価格差異', category: 'Expense' },
  { name: '予算差異', category: 'Expense' },
  { name: '操業度差異', category: 'Expense' },
  { name: '能率差異', category: 'Expense' },
  { name: '仕損費', category: 'Expense' },
];

export const LEVEL2_ACCOUNT_TITLES: string[] = LEVEL2_ACCOUNT_DEFINITIONS.map(d => d.name);
