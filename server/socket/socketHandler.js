const roomUsers = {};

module.exports = (io) => {

    io.on("connection", (socket) => {

        console.log("New User Connected:", socket.id);

        socket.on("join-room", ({ roomId, username }) => {
            console.log("JOIN EVENT:", socket.id, username);

            socket.join(roomId);

            socket.roomId = roomId;
            socket.username = username;

            if (!roomUsers[roomId]) {
                roomUsers[roomId] = [];
            }

            // Remove any previous entry with the same socket id
            roomUsers[roomId] = roomUsers[roomId].filter(
                (user) => user.id !== socket.id
            );

            roomUsers[roomId].push({ id: socket.id, username });

            io.to(roomId).emit("users-update", roomUsers[roomId]);

            console.log(`${username} joined room ${roomId}`);
        });

        socket.on("send-message", (data) => {
            // BUG-11: use socket.roomId instead of trusting data.roomId
            const roomId = socket.roomId;
            if (!roomId) return;

            io.to(roomId).emit("receive-message", {
                // BUG-10: fallback when username not yet set
                sender: socket.username || "Unknown",
                message: data.message
            });
        });

        socket.on("code-change", (data) => {
            // BUG-11: use socket.roomId instead of trusting data.roomId
            const roomId = socket.roomId;
            if (!roomId) return;

            socket.to(roomId).emit("code-update", data.code);
        });

        // Broadcast cursor position to everyone else in the room
        socket.on("cursor-move", (data) => {
            const roomId = socket.roomId;
            if (!roomId) return;

            socket.to(roomId).emit("cursor-update", {
                socketId: socket.id,
                username: socket.username || "Unknown",
                position: data.position,   // { lineNumber, column }
                selection: data.selection  // optional selection range
            });
        });

        socket.on("disconnect", () => {
            console.log("User Disconnected:", socket.id);

            const roomId = socket.roomId;

            if (roomId && roomUsers[roomId]) {
                roomUsers[roomId] = roomUsers[roomId].filter(
                    (user) => user.id !== socket.id
                );

                io.to(roomId).emit("users-update", roomUsers[roomId]);

                // Tell others to remove this user's cursor
                socket.to(roomId).emit("cursor-remove", { socketId: socket.id });

                // BUG-09: clean up the room key once it is empty
                if (roomUsers[roomId].length === 0) {
                    delete roomUsers[roomId];
                }
            }
        });

    });

};
