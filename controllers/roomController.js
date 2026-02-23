const mongoose=require('mongoose')
const Room = require("../models/Room");
require("../models/User");
// login user can create room details 
exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create({
      ...req.body,
      owner: req.user._id,
    });

    res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// get all rooms here 
exports.getAllRooms = async (req, res) => {
  try {
    // Filters
    const { city, listingType, minPrice, maxPrice } = req.query;

    let filter = {};

    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    if (listingType) {
      filter.listingType = listingType;
    }

    if (minPrice && maxPrice) {
      filter.price = {
        $gte: Number(minPrice),
        $lte: Number(maxPrice),
      };
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const totalRooms = await Room.countDocuments(filter);

    const rooms = await Room.find(filter)
      .populate("owner", "name")
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalRooms / limit),
      totalRooms,
      hasMore: skip + rooms.length < totalRooms,
      rooms,
    });

  } catch (error) {
    console.log("GET ROOMS ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// update Room details(login user only)
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 🔐 Check ownership
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this room" });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Room updated successfully",
      room: updatedRoom,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// delete Room details (login user only)
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 🔐 Ownership check
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this room" });
    }

    await room.deleteOne();

    res.json({ message: "Room deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// room details by id
exports.getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const room = await Room.findById(id)
      .populate("owner", "name email phone");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Convert mongoose doc to plain object
    let roomData = room.toObject();

    // 🔐 Smart visibility
    if (!req.user) {
      roomData.owner.email = "Login required";
      roomData.owner.phone = "Login required";
    }

    res.status(200).json(roomData);

  } catch (error) {
    console.log("ROOM DETAIL ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};