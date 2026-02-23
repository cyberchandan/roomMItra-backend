const express = require("express");
const optionalAuth = require("../middleware/optionalAuth");
const { createRoom, getAllRooms,updateRoom, deleteRoom,getRoomById } = require("../controllers/roomController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createRoom);
router.get("/", getAllRooms);
router.get("/:id", optionalAuth, getRoomById);
router.put("/:id", protect, updateRoom);
router.delete("/:id", protect, deleteRoom);

module.exports = router;