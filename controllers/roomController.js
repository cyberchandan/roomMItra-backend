const Room = require("../models/Room");
require("../models/User");

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