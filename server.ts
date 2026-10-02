import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  ClientMessage,
  ServerMessage,
  RoomState,
  Player,
  PlayerRobotCustomization,
  Question,
} from './shared/types.js';
import { BOSSES } from './src/data/bosses.js';
import { QUESTIONS_BY_WORLD } from './src/data/questions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

interface SessionSocket extends WebSocket {
  playerId?: string;
  roomCode?: string;
  isAlive?: boolean;
}

// In-memory server-authoritative rooms
const rooms: Map<string, RoomState> = new Map();
const socketMap: Map<string, SessionSocket> = new Map(); // playerId -> socket
const roomTimers: Map<string, NodeJS.Timeout> = new Map();

function generateRoomCode(): string {
  let code = '';
  do {
    code = Math.floor(100000 + Math.random() * 900000).toString();
  } while (rooms.has(code));
  return code;
}

function broadcastToRoom(roomCode: string, message: ServerMessage) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const allParticipantIds = new Set<string>();
  if (room.hostId) allParticipantIds.add(room.hostId);
  for (const pid of Object.keys(room.players)) {
    allParticipantIds.add(pid);
  }

  for (const pid of allParticipantIds) {
    const ws = socketMap.get(pid);
    if (ws && ws.readyState === WebSocket.OPEN) {
      if (message.type === 'ROOM_STATE') {
        broadcastRoomState(roomCode);
        return;
      } else {
        ws.send(JSON.stringify(message));
      }
    }
  }
}

// Strip answer key before sending question to regular students
function sanitizeQuestionForClient(q: Question): Question {
  const sanitized = { ...q };
  delete (sanitized as any).correctOptionIndex;
  delete (sanitized as any).expectedPattern;
  return sanitized;
}

function broadcastRoomState(roomCode: string) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const allParticipantIds = new Set<string>();
  if (room.hostId) allParticipantIds.add(room.hostId);
  for (const pid of Object.keys(room.players)) {
    allParticipantIds.add(pid);
  }

  for (const participantId of allParticipantIds) {
    const ws = socketMap.get(participantId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      const isHost = participantId === room.hostId;

      if (isHost) {
        // The HOST ADMIN gets the full question (with answer key) AND full real-time player actions
        ws.send(
          JSON.stringify({
            type: 'ROOM_STATE',
            state: room,
            yourPlayerId: participantId,
          })
        );
      } else {
        // REGULAR PLAYERS get sanitized question and cannot inspect other students' live choices during question_active
        const sanitizedPlayers: Record<string, Player> = {};
        for (const [pid, player] of Object.entries(room.players)) {
          if (room.status === 'question_active' && pid !== participantId) {
            sanitizedPlayers[pid] = {
              ...player,
              currentAnswer: null, // Hide peer's choice during active question to prevent copying
            };
          } else {
            sanitizedPlayers[pid] = player;
          }
        }

        const stateToSend: RoomState = {
          ...room,
          players: sanitizedPlayers,
          currentQuestion:
            room.status === 'question_active' && room.currentQuestion
              ? sanitizeQuestionForClient(room.currentQuestion)
              : room.currentQuestion,
        };

        ws.send(
          JSON.stringify({
            type: 'ROOM_STATE',
            state: stateToSend,
            yourPlayerId: participantId,
          })
        );
      }
    }
  }
}

function clearRoomTimer(roomCode: string) {
  const timer = roomTimers.get(roomCode);
  if (timer) {
    clearInterval(timer);
    roomTimers.delete(roomCode);
  }
}

function checkAllPlayersAnswered(room: RoomState): boolean {
  const players = Object.values(room.players);
  if (players.length === 0) return false;
  return players.every((p) => p.hasAnswered);
}

function submitPlayerAnswer(roomCode: string, playerId: string, answer: number | string) {
  const room = rooms.get(roomCode);
  if (!room || room.status !== 'question_active' || !room.currentQuestion) return;

  const player = room.players[playerId];
  if (!player || player.hasAnswered) return;

  player.hasAnswered = true;
  player.currentAnswer = answer;
  player.answeredAt = Date.now();

  const timeSec = Number(((player.answeredAt - room.questionStartTime) / 1000).toFixed(1));
  broadcastToRoom(roomCode, {
    type: 'ANSWER_RECEIVED',
    playerId: player.id,
    responseTimeSec: timeSec,
  });

  // If all players have answered, immediately reveal results
  if (checkAllPlayersAnswered(room)) {
    processRoundAnswers(roomCode);
  } else {
    broadcastRoomState(roomCode);
  }
}

function processRoundAnswers(roomCode: string) {
  clearRoomTimer(roomCode);
  const room = rooms.get(roomCode);
  if (!room || !room.currentQuestion) return;

  room.status = 'round_reveal';
  const q = room.currentQuestion;
  let totalRoundDamage = 0;
  let allCorrect = true;
  let atLeastOneCorrect = false;

  const leaderboardEntries: RoomState['roundLeaderboard'] = [];

  // Difficulty curve scaling by sector level (Level 1 is accessible & friendly, scaling up to Level 4)
  const baseDamageByWorld: Record<number, number> = { 1: 150, 2: 130, 3: 110, 4: 100 };
  const bossPenaltyByWorld: Record<number, number> = { 1: 10, 2: 15, 3: 20, 4: 25 };
  const worldBaseDmg = baseDamageByWorld[room.selectedWorld] || 120;
  const worldBossPenalty = bossPenaltyByWorld[room.selectedWorld] || 18;

  for (const player of Object.values(room.players)) {
    let isCorrect = false;
    let earnedScore = 0;
    let damage = 0;
    const answeredTimeSec = player.answeredAt
      ? Math.max(0.5, ((player.answeredAt - room.questionStartTime) / 1000))
      : q.timeLimitSec;

    if (q.isCodeEditorChallenge) {
      if (player.currentAnswer && typeof player.currentAnswer === 'string') {
        const pattern = new RegExp(q.expectedPattern || '', 'i');
        isCorrect = pattern.test(player.currentAnswer);
      }
    } else {
      isCorrect = player.currentAnswer === q.correctOptionIndex;
    }

    if (isCorrect) {
      atLeastOneCorrect = true;
      player.streak += 1;
      // Base score 100 + speed bonus up to 50
      const timeFraction = Math.max(0, (q.timeLimitSec - answeredTimeSec) / q.timeLimitSec);
      const speedBonus = Math.round(timeFraction * 50);
      earnedScore = 100 + speedBonus;

      // Base damage based on world + streak bonus
      damage = worldBaseDmg + speedBonus;
      if (player.streak > 1) {
        damage += player.streak * 15;
      }
      // Shield auto-repair on correct answers to keep beginners fighting!
      player.hp = Math.min(player.maxHp, player.hp + 10);
    } else {
      allCorrect = false;
      player.streak = 0;
      earnedScore = 0;
      damage = 0;
      // Boss counter-attack penalty scales: -10 HP on Level 1 up to -25 HP on Level 4
      player.hp = Math.max(0, player.hp - worldBossPenalty);
    }

    player.roundScore = earnedScore;
    player.score += earnedScore;

    leaderboardEntries.push({
      playerId: player.id,
      name: player.name,
      roundScore: earnedScore,
      totalScore: player.score,
      damage,
      answeredTimeSec: Number(answeredTimeSec.toFixed(1)),
      isCorrect,
    });
  }

  // Team Combo calculations
  if (atLeastOneCorrect && allCorrect) {
    room.teamCombo += 1;
  } else if (!atLeastOneCorrect) {
    room.teamCombo = 0;
  }

  const comboMultiplier = 1 + room.teamCombo * 0.1; // +10% per combo level

  for (const entry of leaderboardEntries) {
    if (entry.isCorrect) {
      const boostedDamage = Math.round(entry.damage * comboMultiplier);
      entry.damage = boostedDamage;
      totalRoundDamage += boostedDamage;
    }
  }

  // Sort leaderboard by round score descending
  leaderboardEntries.sort((a, b) => b.roundScore - a.roundScore);
  room.roundLeaderboard = leaderboardEntries;
  room.roundDamageDealt = totalRoundDamage;

  // Apply damage to boss
  room.boss.currentHp = Math.max(0, room.boss.currentHp - totalRoundDamage);
  room.boss.isHit = totalRoundDamage > 0;

  // Calculate Boss Phase based on remaining HP percent
  const hpPercent = (room.boss.currentHp / room.boss.maxHp) * 100;
  let newPhase = 1;
  if (hpPercent <= 34) {
    newPhase = 3;
  } else if (hpPercent <= 67) {
    newPhase = 2;
  }

  if (newPhase !== room.boss.phase) {
    room.boss.phase = newPhase;
    broadcastToRoom(roomCode, {
      type: 'PHASE_CHANGE',
      phaseNumber: newPhase,
      bossName: room.boss.name,
    });
  }

  // Check victory condition
  if (room.boss.currentHp <= 0) {
    room.status = 'boss_defeated';
    if (!room.unlockedWorlds.includes(room.selectedWorld + 1) && room.selectedWorld < 4) {
      room.unlockedWorlds.push(room.selectedWorld + 1);
    }
  } else {
    // Check if all players died
    const alivePlayers = Object.values(room.players).filter((p) => p.hp > 0);
    if (alivePlayers.length === 0) {
      room.status = 'game_over';
    }
  }

  broadcastRoomState(roomCode);
}

function startQuestion(roomCode: string, questionIdx: number) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const questions = QUESTIONS_BY_WORLD[room.selectedWorld] || QUESTIONS_BY_WORLD[1];
  if (questionIdx >= questions.length) {
    // If questions run out but boss not dead, loop or finish
    if (room.boss.currentHp > 0) {
      // Bonus frenzy round with first question
      questionIdx = 0;
    } else {
      room.status = 'boss_defeated';
      broadcastRoomState(roomCode);
      return;
    }
  }

  const q = questions[questionIdx];
  room.status = 'question_active';
  room.currentQuestion = q;
  room.questionIndex = questionIdx;
  room.totalQuestions = questions.length;
  room.questionStartTime = Date.now();
  room.questionTimeRemaining = q.timeLimitSec;
  room.boss.isHit = false;
  room.boss.isAttacking = false;

  // Reset player answers
  for (const player of Object.values(room.players)) {
    player.currentAnswer = null;
    player.answeredAt = undefined;
    player.hasAnswered = false;
    player.roundScore = 0;
  }

  broadcastRoomState(roomCode);

  // If there are automated bot players, schedule simulated answers
  for (const player of Object.values(room.players)) {
    if (player.isBot) {
      const delayMs = Math.floor(1500 + Math.random() * 2500);
      setTimeout(() => {
        const curRoom = rooms.get(roomCode);
        if (!curRoom || curRoom.status !== 'question_active' || !curRoom.currentQuestion) return;
        const curBot = curRoom.players[player.id];
        if (!curBot || curBot.hasAnswered) return;

        let botAnswer: number | string = 0;
        if (curRoom.currentQuestion.isCodeEditorChallenge) {
          botAnswer = curRoom.currentQuestion.codeStarter || '';
        } else {
          // 85% correct
          const isCorrect = Math.random() < 0.85;
          botAnswer = isCorrect
            ? (curRoom.currentQuestion.correctOptionIndex ?? 0)
            : ((curRoom.currentQuestion.correctOptionIndex ?? 0) + 1) % 4;
        }

        submitPlayerAnswer(roomCode, curBot.id, botAnswer);
      }, delayMs);
    }
  }

  clearRoomTimer(roomCode);
  const interval = setInterval(() => {
    const currentRoom = rooms.get(roomCode);
    if (!currentRoom || currentRoom.status !== 'question_active') {
      clearRoomTimer(roomCode);
      return;
    }

    if (currentRoom.isTimerPaused) {
      return; // Timer paused by Host Admin
    }

    currentRoom.questionTimeRemaining -= 1;
    if (currentRoom.questionTimeRemaining <= 0) {
      processRoundAnswers(roomCode);
    } else {
      // Light tick broadcast every 2 seconds or on low time to keep clients in sync
      if (currentRoom.questionTimeRemaining <= 5) {
        broadcastRoomState(roomCode);
      }
    }
  }, 1000);

  roomTimers.set(roomCode, interval);
}

function startBattle(roomCode: string) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const bossData = BOSSES[room.selectedWorld] || BOSSES[1];
  room.boss = {
    id: bossData.id,
    name: bossData.name,
    maxHp: bossData.maxHp,
    currentHp: bossData.maxHp,
    phase: 1,
    isHit: false,
    isAttacking: false,
  };
  room.teamCombo = 0;

  // Reset player stats
  for (const player of Object.values(room.players)) {
    player.score = 0;
    player.hp = player.maxHp;
    player.streak = 0;
    player.hasAnswered = false;
    player.currentAnswer = null;
    player.roundScore = 0;
  }

  room.status = 'battle_intro';
  broadcastRoomState(roomCode);

  // Transition from battle_intro to first question after 3.2 seconds
  setTimeout(() => {
    const curRoom = rooms.get(roomCode);
    if (curRoom && curRoom.status === 'battle_intro') {
      startQuestion(roomCode, 0);
    }
  }, 3200);
}

// WebSocket Connection Handler
wss.on('connection', (ws: SessionSocket) => {
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('message', (raw) => {
    try {
      const msg: ClientMessage = JSON.parse(raw.toString());
      handleClientMessage(ws, msg);
    } catch (err) {
      console.error('Failed to parse WebSocket message:', err);
    }
  });

  ws.on('close', () => {
    if (ws.playerId && ws.roomCode) {
      const room = rooms.get(ws.roomCode);
      if (room) {
        if (room.hostId === ws.playerId) {
          // Host disconnected
          const remainingPlayers = Object.values(room.players);
          if (remainingPlayers.length === 0) {
            clearRoomTimer(ws.roomCode);
            rooms.delete(ws.roomCode);
          } else {
            // Transfer host to first player
            room.hostId = remainingPlayers[0].id;
            room.hostName = remainingPlayers[0].name;
            delete room.players[remainingPlayers[0].id];
            broadcastRoomState(ws.roomCode);
          }
        } else {
          // Regular player disconnected
          delete room.players[ws.playerId];
          socketMap.delete(ws.playerId);
          broadcastToRoom(ws.roomCode, {
            type: 'PLAYER_LEFT',
            playerId: ws.playerId,
          });
          broadcastRoomState(ws.roomCode);
        }
      }
    }
  });
});

function handleClientMessage(ws: SessionSocket, msg: ClientMessage) {
  switch (msg.type) {
    case 'CREATE_ROOM': {
      const roomCode = generateRoomCode();
      const hostId = `host_${Math.random().toString(36).substring(2, 9)}`;
      ws.playerId = hostId;
      ws.roomCode = roomCode;
      socketMap.set(hostId, ws);

      const bossData = BOSSES[1];
      const roomState: RoomState = {
        code: roomCode,
        status: 'lobby',
        selectedWorld: 1,
        hostId: hostId,
        hostName: (msg.playerName || 'COMMANDER').trim().substring(0, 16),
        isTimerPaused: false,
        players: {}, // Host is strictly an admin/commander, not a player!
        boss: {
          id: bossData.id,
          name: bossData.name,
          maxHp: bossData.maxHp,
          currentHp: bossData.maxHp,
          phase: 1,
          isHit: false,
          isAttacking: false,
        },
        questionIndex: 0,
        totalQuestions: 5,
        questionStartTime: 0,
        questionTimeRemaining: 35,
        teamCombo: 0,
        roundLeaderboard: [],
        roundDamageDealt: 0,
        unlockedWorlds: [1],
      };

      rooms.set(roomCode, roomState);
      broadcastRoomState(roomCode);
      break;
    }

    case 'JOIN_ROOM': {
      const roomCode = msg.roomCode.trim();
      const room = rooms.get(roomCode);

      if (!room) {
        ws.send(JSON.stringify({ type: 'ERROR', message: 'Room not found! Check the 6-digit code.' }));
        return;
      }

      if (room.status !== 'lobby') {
        ws.send(JSON.stringify({ type: 'ERROR', message: 'Battle already in progress in this room!' }));
        return;
      }

      const playerId = `player_${Math.random().toString(36).substring(2, 9)}`;
      ws.playerId = playerId;
      ws.roomCode = roomCode;
      socketMap.set(playerId, ws);

      const newPlayer: Player = {
        id: playerId,
        name: (msg.playerName || `ROBOT-${Object.keys(room.players).length + 1}`).trim().substring(0, 16),
        isHost: false,
        score: 0,
        hp: 100,
        maxHp: 100,
        streak: 0,
        customization: msg.customization || {
          color: '#a855f7',
          headType: 'visor',
          expression: 'cool',
        },
        hasAnswered: false,
        roundScore: 0,
        isReady: true,
      };

      room.players[playerId] = newPlayer;

      broadcastToRoom(roomCode, {
        type: 'PLAYER_JOINED',
        player: newPlayer,
      });

      broadcastRoomState(roomCode);
      break;
    }

    case 'HOST_ADD_TEST_BOT': {
      if (!ws.roomCode || !ws.playerId) return;
      const room = rooms.get(ws.roomCode);
      if (!room || room.hostId !== ws.playerId) return;

      const botCount = Object.values(room.players).filter((p) => p.isBot).length + 1;
      const botId = `bot_${Math.random().toString(36).substring(2, 7)}`;
      const botColors = ['#10b981', '#f43f5e', '#a855f7', '#facc15', '#38bdf8'];
      const botColor = botColors[botCount % botColors.length];

      room.players[botId] = {
        id: botId,
        name: msg.botName || `CADET-${botCount}`,
        isHost: false,
        isBot: true,
        score: 0,
        hp: 100,
        maxHp: 100,
        streak: 0,
        customization: {
          color: botColor,
          headType: 'antenna',
          expression: 'happy',
        },
        hasAnswered: false,
        roundScore: 0,
        isReady: true,
      };

      broadcastRoomState(ws.roomCode);
      break;
    }

    case 'HOST_REMOVE_BOT': {
      if (!ws.roomCode || !ws.playerId) return;
      const room = rooms.get(ws.roomCode);
      if (!room || room.hostId !== ws.playerId) return;

      if (room.players[msg.botId]) {
        delete room.players[msg.botId];
        broadcastRoomState(ws.roomCode);
      }
      break;
    }

    case 'HOST_HEAL_SQUAD': {
      if (!ws.roomCode || !ws.playerId) return;
      const room = rooms.get(ws.roomCode);
      if (!room || room.hostId !== ws.playerId) return;

      for (const p of Object.values(room.players)) {
        p.hp = p.maxHp;
      }
      broadcastRoomState(ws.roomCode);
      break;
    }

    case 'HOST_TOGGLE_TIMER': {
      if (!ws.roomCode || !ws.playerId) return;
      const room = rooms.get(ws.roomCode);
      if (!room || room.hostId !== ws.playerId) return;

      room.isTimerPaused = !room.isTimerPaused;
      broadcastRoomState(ws.roomCode);
      break;
    }

    case 'SELECT_WORLD': {
      if (!ws.roomCode || !ws.playerId) return;
      const room = rooms.get(ws.roomCode);
      if (!room || room.hostId !== ws.playerId) return;

      if (room.unlockedWorlds.includes(msg.worldNumber)) {
        room.selectedWorld = msg.worldNumber;
        const boss = BOSSES[msg.worldNumber];
        room.boss.id = boss.id;
        room.boss.name = boss.name;
        room.boss.maxHp = boss.maxHp;
        room.boss.currentHp = boss.maxHp;
        broadcastRoomState(ws.roomCode);
      }
      break;
    }

    case 'START_BATTLE': {
      if (!ws.roomCode || !ws.playerId) return;
      const room = rooms.get(ws.roomCode);
      if (!room || room.hostId !== ws.playerId) return;

      // If no players yet, add a test cadet student robot so the host can test/demo immediately
      if (Object.keys(room.players).length === 0) {
        const botId = `bot_${Math.random().toString(36).substring(2, 7)}`;
        room.players[botId] = {
          id: botId,
          name: 'CADET-1',
          isHost: false,
          isBot: true,
          score: 0,
          hp: 100,
          maxHp: 100,
          streak: 0,
          customization: {
            color: '#10b981',
            headType: 'antenna',
            expression: 'happy',
          },
          hasAnswered: false,
          roundScore: 0,
          isReady: true,
        };
      }

      startBattle(ws.roomCode);
      break;
    }

    case 'SUBMIT_ANSWER': {
      if (!ws.roomCode || !ws.playerId) return;
      submitPlayerAnswer(ws.roomCode, ws.playerId, msg.answer);
      break;
    }

    case 'HOST_REVEAL_ANSWER': {
      if (!ws.roomCode || !ws.playerId) return;
      const room = rooms.get(ws.roomCode);
      if (!room || room.hostId !== ws.playerId) return;

      if (room.status === 'question_active') {
        processRoundAnswers(ws.roomCode);
      }
      break;
    }

    case 'HOST_NEXT_QUESTION': {
      if (!ws.roomCode || !ws.playerId) return;
      const room = rooms.get(ws.roomCode);
      if (!room || room.hostId !== ws.playerId) return;

      if (room.status === 'round_reveal') {
        startQuestion(ws.roomCode, room.questionIndex + 1);
      }
      break;
    }

    case 'RETRY_BATTLE': {
      if (!ws.roomCode || !ws.playerId) return;
      const room = rooms.get(ws.roomCode);
      if (!room || room.hostId !== ws.playerId) return;

      startBattle(ws.roomCode);
      break;
    }

    case 'RETURN_TO_LOBBY': {
      if (!ws.roomCode || !ws.playerId) return;
      const room = rooms.get(ws.roomCode);
      if (!room || room.hostId !== ws.playerId) return;

      clearRoomTimer(ws.roomCode);
      room.status = 'lobby';
      broadcastRoomState(ws.roomCode);
      break;
    }

    case 'LEAVE_ROOM': {
      if (!ws.roomCode || !ws.playerId) return;
      const room = rooms.get(ws.roomCode);
      if (room) {
        if (room.hostId === ws.playerId) {
          const remaining = Object.values(room.players);
          if (remaining.length === 0) {
            clearRoomTimer(ws.roomCode);
            rooms.delete(ws.roomCode);
          } else {
            room.hostId = remaining[0].id;
            room.hostName = remaining[0].name;
            delete room.players[remaining[0].id];
            broadcastRoomState(ws.roomCode);
          }
        } else {
          delete room.players[ws.playerId];
          socketMap.delete(ws.playerId);
          broadcastToRoom(ws.roomCode, {
            type: 'PLAYER_LEFT',
            playerId: ws.playerId,
          });
          broadcastRoomState(ws.roomCode);
        }
      }
      ws.roomCode = undefined;
      ws.playerId = undefined;
      break;
    }
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', activeRooms: rooms.size });
});

// Setup Vite in Dev or static in Prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = Number(process.env.PORT) || 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🤖 Robot Micro:bit Boss Rush server running on port ${PORT}`);
  });
}

startServer();
