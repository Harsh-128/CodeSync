const Room = require("../models/Room");

// Get all rooms
const getRooms = (req, res) => {
    res.send("This response is coming from Controller!");
};

// Create a new room
const createRoom = async (req, res) => {
    try {

        const roomId = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

        const newRoom = new Room({
            roomId: roomId
        });

        await newRoom.save();

        res.json({
            success: true,
            message: "Room Saved Successfully",
            room: newRoom
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

module.exports = {
    getRooms,
    createRoom
};