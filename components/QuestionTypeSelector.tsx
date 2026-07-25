import React, { useState } from 'react';
import { BookkeepingLevel, QuestionType } from '../types';
import { BookOpen, CheckCircle2, Circle, ArrowLeft } from 'lucide-react';
import { LEARNING_TOPIC_DEFINITIONS } from '../services/learningTopicService';
import { getLevel2Topics } from '../services/level2TopicService';

type LevelMode = 'level3' | 'commercial' | 'industrial';

interface QuestionTypeSelectorProps {
  onConfirm: (
    types: QuestionType[],
    topic?: string,
    level?: BookkeepingLevel,
    level2Track?: 'commercial' | 'industrial',
    level2Topic?: string
  ) => void;
  onBack: () => void;
}

// 各級・分野で出題できる問題タイプ
const AVAILABLE_TYPES_BY_MODE: Record<LevelMode, QuestionType[]> = {
  level3: [QuestionType.JOURNAL, QuestionType.SELECTION, QuestionType.NUMERIC, QuestionType.STATEMENT],
  commercial: [QuestionType.JOURNAL],
  industrial: [QuestionType.JOURNAL, QuestionType.NUMERIC],
};

const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({ onConfirm, onBack }) => {
  const [levelMode, setLevelMode] = useState<LevelMode>('level3');
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
    QuestionType.JOURNAL,
    QuestionType.SELECTION,
    QuestionType.NUMERIC
  ]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedLevel2Topic, setSelectedLevel2Topic] = useState('');

  const allowedTypesForMode = AVAILABLE_TYPES_BY_MODE[levelMode];

  const changeLevelMode = (mode: LevelMode) => {
    setLevelMode(mode);
    // その級・分野で出題可能なタイプへ選択を揃える
    const allowed = AVAILABLE_TYPES_BY_MODE[mode];
    setSelectedTypes(prev => {
      const filtered = prev.filter(t => allowed.includes(t));
      return filtered.length > 0 ? filtered : [...allowed];
    });
    if (mode !== 'level3') {
      setSelectedTopic('');
    }
    // 級・分野が変わったら論点選択はリセット
    setSelectedLevel2Topic('');
  };

  const toggleType = (type: QuestionType) => {
    if (!allowedTypesForMode.includes(type)) return;
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

  const handleConfirm = () => {
    if (levelMode === 'level3') {
      onConfirm(selectedTypes, selectedTopic || undefined, 'Level3');
    } else {
      onConfirm(selectedTypes, undefined, 'Level2', levelMode, selectedLevel2Topic || undefined);
    }
  };

  // 級・分野別のアクセントカラー（3級=藍 / 2級商業=緑 / 2級工業=橙）
  const levelAccent: Record<LevelMode, { active: string; text: string }> = {
    level3: { active: 'bg-indigo-900/60 border-indigo-500 shadow-lg', text: 'text-white' },
    commercial: { active: 'bg-emerald-900/60 border-emerald-500 shadow-lg', text: 'text-white' },
    industrial: { active: 'bg-amber-900/60 border-amber-500 shadow-lg', text: 'text-white' },
  };

  const levelOptions: { mode: LevelMode; label: string; hint: string }[] = [
    { mode: 'level3', label: '3級', hint: '商業簿記の基礎' },
    { mode: 'commercial', label: '2級 商業', hint: '有価証券・本支店 他' },
    { mode: 'industrial', label: '2級 工業', hint: '原価計算・製造' },
  ];


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
    },
    {
      type: QuestionType.STATEMENT,
      name: '第3問: 決算総合問題',
      description: '決算整理・精算表・財務諸表を作成',
      emoji: '📊',
      color: 'amber'
    }
  ];

  const topicOptions = LEARNING_TOPIC_DEFINITIONS.filter(topic => topic.topic !== 'general' && topic.topic !== 'journal-basics');
  const level2TopicOptions = levelMode === 'level3' ? [] : getLevel2Topics(levelMode);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="relative z-10 max-w-2xl w-full space-y-8">
        <div className="space-y-4 animate-in fade-in zoom-in duration-500">
          <div className="inline-block p-4 bg-slate-800 rounded-full mb-4 border-4 border-indigo-500 shadow-xl">
            <BookOpen size={48} className="text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white font-pixel">出題範囲を選択</h1>
          <p className="text-slate-400 text-lg">挑戦したい級と問題タイプを選んでください</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {levelOptions.map((opt) => {
            const active = levelMode === opt.mode;
            return (
              <button
                key={opt.mode}
                onClick={() => changeLevelMode(opt.mode)}
                aria-pressed={active}
                className={`p-4 rounded-xl border-4 transition-all hover:scale-105 ${
                  active
                    ? levelAccent[opt.mode].active
                    : 'bg-slate-800 border-slate-600'
                }`}
              >
                <div className={`text-lg font-black ${active ? levelAccent[opt.mode].text : 'text-slate-200'}`}>{opt.label}</div>
                <div className="text-[11px] text-slate-400 mt-1 leading-tight">{opt.hint}</div>
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          {typeInfo.map((info) => {
            const selected = isSelected(info.type);
            const disabled = !allowedTypesForMode.includes(info.type);
              const colorClasses = {
                blue: selected ? 'bg-blue-900/60 border-blue-500' : 'bg-slate-800 border-slate-600',
                green: selected ? 'bg-green-900/60 border-green-500' : 'bg-slate-800 border-slate-600',
                purple: selected ? 'bg-purple-900/60 border-purple-500' : 'bg-slate-800 border-slate-600',
                amber: selected ? 'bg-amber-900/60 border-amber-500' : 'bg-slate-800 border-slate-600'
              };

            return (
              <button
                key={info.type}
                onClick={() => toggleType(info.type)}
                disabled={disabled}
                className={`w-full p-6 rounded-xl border-4 transition-all ${
                  disabled
                    ? 'opacity-40 cursor-not-allowed bg-slate-800 border-slate-700'
                    : `hover:scale-105 ${colorClasses[info.color as keyof typeof colorClasses]}`
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl" aria-hidden="true">{info.emoji}</div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-bold text-white mb-1">{info.name}</h3>
                    <p className="text-slate-400 text-sm">{info.description}</p>
                  </div>
                  <div className="text-white">
                    {disabled
                      ? <Circle size={32} className="text-slate-700" />
                      : selected ? <CheckCircle2 size={32} /> : <Circle size={32} className="text-slate-600" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {levelMode === 'level3' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-left shadow-lg">
          <label htmlFor="topic-filter" className="block text-sm font-bold text-slate-200 mb-2">
            論点フィルタ
          </label>
          <select
            id="topic-filter"
            value={selectedTopic}
            onChange={(event) => setSelectedTopic(event.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-3 text-slate-100 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
          >
            <option value="">すべての論点</option>
            {topicOptions.map(topic => (
              <option key={topic.topic} value={topic.topic}>{topic.label}</option>
            ))}
          </select>
        </div>
        )}

        {levelMode !== 'level3' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-left shadow-lg">
          <label htmlFor="level2-topic-filter" className="block text-sm font-bold text-slate-200 mb-2">
            論点フィルタ（{levelMode === 'commercial' ? '商業簿記' : '工業簿記'}）
          </label>
          <select
            id="level2-topic-filter"
            value={selectedLevel2Topic}
            onChange={(event) => setSelectedLevel2Topic(event.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="">すべての論点</option>
            {level2TopicOptions.map(topic => (
              <option key={topic.key} value={topic.key}>{topic.label}</option>
            ))}
          </select>
        </div>
        )}

        <div className="pt-4 space-y-3">
          <button
            onClick={handleConfirm}
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

export default React.memo(QuestionTypeSelector);
