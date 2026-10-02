import React from 'react';
import { Trophy, Flame, Zap, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { Language, RoomState } from '../../shared/types';
import { soundManager } from '../audio/soundManager';
import { translations } from '../i18n/translations';

interface RoundResultModalProps {
  roomState: RoomState;
  yourPlayerId: string;
  lang: Language;
  onNextQuestion: () => void;
}

export const RoundResultModal: React.FC<RoundResultModalProps> = ({
  roomState,
  yourPlayerId,
  lang,
  onNextQuestion,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';
  const isHost = roomState.hostId === yourPlayerId;
  const q = roomState.currentQuestion;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none animate-fadeIn"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-amber-500/70 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-5 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 fill-slate-950" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-mono uppercase tracking-wide">
                ROUND RESULTS
              </h2>
              <p className="text-xs font-bold text-slate-900 font-mono">
                {roomState.boss.name} — HP {roomState.boss.currentHp}/{roomState.boss.maxHp}
              </p>
            </div>
          </div>

          {/* Round Boss Damage Badge */}
          <div className="px-4 py-2 rounded-2xl bg-slate-950 text-amber-300 font-mono font-black text-lg border-2 border-amber-400/50 shadow-lg flex items-center gap-1.5">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>-{roomState.roundDamageDealt} HP</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Team Combo Alert */}
          {roomState.teamCombo > 0 && (
            <div className="flex items-center justify-center gap-3 py-2 px-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-300 font-mono font-black text-sm sm:text-base animate-pulse">
              <Flame className="w-6 h-6 fill-amber-400" />
              <span>
                {t.teamCombo} x{roomState.teamCombo} (+{roomState.teamCombo * 10}% DAMAGE)
              </span>
            </div>
          )}

          {/* Squad Leaderboard Table */}
          <div className="space-y-2">
            {roomState.roundLeaderboard.map((entry, index) => {
              const isYou = entry.playerId === yourPlayerId;
              return (
                <div
                  key={entry.playerId}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 font-mono transition-all ${
                    entry.isCorrect
                      ? isYou
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-md ring-1 ring-cyan-400/50'
                        : 'bg-slate-950/80 border-slate-800'
                      : 'bg-rose-950/20 border-rose-900/60 opacity-80'
                  }`}
                >
                  {/* Rank & Name */}
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-black text-base text-amber-400">
                      #{index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      {entry.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                      <div>
                        <span className="font-bold text-sm sm:text-base text-slate-100">
                          {entry.name}
                        </span>
                        {isYou && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                            YOU
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs sm:text-sm">
                    <span className="text-slate-400">
                      ⏱️ {entry.answeredTimeSec}s
                    </span>
                    <div className="text-end">
                      <span className="text-emerald-400 font-black">
                        +{entry.roundScore}
                      </span>
                      <div className="text-[10px] text-slate-500">
                        {entry.damage > 0 ? `-${entry.damage} DMG` : 'MISSED'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Educational Concept Explanation */}
          {q && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 text-xs sm:text-sm space-y-2">
              <span className="font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                💡 Physical Computing Insight:
              </span>
              <p className="leading-relaxed">
                {isAr ? q.explanationAr : q.explanationEn}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            Sector {roomState.selectedWorld} • Round {roomState.questionIndex + 1}/{roomState.totalQuestions}
          </span>

          {isHost ? (
            <button
              onClick={() => {
                soundManager.playButtonClick();
                onNextQuestion();
              }}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black font-mono text-sm sm:text-base shadow-lg shadow-amber-500/20 border-2 border-amber-200 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>{t.nextQuestion}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <span className="text-xs font-mono text-slate-400 italic">
              {t.waitingForHost}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
