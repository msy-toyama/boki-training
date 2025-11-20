import React, { useState } from 'react';
import { QuestionType } from '../types';
import { BookOpen, CheckCircle2, Circle, ArrowLeft } from 'lucide-react';

interface QuestionTypeSelectorProps {
  onConfirm: (types: QuestionType[]) => void;
  onBack: () => void;
}

const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({ onConfirm, onBack }) => {
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
    QuestionType.JOURNAL,
    QuestionType.SELECTION,
    QuestionType.NUMERIC
  ]);

  const toggleType = (type: QuestionType) => {
    if (selectedTypes.includes(type)) {
      // 最低1つは選択必須
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter(t => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const isSelected = (type: QuestionType) => selectedTypes.includes(type);

  const typeInfo = [
    {
      type: QuestionType.JOURNAL,
      name: '第1問: 仕訳問題',
      description: '取引の仕訳を入力',
      emoji: '📝',
      color: 'blue'
    },
    {
      type: QuestionType.SELECTION,
      name: '第2問: 選択問題',
      description: '正しい選択肢を選ぶ',
      emoji: '✅',
      color: 'green'
    },
    {
      type: QuestionType.NUMERIC,
      name: '第3問: 数値問題',
      description: '金額や数値を計算',
      emoji: '🔢',
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="relative z-10 max-w-2xl w-full space-y-8">
        <div className="space-y-4 animate-in fade-in zoom-in duration-500">
          <div className="inline-block p-4 bg-slate-800 rounded-full mb-4 border-4 border-indigo-500 shadow-xl">
            <BookOpen size={48} className="text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white font-pixel">出題範囲を選択</h1>
          <p className="text-slate-400 text-lg">挑戦したい問題タイプを選んでください</p>
        </div>

        <div className="space-y-4">
          {typeInfo.map((info) => {
            const selected = isSelected(info.type);
            const colorClasses = {
              blue: selected ? 'bg-blue-900/60 border-blue-500' : 'bg-slate-800 border-slate-600',
              green: selected ? 'bg-green-900/60 border-green-500' : 'bg-slate-800 border-slate-600',
              purple: selected ? 'bg-purple-900/60 border-purple-500' : 'bg-slate-800 border-slate-600'
            };

            return (
              <button
                key={info.type}
                onClick={() => toggleType(info.type)}
                className={`w-full p-6 rounded-xl border-4 transition-all hover:scale-105 ${colorClasses[info.color as keyof typeof colorClasses]}`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{info.emoji}</div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-bold text-white mb-1">{info.name}</h3>
                    <p className="text-slate-400 text-sm">{info.description}</p>
                  </div>
                  <div className="text-white">
                    {selected ? <CheckCircle2 size={32} /> : <Circle size={32} className="text-slate-600" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-4 space-y-3">
          <button
            onClick={() => onConfirm(selectedTypes)}
            disabled={selectedTypes.length === 0}
            className="w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg text-lg"
          >
            この範囲で挑戦開始 ({selectedTypes.length}タイプ選択中)
          </button>
          
          <button
            onClick={onBack}
            className="w-full px-8 py-3 text-slate-400 hover:text-white font-bold transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} /> 難易度選択に戻る
          </button>
        </div>

        <div className="text-xs text-slate-500 bg-slate-800/50 rounded-lg p-3">
          💡 ヒント: 特定の問題タイプに集中して学習したい場合は、1つだけ選択することもできます
        </div>
      </div>
    </div>
  );
};

export default QuestionTypeSelector;
