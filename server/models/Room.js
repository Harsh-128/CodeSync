const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({

    roomId: {
        type: String,
        required: true,
        unique: true
    },

    language: {
        type: String,
        default: "cpp"
    },

    users: {
        type: [String],
        default: []
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Room", roomSchema);