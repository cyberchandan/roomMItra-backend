const express = require("express");
const { createRoom, getAllRooms } = require("../controllers/roomController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createRoom);
router.get("/", getAllRooms);

module.exports = router;