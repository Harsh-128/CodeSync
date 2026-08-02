const express = require("express");

const router = express.Router();

const roomController = require("../controllers/roomController");

// GET all rooms
router.get("/", roomController.getRooms);

// CREATE room
router.post("/create", roomController.createRoom);

router.post("/join", roomController.joinRoom);

router.get("/:roomId", roomController.getRoomById);

module.exports = router;