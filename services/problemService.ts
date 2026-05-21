
import { GeneratedProblem, QuestionType, Difficulty, AccountCategory, JournalEntryAnswer, ProblemTemplate } from "../types";
import { PROBLEM_TEMPLATES, ACCOUNT_TITLES, ACCOUNT_DEFINITIONS } from "../constants";

const COMPANY_NAMES = ['A商店', 'B商事', 'C物産', 'D商店', 'E社', 'Fマート', '山田商店', '鈴木商事'];

const FRIENDLY_JOURNAL_AMOUNTS = [12000, 15000, 18000, 20000, 24000, 30000];
const FRIENDLY_NUMERIC_AMOUNTS = [1000, 2000, 3000, 4000, 5000, 6000, 8000, 10000, 12000];
const HARD_JOURNAL_AMOUNTS = [120000, 240000, 360000, 600000, 1200000, 1800000, 2400000];
const HARD_NUMERIC_AMOUNTS = [12000, 24000, 36000, 60000, 120000, 240000];

const pickRandom = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const toYen = (amount: number): number => Math.max(0, Math.round(amount));

const normalizeJournalAnswer = (answer: JournalEntryAnswer): JournalEntryAnswer => ({
  debits: answer.debits.map(item => ({ ...item, amount: toYen(item.amount) })),
  credits: answer.credits.map(item => ({ ...item, amount: toYen(item.amount) })),
});

const getLargestTextMultiplier = (template: ProblemTemplate): number => {
  const multipliers = [...template.textTemplate.toString().matchAll(/a\s*\*\s*(\d+(?:\.\d+)?)/g)]
    .map(match => Number(match[1]))
    .filter(multiplier => Number.isFinite(multiplier) && multiplier > 0);

  return Math.max(1, ...multipliers);
};

const limitAmountForText = (amounts: number[], maxTextAmount: number, multiplier: number): number => {
  const candidates = amounts.filter(amount => amount * multiplier <= maxTextAmount);
  if (candidates.length > 0) {
    return pickRandom(candidates);
  }

  const fallback = Math.floor(maxTextAmount / multiplier / 1000) * 1000;
  return Math.max(1000, fallback);
};

const generateAmount = (difficulty: Difficulty, type: QuestionType, template: ProblemTemplate): number => {
  const largestTextMultiplier = getLargestTextMultiplier(template);

  if (difficulty === 'Hard') {
    const amounts = type === QuestionType.NUMERIC ? HARD_NUMERIC_AMOUNTS : HARD_JOURNAL_AMOUNTS;
    const maxTextAmount = type === QuestionType.NUMERIC ? 50000000 : 30000000;
    return limitAmountForText(amounts, maxTextAmount, largestTextMultiplier);
  }

  if (type === QuestionType.NUMERIC) {
    return limitAmountForText(FRIENDLY_NUMERIC_AMOUNTS, 300000, largestTextMultiplier);
  }

  return limitAmountForText(FRIENDLY_JOURNAL_AMOUNTS, 300000, largestTextMultiplier);
};

// Shuffle utility
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Helper to generate distractor amounts
const generateDistractorAmounts = (correctAmounts: number[], difficulty: Difficulty): number[] => {
  const distractors = new Set<number>();
  const normalizedCorrectAmounts = correctAmounts.map(toYen);
  const base = Math.max(...normalizedCorrectAmounts, 1000);
  const step = base < 1000 ? 10 : base < 10000 ? 100 : 1000;

  const addCandidate = (candidate: number) => {
    const value = toYen(candidate);
    if (value > 0 && !normalizedCorrectAmounts.includes(value)) {
      distractors.add(value);
    }
  };

  if (difficulty === 'Hard') {
    [
      base + step,
      base - step,
      base + step * 3,
      base - step * 3,
      base * 1.1,
      base * 0.9,
      base * 2,
      base * 0.5,
      base * 10,
      base * 0.1,
    ].forEach(addCandidate);
  } else {
    [
      base + step,
      base - step,
      base + step * 2,
      base - step * 2,
      base * 1.1,
      base * 0.9,
      base * 2,
      base * 0.5,
    ].forEach(addCandidate);
  }

  // Logic to create realistic wrong answers
  while (distractors.size < 5) {
    const r = Math.random();
    let val = 0;

    if (r < 0.2) {
      // Slight variation
      val = base + (Math.floor(Math.random() * 10) - 5) * step;
    } else if (r < 0.4) {
      // Tax mistake (incorrectly adding/removing tax)
      val = base * 1.1;
    } else if (r < 0.6) {
      // Digit slip (10x or 0.1x)
      val = difficulty === 'Hard' ? base * 10 : base + step * (Math.floor(Math.random() * 6) + 3);
    } else if (r < 0.8) {
      // Half or Double
      val = base * (Math.random() > 0.5 ? 2 : 0.5);
    } else {
      // Just random pretty number
      const maxMultiplier = difficulty === 'Hard' ? 90 : 12;
      val = (Math.floor(Math.random() * maxMultiplier) + 1) * step;
    }

    // Ensure positive integer and not already in correct set
    addCandidate(Math.abs(val));
  }
  return Array.from(distractors);
};

export const generateProblem = async (difficulty: Difficulty, allowedTypes?: QuestionType[], topic?: string): Promise<GeneratedProblem> => {
  // Simulate subtle async delay
  await new Promise(resolve => setTimeout(resolve, 50));

  // 1. Filter templates by allowed types (if specified)
  let availableTemplates = allowedTypes && allowedTypes.length > 0
    ? PROBLEM_TEMPLATES.filter(t => allowedTypes.includes(t.type))
    : PROBLEM_TEMPLATES;

  // 1b. Filter templates by topic (if specified)
  if (topic) {
    const tLower = topic.toLowerCase();
    let topicTemplates = availableTemplates;
    if (tLower === 'closing' || tLower === 'adjustments') {
      topicTemplates = availableTemplates.filter(t => 
        t.explanation.includes('決算整理') || 
        t.explanation.includes('減価償却') || 
        t.explanation.includes('貸倒') || 
        t.explanation.includes('見越') || 
        t.explanation.includes('繰延') || 
        t.explanation.includes('売上原価') ||
        t.explanation.includes('しーくり')
      );
    } else if (tLower === 'trial-balance') {
      topicTemplates = availableTemplates.filter(t => 
        t.explanation.includes('試算表') || 
        t.textTemplate(1000).includes('試算表') ||
        t.explanation.includes('帳簿') ||
        t.explanation.includes('転記')
      );
    } else if (tLower === 'mistakes') {
      topicTemplates = availableTemplates.filter(t => 
        t.explanation.includes('ひっかけ') || 
        t.explanation.includes('注意') ||
        t.explanation.includes('当座借越') ||
        t.explanation.includes('小切手') ||
        t.explanation.includes('裏書') ||
        t.explanation.includes('預り金') ||
        t.explanation.includes('月割') ||
        t.explanation.includes('消費税')
      );
    }
    // If topic results in nothing, fallback to no topic filter to ensure safety
    if (topicTemplates.length > 0) {
      availableTemplates = topicTemplates;
    }
  }

  if (availableTemplates.length === 0) {
    throw new Error('No templates available for the selected question types');
  }

  // 2. Select a random template from available ones
  const templateIndex = Math.floor(Math.random() * availableTemplates.length);
  const template = availableTemplates[templateIndex];

  // 2. Generate random amount
  const amount = generateAmount(difficulty, template.type, template);

  // 3. Generate context
  const targetName = COMPANY_NAMES[Math.floor(Math.random() * COMPANY_NAMES.length)];

  // 4. Build Base Problem Object
  const problem: GeneratedProblem = {
    id: crypto.randomUUID(),
    type: template.type,
    text: template.textTemplate(amount, targetName),
    explanation: template.explanation,
    difficulty: difficulty,
  };

  // 5. Generate Specific Answer Data based on Type
  switch (template.type) {
    case QuestionType.JOURNAL:
      if (template.generateJournalAnswer) {
        problem.correctJournal = normalizeJournalAnswer(template.generateJournalAnswer(amount, targetName));
        
        // 勘定科目選択肢の絞り込み
        const correctAccounts = new Set<string>();
        const correctAmounts = new Set<number>();
        
        problem.correctJournal.debits.forEach(d => {
          correctAccounts.add(d.account);
          correctAmounts.add(d.amount);
        });
        problem.correctJournal.credits.forEach(c => {
          correctAccounts.add(c.account);
          correctAmounts.add(c.amount);
        });
        
        // Accounts Selection
        const otherAccounts = ACCOUNT_TITLES.filter(a => !correctAccounts.has(a));
        const numCorrect = correctAccounts.size;
        const numDummyNeeded = Math.max(0, 5 - numCorrect);
        const selectedDummyAccounts = shuffleArray(otherAccounts).slice(0, numDummyNeeded);
        problem.selectableAccounts = shuffleArray([...Array.from(correctAccounts), ...selectedDummyAccounts]);

        // Amount Options Generation (Target 5 options)
        // Must include ALL correct amounts needed for the entry
        const distinctCorrectAmounts = Array.from(correctAmounts).map(toYen);
        const dummyAmounts = generateDistractorAmounts(distinctCorrectAmounts, difficulty);
        
        // Fill up to 5 or more if we have many correct amounts
        const neededOptions = Math.max(5, distinctCorrectAmounts.length + 1);
        const finalAmounts = [...distinctCorrectAmounts];
        
        for (const dummy of dummyAmounts) {
          if (finalAmounts.length >= neededOptions) break;
          finalAmounts.push(dummy);
        }
        
        problem.amountOptions = shuffleArray(finalAmounts).sort((a, b) => a - b);
      }
      break;
      
    case QuestionType.SELECTION:
      if (template.generateSelectionAnswer) {
        const { correct, options } = template.generateSelectionAnswer();
        const shuffledOptions = shuffleArray(options);
        problem.correctSelection = correct;
        problem.options = shuffledOptions;
      }
      break;

    case QuestionType.NUMERIC:
      if (template.generateNumericAnswer) {
        const correctVal = toYen(template.generateNumericAnswer(amount));
        problem.correctNumeric = correctVal;

        // Generate numeric choices
        const dummyAmounts = generateDistractorAmounts([correctVal], difficulty);
        const finalAmounts = [correctVal, ...dummyAmounts].slice(0, 5);
        problem.amountOptions = shuffleArray(finalAmounts).sort((a, b) => a - b);
      }
      break;
  }

  return problem;
};
