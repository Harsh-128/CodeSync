const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const roomController = require("../controllers/roomController");

// Public — needed to check if a room exists before login
router.get("/:roomId", roomController.getRoomById);

// Protected — must be logged in to create or join rooms
router.get("/",            protect, roomController.getRooms);
router.post("/create",     protect, roomController.createRoom);
router.post("/join",       protect, roomController.joinRoom);

module.exports = router;