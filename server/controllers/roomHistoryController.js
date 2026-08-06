const RoomHistory = require("../models/RoomHistory");

// Save room history
const saveRoomHistory = async (req, res) => {
    try {
        const { userId, username, roomId, language } = req.body;

        const history = await RoomHistory.create({
            userId,
            username,
            roomId,
            language,
        });

        res.status(201).json({
            success: true,
            history,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get all rooms joined by a user
const getRoomHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        const history = await RoomHistory.find({ userId })
            .sort({ joinedAt: -1 });

        res.json(history);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    saveRoomHistory,
    getRoomHistory,
};