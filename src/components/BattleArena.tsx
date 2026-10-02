import React, { useState, useEffect } from 'react';
import {
  Clock,
  Flame,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  Code2,
  Send,
  Eye,
  Shield,
  Heart,
} from 'lucide-react';
import { Language, RoomState } from '../../shared/types';
import { BOSSES } from '../data/bosses';
import { BossVisual } from './BossVisual';
import { RobotAvatar } from './RobotAvatar';
import { MicroBitSimulator } from './MicroBitSimulator';
import { HostAdminMonitor } from './HostAdminMonitor';
import { soundManager } from '../audio/soundManager';
import { translations } from '../i18n/translations';

interface BattleArenaProps {
  roomState: RoomState;
  yourPlayerId: string;
  lang: Language;
  onSubmitAnswer: (answer: number | string) => void;
  onHostReveal: () => void;
  onHostNext: () => void;
  onToggleTimer?: () => void;
  onHealSquad?: () => void;
  onAddBot?: () => void;
}

const ARCADE_SHAPES = ['▲ A', '◆ B', '● C', '◼ D'];
const ARCADE_COLORS = [
  'from-cyan-500 to-blue-600 border-cyan-300 hover:from-cyan-400 hover:to-blue-500 text-slate-950',
  'from-amber-400 to-yellow-500 border-amber-200 hover:from-amber-300 hover:to-yellow-400 text-slate-950',
  'from-emerald-500 to-teal-600 border-emerald-300 hover:from-emerald-400 hover:to-teal-500 text-slate-950',
  'from-rose-500 to-pink-600 border-rose-300 hover:from-rose-400 hover:to-pink-500 text-slate-950',
];

export const BattleArena: React.FC<BattleArenaProps> = ({
  roomState,
  yourPlayerId,
  lang,
  onSubmitAnswer,
  onHostReveal,
  onHostNext,
  onToggleTimer,
  onHealSquad,
  onAddBot,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';
  const isHost = roomState.hostId === yourPlayerId;
  const q = roomState.currentQuestion;
  const currentBoss = BOSSES[roomState.selectedWorld] || BOSSES[1];
  const hpPercent = Math.max(0, Math.round((roomState.boss.currentHp / roomState.boss.maxHp) * 100));

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [typedCode, setTypedCode] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);

  // Reset local answer state when new question begins
  useEffect(() => {
    setSelectedOption(null);
    setShowHint(false);
    if (q && q.isCodeEditorChallenge && q.codeStarter) {
      setTypedCode(q.codeStarter);
    } else {
      setTypedCode('');
    }
  }, [q?.id]);

  // Audio countdown on last 5 seconds
  useEffect(() => {
    if (roomState.status === 'question_active' && roomState.questionTimeRemaining <= 5 && roomState.questionTimeRemaining > 0) {
      soundManager.playCountDownTick();
    }
  }, [roomState.questionTimeRemaining, roomState.status]);

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null || !q) return;
    setSelectedOption(idx);
    soundManager.playButtonClick();
    onSubmitAnswer(idx);
  };

  const handleTransmitCode = () => {
    if (!q || !typedCode.trim()) return;
    soundManager.playButtonClick();
    onSubmitAnswer(typedCode);
  };

  const currentPhaseData =
    currentBoss.phases.find((p) => p.phaseNumber === roomState.boss.phase) || currentBoss.phases[0];

  const youPlayer = roomState.players[yourPlayerId];
  const hasYouAnswered = youPlayer?.hasAnswered || selectedOption !== null;

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-5 select-none"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* 1. TOP BOSS ARENA DISPLAY */}
      <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Boss Header & HP Bar */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-black font-mono text-xs tracking-wider border border-amber-300">
                {t.world} {roomState.selectedWorld}
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-mono text-white tracking-wide">
                {currentBoss.name}
              </h2>
              <span className="text-xs font-mono font-bold text-slate-400 hidden sm:inline">
                {isAr ? currentBoss.titleAr : currentBoss.titleEn}
              </span>
            </div>

            {/* Boss Phase Badge */}
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-xl font-mono text-xs font-black border transition-all ${
                  roomState.boss.phase === 3
                    ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                    : roomState.boss.phase === 2
                    ? 'bg-amber-500 text-slate-950 border-amber-300'
                    : 'bg-cyan-500 text-slate-950 border-cyan-300'
                }`}
              >
                {t.phase} {roomState.boss.phase} / 3
              </span>
            </div>
          </div>

          {/* Boss Integrity Health Bar */}
          <div className="relative w-full h-7 bg-slate-950 rounded-2xl border-2 border-slate-700 p-0.5 overflow-hidden shadow-inner flex items-center">
            <div
              className={`h-full rounded-xl transition-all duration-500 ${
                hpPercent <= 33
                  ? 'bg-gradient-to-r from-rose-600 to-red-500 shadow-[0_0_15px_#f43f5e]'
                  : hpPercent <= 66
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_15px_#facc15]'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_15px_#38bdf8]'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-4 font-mono font-black text-xs text-white drop-shadow-md">
              <span>{t.bossHp}</span>
              <span>
                {roomState.boss.currentHp} / {roomState.boss.maxHp} ({hpPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Boss Stage Interior (Boss Visual + MicroBit Simulator + Attack Info) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* MicroBit Board Display */}
          <div className="md:col-span-4 flex flex-col items-center justify-center">
            <MicroBitSimulator
              matrix={q?.microbitDisplaySim}
              label={q?.category ? `MODULE: ${q.category.toUpperCase()}` : 'BBC micro:bit'}
              isGlitching={roomState.boss.isHit}
            />
          </div>

          {/* Center Cartoon Boss Visual */}
          <div className="md:col-span-5 flex flex-col items-center justify-center relative">
            <BossVisual
              boss={currentBoss}
              phase={roomState.boss.phase}
              isHit={roomState.boss.isHit}
              isAttacking={roomState.boss.isAttacking}
              currentHpPercent={hpPercent}
            />

            {/* Boss Attack Callout Box */}
            <div className="mt-2 text-center bg-slate-950/80 px-4 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="text-amber-400 font-bold">
                ⚡ {isAr ? currentPhaseData.attackNameAr : currentPhaseData.attackNameEn}:
              </span>{' '}
              <span className="text-slate-300">
                {isAr ? currentPhaseData.attackDescriptionAr : currentPhaseData.attackDescriptionEn}
              </span>
            </div>
          </div>

          {/* Team Combo & Squad Health Summary */}
          <div className="md:col-span-3 flex flex-col gap-2">
            {/* Team Combo Meter */}
            <div className="p-3 rounded-2xl bg-slate-950 border-2 border-amber-500/40 flex items-center gap-3 shadow-inner">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Flame className="w-6 h-6 fill-amber-400 animate-bounce" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                  {t.teamCombo}
                </div>
                <div className="text-lg font-black font-mono text-amber-300 leading-tight">
                  x{roomState.teamCombo}{' '}
                  <span className="text-xs text-amber-400 font-semibold">
                    (+{roomState.teamCombo * 10}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Squad Robot Mini Health Indicators */}
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 max-h-36 overflow-y-auto">
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>SQUAD STATUS</span>
              </div>
              {Object.values(roomState.players).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="font-bold text-slate-200 truncate">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-rose-400 font-bold">{p.hp} HP</span>
                    {p.hasAnswered ? (
                      <span className="text-[10px] text-emerald-400 font-bold">🎯</span>
                    ) : (
                      <span className="text-[10px] text-slate-500">⏳</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. QUESTION & CODING CHALLENGE CARD */}
      {q && (
        <div className="bg-slate-900/90 border-2 border-cyan-500/60 rounded-3xl p-5 sm:p-7 shadow-2xl relative">
          {/* Question Header & Countdown Timer */}
          <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                ROUND {roomState.questionIndex + 1} / {roomState.totalQuestions}
              </span>

              {/* Difficulty Badge */}
              <span
                className={`px-3 py-1 rounded-xl font-mono text-xs font-black border ${
                  q.difficulty === 'easy' || !q.difficulty
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : q.difficulty === 'medium'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : q.difficulty === 'hard'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                }`}
              >
                {q.difficulty === 'easy' || !q.difficulty
                  ? t.difficultyEasy
                  : q.difficulty === 'medium'
                  ? t.difficultyMedium
                  : q.difficulty === 'hard'
                  ? t.difficultyHard
                  : t.difficultyExpert}
              </span>

              <span className="text-xs font-mono text-slate-400 capitalize">
                <strong className="text-slate-200">{q.category}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Interactive Hint Toggle Button */}
              {(q.hintEn || q.hintAr) && (
                <button
                  onClick={() => {
                    soundManager.playButtonClick();
                    setShowHint(!showHint);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                    showHint
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                      : 'bg-slate-950 text-amber-300 border-amber-500/50 hover:bg-slate-800'
                  }`}
                >
                  <span>{showHint ? t.hideHint : t.showHint}</span>
                </button>
              )}

              {/* Countdown Clock */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950 border border-slate-700">
                <Clock
                  className={`w-4 h-4 ${
                    roomState.questionTimeRemaining <= 5 ? 'text-rose-400 animate-spin' : 'text-cyan-400'
                  }`}
                />
                <span
                  className={`font-mono font-black text-sm ${
                    roomState.questionTimeRemaining <= 5 ? 'text-rose-400' : 'text-slate-100'
                  }`}
                >
                  {roomState.questionTimeRemaining}s
                </span>
              </div>
            </div>
          </div>

          {/* Expanded Helpful Hint Callout Box */}
          {showHint && (q.hintEn || q.hintAr) && (
            <div className="mb-4 p-3.5 rounded-2xl bg-amber-500/15 border-2 border-amber-400/60 text-amber-200 text-xs sm:text-sm font-medium animate-fadeIn flex items-start gap-2.5">
              <span className="text-base shrink-0">💡</span>
              <p className="leading-relaxed">
                {isAr ? q.hintAr : q.hintEn}
              </p>
            </div>
          )}

          {/* Question Title */}
          <h3 className="text-base sm:text-lg font-black text-slate-100 mb-4 leading-relaxed">
            {isAr ? q.titleAr : q.titleEn}
          </h3>

          {/* Python Code Snippet Block (if provided) */}
          {q.codeSnippet && (
            <div className="mb-5 rounded-2xl bg-slate-950 border-2 border-slate-800 p-4 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-slate-500 pb-2 mb-2 border-b border-slate-900 select-none">
                <span>main.py (micro:bit MicroPython)</span>
                <span className="text-amber-400 font-bold">BBC micro:bit Editor V3</span>
              </div>
              <pre className="text-slate-100 font-mono leading-relaxed whitespace-pre">
                {q.codeSnippet}
              </pre>
            </div>
          )}

          {/* 3. INTERFACE: HOST ADMIN MONITOR FOR COMMANDER, OR ARCADE BUTTONS FOR PLAYERS */}
          {isHost ? (
            <HostAdminMonitor
              roomState={roomState}
              lang={lang}
              onRevealAnswers={onHostReveal}
              onNextQuestion={onHostNext}
              onToggleTimer={onToggleTimer || (() => {})}
              onHealSquad={onHealSquad || (() => {})}
              onAddBot={onAddBot || (() => {})}
            />
          ) : q.isCodeEditorChallenge ? (
            /* Interactive Code Editor Boss Weak Point Challenge for Student */
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center gap-2">
                <Code2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{isAr ? q.codeEditorPromptAr : q.codeEditorPromptEn}</span>
              </div>

              <div className="rounded-2xl bg-slate-950 border-2 border-slate-700 p-3 shadow-inner">
                <textarea
                  value={typedCode}
                  onChange={(e) => setTypedCode(e.target.value)}
                  disabled={hasYouAnswered}
                  rows={4}
                  placeholder={t.codePlaceholder}
                  className="w-full bg-transparent font-mono text-sm text-emerald-400 outline-none resize-none disabled:opacity-60"
                  spellCheck={false}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playButtonClick();
                    if (q.codeStarter) setTypedCode(q.codeStarter);
                  }}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  ↺ Reset Starter Code
                </button>

                <button
                  onClick={handleTransmitCode}
                  disabled={hasYouAnswered || !typedCode.trim()}
                  className={`py-3 px-6 rounded-2xl font-mono font-black text-sm sm:text-base border-2 transition-all active:scale-95 flex items-center gap-2 ${
                    hasYouAnswered
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 border-amber-200 shadow-lg cursor-pointer'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{hasYouAnswered ? t.answered : t.transmitCode}</span>
                </button>
              </div>
            </div>
          ) : (
            /* 4 Cartoon Arcade Option Buttons for Student */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options?.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={hasYouAnswered}
                    className={`p-4 rounded-2xl border-2 font-mono text-start transition-all transform active:scale-98 flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 border-white ring-4 ring-emerald-400/50 shadow-xl scale-[1.02]'
                        : hasYouAnswered
                        ? 'bg-slate-950/40 text-slate-500 border-slate-800 cursor-not-allowed'
                        : `bg-gradient-to-r ${ARCADE_COLORS[idx]} shadow-md cursor-pointer hover:scale-[1.01]`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-black text-base px-2 py-1 rounded-lg bg-black/20 shrink-0">
                        {ARCADE_SHAPES[idx]}
                      </span>
                      <span className="font-bold text-sm sm:text-base">
                        {isAr ? opt.textAr : opt.textEn}
                      </span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-slate-950 shrink-0 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
