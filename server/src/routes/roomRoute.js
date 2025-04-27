const express = require("express");
const { createRoom, getRoomsByMemberId } = require("../controllers/roomController");

const router = express.Router();

// Route to create a new room
router.post("/", createRoom);
router.get("/:memberId", getRoomsByMemberId);

module.exports = router;