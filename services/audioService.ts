
import { SoundType } from '../types';

class AudioService {
  private ctx: AudioContext | null = null;
  private isBgmPlaying: boolean = false;
  private currentBgmType: SoundType | null = null;
  private bgmInterval: number | null = null;
  private enabled: { bgm: boolean; sfx: boolean } = { bgm: true, sfx: true };

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
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
      this.ctx = null;
    }
  }

  public setSettings(bgm: boolean, sfx: boolean) {
    this.enabled = { bgm, sfx };
    if (!bgm) {
      this.stopBgm();
    } else if (this.currentBgmType !== null && !this.isBgmPlaying) {
      this.playBgm(this.currentBgmType);
    }
  }

  // --- SFX ---

  public playSfx(type: SoundType) {
    if (!this.enabled.sfx) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

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
        osc.type = 'triangle';
        // Arpeggio C E G C
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const o = this.ctx!.createOscillator();
          const g = this.ctx!.createGain();
          o.connect(g);
          g.connect(this.ctx!.destination);
          o.type = 'square';
          o.frequency.value = freq;
          g.gain.setValueAtTime(0.1, t + i * 0.1);
          g.gain.exponentialRampToValueAtTime(0.01, t + i * 0.1 + 0.3);
          o.start(t + i * 0.1);
          o.stop(t + i * 0.1 + 0.3);
        });
        break;

      case SoundType.SFX_GAMEOVER:
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.linearRampToValueAtTime(100, t + 1.0);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 1.0);
        osc.start(t);
        osc.stop(t + 1.0);
        break;
    }
    } catch (error) {
      console.error('Failed to play sound effect:', error);
    }
  }

  // --- BGM ---

  public playBgm(type: SoundType) {
    if (this.currentBgmType === type && this.isBgmPlaying) return;
    this.stopBgm();
    this.currentBgmType = type;
    
    if (!this.enabled.bgm) return;
    this.init();
    if (!this.ctx) return;

    this.isBgmPlaying = true;

    // Simple sequencer using setInterval
    let step = 0;

    const playNote = (freq: number | null, duration: number) => {
      if (!this.ctx) return;
      if (freq) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type === SoundType.BGM_TITLE ? 'triangle' : 'square';
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        const t = this.ctx.currentTime;
        // 初回のプチッという音を防ぐため、0からフェードイン
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.03, t + 0.01); // 10msでフェードイン
        gain.gain.setValueAtTime(0.03, t + 0.01);
        gain.gain.linearRampToValueAtTime(0.0, t + duration - 0.05);
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

    // Hard: Fast Tension (A Minor)
    const melodyHard = [
      220, 220, 261, 220, 196, 196, 220, 0, // A A C A G G A
      220, 220, 311, 220, 196, 196, 207, 0, // A A Eb A G G Ab
      440, 440, 220, 220, 261, 220, 0, 0    // A A A A C A
    ];

    let sequence = melodyTitle;
    let speed = 250;

    if (type === SoundType.BGM_BATTLE_EASY) {
      sequence = melodyEasy;
      speed = 200;
    } else if (type === SoundType.BGM_BATTLE_HARD) {
      sequence = melodyHard;
      speed = 120; // Faster
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
