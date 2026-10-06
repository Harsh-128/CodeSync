const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { runCode } = require("../controllers/codeController");

// Only logged-in users can run code
router.post("/run", protect, runCode);

module.exports = router;