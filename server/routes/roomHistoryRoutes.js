const express = require("express");

const router = express.Router();

const {
    saveRoomHistory,
    getRoomHistory,
} = require("../controllers/roomHistoryController");

// Save room history
router.post("/save", saveRoomHistory);

// Get room history by userId
router.get("/:userId", getRoomHistory);

module.exports = router;