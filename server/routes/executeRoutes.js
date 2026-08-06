const express = require("express");
const router = express.Router();

const { executeCode } = require("../controllers/executeController");

router.post("/run-code", executeCode);

module.exports = router;