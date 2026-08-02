const express = require("express");

const app = express();

const roomRoutes = require("./routes/roomRoutes");

// Middleware
app.use(express.json());

const PORT = 3000;

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

// Create Room API
app.post("/api/create-room", (req, res) => {

    const roomName = req.body.roomName;

    res.json({
        success: true,
        message: "Room created successfully",
        room: roomName
    });

});

// Connect room routes
app.use("/rooms", roomRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});