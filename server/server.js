import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const PORT = process.env.PORT || 4000;

//create express app and http server
const app = express();

const server = http.createServer(app);
app.use(cors());
//initialize socket.io server
export const io = new Server(server, {
  cors: { origin: "*" },
});
//store onlineusers
export const userScoketMap = {}; //userId:socketId
//socket .io connection handler
io.on("connection", (socket) => {
  //client sends userId while connecting to server
  const userId = socket.handshake.query.userId;
  console.log("User Connected:" + userId);
  if (userId) userScoketMap[userId] = socket.id;
  //emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userScoketMap));
  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userScoketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userScoketMap));
  });
});

//Middleware setup
app.use(express.json({ limit: "4mb" }));

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

await connectDB();
app.use("/api/status", (req, res) => res.send("Server is live"));
server.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
});
