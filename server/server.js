import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";

const PORT = process.env.PORT || 4000;

//create express app and http server
const app = express();
const server = http.createServer(app);

//Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());
app.use("/api/auth", userRouter);

await connectDB();
app.use("/api/status", (req, res) => res.send("Server is live"));
server.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
});
