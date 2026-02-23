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
    const rooms = await Room.find()
      .populate("owner", "name email");   // password automatically include nahi hoga

    res.status(200).json(rooms);
  } catch (error) {
    console.log("GET ROOMS ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};