const mongoose = require("mongoose")

const { scaleWorkers } = require("./queue/workerManager")
const Request = require("./models/request")

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/priorityQueue")

mongoose.connection.on("connected", () => {
  console.log(" Scaler MongoDB connected")
})

mongoose.connection.on("error", (err) => {
  console.error(" MongoDB error:", err)
})

console.log(" Auto-scaler started...")

//  Run scaling every 5 seconds
setInterval(async () => {

  try {

    const queued = await Request.countDocuments({ status: "queued" })

    console.log(` Queue size: ${queued}`)

    await scaleWorkers(queued)

  } catch (err) {

    console.error("Scaler error:", err.message)

  }

}, 3000)