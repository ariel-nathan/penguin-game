import { CANVAS_HEIGHT, CANVAS_WIDTH, PlayerState } from "@penguin-game/shared";
import React, { useEffect, useRef } from "react";
import useSocket from "../hooks/useSocket";

export default function GameCanvas({ username }: { username: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { players, requestMove } = useSocket(username);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw all players
      players.forEach((player) => {
        drawPlayer(ctx, player);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [players]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    requestMove(x, y);
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, player: PlayerState) => {
    ctx.beginPath();
    ctx.arc(player.position.x, player.position.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(player.username, player.position.x, player.position.y + 35);
  };

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      onClick={handleCanvasClick}
      className="h-[600px] w-[800px] border border-black"
    />
  );
}
