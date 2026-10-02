import React from 'react';
import { Skull, RotateCcw, Home } from 'lucide-react';
import { Language, RoomState } from '../../shared/types';
import { soundManager } from '../audio/soundManager';
import { translations } from '../i18n/translations';

interface GameOverModalProps {
  roomState: RoomState;
  yourPlayerId: string;
  lang: Language;
  onRetry: () => void;
  onReturnToLobby: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  roomState,
  yourPlayerId,
  lang,
  onRetry,
  onReturnToLobby,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';
  const isHost = roomState.hostId === yourPlayerId;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none animate-fadeIn"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-md bg-slate-900 border-4 border-rose-600 rounded-3xl shadow-[0_0_50px_rgba(225,29,72,0.4)] overflow-hidden flex flex-col text-center">
        {/* Banner */}
        <div className="bg-rose-600 py-6 px-4 text-white">
          <Skull className="w-12 h-12 mx-auto mb-2 animate-bounce text-slate-950" />
          <h2 className="text-2xl font-black font-mono tracking-tight uppercase">
            {t.gameOver}
          </h2>
          <p className="text-xs font-mono text-rose-200 mt-1">
            Boss {roomState.boss.name} overloaded your squad circuits!
          </p>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-300">
            Study your micro:bit MicroPython syntax and try again!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            {isHost ? (
              <>
                <button
                  onClick={() => {
                    soundManager.playButtonClick();
                    onRetry();
                  }}
                  className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black font-mono text-base border-2 border-amber-200 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>{t.retryBattle}</span>
                </button>
                <button
                  onClick={() => {
                    soundManager.playButtonClick();
                    onReturnToLobby();
                  }}
                  className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black font-mono text-base border-2 border-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Home className="w-5 h-5" />
                  <span>{t.returnToLobby}</span>
                </button>
              </>
            ) : (
              <span className="text-xs font-mono text-slate-400 italic">
                {t.waitingForHost}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
