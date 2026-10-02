import React from 'react';
import {
  Eye,
  Clock,
  Pause,
  Play,
  Heart,
  UserPlus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  Activity,
  Shield,
  Zap,
} from 'lucide-react';
import { Language, RoomState, Question } from '../../shared/types';
import { RobotAvatar } from './RobotAvatar';
import { soundManager } from '../audio/soundManager';
import { translations } from '../i18n/translations';

interface HostAdminMonitorProps {
  roomState: RoomState;
  lang: Language;
  onRevealAnswers: () => void;
  onNextQuestion: () => void;
  onToggleTimer: () => void;
  onHealSquad: () => void;
  onAddBot: () => void;
}

const ARCADE_SHAPES = ['▲ A', '◆ B', '● C', '◼ D'];

export const HostAdminMonitor: React.FC<HostAdminMonitorProps> = ({
  roomState,
  lang,
  onRevealAnswers,
  onNextQuestion,
  onToggleTimer,
  onHealSquad,
  onAddBot,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';
  const q = roomState.currentQuestion;
  const players = Object.values(roomState.players);
  const totalPlayers = players.length;
  const answeredCount = players.filter((p) => p.hasAnswered).length;

  // Calculate live distribution for options 0, 1, 2, 3
  const optionCounts = [0, 0, 0, 0];
  players.forEach((p) => {
    if (typeof p.currentAnswer === 'number' && p.currentAnswer >= 0 && p.currentAnswer <= 3) {
      optionCounts[p.currentAnswer]++;
    }
  });

  return (
    <div
      className="bg-slate-900/95 border-2 border-amber-500/60 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Header Banner: Host Commander Deck */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black font-mono tracking-wide text-amber-300 uppercase">
                COMMANDER ADMIN MONITOR
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/40">
                SPECTATOR / TEACHER MODE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              You are moderating the battle. Observe students live, guide them, and control the round flow.
            </p>
          </div>
        </div>

        {/* Live Answer Progress Tracker */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <div className="flex flex-col text-xs font-mono">
            <span className="text-slate-400 font-bold uppercase text-[10px]">
              STUDENTS ANSWERED
            </span>
            <span className="text-sm font-black text-cyan-300">
              {answeredCount} / {totalPlayers} ({totalPlayers > 0 ? Math.round((answeredCount / totalPlayers) * 100) : 0}%)
            </span>
          </div>
        </div>
      </div>

      {/* Admin Action Control Toolbar */}
      <div className="flex items-center gap-2 flex-wrap bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase mr-2">
          CONTROLS:
        </span>

        {/* Reveal Answers */}
        <button
          onClick={() => {
            soundManager.playButtonClick();
            onRevealAnswers();
          }}
          disabled={roomState.status !== 'question_active'}
          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-mono text-xs font-black shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4" />
          <span>{t.revealAnswers}</span>
        </button>

        {/* Pause/Resume Timer */}
        <button
          onClick={() => {
            soundManager.playButtonClick();
            onToggleTimer();
          }}
          className={`px-3.5 py-2 rounded-xl font-mono text-xs font-black border transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
            roomState.isTimerPaused
              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          {roomState.isTimerPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          <span>{roomState.isTimerPaused ? 'RESUME TIMER' : 'PAUSE TIMER'}</span>
        </button>

        {/* Emergency Squad Heal */}
        <button
          onClick={() => {
            soundManager.playButtonClick();
            onHealSquad();
          }}
          className="px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-300 font-mono text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          <span>HEAL SQUAD (100% HP)</span>
        </button>

        {/* Add Practice Cadet Robot */}
        <button
          onClick={() => {
            soundManager.playButtonClick();
            onAddBot();
          }}
          className="px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-mono text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-cyan-400" />
          <span>+ ADD CADET BOT</span>
        </button>
      </div>

      {/* Teacher Answer Key Card */}
      {q && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
          <div>
            <span className="text-amber-400 font-bold uppercase tracking-wider block mb-0.5">
              🎯 ANSWER KEY (VISIBLE ONLY TO COMMANDER):
            </span>
            <span className="text-sm font-black text-white">
              {q.isCodeEditorChallenge
                ? `Required pattern: ${q.expectedPattern}`
                : `Option ${ARCADE_SHAPES[q.correctOptionIndex ?? 0]}: ${
                    isAr
                      ? q.options?.[q.correctOptionIndex ?? 0]?.textAr
                      : q.options?.[q.correctOptionIndex ?? 0]?.textEn
                  }`}
            </span>
          </div>

          <div className="text-slate-400 text-[11px] max-w-sm">
            {isAr ? q.explanationAr : q.explanationEn}
          </div>
        </div>
      )}

      {/* Live Answer Distribution Meters (for multiple-choice rounds) */}
      {q && !q.isCodeEditorChallenge && q.options && (
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
            LIVE STUDENT ANSWER DISTRIBUTION:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((opt, idx) => {
              const count = optionCounts[idx];
              const pct = totalPlayers > 0 ? Math.round((count / totalPlayers) * 100) : 0;
              const isCorrect = q.correctOptionIndex === idx;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex flex-col justify-between gap-1.5 font-mono text-xs ${
                    isCorrect
                      ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black text-slate-200">
                      {ARCADE_SHAPES[idx]}: {isAr ? opt.textAr : opt.textEn}
                    </span>
                    {isCorrect && (
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                        CORRECT KEY
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCorrect ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-slate-400 font-bold text-[11px] shrink-0">
                      {count} ({pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Squad Roster Cards: View What Every Student Is Doing */}
      <div className="space-y-3">
        <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
          LIVE SQUAD TELEMETRY & ACTIONS:
        </span>

        {players.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
            <p className="text-sm font-mono text-slate-400">
              No students connected yet. Share room code{' '}
              <strong className="text-amber-300">{roomState.code}</strong> with players!
            </p>
            <button
              onClick={() => {
                soundManager.playButtonClick();
                onAddBot();
              }}
              className="py-2 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/40"
            >
              + Spawn Cadet Robot for Testing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {players.map((p) => {
              const isCorrectAnswer =
                q &&
                (q.isCodeEditorChallenge
                  ? typeof p.currentAnswer === 'string' &&
                    new RegExp(q.expectedPattern || '', 'i').test(p.currentAnswer)
                  : p.currentAnswer === q.correctOptionIndex);

              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 font-mono transition-all ${
                    p.hasAnswered
                      ? isCorrectAnswer
                        ? 'bg-emerald-950/20 border-emerald-500/50'
                        : 'bg-rose-950/20 border-rose-500/50'
                      : 'bg-slate-950/90 border-slate-800'
                  }`}
                >
                  {/* Robot Avatar & Name */}
                  <div className="flex items-center gap-3">
                    <RobotAvatar customization={p.customization} size={48} />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-sm text-slate-100">{p.name}</span>
                        {p.isBot && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            BOT
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-16 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-rose-500 rounded-full"
                            style={{ width: `${Math.max(0, (p.hp / p.maxHp) * 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">{p.hp} HP</span>
                      </div>
                    </div>
                  </div>

                  {/* Student Live Action Status */}
                  <div className="text-end">
                    {p.hasAnswered ? (
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-xs font-black">
                          {isCorrectAnswer ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              CORRECT
                            </span>
                          ) : (
                            <span className="text-rose-400 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" />
                              INCORRECT
                            </span>
                          )}
                        </div>

                        {/* Selected Option or Code snippet */}
                        <div className="text-[11px] font-bold text-amber-300 mt-0.5">
                          {typeof p.currentAnswer === 'number'
                            ? `Chose: ${ARCADE_SHAPES[p.currentAnswer]}`
                            : 'Submitted Code'}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          ⏱️ {p.answeredAt ? `${((p.answeredAt - roomState.questionStartTime) / 1000).toFixed(1)}s` : ''}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        <span>THINKING...</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
