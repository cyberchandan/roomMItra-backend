const mongoose=require('mongoose')
const Room = require("../models/Room");
require("../models/User");
// login user can create room details 
// login user can create room details
// login user can create room details
exports.createRoom = async (req, res) => {
  try {
    const {
      title,
      description,
      city,
      fullAddress,
      price,
      listingType,
      roommatePreference,
      latitude,
      longitude,
    } = req.body;

    // Validate location
    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude and Longitude are required",
      });
    }

    // 📸 Handle uploaded images (from multer)
    const imagePaths = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const room = await Room.create({
      title,
      description,
      city,
      fullAddress,
      price,
      listingType,
      roommatePreference,
      owner: req.user._id,

      images: imagePaths, // ✅ Corrected here

      // 📍 GeoJSON location
      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)], // [lng, lat]
      },
    });

    res.status(201).json({
      message: "Room created successfully",
      room,
    });

  } catch (error) {
    console.log("CREATE ROOM ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
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
      return res.status(403).json({
        message: "Not authorized to update this room",
      });
    }

    const {
      title,
      description,
      city,
      fullAddress,
      price,
      listingType,
      roommatePreference,
      latitude,
      longitude,
    } = req.body;

    // 📸 If new images uploaded → replace old images
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(
        (file) => `/uploads/${file.filename}`
      );
      room.images = imagePaths;
    }

    // 📍 If location updated
    if (latitude && longitude) {
      room.location = {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)], // [lng, lat]
      };
    }

    // 📝 Update other fields only if provided
    if (title) room.title = title;
    if (description) room.description = description;
    if (city) room.city = city;
    if (fullAddress) room.fullAddress = fullAddress;
    if (price) room.price = price;
    if (listingType) room.listingType = listingType;
    if (roommatePreference) room.roommatePreference = roommatePreference;

    await room.save();

    res.json({
      message: "Room updated successfully",
      room,
    });

  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
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

// get nearest room to ur location
exports.getNearbyRooms = async (req, res) => {
  try {
    const { lat, lng, distance } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude and Longitude are required",
      });
    }

    const maxDistance = Number(distance) || 2000; // default 2km

    const rooms = await Room.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)], // [lng, lat]
          },
          $maxDistance: maxDistance,
        },
      },
      isActive: true,
    }).populate("owner", "name");

    res.status(200).json({
      total: rooms.length,
      rooms,
    });

  } catch (error) {
    console.log("NEARBY ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};