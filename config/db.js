const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/roomMitra");
    console.log("MongoDB connected successfully ✅");
  } catch (error) {
    console.log("Database not connected ❌", error);
    process.exit(1);
  }
};

module.exports = connectDB;