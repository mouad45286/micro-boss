export type Language = 'en' | 'ar';

export interface PlayerRobotCustomization {
  color: string; // hex color for chassis
  headType: 'antenna' | 'radar' | 'visor' | 'bolt';
  expression: 'determined' | 'happy' | 'fierce' | 'cool';
}

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isBot?: boolean;
  score: number;
  hp: number;
  maxHp: number;
  streak: number;
  customization: PlayerRobotCustomization;
  currentAnswer?: number | string | null;
  answeredAt?: number; // timestamp
  hasAnswered: boolean;
  roundScore: number;
  isReady: boolean;
}

export interface QuestionOption {
  textEn: string;
  textAr: string;
}

export interface Question {
  id: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  category: 'basics' | 'display' | 'buttons' | 'sensors' | 'radio' | 'music' | 'pins' | 'debugging' | 'code-challenge';
  titleEn: string;
  titleAr: string;
  hintEn?: string;
  hintAr?: string;
  codeSnippet?: string;
  options?: QuestionOption[]; // 4 multiple choice options
  correctOptionIndex?: number; // 0, 1, 2, 3
  isCodeEditorChallenge?: boolean;
  codeEditorPromptEn?: string;
  codeEditorPromptAr?: string;
  codeStarter?: string;
  expectedPattern?: string; // Regex string to validate MicroPython logic
  explanationEn: string;
  explanationAr: string;
  timeLimitSec: number;
  microbitDisplaySim?: number[][]; // 5x5 array of 0 or 1 to light up LED simulator
}

export interface BossPhase {
  phaseNumber: number;
  minHpPercent: number;
  nameEn: string;
  nameAr: string;
  attackNameEn: string;
  attackNameAr: string;
  attackDescriptionEn: string;
  attackDescriptionAr: string;
  attackType: 'electric' | 'sensor_beam' | 'radio_pulse' | 'syntax_glitch';
}

export interface Boss {
  id: string;
  worldNumber: number;
  name: string;
  titleEn: string;
  titleAr: string;
  locationEn: string;
  locationAr: string;
  maxHp: number;
  accentColor: string;
  phases: BossPhase[];
  avatarSvgType: 'volt9' | 'sensorx' | 'signal404' | 'compiler';
}

export type RoomStatus = 'lobby' | 'battle_intro' | 'question_active' | 'round_reveal' | 'boss_attack' | 'boss_defeated' | 'game_over';

export interface RoomState {
  code: string;
  status: RoomStatus;
  selectedWorld: number;
  hostId: string;
  hostName: string;
  isTimerPaused?: boolean;
  players: Record<string, Player>;
  boss: {
    id: string;
    name: string;
    maxHp: number;
    currentHp: number;
    phase: number;
    isHit: boolean;
    isAttacking: boolean;
    currentAttack?: string;
  };
  currentQuestion?: Question | null;
  questionIndex: number;
  totalQuestions: number;
  questionStartTime: number;
  questionTimeRemaining: number;
  teamCombo: number;
  roundLeaderboard: Array<{
    playerId: string;
    name: string;
    roundScore: number;
    totalScore: number;
    damage: number;
    answeredTimeSec: number;
    isCorrect: boolean;
  }>;
  roundDamageDealt: number;
  unlockedWorlds: number[];
}

// Client to Server Messages
export type ClientMessage =
  | { type: 'CREATE_ROOM'; playerName: string; customization: PlayerRobotCustomization }
  | { type: 'JOIN_ROOM'; roomCode: string; playerName: string; customization: PlayerRobotCustomization }
  | { type: 'LEAVE_ROOM' }
  | { type: 'SELECT_WORLD'; worldNumber: number }
  | { type: 'START_BATTLE' }
  | { type: 'SUBMIT_ANSWER'; answer: number | string }
  | { type: 'HOST_REVEAL_ANSWER' }
  | { type: 'HOST_NEXT_QUESTION' }
  | { type: 'HOST_TOGGLE_TIMER' }
  | { type: 'HOST_HEAL_SQUAD' }
  | { type: 'HOST_ADD_TEST_BOT'; botName?: string }
  | { type: 'HOST_REMOVE_BOT'; botId: string }
  | { type: 'RETRY_BATTLE' }
  | { type: 'RETURN_TO_LOBBY' };

// Server to Client Messages
export type ServerMessage =
  | { type: 'ROOM_STATE'; state: RoomState; yourPlayerId: string }
  | { type: 'PLAYER_JOINED'; player: Player }
  | { type: 'PLAYER_LEFT'; playerId: string }
  | { type: 'ANSWER_RECEIVED'; playerId: string; responseTimeSec: number }
  | { type: 'ATTACK_EFFECT'; target: 'boss' | 'players'; damage: number; combo: number; effectType: string }
  | { type: 'PHASE_CHANGE'; phaseNumber: number; bossName: string }
  | { type: 'ERROR'; message: string };
