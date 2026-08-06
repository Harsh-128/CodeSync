const mongoose = require("mongoose");

const roomHistorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        username: {
            type: String,
            required: true,
        },

        roomId: {
            type: String,
            required: true,
        },

        language: {
            type: String,
            default: "cpp",
        },

        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("RoomHistory", roomHistorySchema);