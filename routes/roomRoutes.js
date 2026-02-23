const express = require("express");
const optionalAuth = require("../middleware/optionalAuth");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
  getRoomById,
  getNearbyRooms
} = require("../controllers/roomController");

const router = express.Router();

// router.post("/create", protect, createRoom);
router.post(
    "/create",
    protect,
    upload.array("images", 5), // max 5 images
    createRoom
  );

router.get("/", getAllRooms);

// 🔥 IMPORTANT: Specific routes first
router.get("/near", getNearbyRooms);

// Dynamic route LAST
router.get("/:id", optionalAuth, getRoomById);
router.put(
  "/:id",
  protect,
  upload.array("images", 5),
  updateRoom
);
router.delete("/:id", protect, deleteRoom);

module.exports = router;