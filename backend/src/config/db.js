const mongoose = require("mongoose")

async function connectDB() {
  try {

    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/priorityQueue"

    await mongoose.connect(uri)

    console.log("MongoDB Connected")

  } catch (err) {

    console.error("MongoDB connection error:", err)
    process.exit(1)

  }
}

module.exports = connectDB