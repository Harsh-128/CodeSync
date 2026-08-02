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

roomUsers[roomId].push({
    id: socket.id,
    username
});

            io.to(roomId).emit("users-update", roomUsers[roomId]);

            console.log(`${username} joined room ${roomId}`);

        });

        socket.on("send-message", (data) => {

            io.to(data.roomId).emit("receive-message", {
    sender: socket.username,
    message: data.message
});

        });

        socket.on("code-change", (data) => {

            socket.to(data.roomId).emit("code-update", data.code);

        });

        socket.on("disconnect", () => {

            console.log("User Disconnected:", socket.id);

            const roomId = socket.roomId;

            if (roomId && roomUsers[roomId]) {

                roomUsers[roomId] = roomUsers[roomId].filter(
                    user => user.id !== socket.id
                );

                io.to(roomId).emit("users-update", roomUsers[roomId]);

            }

        });

    });

};