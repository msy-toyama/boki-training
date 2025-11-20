import React, { useState } from 'react';
import { QuestionType } from '../types';
import { BookOpen, CheckSquare, Calculator } from 'lucide-react';

interface QuestionTypeSelectorProps {
  onConfirm: (selectedTypes: QuestionType[]) => void;
  onBack: () => void;
}

const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({ onConfirm, onBack }) => {
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
    QuestionType.JOURNAL,
    QuestionType.SELECTION,
    QuestionType.NUMERIC
  ]);

  const toggleType = (type: QuestionType) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        // 最後の1つは削除できない
        if (prev.length === 1) return prev;
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleConfirm = () => {
    if (selectedTypes.length > 0) {
      onConfirm(selectedTypes);
    }
  };

  const typeInfo = [
    {
      type: QuestionType.JOURNAL,
      label: '第1問：仕訳問題',
      icon: <BookOpen className="w-8 h-8" />,
      description: '取引を仕訳形式で記録',
      count: '62問'
    },
    {
      type: QuestionType.SELECTION,
      label: '第2問：選択問題',
      icon: <CheckSquare className="w-8 h-8" />,
      description: '勘定科目の分類など',
      count: '30問'
    },
    {
      type: QuestionType.NUMERIC,
      label: '第3問：計算問題',
      icon: <Calculator className="w-8 h-8" />,
      description: '金額や数値を計算',
      count: '24問'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="relative z-10 max-w-2xl w-full space-y-8">
        <div className="space-y-4 animate-in fade-in zoom-in duration-700">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            出題形式の選択
          </h2>
          <p className="text-indigo-300 text-lg">
            100問の出題範囲を選んでください（複数選択可）
          </p>
        </div>

        <div className="space-y-4">
          {typeInfo.map((info) => {
            const isSelected = selectedTypes.includes(info.type);
            return (
              <button
                key={info.type}
                onClick={() => toggleType(info.type)}
                className={`group w-full p-6 rounded-xl border-4 transition-all duration-200 text-left hover:-translate-y-1 ${
                  isSelected
                    ? 'border-indigo-500 bg-slate-800 shadow-xl shadow-indigo-500/20'
                    : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`transition-colors ${isSelected ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
                    {info.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {info.label}
                      </h3>
                      <span className={`text-sm font-semibold ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`}>
                        {info.count}
                      </span>
                    </div>
                    <p className={`text-sm ${isSelected ? 'text-indigo-300' : 'text-slate-500'}`}>
                      {info.description}
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-600'
                  }`}>
                    {isSelected && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-slate-800 border-2 border-indigo-500/30 rounded-lg p-4">
          <p className="text-sm text-indigo-300">
            <strong className="text-white">選択中：</strong>
            {selectedTypes.length === 3 ? (
              ' 全ての問題形式（バランス良く出題されます）'
            ) : selectedTypes.length === 1 ? (
              ` ${typeInfo.find(i => i.type === selectedTypes[0])?.label}のみ`
            ) : (
              ` ${selectedTypes.length}種類の問題形式`
            )}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 bg-slate-700 text-slate-300 rounded-xl font-bold hover:bg-slate-600 transition-colors border-2 border-slate-600"
          >
            戻る
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedTypes.length === 0}
            className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all border-2 ${
              selectedTypes.length > 0
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-500 shadow-lg shadow-indigo-500/50 hover:-translate-y-1'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed border-slate-700'
            }`}
          >
            決定して開始
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionTypeSelector;
