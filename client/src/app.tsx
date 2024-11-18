import { useEffect, useState } from "react";
import { socket } from "./lib/socket";

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<string[]>([]);

  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onMessage(value: string) {
      setMessages((previous) => [...previous, value]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
    };
  }, []);

  return (
    <div className="grow space-y-4">
      <h1 className="text-3xl font-semibold">Penguin Game</h1>
      <p>Connected: {"" + isConnected}</p>
      <div className="space-x-2">
        <button onClick={connect} className="rounded border p-1">
          Connect
        </button>
        <button onClick={disconnect} className="rounded border p-1">
          Disconnect
        </button>
      </div>
      <div className="space-y-2">
        <h2>Messages:</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
