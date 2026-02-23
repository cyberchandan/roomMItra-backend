const express = require("express");
const { createRoom, getAllRooms,updateRoom, deleteRoom } = require("../controllers/roomController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createRoom);
router.get("/", getAllRooms);
router.put("/:id", protect, updateRoom);
router.delete("/:id", protect, deleteRoom);

module.exports = router;