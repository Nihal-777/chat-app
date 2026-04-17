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

const PORT = process.env.PORT || 5001;



app.use(express.json({ limit: "50mb" })); // parse JSON payloads up to 50mb
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookiesParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server running on PORT:" + PORT);
  connectDB();
});
