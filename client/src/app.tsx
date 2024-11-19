import { useState } from "react";
import GameCanvas from "./components/game-canvas";
import { socket } from "./lib/socket";

export default function App() {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);

  function connect(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    socket.connect();
    setConnected(true);
  }

  function disconnect(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    socket.disconnect();
    setConnected(false);
  }

  return (
    <div className="flex grow flex-col items-center justify-center space-y-4">
      <GameCanvas username={username} />
      {connected ? (
        <button onClick={disconnect} className="border border-black p-1">
          Disconnect
        </button>
      ) : (
        <form onSubmit={connect} className="space-x-2">
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="border border-black p-1"
          />
          <button
            type="submit"
            disabled={!username}
            className="border border-black p-1 disabled:opacity-50"
          >
            Connect
          </button>
        </form>
      )}
    </div>
  );
}
