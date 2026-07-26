import React from 'react';
import { Settings, Volume2, VolumeX, Music, Zap, Play, Sparkles } from 'lucide-react';
import { SoundSettings, SoundTheme } from '../types';

interface SettingsScreenProps {
  soundSettings: SoundSettings;
  onToggleBgm: () => void;
  onToggleSfx: () => void;
  onBgmVolume: (value: number) => void;
  onSfxVolume: (value: number) => void;
  onSelectTheme: (theme: SoundTheme) => void;
  onPreviewBgm: () => void;
  onPreviewSfx: () => void;
  onBack: () => void;
}

const THEMES: { id: SoundTheme; label: string; desc: string }[] = [
  { id: 'retro', label: 'レトロ8bit', desc: 'クリアなチップチューン' },
  { id: 'soft', label: 'やわらか', desc: 'まろやかで耳に優しい' },
  { id: 'cinematic', label: 'シネマ', desc: '厚みのある迫力サウンド' },
];

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  activeClass: string;
  activeText: string;
  label: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, activeClass, activeText, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    className={`relative shrink-0 w-16 h-8 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 focus-visible:ring-white/70 ${
      checked ? activeClass : 'bg-slate-600'
    }`}
  >
    <span
      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 flex items-center justify-center ${
        checked ? 'translate-x-8' : 'translate-x-0'
      }`}
    >
      {checked ? (
        <Volume2 size={14} className={activeText} />
      ) : (
        <VolumeX size={14} className="text-slate-500" />
      )}
    </span>
  </button>
);

interface VolumeSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
  accent: string;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ value, onChange, disabled, accent }) => (
  <div className="flex items-center gap-3">
    <VolumeX size={16} className="text-slate-500 shrink-0" />
    <input
      type="range"
      min={0}
      max={1}
      step={0.05}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ accentColor: accent }}
      className={`w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-600 ${
        disabled ? 'opacity-40 cursor-not-allowed' : ''
      }`}
      aria-label="音量"
    />
    <Volume2 size={16} className="text-slate-300 shrink-0" />
    <span className="w-10 text-right text-xs font-mono text-slate-300 shrink-0 tabular-nums">
      {Math.round(value * 100)}
    </span>
  </div>
);

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  soundSettings,
  onToggleBgm,
  onToggleSfx,
  onBgmVolume,
  onSfxVolume,
  onSelectTheme,
  onPreviewBgm,
  onPreviewSfx,
  onBack,
}) => {
  const bgmVolume = soundSettings.bgmVolume ?? 0.6;
  const sfxVolume = soundSettings.sfxVolume ?? 0.8;
  const theme = soundSettings.theme ?? 'retro';

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(#4f46e5 2px, transparent 2px)', backgroundSize: '30px 30px' }}
      />

      <div className="relative z-10 max-w-md w-full space-y-6 py-8">
        <div className="space-y-4">
          <div className="inline-block p-4 bg-slate-800 rounded-full mb-2 border-4 border-indigo-500 shadow-xl">
            <Settings size={48} className="text-indigo-400" />
          </div>
          <h1 className="text-4xl font-bold text-white font-pixel">サウンド設定</h1>
        </div>

        {/* BGM セクション */}
        <div className="bg-slate-800 rounded-xl p-6 space-y-4 border-2 border-slate-700 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music size={24} className="text-indigo-400 shrink-0" />
              <div>
                <h3 className="text-white font-bold">BGM（背景音楽）</h3>
                <p className="text-slate-400 text-sm">バトル中の音楽</p>
              </div>
            </div>
            <Toggle
              checked={soundSettings.bgm}
              onChange={onToggleBgm}
              activeClass="bg-indigo-600"
              activeText="text-indigo-600"
              label="BGMのオン・オフ"
            />
          </div>
          <VolumeSlider value={bgmVolume} onChange={onBgmVolume} disabled={!soundSettings.bgm} accent="#6366f1" />
          <button
            type="button"
            onClick={onPreviewBgm}
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 transition-colors border border-indigo-500/40"
          >
            <Play size={14} /> 試聴する
          </button>
        </div>

        {/* 効果音 セクション */}
        <div className="bg-slate-800 rounded-xl p-6 space-y-4 border-2 border-slate-700 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap size={24} className="text-yellow-400 shrink-0" />
              <div>
                <h3 className="text-white font-bold">効果音</h3>
                <p className="text-slate-400 text-sm">攻撃音や選択音</p>
              </div>
            </div>
            <Toggle
              checked={soundSettings.sfx}
              onChange={onToggleSfx}
              activeClass="bg-yellow-500"
              activeText="text-yellow-600"
              label="効果音のオン・オフ"
            />
          </div>
          <VolumeSlider value={sfxVolume} onChange={onSfxVolume} disabled={!soundSettings.sfx} accent="#eab308" />
          <button
            type="button"
            onClick={onPreviewSfx}
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 transition-colors border border-yellow-500/40"
          >
            <Play size={14} /> 試聴する
          </button>
        </div>

        {/* サウンドテーマ セクション */}
        <div className="bg-slate-800 rounded-xl p-6 space-y-4 border-2 border-slate-700 text-left">
          <div className="flex items-center gap-3">
            <Sparkles size={24} className="text-pink-400 shrink-0" />
            <div>
              <h3 className="text-white font-bold">サウンドテーマ</h3>
              <p className="text-slate-400 text-sm">音の雰囲気を切り替え</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map((th) => {
              const selected = theme === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelectTheme(th.id)}
                  className={`rounded-lg p-3 text-center border-2 transition-colors ${
                    selected
                      ? 'bg-pink-600/25 border-pink-500 text-white'
                      : 'bg-slate-900/40 border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="text-sm font-bold">{th.label}</div>
                </button>
              );
            })}
          </div>
          <p className="text-slate-400 text-xs">{THEMES.find((t) => t.id === theme)?.desc}</p>
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
};

export default React.memo(SettingsScreen);
