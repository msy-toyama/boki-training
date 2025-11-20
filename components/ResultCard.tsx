
import React from 'react';
import { GeneratedProblem, UserAnswer, BattleResult, QuestionType, JournalEntryAnswer } from '../types';
import { XCircle, BookOpen, Swords, ArrowRight, Skull, Flag, AlertTriangle } from 'lucide-react';

interface ResultCardProps {
  problem: GeneratedProblem;
  userAnswer: UserAnswer | null;
  result: BattleResult;
  onNext: () => void;
  isGameOver: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ problem, userAnswer, result, onNext, isGameOver }) => {
  let state: 'win' | 'miss' | 'surrender' | 'dead' = 'miss';
  if (result.isCorrect) state = 'win';
  else if (userAnswer === null && !result.playerDefeated) state = 'surrender';
  else if (result.playerDefeated) state = 'dead';

  // Helper to render User Answer
  const renderUserAnswer = () => {
    if (userAnswer === null) return <span className="text-slate-500 italic">回答なし</span>;

    if (problem.type === QuestionType.JOURNAL) {
      const ans = userAnswer as JournalEntryAnswer;
      return (
        <div className="space-y-1 text-slate-300 font-mono text-xs">
          {ans.debits.map((d, i) => (
            <div key={`ud-${i}`} className="flex justify-between border-b border-slate-800/50 pb-1">
              <span>(借){d.account}</span><span>¥{d.amount.toLocaleString()}</span>
            </div>
          ))}
          {ans.credits.map((c, i) => (
            <div key={`uc-${i}`} className="flex justify-between border-b border-slate-800/50 pb-1">
              <span>(貸){c.account}</span><span>¥{c.amount.toLocaleString()}</span>
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
  };

  // Helper to render Correct Answer
  const renderCorrectAnswer = () => {
    if (problem.type === QuestionType.JOURNAL && problem.correctJournal) {
      return (
        <div className="space-y-1 text-indigo-100 font-mono text-xs">
          {problem.correctJournal.debits.map((d, i) => (
            <div key={`cd-${i}`} className="flex justify-between border-b border-indigo-500/20 pb-1">
              <span>(借){d.account}</span><span>¥{d.amount.toLocaleString()}</span>
            </div>
          ))}
          {problem.correctJournal.credits.map((c, i) => (
            <div key={`cc-${i}`} className="flex justify-between border-b border-indigo-500/20 pb-1">
              <span>(貸){c.account}</span><span>¥{c.amount.toLocaleString()}</span>
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
  };

  return (
    <div className="space-y-6 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
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
      <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
        <h4 className="flex items-center gap-2 font-bold text-slate-300 mb-3 border-b border-slate-700 pb-2">
          <BookOpen size={18} /> 解説
        </h4>
        <p className="text-slate-300 text-sm leading-relaxed">
          {problem.explanation}
        </p>
      </div>

      {/* Comparison Grid - Hide if surrendered (unless you want to show what you missed) */}
      {/* User asked to see answer even after surrender or death */}
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div className="bg-slate-950/50 p-4 rounded border border-slate-800">
          <h4 className="font-bold text-slate-500 mb-3 text-xs uppercase">あなたの回答</h4>
          {renderUserAnswer()}
        </div>

        <div className="bg-indigo-900/20 p-4 rounded border border-indigo-500/20">
          <h4 className="font-bold text-indigo-400 mb-3 text-xs uppercase">正解</h4>
          {renderCorrectAnswer()}
        </div>
      </div>

      <button
        onClick={onNext}
        className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-lg ${
          isGameOver 
          ? 'bg-red-600 hover:bg-red-700 text-white' 
          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/50'
        }`}
      >
        {isGameOver ? '結果画面へ' : result.monsterDefeated ? '次のモンスターへ' : '次のターンへ'} <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default ResultCard;
