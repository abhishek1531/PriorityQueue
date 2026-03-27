const mongoose = require("mongoose")
const { Worker } = require("bullmq")

const { connection, deadLetterQueue } = require("../queue/queueManager")

const Request = require("../models/request")
const logger = require("../logs/logger")

const { requestsTotal, failedRequests } = require("../utils/metrics")

/* ------------------------------------
   Redis Worker Heartbeat
------------------------------------ */

const Redis = require("ioredis")

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379
})

const workerId = "worker_" + process.pid

console.log("Worker started:", workerId)

/* register worker */

redis.sadd("active_workers", workerId)

/* heartbeat every 3 seconds */

setInterval(async () => {

  await redis.set(`worker_heartbeat:${workerId}`, Date.now())

}, 3000)

/* ------------------------------------
   MongoDB Connection
------------------------------------ */

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/priorityQueue")

mongoose.connection.on("connected", () => {
  console.log("Worker MongoDB connected")
})

mongoose.connection.on("error", (err) => {
  console.error("Worker MongoDB connection error:", err)
})

/* ------------------------------------
   Worker Definition
------------------------------------ */

const worker = new Worker(

  "requestQueue",

  async (job) => {

    const req = job.data

    try {

      logger.info(`Processing request ${req.requestId}`)

      await Request.findByIdAndUpdate(req._id, {
        status: "processing",
        startedAt: new Date()
      })

      /* simulate processing */

      await new Promise((resolve) => setTimeout(resolve, 2000))

      /* random failure */

      if (Math.random() < 0.2) {
        throw new Error("Simulated random failure")
      }

      await Request.findByIdAndUpdate(req._id, {
        status: "completed",
        completedAt: new Date()
      })

      requestsTotal.inc()

      logger.info(`Request completed ${req.requestId}`)

      return { success: true }

    } catch (error) {

      failedRequests.inc()

      logger.error(`Worker error: ${error.message}`)

      throw error

    }

  },

  { connection, concurrency: 3 }

)

/* ------------------------------------
   Worker Events
------------------------------------ */

worker.on("completed", (job) => {
  logger.info(`Job completed: ${job.id}`)
})

worker.on("failed", async (job) => {

  logger.error(`Job failed: ${job.id} | Attempts: ${job.attemptsMade}`)

  try {

    if (job.attemptsMade >= job.opts.attempts) {

      await deadLetterQueue.add("failedRequest", job.data)

      await Request.findByIdAndUpdate(job.data._id, {
        status: "failed"
      })

      logger.warn(`Moved to Dead Letter Queue: ${job.data.requestId}`)
    }

  } catch (error) {

    logger.error(`DLQ error: ${error.message}`)
  }

})

worker.on("error", (err) => {
  logger.error(`Worker system error: ${err.message}`)
})

worker.on("ready", () => {
  logger.info("Worker ready and waiting for jobs")
})

/* ------------------------------------
   Cleanup on exit
------------------------------------ */

process.on("SIGINT", async () => {

  console.log("Worker shutting down:", workerId)

  await redis.srem("active_workers", workerId)

  process.exit()

})

module.exports = worker