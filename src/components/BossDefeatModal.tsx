import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Zap, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { Language, RoomState } from '../../shared/types';
import { soundManager } from '../audio/soundManager';
import { translations } from '../i18n/translations';

interface BossDefeatModalProps {
  roomState: RoomState;
  yourPlayerId: string;
  lang: Language;
  onNextWorld: () => void;
  onReturnToLobby: () => void;
}

export const BossDefeatModal: React.FC<BossDefeatModalProps> = ({
  roomState,
  yourPlayerId,
  lang,
  onNextWorld,
  onReturnToLobby,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';
  const isHost = roomState.hostId === yourPlayerId;

  useEffect(() => {
    soundManager.playVictory();
    // Burst confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#facc15', '#ec4899', '#10b981'],
      });
    } catch (e) {}
  }, []);

  const players = Object.values(roomState.players);
  const mvp = [...players].sort((a, b) => b.score - a.score)[0];
  const hasNextWorld = roomState.selectedWorld < 4;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none animate-fadeIn"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-xl bg-slate-900 border-4 border-yellow-400 rounded-3xl shadow-[0_0_50px_rgba(250,204,21,0.4)] overflow-hidden flex flex-col text-center">
        {/* Victory Banner */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 py-6 px-4 text-slate-950">
          <div className="text-4xl mb-1 animate-bounce">🤖💥</div>
          <h2 className="text-3xl font-black font-mono tracking-tight uppercase">
            {t.bossDefeated}
          </h2>
          <p className="text-sm font-black font-mono tracking-widest text-slate-900 mt-1 uppercase">
            {roomState.boss.name} {t.destroyed} • {t.sectorCleared}
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* MVP Highlight Box */}
          {mvp && (
            <div className="p-5 rounded-2xl bg-amber-500/15 border-2 border-amber-400/60 flex flex-col items-center">
              <Award className="w-10 h-10 text-amber-400 mb-1" />
              <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">
                {t.mvp}
              </span>
              <div className="text-2xl font-black font-mono text-white mt-1">
                {mvp.name}
              </div>
              <span className="text-sm font-mono text-amber-300 font-bold mt-1">
                {mvp.score} PTS • STREAK x{mvp.streak}
              </span>
            </div>
          )}

          {/* Squad Leaderboard Summary */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block text-start font-bold">
              FINAL SQUAD RANKINGS:
            </span>
            {players
              .sort((a, b) => b.score - a.score)
              .map((p, idx) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-sm font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-black text-amber-400 w-5">#{idx + 1}</span>
                    <span className="font-bold text-slate-100">{p.name}</span>
                    {p.id === yourPlayerId && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                  <span className="font-black text-cyan-400">{p.score} PTS</span>
                </div>
              ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3">
          {isHost && hasNextWorld && (
            <button
              onClick={() => {
                soundManager.playButtonClick();
                onNextWorld();
              }}
              className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black font-mono text-base border-2 border-emerald-200 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.nextWorld}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {isHost && (
            <button
              onClick={() => {
                soundManager.playButtonClick();
                onReturnToLobby();
              }}
              className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black font-mono text-base border-2 border-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{t.returnToLobby}</span>
            </button>
          )}

          {!isHost && (
            <span className="text-xs font-mono text-slate-400 italic">
              {t.waitingForHost}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
