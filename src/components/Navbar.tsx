import React, { useState } from 'react';
import { Volume2, VolumeX, Globe, Copy, Check, BookOpen, Bot, LogOut } from 'lucide-react';
import { Language } from '../../shared/types';
import { soundManager } from '../audio/soundManager';
import { translations } from '../i18n/translations';

interface NavbarProps {
  roomCode?: string;
  lang: Language;
  onToggleLang: () => void;
  onOpenSyntax: () => void;
  onLeaveRoom?: () => void;
  playerCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  roomCode,
  lang,
  onToggleLang,
  onOpenSyntax,
  onLeaveRoom,
  playerCount,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [copied, setCopied] = useState(false);
  const t = translations[lang];

  const handleToggleAudio = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
    if (!next) {
      soundManager.playButtonClick();
    }
  };

  const handleCopyCode = () => {
    if (!roomCode) return;
    soundManager.playButtonClick();
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header
      className="w-full bg-slate-900/90 backdrop-blur-md border-b-2 border-slate-800 px-4 py-3 select-none sticky top-0 z-40"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 border-2 border-cyan-300">
            <Bot className="w-6 h-6 text-slate-950 font-black" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-cyan-400 leading-tight">
              {t.appTitle}
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 font-bold hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Room Code Pill if inside a room */}
        {roomCode && (
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-2xl border-2 border-amber-500/50 shadow-inner">
            <div className="flex flex-col items-start leading-none">
              <span className="text-[9px] font-mono text-amber-400 font-bold uppercase">
                {t.roomCode}
              </span>
              <span className="text-base sm:text-lg font-black font-mono tracking-widest text-amber-300">
                {roomCode}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              title={t.copyCode}
              className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            {playerCount !== undefined && (
              <div className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                👥 {playerCount}
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Syntax Cheat Sheet button */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onOpenSyntax();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-cyan-300 transition-all active:scale-95"
            title={t.syntaxReference}
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">{t.syntaxReference}</span>
          </button>

          {/* Audio toggle button */}
          <button
            onClick={handleToggleAudio}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all active:scale-95"
            title={isMuted ? t.soundOn : t.soundOff}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* Language switch button */}
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onToggleLang();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-amber-300 transition-all active:scale-95"
          >
            <Globe className="w-4 h-4 text-amber-400" />
            <span>{t.language}</span>
          </button>

          {/* Leave room button */}
          {roomCode && onLeaveRoom && (
            <button
              onClick={() => {
                soundManager.playButtonClick();
                onLeaveRoom();
              }}
              className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800 text-rose-300 transition-all active:scale-95"
              title={t.leaveRoom}
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
