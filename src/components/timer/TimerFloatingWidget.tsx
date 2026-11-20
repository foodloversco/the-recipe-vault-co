import React, { useState, useEffect } from 'react';
import { cookingTimerStore, TimerState } from '../../services/cookingTimerStore';
import { BellRing, Clock, Pause, Play, Volume2, X } from 'lucide-react';

interface TimerFloatingWidgetProps {
  onOpenTimerModal: () => void;
}

export const TimerFloatingWidget: React.FC<TimerFloatingWidgetProps> = ({ onOpenTimerModal }) => {
  const [timerState, setTimerState] = useState<TimerState>(() => cookingTimerStore.getState());

  useEffect(() => {
    return cookingTimerStore.subscribe((s) => setTimerState(s));
  }, []);

  if (timerState.status === 'idle') return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // If ringing, show urgent attention banner
  if (timerState.status === 'ringing') {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-gradient-to-r from-rose-700 via-amber-600 to-rose-700 text-white p-3.5 rounded-2xl shadow-2xl border-2 border-white/60 animate-bounce flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <BellRing className="w-5 h-5 text-white animate-spin flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-xs font-extrabold uppercase tracking-wider block truncate">
              🔔 Braai / Oven Timer Finished!
            </span>
            <span className="text-[11px] text-white/90 block truncate">
              {timerState.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => cookingTimerStore.dismissAlarm()}
            className="px-3 py-1.5 rounded-xl bg-white text-rose-700 font-extrabold text-xs shadow-md hover:bg-neutral-100"
          >
            Stop
          </button>
          <button
            onClick={() => cookingTimerStore.addTime(120)}
            className="px-2.5 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white font-bold text-xs border border-white/30"
          >
            +2m
          </button>
        </div>
      </div>
    );
  }

  // Running or Paused floating pill in bottom-left
  return (
    <div
      onClick={onOpenTimerModal}
      className={`fixed bottom-20 left-4 z-40 bg-[#161311]/95 border cursor-pointer hover:scale-105 active:scale-95 transition-all backdrop-blur-md rounded-2xl p-2.5 shadow-2xl flex items-center gap-2.5 ${
        timerState.status === 'running'
          ? 'border-amber-500/50 shadow-amber-900/30 text-amber-300'
          : 'border-[#382f25] text-[#bbb]'
      }`}
      title="Click to open Cooking Timer controls"
    >
      <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
        <Clock className={`w-4 h-4 ${timerState.status === 'running' ? 'animate-spin' : ''}`} />
      </div>

      <div className="min-w-0 pr-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono font-bold text-white tracking-wide">
            {formatTime(timerState.remainingSeconds)}
          </span>
          <span className="text-[10px] text-amber-400 font-semibold uppercase">
            {timerState.status}
          </span>
        </div>
        <span className="text-[10px] text-[#8e8578] block truncate max-w-[130px]">
          {timerState.label}
        </span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (timerState.status === 'running') {
            cookingTimerStore.pauseTimer();
          } else {
            cookingTimerStore.resumeTimer();
          }
        }}
        className="p-1 rounded-lg bg-[#27211b] hover:bg-[#382f27] text-white"
      >
        {timerState.status === 'running' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
