/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Language,
  RoomState,
  ServerMessage,
  ClientMessage,
  PlayerRobotCustomization,
} from '../shared/types';
import { Navbar } from './components/Navbar';
import { LobbyView } from './components/LobbyView';
import { BattleArena } from './components/BattleArena';
import { RoundResultModal } from './components/RoundResultModal';
import { BossDefeatModal } from './components/BossDefeatModal';
import { GameOverModal } from './components/GameOverModal';
import { SyntaxCheatSheetModal } from './components/SyntaxCheatSheetModal';
import { soundManager } from './audio/soundManager';
import { BOSSES } from './data/bosses';
import { translations } from './i18n/translations';
import { AlertCircle, Zap } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('microbit_lang') as Language) || 'en';
  });
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [yourPlayerId, setYourPlayerId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSyntaxOpen, setIsSyntaxOpen] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  const toggleLanguage = () => {
    const nextLang: Language = lang === 'en' ? 'ar' : 'en';
    setLang(nextLang);
    localStorage.setItem('microbit_lang', nextLang);
  };

  // Connect WebSocket to backend server
  const connectWs = () => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('connected');
        setErrorMessage(null);
      };

      ws.onmessage = (event) => {
        try {
          const msg: ServerMessage = JSON.parse(event.data);
          handleServerMessage(msg);
        } catch (err) {
          console.error('Failed to parse incoming WebSocket message', err);
        }
      };

      ws.onclose = () => {
        setConnectionStatus('disconnected');
        reconnectTimeoutRef.current = setTimeout(connectWs, 2000);
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
      };
    } catch (e) {
      console.error('WebSocket connection failure:', e);
      setConnectionStatus('disconnected');
    }
  };

  useEffect(() => {
    connectWs();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const send = (msg: ClientMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    } else {
      setErrorMessage('Lost connection to battle server. Reconnecting...');
    }
  };

  const handleServerMessage = (msg: ServerMessage) => {
    switch (msg.type) {
      case 'ROOM_STATE': {
        const prevStatus = roomState?.status;
        setRoomState(msg.state);
        if (msg.yourPlayerId) {
          setYourPlayerId(msg.yourPlayerId);
        }

        // Sound triggers on state changes
        if (msg.state.status === 'battle_intro' && prevStatus !== 'battle_intro') {
          soundManager.playBossIntro();
          soundManager.startBattleBgm();
        } else if (msg.state.status === 'round_reveal' && prevStatus !== 'round_reveal') {
          const you = msg.state.roundLeaderboard.find((e) => e.playerId === msg.yourPlayerId);
          if (you && you.isCorrect) {
            soundManager.playCorrect();
            soundManager.playBossHit();
            if (msg.state.teamCombo > 1) {
              soundManager.playCombo(msg.state.teamCombo);
            }
          } else {
            soundManager.playWrong();
            soundManager.playBossAttack();
            soundManager.playPlayerHit();
          }
        } else if (msg.state.status === 'boss_defeated' && prevStatus !== 'boss_defeated') {
          soundManager.stopBgm();
          soundManager.playVictory();
        } else if (msg.state.status === 'game_over' && prevStatus !== 'game_over') {
          soundManager.stopBgm();
          soundManager.playWrong();
        }
        break;
      }

      case 'PHASE_CHANGE': {
        soundManager.playPhaseChange();
        break;
      }

      case 'ERROR': {
        setErrorMessage(msg.message);
        setTimeout(() => setErrorMessage(null), 4000);
        break;
      }
    }
  };

  // Actions
  const handleCreateRoom = (playerName: string, customization: PlayerRobotCustomization) => {
    send({ type: 'CREATE_ROOM', playerName, customization });
  };

  const handleJoinRoom = (roomCode: string, playerName: string, customization: PlayerRobotCustomization) => {
    send({ type: 'JOIN_ROOM', roomCode, playerName, customization });
  };

  const handleLeaveRoom = () => {
    send({ type: 'LEAVE_ROOM' });
    setRoomState(null);
    soundManager.stopBgm();
  };

  const handleSelectWorld = (worldNumber: number) => {
    send({ type: 'SELECT_WORLD', worldNumber });
  };

  const handleStartBattle = () => {
    send({ type: 'START_BATTLE' });
  };

  const handleSubmitAnswer = (answer: number | string) => {
    send({ type: 'SUBMIT_ANSWER', answer });
  };

  const handleHostReveal = () => {
    send({ type: 'HOST_REVEAL_ANSWER' });
  };

  const handleHostNextQuestion = () => {
    send({ type: 'HOST_NEXT_QUESTION' });
  };

  const handleToggleTimer = () => {
    send({ type: 'HOST_TOGGLE_TIMER' });
  };

  const handleHealSquad = () => {
    send({ type: 'HOST_HEAL_SQUAD' });
  };

  const handleAddBot = (botName?: string) => {
    send({ type: 'HOST_ADD_TEST_BOT', botName });
  };

  const handleRemoveBot = (botId: string) => {
    send({ type: 'HOST_REMOVE_BOT', botId });
  };

  const handleRetryBattle = () => {
    send({ type: 'RETRY_BATTLE' });
  };

  const handleReturnToLobby = () => {
    send({ type: 'RETURN_TO_LOBBY' });
    soundManager.stopBgm();
  };

  const handleNextWorld = () => {
    if (roomState && roomState.selectedWorld < 4) {
      send({ type: 'SELECT_WORLD', worldNumber: roomState.selectedWorld + 1 });
      send({ type: 'START_BATTLE' });
    }
  };

  const currentBoss = roomState ? BOSSES[roomState.selectedWorld] || BOSSES[1] : null;

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Top Navigation Bar */}
      <Navbar
        roomCode={roomState?.code}
        lang={lang}
        onToggleLang={toggleLanguage}
        onOpenSyntax={() => setIsSyntaxOpen(true)}
        onLeaveRoom={roomState ? handleLeaveRoom : undefined}
        playerCount={roomState ? Object.keys(roomState.players).length : undefined}
      />

      {/* Disconnection / Error Alert Bar */}
      {connectionStatus === 'disconnected' && (
        <div className="bg-rose-600 text-white font-mono text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 animate-spin" />
          <span>Reconnecting to battle server...</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-amber-500 text-slate-950 font-mono text-xs font-black py-2.5 px-4 text-center flex items-center justify-center gap-2 shadow-lg animate-fadeIn">
          <AlertCircle className="w-5 h-5 fill-slate-950 text-amber-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 flex flex-col justify-center">
        {!roomState || roomState.status === 'lobby' ? (
          <LobbyView
            roomState={roomState}
            yourPlayerId={yourPlayerId}
            lang={lang}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onSelectWorld={handleSelectWorld}
            onStartBattle={handleStartBattle}
            onAddBot={() => handleAddBot()}
            onRemoveBot={handleRemoveBot}
          />
        ) : roomState.status === 'battle_intro' ? (
          /* Electrifying Cartoon Boss Battle Entrance */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
            <div className="p-4 rounded-3xl bg-rose-600/20 border-2 border-rose-500 text-rose-400 font-mono font-black text-sm tracking-widest uppercase mb-4 animate-bounce">
              ⚠️ WARNING: HOSTILE ROBOT BOSS DETECTED!
            </div>
            <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-500 to-yellow-300 drop-shadow-[0_0_35px_rgba(244,63,94,0.6)]">
              {currentBoss?.name}
            </h1>
            <p className="text-base sm:text-xl font-bold font-mono text-cyan-300 mt-2">
              {lang === 'ar' ? currentBoss?.titleAr : currentBoss?.titleEn}
            </p>
            <div className="mt-8 flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-900 border-2 border-amber-400/50 shadow-xl font-mono text-amber-300 font-black text-lg animate-pulse">
              <Zap className="w-6 h-6 fill-amber-400" />
              <span>GET READY TO CODE!</span>
            </div>
          </div>
        ) : (
          /* Active Battle Arena */
          <BattleArena
            roomState={roomState}
            yourPlayerId={yourPlayerId}
            lang={lang}
            onSubmitAnswer={handleSubmitAnswer}
            onHostReveal={handleHostReveal}
            onHostNext={handleHostNextQuestion}
            onToggleTimer={handleToggleTimer}
            onHealSquad={handleHealSquad}
            onAddBot={() => handleAddBot()}
          />
        )}
      </main>

      {/* Synchronized Round Leaderboard & Results Modal */}
      {roomState && roomState.status === 'round_reveal' && (
        <RoundResultModal
          roomState={roomState}
          yourPlayerId={yourPlayerId}
          lang={lang}
          onNextQuestion={handleHostNextQuestion}
        />
      )}

      {/* Boss Defeated Victory Modal */}
      {roomState && roomState.status === 'boss_defeated' && (
        <BossDefeatModal
          roomState={roomState}
          yourPlayerId={yourPlayerId}
          lang={lang}
          onNextWorld={handleNextWorld}
          onReturnToLobby={handleReturnToLobby}
        />
      )}

      {/* Game Over / Overheat Modal */}
      {roomState && roomState.status === 'game_over' && (
        <GameOverModal
          roomState={roomState}
          yourPlayerId={yourPlayerId}
          lang={lang}
          onRetry={handleRetryBattle}
          onReturnToLobby={handleReturnToLobby}
        />
      )}

      {/* Syntax Cheat Sheet Slide-over */}
      <SyntaxCheatSheetModal
        isOpen={isSyntaxOpen}
        onClose={() => setIsSyntaxOpen(false)}
        lang={lang}
      />
    </div>
  );
}
