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
    let filter = {};

    const { city, listingType, minPrice, maxPrice } = req.query;

    // City filter
    if (city) {
      filter.city = city;
    }

    // Listing Type filter
    if (listingType) {
      filter.listingType = listingType;
    }

    // Price filter
    if (minPrice && maxPrice) {
      filter.price = {
        $gte: Number(minPrice),
        $lte: Number(maxPrice),
      };
    }

    const rooms = await Room.find(filter).populate("owner", "name email");

    res.status(200).json(rooms);

  } catch (error) {
    console.log("FILTER ERROR:", error);
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