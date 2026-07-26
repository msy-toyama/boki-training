
import { SoundType, SoundSettings, SoundTheme } from '../types';

class AudioService {
  private ctx: AudioContext | null = null;
  private isBgmPlaying: boolean = false;
  private currentBgmType: SoundType | null = null;
  private bgmInterval: number | null = null;
  private enabled: { bgm: boolean; sfx: boolean } = { bgm: false, sfx: true };
  private volumes: { bgm: number; sfx: number } = { bgm: 0.6, sfx: 0.8 };
  private theme: SoundTheme = 'retro';

  // マスターチェーン（音量・テーマ用）
  private sfxGain: GainNode | null = null;
  private sfxFilter: BiquadFilterNode | null = null;
  private bgmGain: GainNode | null = null;
  private bgmFilter: BiquadFilterNode | null = null;

  constructor() {
    // Lazy init to comply with browser autoplay policies
  }

  public init() {
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) {
          console.warn('Web Audio API is not supported in this browser');
          return;
        }
        this.ctx = new AudioContextClass();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.ensureGraph();
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
      this.ctx = null;
    }
  }

  // マスターゲイン＋テーマ用フィルタのグラフを用意する
  private ensureGraph() {
    if (!this.ctx) return;
    if (!this.sfxGain) {
      this.sfxFilter = this.ctx.createBiquadFilter();
      this.sfxFilter.connect(this.ctx.destination);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.connect(this.sfxFilter);
    }
    if (!this.bgmGain) {
      this.bgmFilter = this.ctx.createBiquadFilter();
      this.bgmFilter.connect(this.ctx.destination);
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.connect(this.bgmFilter);
    }
    this.applyAudioParams();
  }

  // 現在の音量・テーマをマスターチェーンに反映（滑らかに変更）
  private applyAudioParams() {
    if (!this.ctx || !this.sfxGain || !this.bgmGain || !this.sfxFilter || !this.bgmFilter) return;
    const t = this.ctx.currentTime;
    this.sfxGain.gain.setTargetAtTime(this.volumes.sfx, t, 0.02);
    this.bgmGain.gain.setTargetAtTime(this.volumes.bgm, t, 0.02);

    // テーマごとの音色（フィルタ）
    let cutoff = 20000; // retro: ほぼバイパス（クリアなチップチューン）
    if (this.theme === 'soft') cutoff = 1400; // まろやか
    else if (this.theme === 'cinematic') cutoff = 3600; // 少し丸めつつ厚み
    this.sfxFilter.type = 'lowpass';
    this.bgmFilter.type = 'lowpass';
    this.sfxFilter.frequency.setTargetAtTime(cutoff, t, 0.02);
    this.bgmFilter.frequency.setTargetAtTime(cutoff, t, 0.02);
  }

  // テーマに応じて波形を差し替える
  private wave(base: OscillatorType): OscillatorType {
    if (this.theme === 'soft') {
      if (base === 'square' || base === 'sawtooth') return 'triangle';
      return base;
    }
    if (this.theme === 'cinematic') {
      if (base === 'square') return 'sawtooth';
      return base;
    }
    return base; // retro はそのまま
  }

  // --- 設定 API ---

  public setSettings(bgm: boolean, sfx: boolean) {
    this.enabled = { bgm, sfx };
    if (!bgm) {
      this.stopBgm();
    } else if (this.currentBgmType !== null && !this.isBgmPlaying) {
      this.playBgm(this.currentBgmType);
    }
  }

  // 音量・テーマを含む全設定を反映
  public applySettings(settings: SoundSettings) {
    this.volumes = {
      bgm: typeof settings.bgmVolume === 'number' ? settings.bgmVolume : this.volumes.bgm,
      sfx: typeof settings.sfxVolume === 'number' ? settings.sfxVolume : this.volumes.sfx,
    };
    if (settings.theme) this.theme = settings.theme;
    this.applyAudioParams();
    this.setSettings(settings.bgm, settings.sfx);
  }

  public setVolumes(bgm: number, sfx: number) {
    this.volumes = { bgm, sfx };
    this.applyAudioParams();
  }

  public setTheme(theme: SoundTheme) {
    this.theme = theme;
    this.applyAudioParams();
  }

  // --- SFX ---

  public playSfx(type: SoundType) {
    if (!this.enabled.sfx) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.sfxGain);

    switch (type) {
      case SoundType.SFX_SELECT:
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(880, t + 0.05);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        osc.start(t);
        osc.stop(t + 0.05);
        break;

      case SoundType.SFX_DECISION:
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.setValueAtTime(1760, t + 0.05);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;

      case SoundType.SFX_CANCEL:
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.linearRampToValueAtTime(150, t + 0.1);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;

      case SoundType.SFX_ATTACK:
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(110, t + 0.1);
        gain.gain.setValueAtTime(0.1, t); // 音量を少し下げました
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;

      case SoundType.SFX_DAMAGE:
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.linearRampToValueAtTime(50, t + 0.2);
        // Add noise-like effect by modulating frequency
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 50;
        lfo.type = 'square';
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 500;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(t);
        lfo.stop(t + 0.2);

        gain.gain.setValueAtTime(0.1, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
        break;

      case SoundType.SFX_CRITICAL:
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.setValueAtTime(1760, t + 0.05);
        osc.frequency.setValueAtTime(3520, t + 0.1);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.3);
        break;

      case SoundType.SFX_CLEAR:
        // Arpeggio C E G C
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          this.voice(freq, this.wave('square'), t + i * 0.1, 0.3, 0.1);
        });
        gain.gain.setValueAtTime(0, t);
        osc.start(t);
        osc.stop(t + 0.01);
        break;

      case SoundType.SFX_GAMEOVER:
        osc.type = this.wave('sawtooth');
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.linearRampToValueAtTime(100, t + 1.0);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 1.0);
        osc.start(t);
        osc.stop(t + 1.0);
        break;

      // --- 追加 SFX ---

      case SoundType.SFX_WRONG:
        // 不正解ブザー（下降 + うなり）
        osc.type = this.wave('sawtooth');
        osc.frequency.setValueAtTime(330, t);
        osc.frequency.linearRampToValueAtTime(110, t + 0.28);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.32);
        this.voice(98, this.wave('square'), t + 0.02, 0.26, 0.06);
        break;

      case SoundType.SFX_COMBO:
        // コンボ上昇アルペジオ
        [523.25, 659.25, 880].forEach((freq, i) => {
          this.voice(freq, this.wave('square'), t + i * 0.05, 0.14, 0.09);
        });
        gain.gain.setValueAtTime(0, t);
        osc.start(t);
        osc.stop(t + 0.01);
        break;

      case SoundType.SFX_RANKUP:
        // ランクアップのファンファーレ
        [392, 523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          this.voice(freq, this.wave('square'), t + i * 0.09, 0.32, 0.1);
        });
        gain.gain.setValueAtTime(0, t);
        osc.start(t);
        osc.stop(t + 0.01);
        break;

      case SoundType.SFX_REWARD:
        // コイン（2音の軽やかな上昇）
        this.voice(987.77, this.wave('square'), t, 0.08, 0.09);
        this.voice(1318.51, this.wave('square'), t + 0.08, 0.2, 0.09);
        gain.gain.setValueAtTime(0, t);
        osc.start(t);
        osc.stop(t + 0.01);
        break;

      case SoundType.SFX_PAGE:
        // ページ遷移の軽いブリップ
        osc.type = this.wave('triangle');
        osc.frequency.setValueAtTime(660, t);
        osc.frequency.exponentialRampToValueAtTime(990, t + 0.08);
        gain.gain.setValueAtTime(0.07, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);
        osc.start(t);
        osc.stop(t + 0.1);
        break;

      case SoundType.SFX_HOVER:
        // ホバー：ごく短い控えめなティック
        osc.type = this.wave('triangle');
        osc.frequency.setValueAtTime(1200, t);
        gain.gain.setValueAtTime(0.035, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.start(t);
        osc.stop(t + 0.05);
        break;

      case SoundType.SFX_COUNTDOWN:
        // カウントダウンの警告ビープ
        osc.type = this.wave('square');
        osc.frequency.setValueAtTime(880, t);
        gain.gain.setValueAtTime(0.09, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        osc.start(t);
        osc.stop(t + 0.13);
        break;

      default:
        // 未対応タイプは何も鳴らさない（osc を安全に停止）
        gain.gain.setValueAtTime(0, t);
        osc.start(t);
        osc.stop(t + 0.01);
        break;
    }
    } catch (error) {
      console.error('Failed to play sound effect:', error);
    }
  }

  // SFX 用の単発ボイス（envelope 付き）を鳴らすヘルパー
  private voice(freq: number, type: OscillatorType, startTime: number, duration: number, peak: number) {
    if (!this.ctx || !this.sfxGain) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.connect(g);
    g.connect(this.sfxGain);
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(peak, startTime);
    g.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    o.start(startTime);
    o.stop(startTime + duration + 0.02);
  }

  // --- BGM ---

  public playBgm(type: SoundType) {
    if (this.currentBgmType === type && this.isBgmPlaying) return;
    this.stopBgm();
    this.currentBgmType = type;

    if (!this.enabled.bgm) return;
    this.init();
    if (!this.ctx || !this.bgmGain) return;

    this.isBgmPlaying = true;

    // 波形（テーマで差し替え）
    let baseWave: OscillatorType = 'square';
    if (type === SoundType.BGM_TITLE || type === SoundType.BGM_VICTORY) baseWave = 'triangle';
    else if (type === SoundType.BGM_BOSS) baseWave = 'sawtooth';
    const oscType = this.wave(baseWave);

    let step = 0;

    const playNote = (freq: number | null, duration: number) => {
      if (!this.ctx || !this.bgmGain) return;
      if (freq) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = oscType;
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(this.bgmGain);
        const t = this.ctx.currentTime;
        // 初回のプチッという音を防ぐため、0からフェードイン
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.01);
        gain.gain.setValueAtTime(0.1, t + 0.01);
        gain.gain.linearRampToValueAtTime(0.0, t + duration - 0.02);
        osc.start(t);
        osc.stop(t + duration);
      }
    };

    // Title: Gentle Loop
    const melodyTitle = [
      392, 0, 392, 0, 440, 0, 392, 0, 493, 0, 440, 0, // G G A G B A
      392, 0, 392, 0, 440, 0, 587, 0, 523, 0, 0, 0  // G G A G D C
    ];

    // Easy: Upbeat March (C Major)
    const melodyEasy = [
      261, 0, 329, 0, 392, 0, 523, 0, // C E G C
      392, 0, 329, 0, 261, 0, 0, 0,   // G E C
      293, 0, 349, 0, 440, 0, 293, 0, // D F A D
      392, 0, 349, 0, 293, 0, 0, 0    // G F D
    ];

    // Normal: 標準テンポの明るいメロディ (G Major)
    const melodyNormal = [
      392, 0, 493, 0, 587, 0, 493, 0, // G B D B
      440, 0, 392, 0, 329, 0, 0, 0,   // A G E
      349, 0, 440, 0, 523, 0, 440, 0, // F A C A
      392, 0, 349, 0, 392, 0, 0, 0    // G F G
    ];

    // Hard: Fast Tension (A Minor)
    const melodyHard = [
      220, 220, 261, 220, 196, 196, 220, 0, // A A C A G G A
      220, 220, 311, 220, 196, 196, 207, 0, // A A Eb A G G Ab
      440, 440, 220, 220, 261, 220, 0, 0    // A A A A C A
    ];

    // Boss: 重厚な低音リフ (D Minor)
    const melodyBoss = [
      146, 146, 174, 146, 130, 130, 146, 0, // D D F D C C D
      146, 146, 196, 174, 146, 130, 123, 0, // D D G F D C B
      293, 0, 146, 146, 174, 146, 130, 0,   // D(oct)
      146, 174, 220, 174, 146, 130, 0, 0    // D F A F D C
    ];

    // Victory: 勝利のジングル (C Major)
    const melodyVictory = [
      523, 0, 523, 0, 523, 0, 659, 0, // C C C E
      783, 0, 0, 0, 659, 0, 783, 0,   // G .. E G
      1046, 0, 0, 0, 0, 0, 0, 0       // C(high)
    ];

    let sequence = melodyTitle;
    let speed = 250;

    if (type === SoundType.BGM_BATTLE_EASY) {
      sequence = melodyEasy;
      speed = 200;
    } else if (type === SoundType.BGM_BATTLE_NORMAL) {
      sequence = melodyNormal;
      speed = 160;
    } else if (type === SoundType.BGM_BATTLE_HARD) {
      sequence = melodyHard;
      speed = 120;
    } else if (type === SoundType.BGM_BOSS) {
      sequence = melodyBoss;
      speed = 140;
    } else if (type === SoundType.BGM_VICTORY) {
      sequence = melodyVictory;
      speed = 180;
    }

    this.bgmInterval = window.setInterval(() => {
      if (!this.isBgmPlaying) return;
      const freq = sequence[step % sequence.length];
      playNote(freq === 0 ? null : freq, speed / 1000);
      step++;
    }, speed);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const audioService = new AudioService();
