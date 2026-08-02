module.exports = (io) => {

    io.on("connection", (socket) => {

        console.log("New User Connected:", socket.id);

        socket.on("join-room", (roomId) => {

            socket.join(roomId);

            console.log(`${socket.id} joined room ${roomId}`);

        });

        socket.on("send-message", (data) => {

            console.log(data);

            io.to(data.roomId).emit("receive-message", {
                sender: socket.id,
                message: data.message
            });

        });

        socket.on("disconnect", () => {

            console.log("User Disconnected:", socket.id);

        });

    });

};