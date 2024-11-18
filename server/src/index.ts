import "dotenv/config";
import express, { Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
  },
});
const port = process.env.PORT;

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.send("Hello from the server!");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

io.listen(Number(port));

console.log(`Server listening on port ${port}`);
