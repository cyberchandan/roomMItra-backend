const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    city: {
      type: String,
      required: true,
    },
    fullAddress: String,
    location: {
      latitude: Number,
      longitude: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    listingType: {
      type: String,
      enum: ["owner", "roommate"],
      required: true,
    },
    roommatePreference: {
      gender: String,
      occupation: String,
    },
    images: [String],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);