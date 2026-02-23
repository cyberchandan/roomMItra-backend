const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    fullAddress: {
      type: String,
      trim: true,
    },

    // 📍 GeoJSON Location (Longitude, Latitude)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    listingType: {
      type: String,
      enum: ["owner", "roommate"],
      required: true,
    },

    roommatePreference: {
      gender: {
        type: String,
      },
      occupation: {
        type: String,
      },
    },

    images: [
      {
        type: String,
      },
    ],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 🌍 Required for Geo Queries (Nearby Search)
roomSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Room", roomSchema);