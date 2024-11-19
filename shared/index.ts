export interface Vec2D {
  x: number;
  y: number;
}

export interface PlayerState {
  id: string;
  username: string;
  position: Vec2D;
  targetPosition: Vec2D | null;
  facingDirection: "left" | "right";
  speed: number;
  lastUpdateTime: number;
}

export interface GameState {
  players: Map<string, PlayerState>;
  tick: number;
}

// Payloads for each event
export interface PlayerMoveRequestPayload {
  targetX: number;
  targetY: number;
  timestamp: number;
}

export interface PlayerJoinPayload {
  username: string;
}

export interface PlayerStateUpdatePayload {
  players: [string, PlayerState][];
  timestamp: number;
}

export interface PlayerJoinedPayload {
  playerId: string;
  username: string;
  position: Vec2D;
}

export interface PlayerLeftPayload {
  playerId: string;
}

// shared/constants.ts
export const GameEvents = {
  // Client -> Server events
  PLAYER_MOVE_REQUEST: "PLAYER_MOVE_REQUEST",
  PLAYER_JOIN: "PLAYER_JOIN",
  PLAYER_LEAVE: "PLAYER_LEAVE",

  // Server -> Client events
  PLAYER_STATE_UPDATE: "PLAYER_STATE_UPDATE",
  PLAYER_JOINED: "PLAYER_JOINED",
  PLAYER_LEFT: "PLAYER_LEFT",
} as const;

// Type for the events object to ensure type safety
export type GameEventKeys = keyof typeof GameEvents;
export type GameEventValues = (typeof GameEvents)[GameEventKeys];

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
