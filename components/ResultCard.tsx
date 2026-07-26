
import React from 'react';
import { GeneratedProblem, UserAnswer, BattleResult, QuestionType, JournalEntryAnswer, StatementAnswer } from '../types';
import { XCircle, BookOpen, Swords, ArrowRight, Skull, Flag, AlertTriangle } from 'lucide-react';
import AdUnit from './AdUnit';
import { AD_SLOTS } from '../adsConfig';
import ExplanationBody from '../utils/explanationFormatter';

interface ResultCardProps {
  problem: GeneratedProblem;
  userAnswer: UserAnswer | null;
  result: BattleResult;
  onNext: () => void;
  isGameOver: boolean;
  nextLabel?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ problem, userAnswer, result, onNext, isGameOver, nextLabel }) => {
  let state: 'win' | 'miss' | 'surrender' | 'dead' = 'miss';
  if (result.isCorrect) state = 'win';
  else if (result.surrendered) state = 'surrender';
  else if (result.playerDefeated) state = 'dead';
  else if (userAnswer === null) state = 'surrender';

  // Helper to render User Answer
  const renderUserAnswer = () => {
    if (userAnswer === null) return <span className="text-slate-500 italic">回答なし</span>;

    if (problem.type === QuestionType.JOURNAL) {
      const ans = userAnswer as JournalEntryAnswer;
      return (
        <div className="space-y-1 text-slate-300 font-mono text-xs">
          {ans.debits.map((d, i) => (
            <div key={`ud-${i}`} className="flex justify-between gap-3 border-b border-slate-800/50 pb-1">
              <span className="min-w-0 break-words">(借){d.account}</span><span className="shrink-0">¥{d.amount.toLocaleString()}</span>
            </div>
          ))}
          {ans.credits.map((c, i) => (
            <div key={`uc-${i}`} className="flex justify-between gap-3 border-b border-slate-800/50 pb-1">
              <span className="min-w-0 break-words">(貸){c.account}</span><span className="shrink-0">¥{c.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    
    if (problem.type === QuestionType.SELECTION) {
      return <div className="text-slate-300 font-bold text-lg">{userAnswer as string}</div>;
    }

    if (problem.type === QuestionType.NUMERIC) {
      return <div className="text-slate-300 font-mono font-bold text-xl">{(userAnswer as number).toLocaleString()}</div>;
    }

    if (problem.type === QuestionType.STATEMENT) {
      const ans = userAnswer as StatementAnswer;
      return (
        <div className="space-y-1 text-slate-300 font-mono text-xs">
          {problem.statement?.blanks.map(blank => (
            <div key={`us-${blank.id}`} className="flex justify-between gap-3 border-b border-slate-800/50 pb-1">
              <span className="min-w-0 break-words">{blank.label}</span>
              <span className="shrink-0">¥{(ans.values[blank.id] ?? 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
  };

  // Helper to render Correct Answer
  const renderCorrectAnswer = () => {
    if (problem.type === QuestionType.JOURNAL && problem.correctJournal) {
      return (
        <div className="space-y-1 text-indigo-100 font-mono text-xs">
          {problem.correctJournal.debits.map((d, i) => (
            <div key={`cd-${i}`} className="flex justify-between gap-3 border-b border-indigo-500/20 pb-1">
              <span className="min-w-0 break-words">(借){d.account}</span><span className="shrink-0">¥{d.amount.toLocaleString()}</span>
            </div>
          ))}
          {problem.correctJournal.credits.map((c, i) => (
            <div key={`cc-${i}`} className="flex justify-between gap-3 border-b border-indigo-500/20 pb-1">
              <span className="min-w-0 break-words">(貸){c.account}</span><span className="shrink-0">¥{c.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }

    if (problem.type === QuestionType.SELECTION && problem.correctSelection) {
      return <div className="text-indigo-200 font-bold text-lg">{problem.correctSelection}</div>;
    }

    if (problem.type === QuestionType.NUMERIC && problem.correctNumeric !== undefined) {
       return <div className="text-indigo-200 font-mono font-bold text-xl">{problem.correctNumeric.toLocaleString()}</div>;
    }

    if (problem.type === QuestionType.STATEMENT && problem.statement) {
      return (
        <div className="space-y-1 text-indigo-100 font-mono text-xs">
          {problem.statement.blanks.map(blank => (
            <div key={`cs-${blank.id}`} className="flex justify-between gap-3 border-b border-indigo-500/20 pb-1">
              <span className="min-w-0 break-words">{blank.label}</span>
              <span className="shrink-0">¥{problem.statement!.correctAnswers[blank.id].toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="space-y-5 bg-slate-800 p-4 sm:p-6 rounded-lg border border-slate-700 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Result Banner */}
      <div className={`text-center p-6 rounded-lg border-4 ${
        state === 'win' ? 'bg-indigo-900/80 border-indigo-500' : 
        state === 'dead' ? 'bg-red-950 border-red-600' :
        state === 'surrender' ? 'bg-slate-700/80 border-slate-500' :
        'bg-red-900/80 border-red-500'
      }`}>
        <div className={`flex items-center justify-center gap-3 text-3xl font-black tracking-widest mb-3 ${
          state === 'win' ? 'text-indigo-300' : 
          state === 'dead' ? 'text-red-500' :
          state === 'surrender' ? 'text-slate-300' :
          'text-red-400'
        }`}>
          {state === 'win' && <><Swords size={36} /> HIT!</>}
          {state === 'miss' && <><XCircle size={36} /> MISS...</>}
          {state === 'dead' && <><AlertTriangle size={36} /> YOU DIED</>}
          {state === 'surrender' && <><Flag size={36} /> RETIRED</>}
        </div>
        
        {state === 'win' && (
          <div className="flex flex-col items-center gap-1">
             <div className="text-5xl font-black text-yellow-400 drop-shadow-lg font-pixel">
               {result.damageDealt} <span className="text-lg text-white">DMG</span>
             </div>
             {result.isCritical && (
                <span className="text-red-400 font-bold animate-pulse">⚡️ SPEED BONUS ⚡️</span>
             )}
          </div>
        )}

        {state !== 'win' && result.damageTaken > 0 && (
           <div className="flex flex-col items-center gap-1 text-red-400">
              <div className="text-2xl font-bold">
                You took {result.damageTaken} DMG
              </div>
           </div>
        )}
        
        {result.monsterDefeated && (
          <div className="mt-4 py-2 px-4 bg-yellow-500/20 rounded-full border border-yellow-500 inline-flex items-center gap-2 text-yellow-300 font-bold animate-bounce">
            <Skull size={20} /> モンスター討伐！
          </div>
        )}
      </div>

      {/* Explanation Area */}
      <div className="bg-slate-900 p-4 sm:p-5 rounded-lg border border-slate-700 shadow-inner">
        <h4 className="flex items-center gap-2 font-bold text-slate-300 mb-3 border-b border-slate-700 pb-2">
          <BookOpen size={18} /> 解説
        </h4>
        <ExplanationBody text={problem.explanation} />
        {problem.kbLink && (
          <a
            href={problem.kbLink.path}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-950/40 px-3 py-2 text-sm font-bold text-indigo-200 hover:border-indigo-400 hover:bg-indigo-900/60 transition-colors"
          >
            <BookOpen size={16} />
            {problem.kbLink.label}
          </a>
        )}
      </div>

      {/* Comparison Grid - Hide if surrendered (unless you want to show what you missed) */}
      {/* User asked to see answer even after surrender or death */}
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 min-w-0">
          <h4 className="font-bold text-slate-500 mb-3 text-xs uppercase">あなたの回答</h4>
          {renderUserAnswer()}
        </div>

        <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-500/20 min-w-0">
          <h4 className="font-bold text-indigo-400 mb-3 text-xs uppercase">正解</h4>
          {renderCorrectAnswer()}
        </div>
      </div>

      <AdUnit slot={AD_SLOTS.result} className="my-2" />

      <button
        onClick={onNext}
        className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-lg ${
          isGameOver 
          ? 'bg-red-600 hover:bg-red-700 text-white' 
          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/50'
        }`}
      >
        {nextLabel ?? (isGameOver ? '結果画面へ' : result.monsterDefeated ? '次のモンスターへ' : '次のターンへ')} <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default React.memo(ResultCard);
