import React from 'react';

interface MicroBitSimulatorProps {
  matrix?: number[][];
  label?: string;
  isGlitching?: boolean;
  className?: string;
}

export const MicroBitSimulator: React.FC<MicroBitSimulatorProps> = ({
  matrix = [
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  label,
  isGlitching = false,
  className = '',
}) => {
  return (
    <div
      className={`relative bg-neutral-900 border-2 border-slate-700 rounded-2xl p-3 shadow-xl select-none transition-all ${
        isGlitching ? 'animate-pulse ring-4 ring-red-500/50' : ''
      } ${className}`}
      style={{ maxWidth: 220 }}
    >
      {/* Board Screws */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full border border-slate-500 bg-slate-800" />
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full border border-slate-500 bg-slate-800" />

      {/* Top Silkscreen */}
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold">
          BBC micro:bit
        </span>
        <div className="w-2 h-2 rounded-full bg-amber-400/80 animate-ping" />
      </div>

      {/* Main Face Area */}
      <div className="flex items-center justify-between gap-1 my-1">
        {/* Button A */}
        <div className="flex flex-col items-center">
          <div className="w-5 h-5 rounded-full bg-slate-700 border-2 border-slate-600 shadow-inner flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-900" />
          </div>
          <span className="text-[9px] font-bold text-slate-400 font-mono mt-0.5">A</span>
        </div>

        {/* 5x5 LED Matrix Grid */}
        <div className="bg-black/90 p-2 rounded-xl border border-slate-800 shadow-inner grid grid-cols-5 gap-1.5">
          {matrix.map((row, rIdx) =>
            row.map((val, cIdx) => {
              const isLit = val > 0;
              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-3.5 h-3.5 rounded-sm transition-all duration-150 ${
                    isLit
                      ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e] border border-rose-300'
                      : 'bg-neutral-800/80 border border-neutral-800'
                  }`}
                />
              );
            })
          )}
        </div>

        {/* Button B */}
        <div className="flex flex-col items-center">
          <div className="w-5 h-5 rounded-full bg-slate-700 border-2 border-slate-600 shadow-inner flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-900" />
          </div>
          <span className="text-[9px] font-bold text-slate-400 font-mono mt-0.5">B</span>
        </div>
      </div>

      {/* Bottom Gold Fingers / Edge Connector */}
      <div className="mt-2 pt-1 border-t border-slate-800 flex items-center justify-around">
        <div className="flex flex-col items-center">
          <div className="w-4 h-3 rounded-sm bg-gradient-to-b from-amber-400 to-amber-600 shadow-sm" />
          <span className="text-[8px] font-mono text-amber-300">0</span>
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1.5 h-2 bg-amber-500/80 rounded-t-sm" />
          ))}
        </div>
        <div className="flex flex-col items-center">
          <div className="w-4 h-3 rounded-sm bg-gradient-to-b from-amber-400 to-amber-600 shadow-sm" />
          <span className="text-[8px] font-mono text-amber-300">1</span>
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1.5 h-2 bg-amber-500/80 rounded-t-sm" />
          ))}
        </div>
        <div className="flex flex-col items-center">
          <div className="w-4 h-3 rounded-sm bg-gradient-to-b from-amber-400 to-amber-600 shadow-sm" />
          <span className="text-[8px] font-mono text-amber-300">2</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-4 h-3 rounded-sm bg-gradient-to-b from-amber-400 to-amber-600 shadow-sm" />
          <span className="text-[8px] font-mono text-amber-300">3V</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-4 h-3 rounded-sm bg-gradient-to-b from-amber-400 to-amber-600 shadow-sm" />
          <span className="text-[8px] font-mono text-amber-300">GND</span>
        </div>
      </div>

      {label && (
        <div className="mt-1 text-center text-[10px] font-mono font-semibold text-cyan-400 truncate">
          {label}
        </div>
      )}
    </div>
  );
};
