
import React from 'react';
import { Monster, PlayerState } from '../types';
import { Timer, ShieldAlert } from 'lucide-react';

interface BattleSceneProps {
  monster: Monster;
  playerState: PlayerState;
  timeRatio: number; // 0.0 to 1.0 (0 = start, 1 = attack incoming)
  damageDisplay: { amount: number; isCritical: boolean; target: 'monster' | 'player' } | null;
  isShaking: boolean;
}

const BattleScene: React.FC<BattleSceneProps> = ({ monster, playerState, timeRatio, damageDisplay, isShaking }) => {
  const monsterHpPercentage = Math.max(0, (monster.currentHp / monster.maxHp) * 100);
  const playerHpPercentage = Math.max(0, (playerState.currentHp / playerState.maxHp) * 100);
  
  // Player HP Color
  let playerHpColor = 'bg-green-500';
  if (playerHpPercentage < 30) playerHpColor = 'bg-red-500 animate-pulse';
  else if (playerHpPercentage < 60) playerHpColor = 'bg-yellow-500';

  // Time Gauge Color
  let timeColor = 'bg-blue-500';
  if (timeRatio > 0.7) timeColor = 'bg-yellow-500';
  if (timeRatio > 0.9) timeColor = 'bg-red-600 animate-pulse';

  return (
    <div className="relative w-full bg-slate-800 rounded-xl p-3 mb-3 border-4 border-slate-700 shadow-2xl overflow-hidden min-h-[200px] sm:min-h-[220px] md:min-h-[240px] lg:min-h-[260px] flex flex-col justify-between">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl">☁️</div>
        <div className="absolute top-20 right-20 text-4xl">☁️</div>
        <div className="absolute bottom-10 left-20 text-4xl">⛰️</div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      {/* Top HUD: Monster Info */}
      <div className="relative z-10 flex justify-between items-end mb-2">
         <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-yellow-400 font-pixel text-xl tracking-wider shadow-black drop-shadow-md">{monster.name}</span>
              <span className="text-xs text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-600">Lv.{monster.level}</span>
            </div>
            {/* Monster HP Bar */}
            <div className="w-full max-w-[200px] h-3 bg-slate-900 rounded-full border border-slate-600 overflow-hidden relative shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500 ease-out relative"
                style={{ width: `${monsterHpPercentage}%` }}
              />
            </div>
         </div>
      </div>

      {/* Battle Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[100px]">
        {/* Monster Emoji */}
        <div className={`relative text-7xl sm:text-8xl md:text-8xl transition-transform duration-100 cursor-default select-none ${isShaking ? 'animate-shake' : 'animate-bounce-slow'}`}>
          {monster.emoji}
          
          {/* Damage Popup (Monster) */}
          {damageDisplay && damageDisplay.target === 'monster' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full z-20 pointer-events-none animate-damage w-full text-center">
              <div className={`font-black text-6xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] stroke-black ${damageDisplay.isCritical ? 'text-yellow-400 scale-125' : 'text-white'}`}>
                {damageDisplay.amount}
                {damageDisplay.isCritical && <span className="text-sm block text-center text-yellow-300 font-bold mt-1 animate-pulse">CRITICAL!!</span>}
              </div>
            </div>
          )}
        </div>

        {/* Player Damage Overlay (Red Flash) */}
        {damageDisplay && damageDisplay.target === 'player' && (
             <div className="absolute inset-0 bg-red-500/30 animate-pulse z-0 rounded-lg pointer-events-none"></div>
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
                    className={`h-full transition-all duration-300 ${playerHpColor}`}
                    style={{ width: `${playerHpPercentage}%` }}
                  />
               </div>
            </div>

            {/* Attack Gauge */}
            <div className="flex-1 flex flex-col items-end">
               <div className="flex items-center gap-2 text-slate-300 text-xs mb-1 font-mono">
                  <Timer size={14} />
                  <span>MONSTER ATTACK</span>
               </div>
               <div className="w-full max-w-[180px] h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-100 ease-linear ${timeColor}`}
                    style={{ width: `${timeRatio * 100}%` }}
                  />
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BattleScene;
