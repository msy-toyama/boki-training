import { createServer } from 'vite';

const TEST_TARGET = 'テスト商店';
const TEST_AMOUNTS = [12000, 15000, 24000, 120000];
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

const validateGeneratedProblem = (label, problem, QuestionType) => {
  validateText(`${label}: text`, problem.text);
  validateText(`${label}: explanation`, problem.explanation);

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
};

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const [{ PROBLEM_TEMPLATES, ACCOUNT_TITLES }, { generateProblem }, { QuestionType }] = await Promise.all([
    server.ssrLoadModule('/constants.ts'),
    server.ssrLoadModule('/services/problemService.ts'),
    server.ssrLoadModule('/types.ts'),
  ]);

  if (!Array.isArray(PROBLEM_TEMPLATES) || PROBLEM_TEMPLATES.length === 0) {
    fail('PROBLEM_TEMPLATES is empty');
  }

  PROBLEM_TEMPLATES.forEach((template, index) => {
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
      } else {
        fail(`${label}: unknown question type -> ${template.type}`);
      }
    });
  });

  const difficulties = ['Practice', 'Easy', 'Hard'];
  const types = [QuestionType.JOURNAL, QuestionType.SELECTION, QuestionType.NUMERIC];
  for (const difficulty of difficulties) {
    for (const type of types) {
      for (let index = 0; index < GENERATED_SAMPLE_COUNT; index += 1) {
        const problem = await generateProblem(difficulty, [type]);
        validateGeneratedProblem(`generated ${difficulty}/${type} #${index + 1}`, problem, QuestionType);
      }
    }
  }

  for (const topic of ['closing', 'trial-balance', 'mistakes']) {
    for (let index = 0; index < GENERATED_SAMPLE_COUNT; index += 1) {
      const problem = await generateProblem('Practice', undefined, topic);
      validateGeneratedProblem(`topic ${topic} #${index + 1}`, problem, QuestionType);
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

console.log('Problem audit passed. Templates and generated samples look consistent.');