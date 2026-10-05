const Room = require("../models/Room");
const crypto = require("crypto");

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

        // Generate a collision-safe 6-character room ID using crypto
        let roomId;
        let attempts = 0;
        const MAX_ATTEMPTS = 10;

        do {
            roomId = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6 hex chars
            const existing = await Room.findOne({ roomId });
            if (!existing) break;
            attempts++;
        } while (attempts < MAX_ATTEMPTS);

        if (attempts >= MAX_ATTEMPTS) {
            return res.status(500).json({
                success: false,
                message: "Could not generate a unique room ID. Please try again."
            });
        }

        const newRoom = new Room({ roomId });

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