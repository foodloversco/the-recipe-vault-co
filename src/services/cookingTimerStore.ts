// Culinary Braai & Oven Cooking Timer with Web Audio API chime and vibration
export interface TimerState {
  status: 'idle' | 'running' | 'paused' | 'ringing';
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  endTime: number | null;
}

class CookingTimerStore {
  private state: TimerState = {
    status: 'idle',
    label: 'Braai & Oven Timer',
    totalSeconds: 300,
    remainingSeconds: 300,
    endTime: null,
  };

  private intervalRef: any = null;
  private chimeIntervalRef: any = null;
  private audioCtx: AudioContext | null = null;
  private listeners: Set<(state: TimerState) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      // Restore any running timer from sessionStorage/localStorage
      try {
        const saved = localStorage.getItem('rv_active_cooking_timer');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.status === 'running' && parsed.endTime) {
            const now = Date.now();
            const left = Math.max(0, Math.ceil((parsed.endTime - now) / 1000));
            if (left > 0) {
              this.state = { ...parsed, remainingSeconds: left };
              this.startTicking();
            } else {
              this.state = { ...parsed, remainingSeconds: 0, status: 'ringing' };
              this.triggerAlarm();
            }
          }
        }
      } catch {}

      // Handle visibility changes so time doesn't freeze when switching tabs
      document.addEventListener('visibilitychange', () => {
        if (this.state.status === 'running' && this.state.endTime) {
          const now = Date.now();
          const left = Math.max(0, Math.ceil((this.state.endTime - now) / 1000));
          if (left <= 0) {
            this.state.remainingSeconds = 0;
            this.triggerAlarm();
          } else {
            this.state.remainingSeconds = left;
            this.notify();
          }
        }
      });
    }
  }

  public getState(): TimerState {
    return { ...this.state };
  }

  public startTimer(seconds: number, label = 'Braai & Cooking Timer'): void {
    this.stopAlarmSound();
    const now = Date.now();
    this.state = {
      status: 'running',
      label,
      totalSeconds: seconds,
      remainingSeconds: seconds,
      endTime: now + seconds * 1000,
    };
    this.saveState();
    this.startTicking();
    this.notify();
  }

  public pauseTimer(): void {
    if (this.state.status !== 'running') return;
    this.clearInterval();
    this.state.status = 'paused';
    this.state.endTime = null;
    this.saveState();
    this.notify();
  }

  public resumeTimer(): void {
    if (this.state.status !== 'paused' || this.state.remainingSeconds <= 0) return;
    const now = Date.now();
    this.state.status = 'running';
    this.state.endTime = now + this.state.remainingSeconds * 1000;
    this.saveState();
    this.startTicking();
    this.notify();
  }

  public resetTimer(): void {
    this.clearInterval();
    this.stopAlarmSound();
    this.state = {
      status: 'idle',
      label: 'Braai & Oven Timer',
      totalSeconds: 300,
      remainingSeconds: 300,
      endTime: null,
    };
    this.saveState();
    this.notify();
  }

  public addTime(extraSeconds: number): void {
    this.stopAlarmSound();
    const current = this.state.remainingSeconds;
    const next = current + extraSeconds;
    const now = Date.now();
    this.state.totalSeconds = Math.max(this.state.totalSeconds, next);
    this.state.remainingSeconds = next;
    this.state.status = 'running';
    this.state.endTime = now + next * 1000;
    this.saveState();
    this.startTicking();
    this.notify();
  }

  public dismissAlarm(): void {
    this.stopAlarmSound();
    this.resetTimer();
  }

  private startTicking(): void {
    this.clearInterval();
    this.intervalRef = setInterval(() => {
      if (this.state.status === 'running' && this.state.endTime) {
        const now = Date.now();
        const left = Math.max(0, Math.ceil((this.state.endTime - now) / 1000));
        this.state.remainingSeconds = left;
        if (left <= 0) {
          this.triggerAlarm();
        } else {
          this.notify();
        }
      }
    }, 500);
  }

  private clearInterval(): void {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
      this.intervalRef = null;
    }
  }

  private triggerAlarm(): void {
    this.clearInterval();
    this.state.status = 'ringing';
    this.state.remainingSeconds = 0;
    this.state.endTime = null;
    this.saveState();
    this.notify();

    // Trigger audible chime and vibration immediately
    this.playChimeAudio();
    this.triggerVibration();

    // Repeat chime and vibration every 3 seconds while ringing
    if (this.chimeIntervalRef) clearInterval(this.chimeIntervalRef);
    this.chimeIntervalRef = setInterval(() => {
      if (this.state.status === 'ringing') {
        this.playChimeAudio();
        this.triggerVibration();
      } else {
        this.stopAlarmSound();
      }
    }, 3200);
  }

  public stopAlarmSound(): void {
    if (this.chimeIntervalRef) {
      clearInterval(this.chimeIntervalRef);
      this.chimeIntervalRef = null;
    }
  }

  private triggerVibration(): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([400, 150, 400, 150, 700]);
      } catch {}
    }
  }

  public playChimeAudio(): void {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // 3-note ascending chime chord (D5: 587.3Hz, F#5: 739.9Hz, A5: 880Hz, D6: 1174.6Hz)
      const notes = [
        { freq: 587.33, start: 0, dur: 0.8 },
        { freq: 739.99, start: 0.16, dur: 0.9 },
        { freq: 880.00, start: 0.32, dur: 1.1 },
        { freq: 1174.66, start: 0.48, dur: 1.4 },
      ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, now + n.start);

        // Gentle metallic harmonic overtone
        const overtone = ctx.createOscillator();
        const overtoneGain = ctx.createGain();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(n.freq * 2, now + n.start);

        gain.gain.setValueAtTime(0, now + n.start);
        gain.gain.linearRampToValueAtTime(0.35, now + n.start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);

        overtoneGain.gain.setValueAtTime(0, now + n.start);
        overtoneGain.gain.linearRampToValueAtTime(0.12, now + n.start + 0.02);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur * 0.6);

        osc.connect(gain);
        overtone.connect(overtoneGain);
        gain.connect(ctx.destination);
        overtoneGain.connect(ctx.destination);

        osc.start(now + n.start);
        overtone.start(now + n.start);
        osc.stop(now + n.start + n.dur);
        overtone.stop(now + n.start + n.dur);
      });
    } catch (e) {
      console.warn('Audio chime could not play:', e);
    }
  }

  private saveState(): void {
    try {
      localStorage.setItem('rv_active_cooking_timer', JSON.stringify(this.state));
    } catch {}
  }

  public subscribe(listener: (state: TimerState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const s = this.getState();
    this.listeners.forEach((l) => {
      try {
        l(s);
      } catch (e) {
        console.error('Error in cookingTimer listener:', e);
      }
    });
  }
}

export const cookingTimerStore = new CookingTimerStore();
