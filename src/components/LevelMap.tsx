import React from 'react';
import { X, MapPin, Lock, CheckCircle2, Zap } from 'lucide-react';
import { Language } from '../../shared/types';
import { BOSSES } from '../data/bosses';
import { translations } from '../i18n/translations';

interface LevelMapProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedWorlds: number[];
  selectedWorld: number;
  onSelectWorld?: (w: number) => void;
  lang: Language;
}

export const LevelMap: React.FC<LevelMapProps> = ({
  isOpen,
  onClose,
  unlockedWorlds,
  selectedWorld,
  onSelectWorld,
  lang,
}) => {
  if (!isOpen) return null;
  const t = translations[lang];
  const isAr = lang === 'ar';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none animate-fadeIn"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-3xl bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-black font-mono uppercase text-slate-100">
              PHYSICAL COMPUTING NETWORK MAP
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 relative">
          {[1, 2, 3, 4].map((worldNum, idx) => {
            const boss = BOSSES[worldNum];
            const isUnlocked = unlockedWorlds.includes(worldNum);
            const isSelected = selectedWorld === worldNum;

            return (
              <div
                key={worldNum}
                onClick={() => {
                  if (isUnlocked && onSelectWorld) {
                    onSelectWorld(worldNum);
                  }
                }}
                className={`flex-1 w-full p-4 rounded-2xl border-2 flex flex-col items-center text-center relative transition-all ${
                  isSelected
                    ? 'bg-slate-950 border-cyan-400 shadow-xl ring-2 ring-cyan-500/50'
                    : isUnlocked
                    ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700 cursor-pointer'
                    : 'bg-slate-950/30 border-slate-900 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 font-mono font-black text-sm bg-slate-800 border border-slate-700 text-amber-400">
                  {isUnlocked ? worldNum : <Lock className="w-4 h-4 text-slate-500" />}
                </div>

                <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                  SECTOR {worldNum}
                </span>
                <span className="text-base font-black font-mono text-slate-100 mt-1">
                  {boss.name}
                </span>
                <span className="text-[11px] text-cyan-300 font-medium">
                  {isAr ? boss.locationAr : boss.locationEn}
                </span>

                {isUnlocked && (
                  <div className="mt-3 flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ACCESSIBLE</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
