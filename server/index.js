const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./socket/socketHandler");

require("dotenv").config();

// Force Google DNS to bypass ISP/router DNS that blocks MongoDB SRV lookups
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

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
const allowedOrigins = allowedOrigin.split(",").map(o => o.trim());

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile, curl, Render health checks)
        if (!origin) return callback(null, true);
        // Allow any vercel.app subdomain + localhost
        if (
            origin.includes("vercel.app") ||
            origin.includes("localhost") ||
            allowedOrigins.some(o => origin === o)
        ) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
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
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (
                origin.includes("vercel.app") ||
                origin.includes("localhost") ||
                allowedOrigins.some(o => origin === o)
            ) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true
    }
});

socketHandler(io);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});