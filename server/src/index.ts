import {
  GameEvents,
  PlayerJoinPayload,
  PlayerMoveRequestPayload,
} from "@penguin-game/shared";
import "dotenv/config";
import express, { Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { GameLoop } from "./game-loop";

const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
  },
});
const port = process.env.PORT || 8081;

const gameLoop = new GameLoop(io);
gameLoop.start();

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on(GameEvents.PLAYER_JOIN, (payload: PlayerJoinPayload) => {
    const player = gameLoop.addPlayer(socket.id, payload.username);

    io.emit(GameEvents.PLAYER_JOINED, {
      playerId: player.id,
      username: player.username,
      position: player.position,
    });
  });

  socket.on(
    GameEvents.PLAYER_MOVE_REQUEST,
    (payload: PlayerMoveRequestPayload) => {
      gameLoop.handleMoveRequest(socket.id, {
        x: payload.targetX,
        y: payload.targetY,
      });
    },
  );

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
    gameLoop.removePlayer(socket.id);
    io.emit(GameEvents.PLAYER_LEFT, { playerId: socket.id });
  });
});

io.listen(Number(port));

console.log(`Server listening on port ${port}`);
