import { createServer } from 'vite';

const TEST_TARGET = 'テスト商店';
// 実際に problemService.generateAmount が生成しうる全金額を網羅し、
// どの金額でも丸め(floor/round)による貸借不一致・非正数・NaN が発生しないことを保証する。
// (FRIENDLY_JOURNAL / HARD_JOURNAL / FRIENDLY_NUMERIC / HARD_NUMERIC の和集合)
const TEST_AMOUNTS = [
  1000, 2000, 3000, 4000, 5000, 6000, 8000, 10000,
  12000, 15000, 18000, 20000, 24000, 30000, 36000, 60000,
  120000, 240000, 360000, 600000, 1200000, 1800000, 2400000,
];
const GENERATED_SAMPLE_COUNT = 8;

const hasBrokenText = (value) => /undefined|NaN|Infinity/.test(String(value));
const hasInternalPlaceholder = (value) => {
  const text = String(value);
  return /(^|[^A-Za-z0-9])(?:\d+(?:\.\d+)?\s*)?a(?:\s*[×*/+\-]\s*\d|\s*円|[）)]|$)/.test(text);
};

const toYen = (amount) => Math.max(0, Math.round(amount));
const sumAmounts = (items) => items.reduce((total, item) => total + toYen(item.amount), 0);
const unique = (items) => new Set(items).size === items.length;
const yenList = (items) => items.map((item) => toYen(item.amount));

const failures = [];
const scopeCounts = new Map();

const fail = (message) => {
  failures.push(message);
};

const validateText = (label, value) => {
  if (!String(value).trim()) {
    fail(`${label}: empty text`);
    return;
  }
  if (hasBrokenText(value)) {
    fail(`${label}: contains undefined/NaN/Infinity -> ${value}`);
  }
  if (hasInternalPlaceholder(value)) {
    fail(`${label}: contains internal placeholder -> ${value}`);
  }
};

const validateJournalAnswer = (label, answer, accountTitles) => {
  if (!answer || !Array.isArray(answer.debits) || !Array.isArray(answer.credits)) {
    fail(`${label}: invalid journal answer shape`);
    return;
  }
  if (answer.debits.length === 0 || answer.credits.length === 0) {
    fail(`${label}: journal answer must have debit and credit rows`);
  }

  for (const [sideName, rows] of [['debit', answer.debits], ['credit', answer.credits]]) {
    rows.forEach((row, index) => {
      if (!row.account || typeof row.account !== 'string') {
        fail(`${label}: ${sideName}[${index}] has no account`);
      }
      if (!accountTitles.includes(row.account)) {
        fail(`${label}: ${sideName}[${index}] account is not selectable -> ${row.account}`);
      }
      if (!Number.isFinite(row.amount) || toYen(row.amount) <= 0) {
        fail(`${label}: ${sideName}[${index}] invalid amount -> ${row.amount}`);
      }
    });
  }

  const debitTotal = sumAmounts(answer.debits);
  const creditTotal = sumAmounts(answer.credits);
  if (debitTotal !== creditTotal) {
    fail(`${label}: debit/credit mismatch -> debit ${debitTotal}, credit ${creditTotal}`);
  }
};

const validateSelectionAnswer = (label, answer) => {
  if (!answer || !answer.correct || !Array.isArray(answer.options)) {
    fail(`${label}: invalid selection answer shape`);
    return;
  }
  if (!answer.options.includes(answer.correct)) {
    fail(`${label}: options do not include correct answer -> ${answer.correct}`);
  }
  if (!unique(answer.options)) {
    fail(`${label}: duplicate selection options -> ${answer.options.join(', ')}`);
  }
  answer.options.forEach((option, index) => validateText(`${label}: option[${index}]`, option));
};

const validateNumericAnswer = (label, answer) => {
  if (!Number.isFinite(answer) || toYen(answer) <= 0) {
    fail(`${label}: invalid numeric answer -> ${answer}`);
  }
};

const validateStatementData = (label, data, accountTitles = []) => {
  if (!data || typeof data !== 'object') {
    fail(`${label}: missing statement data`);
    return;
  }
  validateText(`${label}: statement title`, data.title);
  validateText(`${label}: statement description`, data.description);
  if (!Array.isArray(data.materials) || data.materials.length === 0) {
    fail(`${label}: statement materials is empty`);
  }
  if (!Array.isArray(data.requirements) || data.requirements.length === 0) {
    fail(`${label}: statement requirements is empty`);
  }
  if (!Array.isArray(data.blanks) || data.blanks.length === 0) {
    fail(`${label}: statement blanks is empty`);
  }
  if (data.trialBalance !== undefined) {
    if (!Array.isArray(data.trialBalance) || data.trialBalance.length === 0) {
      fail(`${label}: trial balance is empty`);
    } else {
      let debitTotal = 0;
      let creditTotal = 0;
      for (const [index, row] of data.trialBalance.entries()) {
        validateText(`${label}: trialBalance[${index}] account`, row.account);
        if (accountTitles.length > 0 && !accountTitles.includes(row.account)) {
          fail(`${label}: trialBalance[${index}] account is not selectable -> ${row.account}`);
        }
        const debit = row.debit ?? 0;
        const credit = row.credit ?? 0;
        if (!Number.isFinite(debit) || debit < 0 || !Number.isFinite(credit) || credit < 0) {
          fail(`${label}: trialBalance[${index}] has invalid amount`);
        }
        if (debit > 0 && credit > 0) {
          fail(`${label}: trialBalance[${index}] has both debit and credit`);
        }
        debitTotal += toYen(debit);
        creditTotal += toYen(credit);
      }
      if (debitTotal !== creditTotal) {
        fail(`${label}: trial balance mismatch -> debit ${debitTotal}, credit ${creditTotal}`);
      }
    }
  }
  for (const item of data.adjustmentItems ?? []) {
    validateText(`${label}: adjustment item label`, item.label);
    validateText(`${label}: adjustment item text`, item.text);
  }
  const blankIds = data.blanks?.map(blank => blank.id) ?? [];
  if (!unique(blankIds)) {
    fail(`${label}: statement blank ids has duplicates -> ${blankIds.join(', ')}`);
  }
  for (const blank of data.blanks ?? []) {
    validateText(`${label}: statement blank label`, blank.label);
    if (!Number.isFinite(data.correctAnswers?.[blank.id]) || data.correctAnswers[blank.id] <= 0) {
      fail(`${label}: statement blank ${blank.id} has invalid correct answer`);
    }
  }
  for (const [index, entry] of (data.closingEntries ?? []).entries()) {
    if (accountTitles.length > 0) {
      validateJournalAnswer(`${label}: closingEntries[${index}]`, entry, accountTitles);
    } else if (sumAmounts(entry.debits ?? []) !== sumAmounts(entry.credits ?? [])) {
      fail(`${label}: closingEntries[${index}] debit/credit mismatch`);
    }
  }
  for (const [index, check] of (data.integrityChecks ?? []).entries()) {
    validateText(`${label}: integrityChecks[${index}] label`, check.label);
    if (!Number.isFinite(check.left) || !Number.isFinite(check.right)) {
      fail(`${label}: integrityChecks[${index}] has invalid amount`);
    }
    if (toYen(check.left) !== toYen(check.right)) {
      fail(`${label}: integrity check failed ${check.label} -> left ${check.left}, right ${check.right}`);
    }
  }
};

const validateGeneratedProblem = (label, problem, QuestionType, ProblemScopeTag, isDefaultExamAccountTitle, allowAllAccounts = false) => {
  validateText(`${label}: text`, problem.text);
  validateText(`${label}: explanation`, problem.explanation);
  if (!problem.scope?.tag || !problem.scope?.label || !problem.scope?.reason) {
    fail(`${label}: missing problem scope metadata`);
  }
  if (!allowAllAccounts && (problem.scope?.tag === ProblemScopeTag.LEGACY || problem.scope?.tag === ProblemScopeTag.OUT_OF_SCOPE)) {
    fail(`${label}: default generation included ${problem.scope.tag} problem -> ${problem.text}`);
  }

  if (problem.type === QuestionType.JOURNAL) {
    const answerAmounts = [
      ...yenList(problem.correctJournal?.debits ?? []),
      ...yenList(problem.correctJournal?.credits ?? []),
    ];
    const selectableAccounts = problem.selectableAccounts ?? [];
    const amountOptions = problem.amountOptions ?? [];

    for (const row of [...(problem.correctJournal?.debits ?? []), ...(problem.correctJournal?.credits ?? [])]) {
      if (!selectableAccounts.includes(row.account)) {
        fail(`${label}: generated selectableAccounts missing ${row.account}`);
      }
    }
    for (const account of selectableAccounts) {
      if (!allowAllAccounts && !isDefaultExamAccountTitle(account)) {
        fail(`${label}: generated selectableAccounts included out-of-scope account ${account}`);
      }
    }
    for (const amount of new Set(answerAmounts)) {
      if (!amountOptions.includes(amount)) {
        fail(`${label}: generated amountOptions missing ${amount}`);
      }
    }
    if (!unique(amountOptions)) {
      fail(`${label}: generated amountOptions has duplicates -> ${amountOptions.join(', ')}`);
    }
  }

  if (problem.type === QuestionType.SELECTION) {
    if (!problem.options?.includes(problem.correctSelection)) {
      fail(`${label}: generated options missing correct selection`);
    }
    if (!unique(problem.options ?? [])) {
      fail(`${label}: generated options has duplicates -> ${(problem.options ?? []).join(', ')}`);
    }
  }

  if (problem.type === QuestionType.NUMERIC) {
    if (!problem.amountOptions?.includes(problem.correctNumeric)) {
      fail(`${label}: generated numeric options missing correct answer`);
    }
    if (!unique(problem.amountOptions ?? [])) {
      fail(`${label}: generated numeric options has duplicates -> ${(problem.amountOptions ?? []).join(', ')}`);
    }
  }

  if (problem.type === QuestionType.STATEMENT) {
    validateStatementData(`${label}: statement`, problem.statement);
    for (const amount of Object.values(problem.statement?.correctAnswers ?? {})) {
      if (!problem.amountOptions?.includes(amount)) {
        fail(`${label}: generated statement options missing correct amount ${amount}`);
      }
    }
  }
};

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const [
    { PROBLEM_TEMPLATES, ACCOUNT_TITLES },
    { generateProblem },
    { resolveProblemScope, isDefaultExamAccountTitle },
    { QuestionType, ProblemScopeTag },
  ] = await Promise.all([
    server.ssrLoadModule('/constants.ts'),
    server.ssrLoadModule('/services/problemService.ts'),
    server.ssrLoadModule('/services/problemScopeService.ts'),
    server.ssrLoadModule('/types.ts'),
  ]);

  if (!Array.isArray(PROBLEM_TEMPLATES) || PROBLEM_TEMPLATES.length === 0) {
    fail('PROBLEM_TEMPLATES is empty');
  }

  PROBLEM_TEMPLATES.forEach((template, index) => {
    const scope = resolveProblemScope(template);
    if (!scope?.tag || !scope?.label || !scope?.reason) {
      fail(`template[${index}]: missing scope metadata`);
    }
    scopeCounts.set(scope.tag, (scopeCounts.get(scope.tag) ?? 0) + 1);

    TEST_AMOUNTS.forEach((amount) => {
      const label = `template[${index}] ${template.type} amount=${amount}`;
      const text = template.textTemplate(amount, TEST_TARGET);
      const explanation = template.explanationTemplate
        ? template.explanationTemplate(amount, TEST_TARGET)
        : template.explanation;

      validateText(`${label}: text`, text);
      validateText(`${label}: explanation`, explanation);

      if (template.type === QuestionType.JOURNAL) {
        validateJournalAnswer(`${label}: journal`, template.generateJournalAnswer?.(amount, TEST_TARGET), ACCOUNT_TITLES);
      } else if (template.type === QuestionType.SELECTION) {
        validateSelectionAnswer(`${label}: selection`, template.generateSelectionAnswer?.());
      } else if (template.type === QuestionType.NUMERIC) {
        validateNumericAnswer(`${label}: numeric`, template.generateNumericAnswer?.(amount));
      } else if (template.type === QuestionType.STATEMENT) {
        validateStatementData(`${label}: statement`, template.generateStatementData?.(amount, TEST_TARGET), ACCOUNT_TITLES);
      } else {
        fail(`${label}: unknown question type -> ${template.type}`);
      }
    });
  });

  const difficulties = ['Practice', 'Easy', 'Hard'];
  const types = [QuestionType.JOURNAL, QuestionType.SELECTION, QuestionType.NUMERIC, QuestionType.STATEMENT];
  for (const difficulty of difficulties) {
    for (const type of types) {
      for (let index = 0; index < GENERATED_SAMPLE_COUNT; index += 1) {
        const problem = await generateProblem(difficulty, [type]);
        validateGeneratedProblem(`generated ${difficulty}/${type} #${index + 1}`, problem, QuestionType, ProblemScopeTag, isDefaultExamAccountTitle);
      }
    }
  }

  for (const topic of ['closing', 'trial-balance', 'mistakes']) {
    for (let index = 0; index < GENERATED_SAMPLE_COUNT; index += 1) {
      const problem = await generateProblem('Practice', undefined, topic);
      validateGeneratedProblem(`topic ${topic} #${index + 1}`, problem, QuestionType, ProblemScopeTag, isDefaultExamAccountTitle);
    }
  }

  // --- 簿記2級（Level2）の生成検証 ---
  // 2級は専用勘定を使うため allowAllAccounts=true で検証する。
  const level2Tracks = [
    { track: 'commercial', types: [QuestionType.JOURNAL] },
    { track: 'industrial', types: [QuestionType.JOURNAL, QuestionType.NUMERIC] },
  ];
  for (const difficulty of difficulties) {
    for (const { track, types: trackTypes } of level2Tracks) {
      for (const type of trackTypes) {
        for (let index = 0; index < GENERATED_SAMPLE_COUNT; index += 1) {
          const problem = await generateProblem(difficulty, [type], undefined, { level: 'Level2', level2Track: track });
          if ((problem.level ?? 'Level3') !== 'Level2') {
            fail(`Level2 ${difficulty}/${track}/${type} #${index + 1}: generated problem is not Level2 -> ${problem.level}`);
          }
          validateGeneratedProblem(`Level2 ${difficulty}/${track}/${type} #${index + 1}`, problem, QuestionType, ProblemScopeTag, isDefaultExamAccountTitle, true);
        }
      }
    }
  }
} finally {
  await server.close();
}

if (failures.length > 0) {
  console.error(`Problem audit failed with ${failures.length} issue(s):`);
  failures.slice(0, 80).forEach((failure) => console.error(`- ${failure}`));
  if (failures.length > 80) {
    console.error(`...and ${failures.length - 80} more issue(s).`);
  }
  process.exit(1);
}

const scopeSummary = Array.from(scopeCounts.entries())
  .map(([tag, count]) => `${tag}: ${count}`)
  .join(', ');

console.log(`Problem audit passed. Templates and generated samples look consistent. Scope counts: ${scopeSummary}`);
