const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./socket/socketHandler");

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const roomRoutes = require("./routes/roomRoutes");

const app = express();
const server = http.createServer(app);
const PORT = 3000;

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());

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

// Start Server
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

socketHandler(io);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});