import React, { useState } from 'react';
import { Play, PlusCircle, LogIn, Crown, Shield, Sparkles, Check, Lock, Zap } from 'lucide-react';
import { Language, PlayerRobotCustomization, RoomState } from '../../shared/types';
import { BOSSES } from '../data/bosses';
import { RobotAvatar } from './RobotAvatar';
import { soundManager } from '../audio/soundManager';
import { translations } from '../i18n/translations';

interface LobbyViewProps {
  roomState: RoomState | null;
  yourPlayerId: string;
  lang: Language;
  onCreateRoom: (playerName: string, customization: PlayerRobotCustomization) => void;
  onJoinRoom: (roomCode: string, playerName: string, customization: PlayerRobotCustomization) => void;
  onSelectWorld: (worldNum: number) => void;
  onStartBattle: () => void;
  onAddBot?: () => void;
  onRemoveBot?: (botId: string) => void;
}

const COLOR_OPTIONS = ['#38bdf8', '#a855f7', '#10b981', '#f43f5e', '#facc15', '#6366f1'];
const HEAD_OPTIONS: Array<PlayerRobotCustomization['headType']> = ['antenna', 'radar', 'visor', 'bolt'];
const EXPRESSION_OPTIONS: Array<PlayerRobotCustomization['expression']> = ['determined', 'happy', 'fierce', 'cool'];

export const LobbyView: React.FC<LobbyViewProps> = ({
  roomState,
  yourPlayerId,
  lang,
  onCreateRoom,
  onJoinRoom,
  onSelectWorld,
  onStartBattle,
  onAddBot,
  onRemoveBot,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('microbit_robot_name') || 'MOUAD';
  });
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [customization, setCustomization] = useState<PlayerRobotCustomization>(() => {
    const saved = localStorage.getItem('microbit_robot_custom');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      color: '#38bdf8',
      headType: 'antenna',
      expression: 'determined',
    };
  });

  const handleSaveCustomization = (next: PlayerRobotCustomization) => {
    setCustomization(next);
    localStorage.setItem('microbit_robot_custom', JSON.stringify(next));
  };

  const handleNameChange = (name: string) => {
    setPlayerName(name);
    localStorage.setItem('microbit_robot_name', name);
  };

  const handleCreate = () => {
    soundManager.playButtonClick();
    const cleanName = playerName.trim() || 'ROBOT-1';
    onCreateRoom(cleanName, customization);
  };

  const handleJoin = () => {
    soundManager.playButtonClick();
    const cleanName = playerName.trim() || 'ROBOT-2';
    const cleanCode = inputRoomCode.trim();
    if (cleanCode.length !== 6) return;
    onJoinRoom(cleanCode, cleanName, customization);
  };

  const isHost = roomState ? roomState.hostId === yourPlayerId : false;

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-8 flex flex-col items-center select-none"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* If NOT inside a room yet: Create or Join Screen */}
      {!roomState ? (
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Robot Customizer */}
          <div className="lg:col-span-5 bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-black font-mono uppercase text-slate-100">
                {t.robotName}
              </h2>
            </div>

            {/* Robot Avatar Live Preview Box */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-950/90 rounded-2xl border-2 border-slate-800 shadow-inner mb-6 relative">
              <RobotAvatar customization={customization} size={110} />
              <div className="mt-3 px-4 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono font-bold text-cyan-300">
                {playerName || 'UNTITLED ROBOT'}
              </div>
            </div>

            {/* Robot Name Input Field */}
            <div className="mb-6">
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase font-bold">
                {t.enterNamePlaceholder}
              </label>
              <input
                type="text"
                maxLength={14}
                value={playerName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. MOUAD"
                className="w-full bg-slate-950 border-2 border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 font-mono text-base font-bold text-amber-300 uppercase tracking-widest outline-none transition-colors"
              />
            </div>

            {/* Chassis Color Picker */}
            <div className="mb-5">
              <label className="block text-xs font-mono text-slate-400 mb-2 font-bold uppercase">
                {t.customizeChassis}
              </label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map((col) => (
                  <button
                    key={col}
                    onClick={() => {
                      soundManager.playButtonClick();
                      handleSaveCustomization({ ...customization, color: col });
                    }}
                    className={`w-9 h-9 rounded-xl border-2 transition-transform active:scale-90 flex items-center justify-center ${
                      customization.color === col
                        ? 'border-white scale-110 shadow-lg'
                        : 'border-slate-800 hover:scale-105'
                    }`}
                    style={{ backgroundColor: col }}
                  >
                    {customization.color === col && <Check className="w-5 h-5 text-slate-950 stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Antenna / Headgear Selector */}
            <div className="mb-5">
              <label className="block text-xs font-mono text-slate-400 mb-2 font-bold uppercase">
                {t.customizeHead}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {HEAD_OPTIONS.map((head) => (
                  <button
                    key={head}
                    onClick={() => {
                      soundManager.playButtonClick();
                      handleSaveCustomization({ ...customization, headType: head });
                    }}
                    className={`py-2 px-1 rounded-xl border font-mono text-xs font-bold capitalize transition-all ${
                      customization.headType === head
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-md scale-105'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {head}
                  </button>
                ))}
              </div>
            </div>

            {/* Face Expression Selector */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 font-bold uppercase">
                {t.customizeExpression}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {EXPRESSION_OPTIONS.map((exp) => (
                  <button
                    key={exp}
                    onClick={() => {
                      soundManager.playButtonClick();
                      handleSaveCustomization({ ...customization, expression: exp });
                    }}
                    className={`py-2 px-1 rounded-xl border font-mono text-xs font-bold capitalize transition-all ${
                      customization.expression === exp
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-105'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Room Actions */}
          <div className="lg:col-span-7 bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {/* Tabs */}
            <div className="flex border-b-2 border-slate-800 mb-8">
              <button
                onClick={() => {
                  soundManager.playButtonClick();
                  setActiveTab('create');
                }}
                className={`flex-1 py-3 font-mono font-black text-sm sm:text-base flex items-center justify-center gap-2 border-b-4 transition-all ${
                  activeTab === 'create'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <PlusCircle className="w-5 h-5" />
                {t.createRoom}
              </button>
              <button
                onClick={() => {
                  soundManager.playButtonClick();
                  setActiveTab('join');
                }}
                className={`flex-1 py-3 font-mono font-black text-sm sm:text-base flex items-center justify-center gap-2 border-b-4 transition-all ${
                  activeTab === 'join'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <LogIn className="w-5 h-5" />
                {t.joinRoom}
              </button>
            </div>

            {activeTab === 'create' ? (
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm max-w-md">
                  <p className="font-semibold mb-1">⚡ Authoritative Battle Network</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Create a synchronized room with a 6-digit numeric room code. All players receive identical micro:bit coding challenges and fight together against giant robot bosses!
                  </p>
                </div>

                <button
                  onClick={handleCreate}
                  className="w-full max-w-md py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black font-mono text-lg tracking-wider shadow-lg shadow-cyan-500/30 border-2 border-cyan-200 transition-all transform active:scale-98 flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Zap className="w-6 h-6 fill-slate-950" />
                  {t.createRoom}
                </button>

                <p className="text-xs text-slate-500 font-mono">
                  {t.soloPlayNote}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-6">
                <div className="w-full max-w-md">
                  <label className="block text-xs font-mono text-slate-400 mb-2 font-bold uppercase text-center">
                    {t.enterRoomCode}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={inputRoomCode}
                    onChange={(e) => setInputRoomCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="482731"
                    className="w-full bg-slate-950 border-2 border-amber-500/60 focus:border-amber-400 rounded-2xl px-6 py-4 font-mono text-3xl font-black text-amber-300 text-center tracking-[0.3em] outline-none shadow-inner"
                  />
                </div>

                <button
                  onClick={handleJoin}
                  disabled={inputRoomCode.trim().length !== 6}
                  className={`w-full max-w-md py-4 px-6 rounded-2xl font-black font-mono text-lg tracking-wider border-2 transition-all transform active:scale-98 flex items-center justify-center gap-3 ${
                    inputRoomCode.trim().length === 6
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 border-amber-200 shadow-lg shadow-amber-500/30 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <LogIn className="w-6 h-6" />
                  {t.joinRoom}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* If INSIDE a room: Active Squad Lobby */
        <div className="w-full space-y-8">
          {/* Header Card: Room Code & Squad Roster */}
          <div className="bg-slate-900/95 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="text-center md:text-start">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  {t.roomCode}
                </span>
                <div className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-amber-300 mt-1">
                  {roomState.code}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Share this 6-digit code with students on their devices to enter your squad!
                </p>
              </div>

              {/* Commander Host Status Card */}
              <div className="flex items-center gap-3 bg-slate-950 px-5 py-3 rounded-2xl border-2 border-amber-500/40 shadow-inner">
                <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />
                <div className="flex flex-col text-xs font-mono text-start">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    COMMANDER (ADMIN SPECTATOR)
                  </span>
                  <span className="text-base font-black text-white">
                    {roomState.hostName}
                  </span>
                </div>
              </div>

              {/* Start Battle / Waiting Button */}
              {isHost ? (
                <button
                  onClick={() => {
                    soundManager.playButtonClick();
                    onStartBattle();
                  }}
                  className="py-4 px-8 rounded-2xl bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-400 hover:from-rose-400 hover:to-yellow-300 text-slate-950 font-black font-mono text-xl tracking-wider shadow-xl shadow-rose-500/30 border-2 border-amber-200 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
                >
                  <Play className="w-7 h-7 fill-slate-950" />
                  {t.startBattle}
                </button>
              ) : (
                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 font-mono text-sm">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                  <span>{t.waitingForHost}</span>
                </div>
              )}
            </div>

            {/* Players Squad Grid */}
            <div className="mt-6">
              <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-mono font-bold uppercase text-slate-300">
                    {t.playersInLobby} ({Object.keys(roomState.players).length})
                  </h3>
                </div>

                {isHost && (
                  <button
                    onClick={() => {
                      soundManager.playButtonClick();
                      if (onAddBot) onAddBot();
                    }}
                    className="py-1.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/40 transition-all cursor-pointer"
                  >
                    + Add Cadet Bot (for testing)
                  </button>
                )}
              </div>

              {Object.keys(roomState.players).length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-950/80 border border-dashed border-slate-700 text-center space-y-3">
                  <p className="text-sm font-mono text-slate-300">
                    Awaiting students to join with code <strong className="text-amber-300 text-base">{roomState.code}</strong>...
                  </p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Students can enter the room code on their laptops, tablets, or phones to join your squad.
                  </p>
                  {isHost && (
                    <button
                      onClick={() => {
                        soundManager.playButtonClick();
                        if (onAddBot) onAddBot();
                      }}
                      className="py-2.5 px-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-black shadow-lg transition-all cursor-pointer"
                    >
                      + Add Practice Student Robot
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {Object.values(roomState.players).map((player) => {
                    const isYou = player.id === yourPlayerId;
                    return (
                      <div
                        key={player.id}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center relative transition-all ${
                          isYou
                            ? 'bg-cyan-950/40 border-cyan-400 shadow-md'
                            : 'bg-slate-950/80 border-slate-800'
                        }`}
                      >
                        {isHost && player.isBot && onRemoveBot && (
                          <button
                            onClick={() => onRemoveBot(player.id)}
                            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-white flex items-center justify-center text-xs font-mono"
                            title="Remove bot"
                          >
                            ×
                          </button>
                        )}
                        <RobotAvatar customization={player.customization} size={70} />
                        <span className="mt-2 text-sm font-black font-mono text-slate-200 truncate max-w-full">
                          {player.name}
                        </span>
                        <div className="flex gap-1 mt-1">
                          {isYou && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                              {t.youBadge}
                            </span>
                          )}
                          {player.isBot && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold border border-slate-700">
                              BOT
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sector / World Selector */}
          <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg font-black font-mono uppercase text-slate-200 mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              {t.selectWorld}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((worldNum) => {
                const boss = BOSSES[worldNum];
                const isUnlocked = roomState.unlockedWorlds.includes(worldNum);
                const isSelected = roomState.selectedWorld === worldNum;

                return (
                  <div
                    key={worldNum}
                    onClick={() => {
                      if (isHost && isUnlocked) {
                        soundManager.playButtonClick();
                        onSelectWorld(worldNum);
                      }
                    }}
                    className={`p-5 rounded-2xl border-2 flex flex-col justify-between transition-all select-none relative ${
                      isSelected
                        ? 'bg-slate-950 border-cyan-400 ring-2 ring-cyan-500/40 shadow-xl'
                        : isUnlocked
                        ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700 cursor-pointer'
                        : 'bg-slate-950/40 border-slate-900 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {!isUnlocked && (
                      <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono font-bold text-amber-400">
                          {t.world} {worldNum}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black">
                            SELECTED
                          </span>
                        )}
                      </div>

                      {/* Level Difficulty Tag */}
                      <div className="mb-2">
                        <span
                          className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md border ${
                            worldNum === 1
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : worldNum === 2
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : worldNum === 3
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          }`}
                        >
                          {worldNum === 1
                            ? t.difficultyEasy
                            : worldNum === 2
                            ? t.difficultyMedium
                            : worldNum === 3
                            ? t.difficultyHard
                            : t.difficultyExpert}
                        </span>
                      </div>

                      <h4 className="text-base font-black font-mono text-slate-100">
                        {boss.name}
                      </h4>
                      <p className="text-xs text-cyan-300 font-medium mt-0.5">
                        {isAr ? boss.locationAr : boss.locationEn}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                        {isAr ? boss.titleAr : boss.titleEn}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">HP {boss.maxHp}</span>
                      <span className="text-amber-400 font-bold">3 PHASES</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
