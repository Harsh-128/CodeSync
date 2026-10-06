const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { saveRoomHistory, getRoomHistory } = require("../controllers/roomHistoryController");

// Both routes protected — users can only access their own history
router.post("/save",       protect, saveRoomHistory);
router.get("/:userId",     protect, getRoomHistory);

module.exports = router;