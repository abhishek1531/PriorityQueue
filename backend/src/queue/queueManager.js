const { Queue } = require("bullmq")
const Redis = require("ioredis")

const connection = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null
})

const requestQueue = new Queue("requestQueue", {
  connection
})

const deadLetterQueue = new Queue("deadLetterQueue", {
  connection
})

module.exports = {
  connection,
  requestQueue,
  deadLetterQueue
}