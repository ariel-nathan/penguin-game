import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  GameEvents,
  GameState,
  PlayerState,
  PlayerStateUpdatePayload,
  Vec2D,
} from "@penguin-game/shared";
import { Server as SocketServer } from "socket.io";

export class GameLoop {
  private gameState: GameState;
  private io: SocketServer;
  private tickRate: number = 20;
  private tickInterval: number = 1000 / this.tickRate;
  private lastTick: number = Date.now();

  constructor(io: SocketServer) {
    this.io = io;
    this.gameState = {
      players: new Map(),
      tick: 0,
    };
  }

  start() {
    setInterval(() => this.update(), this.tickInterval);
  }

  private update() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - this.lastTick) / 1000;

    this.gameState.players.forEach((player) => {
      this.updatePlayerPosition(player, deltaTime);
    });

    if (this.gameState.players.size > 0) {
      const payload: PlayerStateUpdatePayload = {
        players: Array.from(this.gameState.players.entries()),
        timestamp: currentTime,
      };
      this.io.emit(GameEvents.PLAYER_STATE_UPDATE, payload);
    }

    this.lastTick = currentTime;
    this.gameState.tick++;
  }

  private updatePlayerPosition(player: PlayerState, deltaTime: number) {
    if (!player.targetPosition) return;

    const dx = player.targetPosition.x - player.position.x;
    const dy = player.targetPosition.y - player.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 2) {
      player.position = {
        x: player.targetPosition.x,
        y: player.targetPosition.y,
      };
      player.targetPosition = null;
      return;
    }

    player.facingDirection = dx > 0 ? "right" : "left";

    const moveDistance = player.speed * deltaTime;
    const ratio = Math.min(moveDistance / distance, 1); // Ensure we don't overshoot

    player.position.x += dx * ratio;
    player.position.y += dy * ratio;
    player.lastUpdateTime = Date.now();
  }

  addPlayer(playerId: string, username: string): PlayerState {
    const startPosition: Vec2D = {
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
    };

    const newPlayer: PlayerState = {
      id: playerId,
      username,
      position: startPosition,
      targetPosition: null,
      facingDirection: "right",
      speed: 100,
      lastUpdateTime: Date.now(),
    };

    this.gameState.players.set(playerId, newPlayer);
    return newPlayer;
  }

  removePlayer(playerId: string) {
    this.gameState.players.delete(playerId);
  }

  handleMoveRequest(playerId: string, targetPosition: Vec2D) {
    const player = this.gameState.players.get(playerId);
    if (player) {
      player.targetPosition = targetPosition;
    }
  }
}
