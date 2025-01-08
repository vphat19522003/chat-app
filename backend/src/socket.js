import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: ["http://localhost:5173"],
});

const onlineUsers = {}; // {userID: socketID}

export function getReceiverMessage(receiverId) {
  return onlineUsers[receiverId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) onlineUsers[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(onlineUsers));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    delete onlineUsers[userId];

    io.emit("getOnlineUsers", Object.keys(onlineUsers));
  });
});

export { app, io, server };
