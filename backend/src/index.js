import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookiesParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import path from "path";

dotenv.config(); // load env first

const PORT = process.env.PORT || 5000;



app.use(express.json({ limit: "50mb" })); // parse JSON payloads up to 50mb
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookiesParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

server.listen(PORT, () => {
  console.log("Server running on PORT:" + PORT);
  connectDB();
});
