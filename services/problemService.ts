
import { GeneratedProblem, QuestionType, Difficulty, AccountCategory, JournalEntryAnswer } from "../types";
import { PROBLEM_TEMPLATES, ACCOUNT_TITLES, ACCOUNT_DEFINITIONS } from "../constants";

const COMPANY_NAMES = ['A商店', 'B商事', 'C物産', 'D商店', 'E社', 'Fマート', '山田商店', '鈴木商事'];

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
const generateDistractorAmounts = (correctAmounts: number[]): number[] => {
  const distractors = new Set<number>();
  const base = correctAmounts[0] || 10000;

  // Logic to create realistic wrong answers
  while (distractors.size < 5) {
    const r = Math.random();
    let val = 0;

    if (r < 0.2) {
      // Slight variation
      val = base + (Math.floor(Math.random() * 10) - 5) * 1000;
    } else if (r < 0.4) {
      // Tax mistake (incorrectly adding/removing tax)
      val = Math.floor(base * 1.1);
    } else if (r < 0.6) {
      // Digit slip (10x or 0.1x)
      val = base * 10;
    } else if (r < 0.8) {
      // Half or Double
      val = base * (Math.random() > 0.5 ? 2 : 0.5);
    } else {
      // Just random pretty number
      val = (Math.floor(Math.random() * 90) + 10) * 1000;
    }

    // Ensure positive integer and not already in correct set
    val = Math.floor(Math.abs(val));
    if (val > 0 && !correctAmounts.includes(val)) {
      distractors.add(val);
    }
  }
  return Array.from(distractors);
};

export const generateProblem = async (difficulty: Difficulty, allowedTypes?: QuestionType[]): Promise<GeneratedProblem> => {
  // Simulate subtle async delay
  await new Promise(resolve => setTimeout(resolve, 50));

  // 1. Filter templates by allowed types (if specified)
  const availableTemplates = allowedTypes && allowedTypes.length > 0
    ? PROBLEM_TEMPLATES.filter(t => allowedTypes.includes(t.type))
    : PROBLEM_TEMPLATES;

  if (availableTemplates.length === 0) {
    throw new Error('No templates available for the selected question types');
  }

  // 2. Select a random template from available ones
  const templateIndex = Math.floor(Math.random() * availableTemplates.length);
  const template = availableTemplates[templateIndex];

  // 2. Generate random amount 
  // Base logic: Keep numbers somewhat clean for calculations (divisible by 12 for months, etc.)
  let base = Math.pow(10, Math.floor(Math.random() * 3) + 3); // 1000, 10000, 100000
  let multiplier = Math.floor(Math.random() * 50) + 1; 
  let amount = base * multiplier; 
  // Ensure divisibility for monthly calc problems (often needed for depreciation/insurance)
  amount = Math.floor(amount / 12000) * 12000 + 12000; 

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
        problem.correctJournal = template.generateJournalAnswer(amount, targetName);
        
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
        const distinctCorrectAmounts = Array.from(correctAmounts);
        const dummyAmounts = generateDistractorAmounts(distinctCorrectAmounts);
        
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
        const correctVal = template.generateNumericAnswer(amount);
        problem.correctNumeric = correctVal;

        // Generate numeric choices
        const dummyAmounts = generateDistractorAmounts([correctVal]);
        const finalAmounts = [correctVal, ...dummyAmounts].slice(0, 5);
        problem.amountOptions = shuffleArray(finalAmounts).sort((a, b) => a - b);
      }
      break;
  }

  return problem;
};
