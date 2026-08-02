const Room = require("../models/Room");

// Get all rooms
const getRooms = async (req, res) => {

    try {

        const rooms = await Room.find();

        res.json({
            success: true,
            count: rooms.length,
            rooms: rooms
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

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

const joinRoom = async (req, res) => {
    try {

        const { roomId, username } = req.body;

        const room = await Room.findOne({ roomId });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        if (!room.users.includes(username)) {
            room.users.push(username);
            await room.save();
        }

        res.json({
            success: true,
            message: "Joined Successfully",
            room
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

const getRoomById = async (req, res) => {

    try {

        const room = await Room.findOne({
            roomId: req.params.roomId
        });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        res.json({
            success: true,
            room
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
    createRoom,
    joinRoom,
    getRoomById
};