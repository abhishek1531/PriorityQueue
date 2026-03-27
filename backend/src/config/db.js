const mongoose = require("mongoose");

async function connectDB() {
  try {

    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI not defined in .env");
    }

    await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000
    });

    console.log("MongoDB Connected");

  } catch (err) {

    console.error("MongoDB connection error:", err.message);
    process.exit(1);

  }
}

module.exports = connectDB;

async function connectDB() {
  try {

    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI not defined in .env");
    }

    await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000
    });

    console.log("MongoDB Connected");

  } catch (err) {

    console.error("MongoDB connection error:", err.message);
    process.exit(1);

  }
}

module.exports = connectDB;