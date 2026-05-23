
import React from 'react';
import { Monster, PlayerState } from '../types';
import { BookOpen, Timer, ShieldAlert } from 'lucide-react';

interface BattleSceneProps {
  monster: Monster;
  playerState: PlayerState;
  timeRatio: number; // 0.0 to 1.0 (0 = start, 1 = attack incoming)
  damageDisplay: { amount: number; isCritical: boolean; target: 'monster' | 'player' } | null;
  isShaking: boolean;
  isPracticeMode?: boolean;
}

const BattleScene: React.FC<BattleSceneProps> = ({ monster, playerState, timeRatio, damageDisplay, isShaking, isPracticeMode = false }) => {
  const monsterHpPercentage = Math.max(0, (monster.currentHp / monster.maxHp) * 100);
  const playerHpPercentage = Math.max(0, (playerState.currentHp / playerState.maxHp) * 100);
  const monsterHit = damageDisplay?.target === 'monster';
  const playerHit = damageDisplay?.target === 'player';
  
  // Player HP Color
  let playerHpColor = 'bg-green-500';
  if (playerHpPercentage < 30) playerHpColor = 'bg-red-500 animate-pulse';
  else if (playerHpPercentage < 60) playerHpColor = 'bg-yellow-500';

  // Time Gauge Color
  let timeColor = 'bg-gradient-to-r from-blue-500 to-cyan-300';
  if (timeRatio > 0.7) timeColor = 'bg-gradient-to-r from-yellow-500 to-orange-300';
  if (timeRatio > 0.9) timeColor = 'bg-gradient-to-r from-red-700 to-red-400 animate-pulse';

  return (
    <div className={`battle-scene relative w-full bg-slate-800 rounded-lg p-3 mb-3 border-4 border-slate-700 shadow-2xl overflow-hidden min-h-[210px] sm:min-h-[230px] md:min-h-[250px] lg:min-h-[280px] flex flex-col justify-between ${playerHit ? 'battle-player-hit' : ''}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(110deg,rgba(14,165,233,0.18),transparent_40%,rgba(250,204,21,0.08)_70%,rgba(239,68,68,0.14))]"></div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-slate-950/30 to-transparent"></div>
        <div className="absolute bottom-4 left-6 text-3xl opacity-20">⛰️</div>
        <div className="absolute bottom-6 right-10 text-3xl opacity-20">⛰️</div>
        <div className="absolute top-8 left-8 text-3xl opacity-15">☁️</div>
        <div className="absolute top-12 right-12 text-3xl opacity-15">☁️</div>
      </div>

      {/* Top HUD: Monster Info */}
      <div className="relative z-10 flex justify-between items-end mb-2">
         <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-yellow-400 font-pixel text-xl tracking-wider shadow-black drop-shadow-md">{monster.name}</span>
              <span className="text-xs text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-600">Lv.{monster.level}</span>
            </div>
            {/* Monster HP Bar */}
            <div className="w-full max-w-[220px] h-3 bg-slate-900 rounded-full border border-slate-600 overflow-hidden relative shadow-inner">
              <div 
                className="hp-fill h-full bg-gradient-to-r from-red-700 via-red-500 to-orange-300 transition-all duration-500 ease-out relative"
                style={{ width: `${monsterHpPercentage}%` }}
              />
            </div>
         </div>
      </div>

      {/* Battle Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[100px]">
        {/* Monster Emoji */}
        <div className={`battle-monster relative text-7xl sm:text-8xl md:text-8xl lg:text-9xl transition-transform duration-100 cursor-default select-none drop-shadow-[0_18px_20px_rgba(0,0,0,0.45)] ${isShaking ? 'animate-shake' : 'animate-bounce-slow'} ${monsterHit ? 'battle-monster-hit' : ''}`}>
          {monster.emoji}
          {monsterHit && <div className="absolute inset-0 -z-10 rounded-full battle-hit-ring" />}
          
          {/* Damage Popup (Monster) */}
          {damageDisplay && damageDisplay.target === 'monster' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full z-20 pointer-events-none animate-damage w-full text-center">
              <div className={`damage-number font-black text-6xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] stroke-black ${damageDisplay.isCritical ? 'text-yellow-300 scale-125' : 'text-white'}`}>
                {damageDisplay.amount}
                {damageDisplay.isCritical && <span className="text-sm block text-center text-yellow-300 font-bold mt-1 animate-pulse">CRITICAL!!</span>}
              </div>
            </div>
          )}
        </div>

        {/* Player Damage Overlay (Red Flash) */}
        {damageDisplay && damageDisplay.target === 'player' && (
             <div className="absolute inset-0 bg-red-500/30 battle-screen-flash z-0 rounded-lg pointer-events-none"></div>
        )}
      </div>

      {/* Bottom HUD: Player Info & Time Gauge */}
      <div className="relative z-10 mt-2 pt-2 border-t border-slate-700/50">
        <div className="flex justify-between items-end">
            {/* Player Stats */}
            <div className="flex-1">
               <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                 <ShieldAlert size={16} className="text-blue-400" /> 
                 <span>PLAYER HP</span>
                 <span className="font-mono text-lg">{playerState.currentHp}/{playerState.maxHp}</span>
               </div>
               <div className="w-full max-w-[200px] h-3 bg-slate-900 rounded-full border border-slate-600 overflow-hidden relative">
                  <div 
                    className={`hp-fill h-full transition-all duration-300 ${playerHpColor}`}
                    style={{ width: `${playerHpPercentage}%` }}
                  />
               </div>
            </div>

            {/* Attack Gauge */}
            <div className="flex-1 flex flex-col items-end">
                {isPracticeMode ? (
                  <div className="flex items-center gap-2 text-blue-200 text-xs mb-1 font-mono bg-blue-950/60 border border-blue-800/70 rounded-full px-3 py-1">
                    <BookOpen size={14} />
                    <span>PRACTICE</span>
                  </div>
                ) : (
                  <>
                   <div className="flex items-center gap-2 text-slate-300 text-xs mb-1 font-mono">
                     <Timer size={14} />
                     <span>MONSTER ATTACK</span>
                   </div>
                   <div className="w-full max-w-[190px] h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700/70">
                     <div
                      className={`h-full transition-all duration-100 ease-linear ${timeColor}`}
                      style={{ width: `${timeRatio * 100}%` }}
                     />
                   </div>
                  </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default BattleScene;
