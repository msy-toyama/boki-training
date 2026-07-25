import { JournalEntryAnswer, StatementProblemData, StatementTrialBalanceRow } from '../types';

const yen = (amount: number): string => `${Math.round(amount).toLocaleString()}円`;

const amount = (base: number, multiplier: number): number => Math.round(base * multiplier);

const trialDebit = (account: string, value: number): StatementTrialBalanceRow => ({
  account,
  debit: amount(value, 1),
});

const trialCredit = (account: string, value: number): StatementTrialBalanceRow => ({
  account,
  credit: amount(value, 1),
});

const totalDebits = (rows: StatementTrialBalanceRow[]): number => (
  rows.reduce((total, row) => total + (row.debit ?? 0), 0)
);

const totalCredits = (rows: StatementTrialBalanceRow[]): number => (
  rows.reduce((total, row) => total + (row.credit ?? 0), 0)
);

const balanceWithCapital = (rowsWithoutCapital: StatementTrialBalanceRow[]): StatementTrialBalanceRow[] => {
  const capital = totalDebits(rowsWithoutCapital) - totalCredits(rowsWithoutCapital);
  return [
    ...rowsWithoutCapital,
    trialCredit('資本金', capital),
  ];
};

const journal = (debits: JournalEntryAnswer['debits'], credits: JournalEntryAnswer['credits']): JournalEntryAnswer => ({
  debits,
  credits,
});

export const createClosingWorksheetStatementData = (base: number, target = '当社'): StatementProblemData => {
  const cash = amount(base, 9);
  const accountsReceivable = amount(base, 20);
  const allowanceBefore = amount(base, 0.2);
  const beginningInventory = amount(base, 4);
  const purchases = amount(base, 26);
  const equipment = amount(base, 30);
  const accumulatedDepreciationBefore = amount(base, 6);
  const accountsPayable = amount(base, 10);
  const sales = amount(base, 75);
  const salaries = amount(base, 8);
  const rentExpense = amount(base, 6);
  const insuranceExpenseBefore = amount(base, 3);

  const endingInventory = amount(base, 6);
  const costOfGoodsSold = beginningInventory + purchases - endingInventory;
  const allowanceTarget = amount(base, 0.4);
  const allowanceExpense = allowanceTarget - allowanceBefore;
  const depreciation = amount(base, 4);
  const accumulatedDepreciationAfter = accumulatedDepreciationBefore + depreciation;
  const prepaidInsurance = amount(base, 1);
  const insuranceExpenseAfter = insuranceExpenseBefore - prepaidInsurance;
  const netIncome = sales - costOfGoodsSold - salaries - rentExpense - insuranceExpenseAfter - allowanceExpense - depreciation;
  const totalAssets = cash + accountsReceivable - allowanceTarget + endingInventory + equipment - accumulatedDepreciationAfter + prepaidInsurance;
  const trialRows = balanceWithCapital([
    trialDebit('現金', cash),
    trialDebit('売掛金', accountsReceivable),
    trialDebit('繰越商品', beginningInventory),
    trialDebit('仕入', purchases),
    trialDebit('備品', equipment),
    trialDebit('給料', salaries),
    trialDebit('支払家賃', rentExpense),
    trialDebit('支払保険料', insuranceExpenseBefore),
    trialCredit('貸倒引当金', allowanceBefore),
    trialCredit('減価償却累計額', accumulatedDepreciationBefore),
    trialCredit('買掛金', accountsPayable),
    trialCredit('売上', sales),
  ]);
  const capital = trialRows.find(row => row.account === '資本金')?.credit ?? 0;

  return {
    mode: 'closing_entries',
    title: '決算整理仕訳から精算表へ',
    description: `${target}の決算整理前残高試算表と決算整理事項にもとづいて、決算整理仕訳を行い、精算表の主要空欄を作成します。`,
    materials: [
      { label: '会計期間', value: 'X1年4月1日からX2年3月31日まで' },
      { label: '決算日', value: 'X2年3月31日' },
      { label: '商品売買の記帳方法', value: '三分法' },
    ],
    trialBalance: trialRows,
    adjustmentItems: [
      { label: '1', text: `期末商品棚卸高は${yen(endingInventory)}である。売上原価は仕入の行で計算する。` },
      { label: '2', text: `売掛金の期末残高に対して2%の貸倒引当金を差額補充法で設定する。` },
      { label: '3', text: `備品について当期の減価償却費${yen(depreciation)}を間接法で計上する。` },
      { label: '4', text: `支払保険料のうち${yen(prepaidInsurance)}は翌期分である。` },
    ],
    requirements: [
      'まず決算整理仕訳の金額を作る',
      '整理後の損益計算書欄と貸借対照表欄に必要な金額を作る',
      '当期純利益が貸借対照表側の純資産増加と一致することを確認する',
    ],
    blanks: [
      { id: 'entry-beginning-inventory', section: '決算整理仕訳', label: '(借) 仕入 / (貸) 繰越商品', hint: '期首商品を仕入へ振り替える' },
      { id: 'entry-ending-inventory', section: '決算整理仕訳', label: '(借) 繰越商品 / (貸) 仕入', hint: '期末商品を資産へ振り替える' },
      { id: 'entry-allowance-expense', section: '決算整理仕訳', label: '(借) 貸倒引当金繰入 / (貸) 貸倒引当金' },
      { id: 'entry-depreciation', section: '決算整理仕訳', label: '(借) 減価償却費 / (貸) 減価償却累計額' },
      { id: 'entry-prepaid-insurance', section: '決算整理仕訳', label: '(借) 前払保険料 / (貸) 支払保険料' },
      { id: 'worksheet-cogs', section: '精算表 損益計算書欄', label: '売上原価' },
      { id: 'worksheet-insurance-expense', section: '精算表 損益計算書欄', label: '支払保険料' },
      { id: 'worksheet-net-income', section: '精算表 損益計算書欄', label: '当期純利益' },
      { id: 'worksheet-inventory', section: '精算表 貸借対照表欄', label: '繰越商品' },
      { id: 'worksheet-total-assets', section: '精算表 貸借対照表欄', label: '資産合計', hint: '売掛金は貸倒引当金を控除し、備品は累計額を控除する' },
    ],
    correctAnswers: {
      'entry-beginning-inventory': beginningInventory,
      'entry-ending-inventory': endingInventory,
      'entry-allowance-expense': allowanceExpense,
      'entry-depreciation': depreciation,
      'entry-prepaid-insurance': prepaidInsurance,
      'worksheet-cogs': costOfGoodsSold,
      'worksheet-insurance-expense': insuranceExpenseAfter,
      'worksheet-net-income': netIncome,
      'worksheet-inventory': endingInventory,
      'worksheet-total-assets': totalAssets,
    },
    closingEntries: [
      journal([{ account: '仕入', amount: beginningInventory }], [{ account: '繰越商品', amount: beginningInventory }]),
      journal([{ account: '繰越商品', amount: endingInventory }], [{ account: '仕入', amount: endingInventory }]),
      journal([{ account: '貸倒引当金繰入', amount: allowanceExpense }], [{ account: '貸倒引当金', amount: allowanceExpense }]),
      journal([{ account: '減価償却費', amount: depreciation }], [{ account: '減価償却累計額', amount: depreciation }]),
      journal([{ account: '前払保険料', amount: prepaidInsurance }], [{ account: '支払保険料', amount: prepaidInsurance }]),
    ],
    explanationRows: [
      { label: '売上原価', formula: `${yen(beginningInventory)} + ${yen(purchases)} - ${yen(endingInventory)}`, amount: costOfGoodsSold },
      { label: '貸倒引当金繰入', formula: `${yen(accountsReceivable)} × 2% - ${yen(allowanceBefore)}`, amount: allowanceExpense },
      { label: '支払保険料', formula: `${yen(insuranceExpenseBefore)} - ${yen(prepaidInsurance)}`, amount: insuranceExpenseAfter },
      { label: '当期純利益', formula: `${yen(sales)} - 費用合計${yen(sales - netIncome)}`, amount: netIncome },
      { label: '資産合計', formula: `現金 + 売掛金純額 + 繰越商品 + 備品純額 + 前払保険料`, amount: totalAssets },
    ],
    integrityChecks: [
      { label: '決算整理前残高試算表', left: totalDebits(trialRows), right: totalCredits(trialRows) },
      { label: '貸借対照表', left: totalAssets, right: accountsPayable + capital + netIncome },
    ],
  };
};

export const createWorksheetStatementData = (base: number, target = '当社'): StatementProblemData => {
  const cash = amount(base, 12);
  const accountsReceivable = amount(base, 30);
  const allowanceBefore = amount(base, 0.4);
  const beginningInventory = amount(base, 4);
  const purchases = amount(base, 35);
  const equipment = amount(base, 45);
  const accumulatedDepreciationBefore = amount(base, 12);
  const accountsPayable = amount(base, 14);
  const loanPayable = amount(base, 20);
  const sales = amount(base, 95);
  const salaries = amount(base, 10);
  const rentExpense = amount(base, 5);
  const insuranceExpenseBefore = amount(base, 6);
  const interestExpenseBefore = amount(base, 1);

  const endingInventory = amount(base, 7);
  const costOfGoodsSold = beginningInventory + purchases - endingInventory;
  const allowanceTarget = amount(base, 0.6);
  const allowanceExpense = allowanceTarget - allowanceBefore;
  const depreciation = amount(base, 5);
  const accumulatedDepreciationAfter = accumulatedDepreciationBefore + depreciation;
  const prepaidInsurance = amount(base, 2);
  const insuranceExpenseAfter = insuranceExpenseBefore - prepaidInsurance;
  const accruedInterest = amount(base, 0.5);
  const interestExpenseAfter = interestExpenseBefore + accruedInterest;
  const totalExpenses = costOfGoodsSold + allowanceExpense + depreciation + insuranceExpenseAfter + salaries + rentExpense + interestExpenseAfter;
  const netIncome = sales - totalExpenses;
  const totalAssets = cash + accountsReceivable - allowanceTarget + endingInventory + equipment - accumulatedDepreciationAfter + prepaidInsurance;
  const totalLiabilities = accountsPayable + loanPayable + accruedInterest;
  const trialRows = balanceWithCapital([
    trialDebit('現金', cash),
    trialDebit('売掛金', accountsReceivable),
    trialDebit('繰越商品', beginningInventory),
    trialDebit('仕入', purchases),
    trialDebit('備品', equipment),
    trialDebit('給料', salaries),
    trialDebit('支払家賃', rentExpense),
    trialDebit('支払保険料', insuranceExpenseBefore),
    trialDebit('支払利息', interestExpenseBefore),
    trialCredit('貸倒引当金', allowanceBefore),
    trialCredit('減価償却累計額', accumulatedDepreciationBefore),
    trialCredit('買掛金', accountsPayable),
    trialCredit('借入金', loanPayable),
    trialCredit('売上', sales),
  ]);
  const capital = trialRows.find(row => row.account === '資本金')?.credit ?? 0;

  return {
    mode: 'worksheet',
    title: '第3問形式 精算表の作成',
    description: `${target}の決算整理前残高試算表と決算整理事項等にもとづいて、精算表の決算整理欄・損益計算書欄・貸借対照表欄を作成します。`,
    materials: [
      { label: '会計期間', value: 'X1年4月1日からX2年3月31日まで' },
      { label: '決算日', value: 'X2年3月31日' },
      { label: '商品売買の記帳方法', value: '三分法' },
    ],
    trialBalance: trialRows,
    adjustmentItems: [
      { label: '1', text: `期末商品棚卸高は${yen(endingInventory)}である。売上原価は仕入の行で計算する。` },
      { label: '2', text: `売掛金の期末残高に対して2%の貸倒引当金を差額補充法で設定する。` },
      { label: '3', text: `備品の当期減価償却費${yen(depreciation)}を間接法で計上する。` },
      { label: '4', text: `支払保険料のうち${yen(prepaidInsurance)}は翌期分である。` },
      { label: '5', text: `借入金の利息${yen(accruedInterest)}が未払いである。` },
    ],
    requirements: [
      '決算整理仕訳の金額を求める',
      '精算表の損益計算書欄と貸借対照表欄へ整理後金額を振り分ける',
      '当期純利益を損益計算書欄と貸借対照表欄で一致させる',
    ],
    blanks: [
      { id: 'entry-beginning-inventory', section: '決算整理仕訳', label: '(借) 仕入 / (貸) 繰越商品' },
      { id: 'entry-ending-inventory', section: '決算整理仕訳', label: '(借) 繰越商品 / (貸) 仕入' },
      { id: 'entry-allowance-expense', section: '決算整理仕訳', label: '(借) 貸倒引当金繰入 / (貸) 貸倒引当金' },
      { id: 'entry-depreciation', section: '決算整理仕訳', label: '(借) 減価償却費 / (貸) 減価償却累計額' },
      { id: 'entry-prepaid-insurance', section: '決算整理仕訳', label: '(借) 前払保険料 / (貸) 支払保険料' },
      { id: 'entry-accrued-interest', section: '決算整理仕訳', label: '(借) 支払利息 / (貸) 未払費用' },
      { id: 'pl-sales', section: '精算表 損益計算書欄', label: '売上' },
      { id: 'pl-cogs', section: '精算表 損益計算書欄', label: '売上原価' },
      { id: 'pl-insurance-expense', section: '精算表 損益計算書欄', label: '支払保険料' },
      { id: 'pl-interest-expense', section: '精算表 損益計算書欄', label: '支払利息' },
      { id: 'pl-net-income', section: '精算表 損益計算書欄', label: '当期純利益' },
      { id: 'bs-inventory', section: '精算表 貸借対照表欄', label: '繰越商品' },
      { id: 'bs-allowance', section: '精算表 貸借対照表欄', label: '貸倒引当金' },
      { id: 'bs-prepaid-insurance', section: '精算表 貸借対照表欄', label: '前払保険料' },
      { id: 'bs-accrued-interest', section: '精算表 貸借対照表欄', label: '未払費用' },
      { id: 'bs-net-income', section: '精算表 貸借対照表欄', label: '当期純利益' },
    ],
    correctAnswers: {
      'entry-beginning-inventory': beginningInventory,
      'entry-ending-inventory': endingInventory,
      'entry-allowance-expense': allowanceExpense,
      'entry-depreciation': depreciation,
      'entry-prepaid-insurance': prepaidInsurance,
      'entry-accrued-interest': accruedInterest,
      'pl-sales': sales,
      'pl-cogs': costOfGoodsSold,
      'pl-insurance-expense': insuranceExpenseAfter,
      'pl-interest-expense': interestExpenseAfter,
      'pl-net-income': netIncome,
      'bs-inventory': endingInventory,
      'bs-allowance': allowanceTarget,
      'bs-prepaid-insurance': prepaidInsurance,
      'bs-accrued-interest': accruedInterest,
      'bs-net-income': netIncome,
    },
    closingEntries: [
      journal([{ account: '仕入', amount: beginningInventory }], [{ account: '繰越商品', amount: beginningInventory }]),
      journal([{ account: '繰越商品', amount: endingInventory }], [{ account: '仕入', amount: endingInventory }]),
      journal([{ account: '貸倒引当金繰入', amount: allowanceExpense }], [{ account: '貸倒引当金', amount: allowanceExpense }]),
      journal([{ account: '減価償却費', amount: depreciation }], [{ account: '減価償却累計額', amount: depreciation }]),
      journal([{ account: '前払保険料', amount: prepaidInsurance }], [{ account: '支払保険料', amount: prepaidInsurance }]),
      journal([{ account: '支払利息', amount: accruedInterest }], [{ account: '未払費用', amount: accruedInterest }]),
    ],
    explanationRows: [
      { label: '売上原価', formula: `${yen(beginningInventory)} + ${yen(purchases)} - ${yen(endingInventory)}`, amount: costOfGoodsSold },
      { label: '貸倒引当金繰入', formula: `${yen(accountsReceivable)} × 2% - ${yen(allowanceBefore)}`, amount: allowanceExpense },
      { label: '支払保険料', formula: `${yen(insuranceExpenseBefore)} - ${yen(prepaidInsurance)}`, amount: insuranceExpenseAfter },
      { label: '支払利息', formula: `${yen(interestExpenseBefore)} + ${yen(accruedInterest)}`, amount: interestExpenseAfter },
      { label: '当期純利益', formula: `${yen(sales)} - ${yen(totalExpenses)}`, amount: netIncome },
    ],
    integrityChecks: [
      { label: '決算整理前残高試算表', left: totalDebits(trialRows), right: totalCredits(trialRows) },
      { label: '貸借対照表', left: totalAssets, right: totalLiabilities + capital + netIncome },
      { label: '当期純利益の一致', left: netIncome, right: sales - totalExpenses },
    ],
  };
};

export const createFinancialStatementsData = (base: number, target = '当社'): StatementProblemData => {
  const cash = amount(base, 10);
  const accountsReceivable = amount(base, 25);
  const allowanceBefore = amount(base, 0.2);
  const beginningInventory = amount(base, 5);
  const purchases = amount(base, 28);
  const suppliesExpenseBefore = amount(base, 4);
  const equipment = amount(base, 35);
  const accumulatedDepreciationBefore = amount(base, 8);
  const accountsPayable = amount(base, 13);
  const sales = amount(base, 82);
  const rentRevenueBefore = amount(base, 6);
  const salaries = amount(base, 11);
  const rentExpense = amount(base, 7);
  const advertising = amount(base, 3);

  const endingInventory = amount(base, 9);
  const costOfGoodsSold = beginningInventory + purchases - endingInventory;
  const allowanceTarget = amount(base, 0.5);
  const allowanceExpense = allowanceTarget - allowanceBefore;
  const depreciation = amount(base, 4);
  const accumulatedDepreciationAfter = accumulatedDepreciationBefore + depreciation;
  const unusedSupplies = amount(base, 1.5);
  const suppliesExpenseAfter = suppliesExpenseBefore - unusedSupplies;
  const unearnedRent = amount(base, 2);
  const rentRevenueAfter = rentRevenueBefore - unearnedRent;
  const grossProfit = sales - costOfGoodsSold;
  const totalRevenue = sales + rentRevenueAfter;
  const totalExpenses = costOfGoodsSold + allowanceExpense + depreciation + suppliesExpenseAfter + salaries + rentExpense + advertising;
  const netIncome = totalRevenue - totalExpenses;
  const totalAssets = cash + accountsReceivable - allowanceTarget + endingInventory + unusedSupplies + equipment - accumulatedDepreciationAfter;
  const totalLiabilities = accountsPayable + unearnedRent;
  const trialRows = balanceWithCapital([
    trialDebit('現金', cash),
    trialDebit('売掛金', accountsReceivable),
    trialDebit('繰越商品', beginningInventory),
    trialDebit('仕入', purchases),
    trialDebit('消耗品費', suppliesExpenseBefore),
    trialDebit('備品', equipment),
    trialDebit('給料', salaries),
    trialDebit('支払家賃', rentExpense),
    trialDebit('広告宣伝費', advertising),
    trialCredit('貸倒引当金', allowanceBefore),
    trialCredit('減価償却累計額', accumulatedDepreciationBefore),
    trialCredit('買掛金', accountsPayable),
    trialCredit('売上', sales),
    trialCredit('受取家賃', rentRevenueBefore),
  ]);
  const capital = trialRows.find(row => row.account === '資本金')?.credit ?? 0;
  const retainedEarnings = netIncome;
  const netAssets = capital + retainedEarnings;

  return {
    mode: 'financial_statements',
    title: '第3問形式 財務諸表の作成',
    description: `${target}の決算整理前残高試算表と決算整理事項等にもとづいて、損益計算書と貸借対照表の主要項目を作成します。`,
    materials: [
      { label: '会計期間', value: 'X1年4月1日からX2年3月31日まで' },
      { label: '決算日', value: 'X2年3月31日' },
      { label: '商品売買の記帳方法', value: '三分法' },
    ],
    trialBalance: trialRows,
    adjustmentItems: [
      { label: '1', text: `期末商品棚卸高は${yen(endingInventory)}である。売上原価は仕入の行で計算する。` },
      { label: '2', text: `売掛金の期末残高に対して2%の貸倒引当金を差額補充法で設定する。` },
      { label: '3', text: `備品について当期の減価償却費${yen(depreciation)}を間接法で計上する。` },
      { label: '4', text: `消耗品の未使用高は${yen(unusedSupplies)}である。` },
      { label: '5', text: `受取家賃のうち${yen(unearnedRent)}は翌期分である。` },
    ],
    requirements: [
      '決算整理仕訳を行ったうえで損益計算書を作成する',
      '貸借対照表では売掛金と備品を控除形式で考える',
      '当期純利益を繰越利益剰余金として純資産へ反映する',
    ],
    blanks: [
      { id: 'entry-beginning-inventory', section: '決算整理仕訳', label: '(借) 仕入 / (貸) 繰越商品' },
      { id: 'entry-ending-inventory', section: '決算整理仕訳', label: '(借) 繰越商品 / (貸) 仕入' },
      { id: 'entry-allowance-expense', section: '決算整理仕訳', label: '(借) 貸倒引当金繰入 / (貸) 貸倒引当金' },
      { id: 'entry-depreciation', section: '決算整理仕訳', label: '(借) 減価償却費 / (貸) 減価償却累計額' },
      { id: 'entry-unused-supplies', section: '決算整理仕訳', label: '(借) 消耗品 / (貸) 消耗品費' },
      { id: 'entry-unearned-rent', section: '決算整理仕訳', label: '(借) 受取家賃 / (貸) 前受収益' },
      { id: 'pl-sales', section: '損益計算書', label: '売上高' },
      { id: 'pl-cogs', section: '損益計算書', label: '売上原価' },
      { id: 'pl-gross-profit', section: '損益計算書', label: '売上総利益' },
      { id: 'pl-rent-revenue', section: '損益計算書', label: '受取家賃' },
      { id: 'pl-net-income', section: '損益計算書', label: '当期純利益' },
      { id: 'bs-assets', section: '貸借対照表', label: '資産合計' },
      { id: 'bs-liabilities', section: '貸借対照表', label: '負債合計' },
      { id: 'bs-retained-earnings', section: '貸借対照表', label: '繰越利益剰余金' },
      { id: 'bs-net-assets', section: '貸借対照表', label: '純資産合計' },
    ],
    correctAnswers: {
      'entry-beginning-inventory': beginningInventory,
      'entry-ending-inventory': endingInventory,
      'entry-allowance-expense': allowanceExpense,
      'entry-depreciation': depreciation,
      'entry-unused-supplies': unusedSupplies,
      'entry-unearned-rent': unearnedRent,
      'pl-sales': sales,
      'pl-cogs': costOfGoodsSold,
      'pl-gross-profit': grossProfit,
      'pl-rent-revenue': rentRevenueAfter,
      'pl-net-income': netIncome,
      'bs-assets': totalAssets,
      'bs-liabilities': totalLiabilities,
      'bs-retained-earnings': retainedEarnings,
      'bs-net-assets': netAssets,
    },
    closingEntries: [
      journal([{ account: '仕入', amount: beginningInventory }], [{ account: '繰越商品', amount: beginningInventory }]),
      journal([{ account: '繰越商品', amount: endingInventory }], [{ account: '仕入', amount: endingInventory }]),
      journal([{ account: '貸倒引当金繰入', amount: allowanceExpense }], [{ account: '貸倒引当金', amount: allowanceExpense }]),
      journal([{ account: '減価償却費', amount: depreciation }], [{ account: '減価償却累計額', amount: depreciation }]),
      journal([{ account: '消耗品', amount: unusedSupplies }], [{ account: '消耗品費', amount: unusedSupplies }]),
      journal([{ account: '受取家賃', amount: unearnedRent }], [{ account: '前受収益', amount: unearnedRent }]),
    ],
    explanationRows: [
      { label: '売上原価', formula: `${yen(beginningInventory)} + ${yen(purchases)} - ${yen(endingInventory)}`, amount: costOfGoodsSold },
      { label: '売上総利益', formula: `${yen(sales)} - ${yen(costOfGoodsSold)}`, amount: grossProfit },
      { label: '受取家賃', formula: `${yen(rentRevenueBefore)} - ${yen(unearnedRent)}`, amount: rentRevenueAfter },
      { label: '当期純利益', formula: `${yen(totalRevenue)} - ${yen(totalExpenses)}`, amount: netIncome },
      { label: '資産合計', formula: `現金 + 売掛金純額 + 繰越商品 + 消耗品 + 備品純額`, amount: totalAssets },
      { label: '純資産合計', formula: `${yen(capital)} + ${yen(retainedEarnings)}`, amount: netAssets },
    ],
    integrityChecks: [
      { label: '決算整理前残高試算表', left: totalDebits(trialRows), right: totalCredits(trialRows) },
      { label: '貸借対照表', left: totalAssets, right: totalLiabilities + netAssets },
      { label: '当期純利益の繰越', left: retainedEarnings, right: netIncome },
    ],
  };
};
