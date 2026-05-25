
import React, { useEffect, useState } from 'react';
import { ScoreRecord, Difficulty, LearningStatsSummary } from '../types';
import { getHistory, getPersonalBest } from '../services/scoreService';
import { getLearningStatsSummary } from '../services/learningStatsService';
import { History, ArrowLeft, Filter, Target, Flame, CalendarDays, TrendingDown } from 'lucide-react';

interface RankingScreenProps {
  onBack: () => void;
}

const RankingScreen: React.FC<RankingScreenProps> = ({ onBack }) => {
  const [history, setHistory] = useState<ScoreRecord[]>([]);
  const [bestEasy, setBestEasy] = useState(0);
  const [bestHard, setBestHard] = useState(0);
  const [stats, setStats] = useState<LearningStatsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | Difficulty>('All');

  useEffect(() => {
    setLoading(true);
    setHistory(getHistory());
    setBestEasy(getPersonalBest('Easy'));
    setBestHard(getPersonalBest('Hard'));
    setStats(getLearningStatsSummary());
    setLoading(false);
  }, []);

  const filteredHistory = history.filter(rec => filter === 'All' || rec.difficulty === filter);

  return (
    <div className="min-h-screen bg-slate-900 p-4 text-slate-100">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6">
          <ArrowLeft size={20} /> 戻る
        </button>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
             <h2 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-2">EASY BEST</h2>
             <div className="text-3xl font-black text-white font-mono">
               {bestEasy.toLocaleString()}
             </div>
          </div>
          <div className="bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
             <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">HARD BEST</h2>
             <div className="text-3xl font-black text-white font-mono">
               {bestHard.toLocaleString()}
             </div>
          </div>
        </div>

        {stats && (
          <section className="mb-8 space-y-4" aria-labelledby="learning-stats-heading">
            <div className="flex items-center justify-between gap-3">
              <h2 id="learning-stats-heading" className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="text-indigo-400" /> 弱点分析
              </h2>
              <div className="text-xs text-slate-500">
                正答 {stats.correctAttempts} / {stats.totalAttempts}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
                <CalendarDays size={18} className="mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-black text-white">{stats.last7DaysAttempts}</div>
                <div className="text-[11px] text-slate-400">直近7日</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
                <Flame size={18} className="mx-auto mb-2 text-orange-400" />
                <div className="text-2xl font-black text-white">{stats.streakDays}</div>
                <div className="text-[11px] text-slate-400">連続日数</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
                <Target size={18} className="mx-auto mb-2 text-emerald-400" />
                <div className="text-2xl font-black text-white">
                  {stats.totalAttempts === 0 ? 0 : Math.round((stats.correctAttempts / stats.totalAttempts) * 100)}%
                </div>
                <div className="text-[11px] text-slate-400">総合正答率</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                <h3 className="text-sm font-bold text-red-300 flex items-center gap-2 mb-3">
                  <TrendingDown size={16} /> 苦手トップ3
                </h3>
                {stats.weakestTopics.length === 0 ? (
                  <p className="text-sm text-slate-500">2回以上解いた正答率80%未満の論点が表示されます。</p>
                ) : (
                  <div className="space-y-3">
                    {stats.weakestTopics.map(topic => (
                      <div key={topic.topic} className="space-y-1">
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <span className="font-bold text-slate-200">{topic.label}</span>
                          <span className="font-mono text-red-300">{topic.accuracy}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500" style={{ width: `${topic.accuracy}%` }} />
                        </div>
                        <a href={`/?topic=${topic.topic}&difficulty=practice`} className="text-xs text-indigo-300 hover:text-indigo-200 underline">
                          この論点をPracticeで鍛える
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                <h3 className="text-sm font-bold text-indigo-300 mb-3">論点別正答率</h3>
                {stats.byTopic.length === 0 ? (
                  <p className="text-sm text-slate-500">問題を解くと論点別の正答率が記録されます。</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {stats.byTopic.map(topic => (
                      <div key={topic.topic} className="flex items-center justify-between gap-3 text-sm border-b border-slate-700/70 pb-2">
                        <div className="min-w-0">
                          <div className="font-bold text-slate-200 truncate">{topic.label}</div>
                          <div className="text-xs text-slate-500">{topic.correct}/{topic.attempts} 正解</div>
                        </div>
                        <span className={`font-mono font-bold ${topic.accuracy >= 80 ? 'text-emerald-300' : topic.accuracy >= 50 ? 'text-yellow-300' : 'text-red-300'}`}>
                          {topic.accuracy}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="text-indigo-400" /> プレイ履歴
          </h3>
          
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
             {(['All', 'Easy', 'Hard'] as const).map(type => (
               <button
                 key={type}
                 onClick={() => setFilter(type)}
                 className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                   filter === type 
                     ? 'bg-indigo-600 text-white shadow' 
                     : 'text-slate-400 hover:text-slate-200'
                 }`}
               >
                 {type}
               </button>
             ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden min-h-[400px]">
           {loading ? (
             <div className="flex items-center justify-center h-64 text-slate-500">読み込み中...</div>
           ) : (
             <div className="divide-y divide-slate-700">
                {filteredHistory.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                        <Filter size={32} className="text-slate-500" />
                      </div>
                      履歴が見つかりません。
                    </div>
                 ) : (
                   filteredHistory.map((rec, idx) => (
                     <div key={idx} className="p-5 flex items-center justify-between hover:bg-slate-750 transition-colors group">
                       <div>
                         <div className="text-xs text-slate-500 mb-1">{new Date(rec.date).toLocaleString()}</div>
                         <div className="font-bold text-white flex items-center gap-3">
                           <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold border ${rec.difficulty === 'Hard' ? 'bg-red-900/50 border-red-700 text-red-300' : 'bg-green-900/50 border-green-700 text-green-300'}`}>
                             {rec.difficulty}
                           </span>
                           <span className="text-sm text-slate-300 flex items-center gap-1">
                             Q.{rec.questionsAnswered} <span className="text-slate-600">/</span> <span className="text-slate-500">討伐 {rec.monsterDefeated}</span>
                           </span>
                         </div>
                       </div>
                       <div className="text-2xl font-mono font-bold text-indigo-300 group-hover:text-yellow-400 transition-colors">
                          {rec.score.toLocaleString()}
                       </div>
                     </div>
                   ))
                 )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default RankingScreen;
