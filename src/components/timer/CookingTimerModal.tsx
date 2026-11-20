import React, { useState, useEffect } from 'react';
import { cookingTimerStore, TimerState } from '../../services/cookingTimerStore';
import { wakeLockService } from '../../services/wakeLockService';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Volume2,
  Flame,
  Sun,
  Moon,
  Clock,
  BellRing
} from 'lucide-react';

interface CookingTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeTitle?: string;
}

const PRESETS = [
  { label: '5m • Chops & Steaks Sear', seconds: 300, icon: '🥩' },
  { label: '10m • Braaibroodjies Melt', seconds: 600, icon: '🥪' },
  { label: '15m • Sticky Ribs Glaze', seconds: 900, icon: '🍖' },
  { label: '25m • Chicken Sosaties Flip', seconds: 1500, icon: '🍢' },
  { label: '45m • Potjie Simmer Coals', seconds: 2700, icon: '🍲' },
];

export const CookingTimerModal: React.FC<CookingTimerModalProps> = ({
  isOpen,
  onClose,
  recipeTitle,
}) => {
  const [timerState, setTimerState] = useState<TimerState>(() => cookingTimerStore.getState());
  const [customMinutes, setCustomMinutes] = useState<string>('5');
  const [customSeconds, setCustomSeconds] = useState<string>('0');
  const [isWakeLockActive, setIsWakeLockActive] = useState<boolean>(() => wakeLockService.isActive());

  useEffect(() => {
    const unsubTimer = cookingTimerStore.subscribe((s) => setTimerState(s));
    const unsubWake = wakeLockService.subscribe((active) => setIsWakeLockActive(active));
    return () => {
      unsubTimer();
      unsubWake();
    };
  }, []);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartCustom = () => {
    const m = Math.max(0, parseInt(customMinutes, 10) || 0);
    const s = Math.max(0, Math.min(59, parseInt(customSeconds, 10) || 0));
    const total = m * 60 + s;
    if (total > 0) {
      cookingTimerStore.startTimer(total, recipeTitle ? `${recipeTitle} Timer` : 'Braai & Oven Timer');
    }
  };

  const handleToggleWakeLock = async () => {
    await wakeLockService.toggle();
  };

  const progressPct =
    timerState.totalSeconds > 0
      ? Math.max(0, Math.min(100, ((timerState.totalSeconds - timerState.remainingSeconds) / timerState.totalSeconds) * 100))
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#161311] border border-[#382f25] rounded-3xl p-5 sm:p-6 shadow-2xl relative text-[#f2efe9] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#29221a] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">
                Braai &amp; Oven Cooking Timer
              </h3>
              <p className="text-[11px] text-[#9c9387]">
                Clear chime alert &amp; vibration • Keeps running across tabs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#251f19] text-[#8e8578] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ringing Alarm Alert Banner */}
        {timerState.status === 'ringing' && (
          <div className="mb-4 bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 border-2 border-amber-300 p-4 rounded-2xl text-center space-y-2 animate-bounce shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-white font-bold text-sm sm:text-base">
              <BellRing className="w-6 h-6 animate-spin" />
              <span>🔔 TIME'S UP! COALS ARE READY!</span>
            </div>
            <p className="text-xs text-white/90">
              {timerState.label || 'Your braai timer has finished!'}
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => cookingTimerStore.dismissAlarm()}
                className="px-4 py-2 bg-white text-rose-700 font-extrabold text-xs rounded-xl shadow-lg hover:bg-neutral-100 transition-all"
              >
                Stop Alarm
              </button>
              <button
                onClick={() => cookingTimerStore.addTime(120)}
                className="px-3 py-2 bg-black/40 hover:bg-black/60 text-white font-bold text-xs rounded-xl border border-white/30"
              >
                +2 Mins More
              </button>
            </div>
          </div>
        )}

        {/* Screen Wake Lock Toggle Pill */}
        <div className="mb-4 bg-[#1f1a15] border border-[#352c22] p-2.5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            {isWakeLockActive ? (
              <Sun className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-[#777] flex-shrink-0" />
            )}
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                {isWakeLockActive ? 'Screen Awake: ACTIVE' : 'Keep Screen Awake'}
              </span>
              <span className="text-[10px] text-[#999] block truncate">
                {isWakeLockActive
                  ? 'Screen won\'t go dark while hands are covered in marinade'
                  : 'Tap to prevent screen sleep while cooking'}
              </span>
            </div>
          </div>

          <button
            onClick={handleToggleWakeLock}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex-shrink-0 ${
              isWakeLockActive
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40 border border-amber-400'
                : 'bg-[#29221b] text-[#c2bcaf] hover:text-white border border-[#44382d]'
            }`}
          >
            {isWakeLockActive ? 'Awake ON' : 'Turn ON'}
          </button>
        </div>

        {/* Main Countdown Display */}
        <div className="bg-[#12100e] border border-[#2b241c] rounded-2xl p-5 text-center relative overflow-hidden mb-4">
          <div
            className="absolute left-0 top-0 bottom-0 bg-amber-500/10 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />

          <span className="relative text-[10px] uppercase font-bold tracking-widest text-[#dea374]">
            {timerState.label}
          </span>

          <div className="relative text-4xl sm:text-5xl font-mono font-extrabold text-white my-1 tracking-wider">
            {formatTime(timerState.remainingSeconds)}
          </div>

          {/* Quick Bump Buttons */}
          <div className="relative flex items-center justify-center gap-2 mt-3">
            <button
              onClick={() => cookingTimerStore.addTime(60)}
              className="px-2.5 py-1 bg-[#221c17] hover:bg-[#2e2620] border border-[#382f25] text-[11px] font-semibold text-[#dea374] rounded-lg transition-all"
            >
              +1 Min
            </button>
            <button
              onClick={() => cookingTimerStore.addTime(300)}
              className="px-2.5 py-1 bg-[#221c17] hover:bg-[#2e2620] border border-[#382f25] text-[11px] font-semibold text-[#dea374] rounded-lg transition-all"
            >
              +5 Mins
            </button>
            <button
              onClick={() => cookingTimerStore.playChimeAudio()}
              title="Test audio chime volume"
              className="px-2.5 py-1 bg-[#221c17] hover:bg-[#2e2620] border border-[#382f25] text-[11px] font-semibold text-[#a8a196] hover:text-white rounded-lg transition-all flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#dea374]" />
              <span>Test Chime</span>
            </button>
          </div>
        </div>

        {/* Timer Controls: Start / Pause / Resume / Reset */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {timerState.status === 'running' ? (
            <button
              onClick={() => cookingTimerStore.pauseTimer()}
              className="py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all"
            >
              <Pause className="w-4 h-4" />
              <span>Pause Timer</span>
            </button>
          ) : timerState.status === 'paused' ? (
            <button
              onClick={() => cookingTimerStore.resumeTimer()}
              className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all"
            >
              <Play className="w-4 h-4" />
              <span>Resume</span>
            </button>
          ) : (
            <button
              onClick={handleStartCustom}
              className="py-2.5 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#cf7b3e]/30 transition-all"
            >
              <Play className="w-4 h-4" />
              <span>Start Timer</span>
            </button>
          )}

          <button
            onClick={() => cookingTimerStore.resetTimer()}
            className="py-2.5 rounded-xl bg-[#221c17] hover:bg-[#2e2620] border border-[#382f25] text-xs font-semibold text-[#b8afa3] hover:text-white flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Quick Braai Presets */}
        <div className="overflow-y-auto space-y-1.5 flex-1 pr-1 border-t border-[#29221a] pt-3">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#999] block mb-1">
            Quick Fireside &amp; Braai Presets:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => cookingTimerStore.startTimer(p.seconds, p.label.split('•')[1]?.trim() || p.label)}
                className="p-2 rounded-xl bg-[#1d1814] hover:bg-[#29221b] border border-[#32281e] text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base">{p.icon}</span>
                  <span className="text-xs font-semibold text-[#ddd] group-hover:text-white truncate">
                    {p.label}
                  </span>
                </div>
                <Flame className="w-3.5 h-3.5 text-amber-500/70 group-hover:text-amber-400 flex-shrink-0" />
              </button>
            ))}
          </div>

          {/* Custom Time Selector */}
          <div className="mt-3 pt-2.5 border-t border-[#221c17] flex items-center justify-between gap-2">
            <span className="text-xs text-[#a8a196]">Custom time:</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="180"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="w-14 bg-[#100e0d] border border-[#332b22] rounded-lg px-2 py-1 text-xs text-white text-center font-mono focus:outline-none focus:border-[#cf7b3e]"
              />
              <span className="text-xs text-[#777]">m</span>
              <input
                type="number"
                min="0"
                max="59"
                value={customSeconds}
                onChange={(e) => setCustomSeconds(e.target.value)}
                className="w-12 bg-[#100e0d] border border-[#332b22] rounded-lg px-2 py-1 text-xs text-white text-center font-mono focus:outline-none focus:border-[#cf7b3e]"
              />
              <span className="text-xs text-[#777]">s</span>
              <button
                onClick={handleStartCustom}
                className="ml-1 px-3 py-1 bg-[#cf7b3e] hover:bg-[#b8612b] text-white font-bold text-xs rounded-lg shadow transition-all"
              >
                Set
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
