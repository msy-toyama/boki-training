
import React, { useState, useEffect, useRef } from 'react';
import { generateProblem } from './services/problemService';
import { saveScore, getUserProfile, getPersonalBest } from './services/scoreService';
import { GeneratedProblem, UserAnswer, Difficulty, Monster, BattleResult, PlayerState, QuestionType, JournalEntryAnswer, ScoreRecord, UserProfile, SoundType } from './types';
import { MONSTERS_LIST, MAX_QUESTIONS, GAME_SETTINGS } from './constants';
import { audioService } from './services/audioService';
import JournalEntryForm from './components/JournalEntryForm';
import ResultCard from './components/ResultCard';
import BattleScene from './components/BattleScene';
import RankingScreen from './components/RankingScreen';
import QuestionTypeSelector from './components/QuestionTypeSelector';
import { Sword, Shield, Trophy, AlertTriangle, BookOpen, Flag, BarChart3, History, Crown, Settings, Volume2, VolumeX, Music, Zap } from 'lucide-react';

const App: React.FC = () => {
  // Game Flow State
  const [screen, setScreen] = useState<'title' | 'settings' | 'question-type-select' | 'battle' | 'result' | 'gameover' | 'clear' | 'ranking'>('title');
  const [soundSettings, setSoundSettings] = useState({ bgm: true, sfx: true });
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<QuestionType[]>([
    QuestionType.JOURNAL,
    QuestionType.SELECTION,
    QuestionType.NUMERIC
  ]);
  
  // Data State
  const [problem, setProblem] = useState<GeneratedProblem | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentHighScore, setCurrentHighScore] = useState(0);
  
  // Progression State
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [monsterIndex, setMonsterIndex] = useState(0);
  
  // Entity State
  const [currentMonster, setCurrentMonster] = useState<Monster | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    maxHp: 100,
    currentHp: 100,
    score: 0,
    combo: 0
  });

  // Turn/Battle Results
  const [userAnswer, setUserAnswer] = useState<UserAnswer | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Visual/Timer State
  const [timer, setTimer] = useState(0); 
  const [attackInterval, setAttackInterval] = useState(15); 
  const [damageDisplay, setDamageDisplay] = useState<{ amount: number; isCritical: boolean; target: 'monster' | 'player' } | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Surrender Modal
  const [showSurrenderConfirm, setShowSurrenderConfirm] = useState(false);

  const timerRef = useRef<number | null>(null);

  // --- Initialize Audio Settings ---
  useEffect(() => {
    const profile = getUserProfile();
    if (profile) {
      const settings = { bgm: profile.soundSettings.bgm, sfx: profile.soundSettings.sfx };
      setSoundSettings(settings);
      audioService.setSettings(settings.bgm, settings.sfx);
    }
  }, []);

  // --- Audio BGM Management ---
  useEffect(() => {
    if (screen === 'title') {
      audioService.playBgm(SoundType.BGM_TITLE);
    } else if (screen === 'battle') {
      // Difficulty based BGM
      audioService.playBgm(difficulty === 'Easy' ? SoundType.BGM_BATTLE_EASY : SoundType.BGM_BATTLE_HARD);
    } else if (screen === 'gameover' || screen === 'clear' || screen === 'ranking') {
      audioService.stopBgm();
      if (screen === 'gameover') audioService.playSfx(SoundType.SFX_GAMEOVER);
      if (screen === 'clear') audioService.playSfx(SoundType.SFX_CLEAR);
    }
  }, [screen, difficulty]);

  // --- Initialize Monster ---
  const spawnMonster = (index: number): Monster => {
    const baseMonster = MONSTERS_LIST[index % MONSTERS_LIST.length];
    const loopCount = Math.floor(index / MONSTERS_LIST.length);
    const multiplier = 1 + (loopCount * 0.5);
    return {
      ...baseMonster,
      id: crypto.randomUUID(),
      maxHp: Math.floor(baseMonster.hp * multiplier),
      currentHp: Math.floor(baseMonster.hp * multiplier),
      level: index + 1
    };
  };

  // --- Dynamic Timer Calculation ---
  const calculateInterval = (diff: Difficulty, qIndex: number) => {
    const settings = GAME_SETTINGS[diff];
    const progress = Math.min(qIndex / MAX_QUESTIONS, 1);
    const current = settings.startInterval - (progress * (settings.startInterval - settings.minInterval));
    return Math.max(settings.minInterval, current);
  };

  // --- Handle Time Damage ---
  const handleTimeDamage = React.useCallback(() => {
    audioService.playSfx(SoundType.SFX_DAMAGE);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    const damage = 10 + Math.floor(questionsAnswered / 10);
    setDamageDisplay({ amount: damage, isCritical: false, target: 'player' });
    
    setPlayerState(prev => {
      const nextHp = Math.max(0, prev.currentHp - damage);
      
      if (nextHp === 0) {
        if (timerRef.current !== null) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setTimeout(() => {
            setBattleResult({
                damageDealt: 0,
                damageTaken: damage,
                isCorrect: false,
                isCritical: false,
                timeBonus: 0,
                monsterDefeated: false,
                playerDefeated: true
            });
            setScreen('result');
        }, 1000);
      }
      
      return { ...prev, currentHp: nextHp, combo: 0 };
    });
    
    setTimeout(() => setDamageDisplay(null), 1500);
  }, [questionsAnswered]);

  // --- Timer Loop ---
  useEffect(() => {
    if (screen === 'battle' && !loading && problem && !showSurrenderConfirm) {
      timerRef.current = window.setInterval(() => {
        setTimer(prev => {
          const nextTime = prev + 0.1;
          if (nextTime >= attackInterval) {
             handleTimeDamage();
             return 0; 
          }
          return nextTime;
        });
      }, 100);
    } else {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [screen, loading, problem, attackInterval, showSurrenderConfirm, handleTimeDamage]);

  // --- Save Score Effect on Game End ---
  useEffect(() => {
    if (screen === 'gameover' || screen === 'clear') {
      const profile = getUserProfile();
      
      const record: ScoreRecord = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        score: playerState.score,
        difficulty: difficulty,
        questionsAnswered: questionsAnswered,
        monsterDefeated: monsterIndex,
        userName: profile?.name || 'プレイヤー',
        prefecture: profile?.prefecture || '未設定'
      };
      saveScore(record);
    }
  }, [screen]);

  // --- Start Game (show question type selector) ---
  const selectDifficulty = (selectedDiff: Difficulty) => {
    audioService.init();
    audioService.playSfx(SoundType.SFX_DECISION);
    setDifficulty(selectedDiff);
    setScreen('question-type-select');
  };

  // --- Confirm Question Types and Start Battle ---
  const confirmQuestionTypes = (types: QuestionType[]) => {
    audioService.playSfx(SoundType.SFX_DECISION);
    setSelectedQuestionTypes(types);
    
    // Load best score for this difficulty
    const best = getPersonalBest(difficulty);
    setCurrentHighScore(best);

    const settings = GAME_SETTINGS[difficulty];
    setPlayerState({
      maxHp: settings.playerHp,
      currentHp: settings.playerHp,
      score: 0,
      combo: 0
    });
    setQuestionsAnswered(0);
    setMonsterIndex(0);
    setCurrentMonster(spawnMonster(0));
    setAttackInterval(settings.startInterval);
    setScreen('battle');
    
    // Load first problem with selected question types
    loadNextProblem(difficulty, 0, types);
  };

  const loadNextProblem = async (diff: Difficulty, qIndex: number, types: QuestionType[]) => {
    setLoading(true);
    setTimer(0);
    setUserAnswer(null);
    setBattleResult(null);
    setDamageDisplay(null);
    setShowSurrenderConfirm(false);
    setIsSubmitting(false);
    setAttackInterval(calculateInterval(diff, qIndex));
    
    const newProblem = await generateProblem(diff, types);
    setProblem(newProblem);
    setLoading(false);
  };

  // --- Validate Answer ---
  const checkAnswer = (userAns: UserAnswer, prob: GeneratedProblem): boolean => {
    if (prob.type === QuestionType.SELECTION) {
      return typeof userAns === 'string' && userAns === prob.correctSelection;
    }
    if (prob.type === QuestionType.NUMERIC) {
      return typeof userAns === 'number' && userAns === prob.correctNumeric;
    }
    if (prob.type === QuestionType.JOURNAL && prob.correctJournal) {
      // 型ガード: userAnsがJournalEntryAnswerであることを確認
      if (typeof userAns === 'object' && userAns !== null && 'debits' in userAns && 'credits' in userAns) {
        const u = userAns as JournalEntryAnswer;
        const normalize = (items: { account: string; amount: number }[]) => 
          items.map(i => `${i.account}:${i.amount}`).sort().join('|');
        return normalize(u.debits) === normalize(prob.correctJournal.debits) &&
               normalize(u.credits) === normalize(prob.correctJournal.credits);
      }
    }
    return false;
  };

  const handleAnswer = (answer: UserAnswer) => {
    if (!problem || !currentMonster || isSubmitting) return;
    setIsSubmitting(true);
    
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const isCorrect = checkAnswer(answer, problem);

    let damageDealt = 0;
    let damageTaken = 0;
    let timeBonus = 0;
    let isCritical = false;

    if (isCorrect) {
      damageDealt = 20;
      if (timer < attackInterval * 0.3) {
        isCritical = true;
        damageDealt = Math.floor(damageDealt * 1.5);
        timeBonus = 100;
        audioService.playSfx(SoundType.SFX_CRITICAL);
      } else {
        audioService.playSfx(SoundType.SFX_ATTACK);
      }
      setPlayerState(prev => ({
        ...prev,
        score: prev.score + damageDealt * 10 + timeBonus + (prev.combo * 50),
        combo: prev.combo + 1
      }));
    } else {
      audioService.playSfx(SoundType.SFX_DAMAGE);
      damageTaken = 15;
      setPlayerState(prev => ({
        ...prev,
        currentHp: Math.max(0, prev.currentHp - damageTaken),
        combo: 0
      }));
    }

    let monsterDefeated = false;
    if (isCorrect) {
       const newMonsterHp = Math.max(0, currentMonster.currentHp - damageDealt);
       monsterDefeated = newMonsterHp === 0;
       setCurrentMonster({ ...currentMonster, currentHp: newMonsterHp });
       setDamageDisplay({ amount: damageDealt, isCritical, target: 'monster' });
       setIsShaking(true);
    } else {
       setDamageDisplay({ amount: damageTaken, isCritical: false, target: 'player' });
       setIsShaking(true);
    }

    setTimeout(() => setIsShaking(false), 500);

    setBattleResult({
      damageDealt,
      damageTaken,
      isCorrect,
      isCritical,
      timeBonus,
      monsterDefeated,
      playerDefeated: playerState.currentHp - damageTaken <= 0
    });
    setUserAnswer(answer);

    setTimeout(() => {
      setIsSubmitting(false);
      setScreen('result');
    }, 1200);
  };

  const triggerSurrender = () => {
    audioService.playSfx(SoundType.SFX_SELECT);
    setShowSurrenderConfirm(true);
  };

  const confirmSurrender = () => {
    audioService.playSfx(SoundType.SFX_DAMAGE);
    setShowSurrenderConfirm(false);
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setBattleResult({
      damageDealt: 0,
      damageTaken: 0,
      isCorrect: false,
      isCritical: false,
      timeBonus: 0,
      monsterDefeated: false,
      playerDefeated: true // Treat surrender as defeat
    });
    setUserAnswer(null);
    setScreen('result');
  };

  const cancelSurrender = () => {
    audioService.playSfx(SoundType.SFX_CANCEL);
    setShowSurrenderConfirm(false);
  };

  const handleNext = () => {
    audioService.playSfx(SoundType.SFX_SELECT);
    if (!battleResult) return;
    if (battleResult.playerDefeated) {
       setScreen('gameover');
       return;
    }
    const nextQIndex = questionsAnswered + 1;
    if (nextQIndex >= MAX_QUESTIONS) {
      setScreen('clear');
      return;
    }
    if (battleResult.monsterDefeated) {
      const nextMIndex = monsterIndex + 1;
      setMonsterIndex(nextMIndex);
      setCurrentMonster(spawnMonster(nextMIndex));
    }
    setQuestionsAnswered(nextQIndex);
    setScreen('battle');
    loadNextProblem(difficulty, nextQIndex, selectedQuestionTypes);
  };

  // --- RENDER ---

  if (screen === 'question-type-select') {
    return (
      <QuestionTypeSelector
        onConfirm={confirmQuestionTypes}
        onBack={() => {
          audioService.playSfx(SoundType.SFX_CANCEL);
          setScreen('title');
        }}
      />
    );
  }

  if (screen === 'ranking') {
    return <RankingScreen onBack={() => {
      audioService.playSfx(SoundType.SFX_CANCEL);
      setScreen('title');
    }} />;
  }

  if (screen === 'title') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="relative z-10 max-w-2xl w-full space-y-12 mb-12">
          <div className="space-y-4 animate-in fade-in zoom-in duration-700">
            <div className="inline-block p-4 bg-slate-800 rounded-full mb-4 border-4 border-indigo-500 shadow-xl">
              <Sword size={64} className="text-yellow-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 font-pixel drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
              簿記<br/>トレーニング大戦
            </h1>
            <p className="text-indigo-300 text-xl font-bold tracking-widest">3級 100本ノック</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <button 
              onClick={() => selectDifficulty('Easy')}
              aria-label="イージーモードでゲームを開始"
              className="group relative bg-slate-800 hover:bg-green-900 border-4 border-slate-600 hover:border-green-400 p-8 rounded-xl transition-all hover:-translate-y-2 shadow-xl"
            >
              <Shield className="w-12 h-12 mx-auto mb-4 text-green-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-2">Easy</h3>
              <p className="text-slate-400 text-sm">初心者向け<br/>ゆっくり考えられます</p>
            </button>

            <button 
              onClick={() => selectDifficulty('Hard')}
              aria-label="ハードモードでゲームを開始"
              className="group relative bg-slate-800 hover:bg-red-900 border-4 border-slate-600 hover:border-red-400 p-8 rounded-xl transition-all hover:-translate-y-2 shadow-xl"
            >
              <Sword className="w-12 h-12 mx-auto mb-4 text-red-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-2">Hard</h3>
              <p className="text-slate-400 text-sm">上級者向け<br/>素早い判断が必要です</p>
            </button>
          </div>

          <div className="flex justify-center gap-4">
            <button 
              onClick={() => {
                audioService.init();
                audioService.playSfx(SoundType.SFX_SELECT);
                setScreen('settings');
              }}
              className="text-indigo-300 hover:text-white flex items-center justify-center gap-2 transition-colors px-4 py-2"
            >
              <Settings size={20} /> サウンド設定
            </button>
            <button 
              onClick={() => {
                audioService.init();
                audioService.playSfx(SoundType.SFX_SELECT);
                setScreen('ranking');
              }}
              className="text-indigo-300 hover:text-white flex items-center justify-center gap-2 transition-colors px-4 py-2"
            >
              <History size={20} /> プレイ履歴
            </button>
          </div>
        </div>
        
        <footer className="absolute bottom-2 w-full text-center px-4 opacity-60 hover:opacity-100 transition-opacity z-20">
          <p className="text-[10px] text-slate-600">
            本アプリは学習用であり、実務上の正確性を保証するものではありません。日商簿記検定の最新の出題範囲と異なる場合があります。<br/>
            © 2024 Toyama Digital Works. All rights reserved.
          </p>
        </footer>
      </div>
    );
  }

  if (screen === 'settings') {
    const toggleBgm = () => {
      const newBgm = !soundSettings.bgm;
      const newSettings = { ...soundSettings, bgm: newBgm };
      setSoundSettings(newSettings);
      audioService.setSettings(newSettings.bgm, newSettings.sfx);
      audioService.playSfx(SoundType.SFX_SELECT);
      
      // Save to localStorage
      const profile = getUserProfile() || { soundSettings: { bgm: true, sfx: true } };
      profile.soundSettings.bgm = newBgm;
      localStorage.setItem('boki-training-profile', JSON.stringify(profile));
    };

    const toggleSfx = () => {
      const newSfx = !soundSettings.sfx;
      const newSettings = { ...soundSettings, sfx: newSfx };
      setSoundSettings(newSettings);
      audioService.setSettings(newSettings.bgm, newSettings.sfx);
      if (newSfx) audioService.playSfx(SoundType.SFX_SELECT);
      
      // Save to localStorage
      const profile = getUserProfile() || { soundSettings: { bgm: true, sfx: true } };
      profile.soundSettings.sfx = newSfx;
      localStorage.setItem('boki-training-profile', JSON.stringify(profile));
    };

    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="relative z-10 max-w-md w-full space-y-8">
          <div className="space-y-4">
            <div className="inline-block p-4 bg-slate-800 rounded-full mb-4 border-4 border-indigo-500 shadow-xl">
              <Settings size={48} className="text-indigo-400" />
            </div>
            <h1 className="text-4xl font-bold text-white font-pixel">サウンド設定</h1>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 space-y-6 border-2 border-slate-700">
            {/* BGM Setting */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Music size={24} className="text-indigo-400" />
                <div className="text-left">
                  <h3 className="text-white font-bold">BGM（背景音楽）</h3>
                  <p className="text-slate-400 text-sm">バトル中の音楽</p>
                </div>
              </div>
              <button
                onClick={toggleBgm}
                className={`relative w-16 h-8 rounded-full transition-colors ${soundSettings.bgm ? 'bg-indigo-600' : 'bg-slate-600'}`}
              >
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${soundSettings.bgm ? 'translate-x-8' : ''} flex items-center justify-center`}>
                  {soundSettings.bgm ? <Volume2 size={14} className="text-indigo-600" /> : <VolumeX size={14} className="text-slate-600" />}
                </div>
              </button>
            </div>

            {/* SFX Setting */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-700">
              <div className="flex items-center gap-3">
                <Zap size={24} className="text-yellow-400" />
                <div className="text-left">
                  <h3 className="text-white font-bold">効果音</h3>
                  <p className="text-slate-400 text-sm">攻撃音や選択音</p>
                </div>
              </div>
              <button
                onClick={toggleSfx}
                className={`relative w-16 h-8 rounded-full transition-colors ${soundSettings.sfx ? 'bg-yellow-600' : 'bg-slate-600'}`}
              >
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${soundSettings.sfx ? 'translate-x-8' : ''} flex items-center justify-center`}>
                  {soundSettings.sfx ? <Volume2 size={14} className="text-yellow-600" /> : <VolumeX size={14} className="text-slate-600" />}
                </div>
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              audioService.playSfx(SoundType.SFX_CANCEL);
              setScreen('title');
            }}
            className="w-full px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors"
          >
            タイトルへ戻る
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'gameover' || screen === 'clear') {
     const isClear = screen === 'clear';
     return (
       <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative">
          <div className={`max-w-md w-full p-8 rounded-2xl border-4 ${isClear ? 'bg-yellow-900/40 border-yellow-500' : 'bg-red-900/40 border-red-500'} text-center backdrop-blur-md animate-in zoom-in duration-300`}>
             {isClear ? <Trophy size={80} className="mx-auto text-yellow-400 mb-6" /> : <AlertTriangle size={80} className="mx-auto text-red-500 mb-6" />}
             
             <h2 className="text-4xl font-black text-white mb-2 font-pixel">{isClear ? 'GAME CLEAR!!' : 'GAME OVER'}</h2>
             <p className="text-slate-300 mb-8">{isClear ? '全100問完走！素晴らしい！' : '残念、体力が尽きてしまった...'}</p>
             
             <div className="bg-slate-800 p-4 rounded-lg mb-8 space-y-2">
                <div className="flex justify-between text-slate-300">
                   <span>到達問題数</span>
                   <span className="font-bold text-white">{questionsAnswered} / {MAX_QUESTIONS}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                   <span>討伐モンスター</span>
                   <span className="font-bold text-white">{monsterIndex} 体</span>
                </div>
                <div className="flex justify-between text-slate-300 text-xl border-t border-slate-600 pt-2 mt-2">
                   <span>TOTAL SCORE</span>
                   <span className="font-bold text-yellow-400">{playerState.score.toLocaleString()}</span>
                </div>
             </div>

             <div className="space-y-4">
               <button onClick={() => {
                 audioService.playSfx(SoundType.SFX_CANCEL);
                 setScreen('title');
               }} className="w-full px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:scale-105 transition-transform">
                 タイトルへ戻る
               </button>
               <button onClick={() => {
                 audioService.playSfx(SoundType.SFX_SELECT);
                 setScreen('ranking');
               }} className="w-full px-8 py-3 text-slate-300 hover:text-white font-bold transition-colors flex items-center justify-center gap-2">
                 <BarChart3 size={18} /> スコア画面へ
               </button>
             </div>
          </div>
       </div>
     );
  }

  return (
    <div className="h-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-slate-950/50 backdrop-blur-md border-b border-slate-800 z-40">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white">B</div>
                <span className="font-bold text-slate-200 hidden sm:inline">簿記トレ大戦</span>
                <span className={`text-xs px-2 py-1 rounded border ml-1 ${difficulty === 'Hard' ? 'bg-red-900/50 border-red-700 text-red-300' : 'bg-green-900/50 border-green-700 text-green-300'}`}>
                  {difficulty}
                </span>
             </div>
             {/* Personal Best Display */}
             <div className="hidden md:flex items-center gap-1 text-xs text-yellow-500/80 font-mono bg-yellow-900/20 px-2 py-1 rounded border border-yellow-700/30">
               <Crown size={12} />
               <span>BEST: {currentHighScore.toLocaleString()}</span>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
               <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">SCORE</span>
               <span className="text-yellow-400 font-mono font-bold leading-none text-xl">{playerState.score.toLocaleString()}</span>
             </div>
             <div className="h-8 w-[1px] bg-slate-700 mx-2"></div>
             <div className="flex items-center gap-2 text-sm font-mono text-indigo-300">
               <BookOpen size={16} />
               <span>{questionsAnswered + 1}<span className="text-slate-600">/</span>{MAX_QUESTIONS}</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Arena */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="container mx-auto px-4 py-3 max-w-3xl pb-6">
        
          {currentMonster && (
            <BattleScene 
              monster={currentMonster}
              playerState={playerState}
              timeRatio={Math.min(1, timer / attackInterval)}
              damageDisplay={damageDisplay}
              isShaking={isShaking}
            />
          )}

          {/* Game Content */}
          <div className="relative min-h-[300px]">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm z-50 min-h-[300px]">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-indigo-300 font-bold animate-pulse">モンスター出現中...</p>
              </div>
            ) : problem ? (
            <>
              {/* Question Box */}
              <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-3 md:p-4 mb-4 shadow-lg border-l-8 border-indigo-500 relative">
                 <div className="absolute -left-3 -top-3 bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-md">Q</div>
                 <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="inline-block px-2 py-0.5 bg-indigo-800/60 text-indigo-200 text-xs font-bold rounded mb-1.5">
                        {problem.type}
                      </span>
                      <p className="text-slate-100 text-base md:text-lg font-medium leading-relaxed">{problem.text}</p>
                    </div>
                    {screen === 'battle' && (
                      <button 
                        onClick={triggerSurrender}
                        className="ml-4 text-xs text-slate-400 hover:text-red-500 flex flex-col items-center gap-1 p-2 rounded hover:bg-slate-100 transition-colors"
                        title="この回を諦める"
                      >
                        <Flag size={16} />
                        <span className="whitespace-nowrap">降参</span>
                      </button>
                    )}
                 </div>
              </div>

              {/* Interaction Area */}
              {screen === 'result' && battleResult ? (
                <ResultCard 
                  problem={problem} 
                  userAnswer={userAnswer} 
                  result={battleResult}
                  onNext={handleNext}
                  isGameOver={battleResult.playerDefeated}
                />
              ) : (
                <div className="animate-in slide-in-from-bottom-8 duration-500">
                  <JournalEntryForm 
                    problem={problem}
                    onSubmit={handleAnswer} 
                    isSubmitting={isSubmitting} 
                  />
                </div>
              )}
            </>
          ) : null}
          </div>
        </div>
      </main>

      {/* Surrender Confirmation Modal */}
      {showSurrenderConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              cancelSurrender();
            } else if (e.key === 'Enter') {
              confirmSurrender();
            }
          }}
          tabIndex={-1}
        >
          <div className="bg-slate-800 border-2 border-slate-600 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
               <AlertTriangle className="text-yellow-500" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">降参しますか？</h3>
            <p className="text-slate-400 mb-6">
              降参すると、この問題は「不正解」扱いとなり、ダメージを受けます。<br/>
              解説と正解は表示されます。
            </p>
            <div className="flex gap-4">
               <button 
                 onClick={cancelSurrender}
                 className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold focus:ring-2 focus:ring-slate-500 outline-none"
               >
                 続ける
               </button>
               <button 
                 onClick={confirmSurrender}
                 autoFocus
                 className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold focus:ring-2 focus:ring-red-500 outline-none"
               >
                 降参する
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
