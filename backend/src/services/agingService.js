const Request = require("../models/request")
const logger = require("../logs/logger")

exports.applyPriorityAging = async () => {

  try {

    const waitingRequests = await Request.find({
      status: "queued"
    })

    const now = Date.now()

    let updated = 0

    for (let req of waitingRequests) {

      const waitTime = now - new Date(req.createdAt).getTime()

      /* Apply aging if waiting more than 30 seconds */

      if (waitTime > 30000) {

        const newPriority = Math.max(1, req.priority - 1)

        if (newPriority !== req.priority) {

          await Request.findByIdAndUpdate(req._id, {
            priority: newPriority
          })

          updated++

        }

      }

    }

    logger.info(`Priority aging applied to ${updated} requests`)

    return {
      updated
    }

  } catch (error) {

    logger.error(`Aging service error: ${error.message}`)

    throw error

  }

}