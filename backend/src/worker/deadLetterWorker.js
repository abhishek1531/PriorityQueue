const { Worker } = require("bullmq")

const { connection } = require("../queue/queueManager")
const logger = require("../logs/logger")

/* ------------------------------------
   Dead Letter Queue Worker
------------------------------------ */

const deadLetterWorker = new Worker(

  "deadLetterQueue",

  async (job) => {

    try {

      logger.warn(`Dead Letter Job Received: ${job.data.requestId}`)

      /* Here you could store failed jobs
         in a separate database or alert system */

      return { stored: true }

    } catch (error) {

      logger.error(`DLQ Worker Error: ${error.message}`)

      throw error

    }

  },

  { connection }

)


//   Worker Events

deadLetterWorker.on("completed", (job) => {

  logger.info(`DLQ job handled successfully: ${job.id}`)

})

deadLetterWorker.on("failed", (job, err) => {

  logger.error(`DLQ job failed: ${job?.id} | ${err.message}`)

})

deadLetterWorker.on("ready", () => {

  logger.info("Dead Letter Worker ready")

})

module.exports = deadLetterWorker