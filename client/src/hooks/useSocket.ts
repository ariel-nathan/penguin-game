import {
  GameEvents,
  PlayerState,
  PlayerStateUpdatePayload,
} from "@penguin-game/shared";
import { useEffect, useState } from "react";
import { socket } from "../lib/socket";

export default function useSocket(username: string) {
  const [players, setPlayers] = useState<Map<string, PlayerState>>(new Map());

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit(GameEvents.PLAYER_JOIN, { username });
    });

    socket.on(
      GameEvents.PLAYER_STATE_UPDATE,
      (payload: PlayerStateUpdatePayload) => {
        const newPlayers = new Map<string, PlayerState>(payload.players);
        setPlayers(newPlayers);
      },
    );

    return () => {
      socket.off("connect");
      socket.off(GameEvents.PLAYER_STATE_UPDATE);
    };
  }, [username]);

  const requestMove = (x: number, y: number) => {
    socket.emit(GameEvents.PLAYER_MOVE_REQUEST, {
      targetX: x,
      targetY: y,
      timestamp: Date.now(),
    });
  };

  return {
    players,
    requestMove,
  };
}
