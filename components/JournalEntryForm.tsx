
import React, { useState, useEffect } from 'react';
import { JournalEntryAnswer, JournalEntryItem, QuestionType, UserAnswer, GeneratedProblem, SoundType } from '../types';
import { ACCOUNT_TITLES } from '../constants';
import { Trash2, Plus, Sword, Calculator, CheckCircle2, ChevronDown } from 'lucide-react';
import { audioService } from '../services/audioService';

interface JournalEntryFormProps {
  problem: GeneratedProblem;
  onSubmit: (answer: UserAnswer) => void;
  isSubmitting: boolean;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ problem, onSubmit, isSubmitting }) => {
  // State for Journal Type
  const [debits, setDebits] = useState<JournalEntryItem[]>([{ account: '', amount: 0 }]);
  const [credits, setCredits] = useState<JournalEntryItem[]>([{ account: '', amount: 0 }]);

  // State for Numeric Type
  const [numericInput, setNumericInput] = useState<string | number>('');

  // State for Selection Type
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Determine available accounts for Journal Type
  const availableAccounts = problem.selectableAccounts || ACCOUNT_TITLES;
  const availableAmounts = problem.amountOptions || [];

  // Reset state when problem changes
  useEffect(() => {
    setDebits([{ account: '', amount: 0 }]);
    setCredits([{ account: '', amount: 0 }]);
    setNumericInput('');
    setSelectedOption(null);
  }, [problem]);

  // --- Handlers for Journal ---
  const handleAddRow = (type: 'debit' | 'credit') => {
    audioService.playSfx(SoundType.SFX_SELECT);
    if (type === 'debit') setDebits([...debits, { account: '', amount: 0 }]);
    else setCredits([...credits, { account: '', amount: 0 }]);
  };

  const handleRemoveRow = (type: 'debit' | 'credit', index: number) => {
    audioService.playSfx(SoundType.SFX_CANCEL);
    if (type === 'debit' && debits.length > 1) {
      const newRows = [...debits];
      newRows.splice(index, 1);
      setDebits(newRows);
    } else if (type === 'credit' && credits.length > 1) {
      const newRows = [...credits];
      newRows.splice(index, 1);
      setCredits(newRows);
    }
  };

  const handleChange = (type: 'debit' | 'credit', index: number, field: keyof JournalEntryItem, value: string | number) => {
    const setter = type === 'debit' ? setDebits : setCredits;
    setter(prev => {
      const newRows = [...prev];
      if (field === 'account') {
        newRows[index] = { ...newRows[index], account: value as string };
      } else if (field === 'amount') {
        newRows[index] = { ...newRows[index], amount: Number(value) };
      }
      return newRows;
    });
  };

  const submitJournal = () => {
    audioService.playSfx(SoundType.SFX_DECISION);
    const cleanDebits = debits.filter(d => d.account !== '' && d.amount > 0);
    const cleanCredits = credits.filter(c => c.account !== '' && c.amount > 0);
    onSubmit({ debits: cleanDebits, credits: cleanCredits });
  };

  // --- Render ---

  // 1. SELECTION TYPE
  if (problem.type === QuestionType.SELECTION) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {problem.options?.map((option, idx) => (
            <button
              key={idx}
              onClick={() => {
                audioService.playSfx(SoundType.SFX_SELECT);
                setSelectedOption(option);
              }}
              disabled={isSubmitting}
              className={`p-3 rounded-xl border-2 font-bold transition-all shadow-sm flex items-center justify-center min-h-[80px] relative ${
                selectedOption === option
                  ? 'bg-indigo-600 border-indigo-400 ring-4 ring-indigo-500/20 z-10 text-white'
                  : 'bg-slate-900/80 backdrop-blur-sm border-slate-600 hover:bg-slate-800 hover:border-indigo-400 text-slate-100'
              }`}
            >
              {selectedOption === option && (
                <div className="absolute top-2 right-2 text-white">
                  <CheckCircle2 size={20} />
                </div>
              )}
              <span className="text-base md:text-lg">{option}</span>
            </button>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={() => {
              if (selectedOption) {
                audioService.playSfx(SoundType.SFX_DECISION);
                onSubmit(selectedOption);
              }
            }}
            disabled={!selectedOption || isSubmitting}
            className={`w-full md:w-auto px-8 py-3 rounded-full font-black text-base md:text-lg flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-105 active:scale-95 ${
              !selectedOption
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white ring-4 ring-indigo-400/30'
            }`}
          >
            <Sword size={24} /> 攻撃決定！
          </button>
        </div>
      </div>
    );
  }

  // 2. NUMERIC TYPE
  if (problem.type === QuestionType.NUMERIC) {
    return (
      <div className="flex flex-col items-center justify-center py-2">
        <div className="bg-slate-900/80 backdrop-blur-sm p-4 md:p-5 rounded-2xl shadow-lg border-2 border-indigo-500/50 w-full max-w-md">
          <label className="block text-slate-300 text-sm font-bold mb-2">計算結果を選択してください</label>
          <div className="relative">
            <Calculator className="absolute left-4 top-4 text-slate-400" />
            
            {availableAmounts.length > 0 ? (
              <select
                value={numericInput}
                onChange={(e) => {
                    audioService.playSfx(SoundType.SFX_SELECT);
                    setNumericInput(Number(e.target.value));
                }}
                className="w-full pl-12 pr-10 py-3 text-lg md:text-xl font-bold text-right bg-slate-800/80 border-2 border-slate-600 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 outline-none text-slate-100 appearance-none"
              >
                <option value="" disabled>答えを選択</option>
                {availableAmounts.map((amt) => (
                  <option key={amt} value={amt}>¥{amt.toLocaleString()}</option>
                ))}
              </select>
            ) : (
              <input
                 type="number"
                 value={numericInput}
                 onChange={(e) => setNumericInput(e.target.value)}
                 className="w-full pl-12 pr-4 py-3 text-xl md:text-2xl font-bold text-right bg-slate-800/80 border-2 border-slate-600 rounded-xl focus:border-indigo-400 outline-none text-slate-100"
                 placeholder="金額入力"
              />
            )}
            {availableAmounts.length > 0 && (
                <div className="absolute right-4 top-5 text-slate-400 pointer-events-none">
                  <ChevronDown size={20} />
                </div>
            )}
          </div>
          <button
            onClick={() => {
              if (numericInput !== '') {
                audioService.playSfx(SoundType.SFX_DECISION);
                onSubmit(Number(numericInput));
              }
            }}
            disabled={numericInput === '' || isSubmitting}
            className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
             <Sword size={20} /> 攻撃決定！
          </button>
        </div>
      </div>
    );
  }

  // 3. JOURNAL TYPE (Default)
  const totalDebit = debits.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalCredit = credits.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  
  // Validation: Balanced amounts AND no empty accounts
  const hasEmptyAccounts = debits.some(d => !d.account) || credits.some(c => !c.account);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;
  const isFormValid = isBalanced && !hasEmptyAccounts;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Debit Side */}
        <div className="bg-slate-900/80 backdrop-blur-sm p-3 rounded-xl border-2 border-indigo-500/50 shadow-sm">
          <h3 className="text-base font-bold text-slate-200 mb-2 border-b border-slate-600 pb-1.5 flex justify-between items-center">
            <span className="flex items-center gap-2"><span className="w-3 h-3 bg-indigo-500 rounded-full"></span>借方 (左)</span>
          </h3>
          <div className="space-y-2">
            {debits.map((row, index) => (
              <div key={`debit-${index}`} className="flex gap-2 items-center">
                <div className="flex-1">
                  <select
                    className={`w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-slate-800/80 text-slate-100 font-medium appearance-none ${row.account === '' ? 'border-red-400 bg-red-900/30' : 'border-slate-600'}`}
                    value={row.account}
                    onChange={(e) => handleChange('debit', index, 'account', e.target.value)}
                  >
                    <option value="" className="text-slate-400">勘定科目を選択</option>
                    {availableAccounts.map((t) => (
                      <option key={t} value={t} className="text-slate-900">{t}</option>
                    ))}
                  </select>
                </div>
                <div className="w-36 relative">
                  <select
                    className="w-full p-2 pl-2 pr-6 border border-slate-600 rounded-md text-sm text-right focus:ring-2 focus:ring-indigo-400 outline-none font-mono font-bold text-slate-100 bg-slate-800/80 appearance-none"
                    value={row.amount === 0 ? '' : row.amount}
                    onChange={(e) => handleChange('debit', index, 'amount', e.target.value)}
                  >
                    <option value="" disabled>金額を選択</option>
                    {availableAmounts.map((amt) => (
                      <option key={amt} value={amt}>¥{amt.toLocaleString()}</option>
                    ))}
                  </select>
                   <div className="absolute right-1 top-2.5 text-slate-400 pointer-events-none">
                      <ChevronDown size={14} />
                   </div>
                </div>
                <button
                  onClick={() => handleRemoveRow('debit', index)}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  disabled={debits.length === 1}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddRow('debit')}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2"
            >
              <Plus size={16} /> 行を追加
            </button>
          </div>
        </div>

        {/* Credit Side */}
        <div className="bg-slate-900/80 backdrop-blur-sm p-4 rounded-xl border-2 border-indigo-500/50 shadow-sm">
          <h3 className="text-lg font-bold text-slate-200 mb-3 border-b border-slate-600 pb-2 flex justify-between items-center">
             <span className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full"></span>貸方 (右)</span>
          </h3>
          <div className="space-y-3">
            {credits.map((row, index) => (
              <div key={`credit-${index}`} className="flex gap-2 items-center">
                <div className="flex-1">
                  <select
                    className={`w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-slate-800/80 text-slate-100 font-medium appearance-none ${row.account === '' ? 'border-red-400 bg-red-900/30' : 'border-slate-600'}`}
                    value={row.account}
                    onChange={(e) => handleChange('credit', index, 'account', e.target.value)}
                  >
                    <option value="" className="text-slate-400">勘定科目を選択</option>
                    {availableAccounts.map((t) => (
                      <option key={t} value={t} className="text-slate-100">{t}</option>
                    ))}
                  </select>
                </div>
                <div className="w-36 relative">
                   <select
                    className="w-full p-2 pl-2 pr-6 border border-slate-600 rounded-md text-sm text-right focus:ring-2 focus:ring-indigo-400 outline-none font-mono font-bold text-slate-100 bg-slate-800/80 appearance-none"
                    value={row.amount === 0 ? '' : row.amount}
                    onChange={(e) => handleChange('credit', index, 'amount', e.target.value)}
                  >
                    <option value="" disabled>金額を選択</option>
                    {availableAmounts.map((amt) => (
                      <option key={amt} value={amt}>¥{amt.toLocaleString()}</option>
                    ))}
                  </select>
                   <div className="absolute right-1 top-2.5 text-slate-400 pointer-events-none">
                      <ChevronDown size={14} />
                   </div>
                </div>
                <button
                  onClick={() => handleRemoveRow('credit', index)}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  disabled={credits.length === 1}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddRow('credit')}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2"
            >
              <Plus size={16} /> 行を追加
            </button>
          </div>
        </div>
      </div>

      {/* Summary & Submit */}
      <div className="bg-slate-800 p-3 rounded-lg flex flex-col md:flex-row justify-between items-center gap-3 shadow-inner">
        <div className="flex gap-6 text-sm font-bold font-mono">
          <div className={`flex gap-2 ${totalDebit !== totalCredit ? 'text-red-400' : 'text-green-400'}`}>
            <span>借方計:</span>
            <span>¥{totalDebit.toLocaleString()}</span>
          </div>
          <div className={`flex gap-2 ${totalDebit !== totalCredit ? 'text-red-400' : 'text-green-400'}`}>
            <span>貸方計:</span>
            <span>¥{totalCredit.toLocaleString()}</span>
          </div>
        </div>
        <button
          onClick={submitJournal}
          disabled={!isFormValid || isSubmitting}
          className={`w-full md:w-auto px-8 py-3 rounded-full font-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-105 active:scale-95 ${
            !isFormValid
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-800'
          }`}
        >
          <Sword size={24} /> 攻撃決定！
        </button>
      </div>
      {(!isBalanced || hasEmptyAccounts) && totalDebit > 0 && totalCredit > 0 && (
         <div className="text-center space-y-1">
            {!isBalanced && <p className="text-red-400 text-sm font-bold bg-red-900/20 py-1 rounded animate-pulse">貸借の金額が一致していません！</p>}
            {hasEmptyAccounts && <p className="text-yellow-400 text-sm font-bold bg-yellow-900/20 py-1 rounded">勘定科目を選択してください！</p>}
         </div>
      )}
    </div>
  );
};

export default JournalEntryForm;
