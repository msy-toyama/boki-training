import React from 'react';
import { Settings, Volume2, VolumeX, Music, Zap } from 'lucide-react';
import { SoundSettings } from '../types';

interface SettingsScreenProps {
  soundSettings: SoundSettings;
  onToggleBgm: () => void;
  onToggleSfx: () => void;
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  soundSettings,
  onToggleBgm,
  onToggleSfx,
  onBack,
}) => (
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Music size={24} className="text-indigo-400" />
            <div className="text-left">
              <h3 className="text-white font-bold">BGM（背景音楽）</h3>
              <p className="text-slate-400 text-sm">バトル中の音楽</p>
            </div>
          </div>
          <button
            onClick={onToggleBgm}
            className={`relative w-16 h-8 rounded-full transition-colors ${soundSettings.bgm ? 'bg-indigo-600' : 'bg-slate-600'}`}
          >
            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${soundSettings.bgm ? 'translate-x-8' : ''} flex items-center justify-center`}>
              {soundSettings.bgm ? <Volume2 size={14} className="text-indigo-600" /> : <VolumeX size={14} className="text-slate-600" />}
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <Zap size={24} className="text-yellow-400" />
            <div className="text-left">
              <h3 className="text-white font-bold">効果音</h3>
              <p className="text-slate-400 text-sm">攻撃音や選択音</p>
            </div>
          </div>
          <button
            onClick={onToggleSfx}
            className={`relative w-16 h-8 rounded-full transition-colors ${soundSettings.sfx ? 'bg-yellow-600' : 'bg-slate-600'}`}
          >
            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${soundSettings.sfx ? 'translate-x-8' : ''} flex items-center justify-center`}>
              {soundSettings.sfx ? <Volume2 size={14} className="text-yellow-600" /> : <VolumeX size={14} className="text-slate-600" />}
            </div>
          </button>
        </div>
      </div>

      <button
        onClick={onBack}
        className="w-full px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors"
      >
        タイトルへ戻る
      </button>
    </div>
  </div>
);

export default React.memo(SettingsScreen);
