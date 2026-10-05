const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./socket/socketHandler");

require("dotenv").config();

// Keep server alive — log unhandled errors instead of crashing
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err.message);
});
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const roomRoutes = require("./routes/roomRoutes");
const codeRoutes = require("./routes/codeRoutes");
const authRoutes = require("./routes/authRoutes");
const roomHistoryRoutes = require("./routes/roomHistoryRoutes");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Connect MongoDB
connectDB();

// Middleware
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));

app.use(express.json());

// Home Route
app.get("/", (req, res) => {
    res.send(`
        <h1>🚀 Welcome to CodeSync</h1>
        <p>My first Express Server is running successfully.</p>
    `);
});

// Health API
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        project: "CodeSync",
        version: "1.0.0"
    });
});

// Room Routes
app.use("/rooms", roomRoutes);
app.use("/code", codeRoutes);
app.use("/auth", authRoutes);
app.use("/room-history", roomHistoryRoutes);

// Start Server
const io = new Server(server, {
    cors: {
        origin: allowedOrigin,
        credentials: true
    }
});

socketHandler(io);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});