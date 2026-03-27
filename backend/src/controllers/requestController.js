const Request = require("../models/request")
const logger = require("../logs/logger")

const calculatePriority = require("../services/priorityService")
const { requestQueue } = require("../queue/queueManager")

exports.createRequest = async (req, res) => {

  try {

    const requests = Array.isArray(req.body) ? req.body : [req.body]

    const createdIds = []

    for (const item of requests) {

      if (!item || !item.payload) {
        logger.warn("Invalid request skipped")
        continue
      }

      const priority = calculatePriority(item.type)

      const request = await Request.create({
        requestId: "REQ_" + Date.now() + "_" + Math.floor(Math.random()*1000),
        payload: item.payload,
        priority: priority,
        status: "queued",
        slaDeadline: new Date(Date.now() + 60000)
      })

      await requestQueue.add(
        "processRequest",
        request,
        {
          priority: priority,
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000
          }
        }
      )

      createdIds.push(request.requestId)

      logger.info(`Request created ${request.requestId}`)
    }

    res.json({
      message: `${createdIds.length} request(s) added to queue`,
      requestIds: createdIds
    })

  } catch (error) {

    logger.error(error)

    res.status(500).json({
      error: "Failed to create request"
    })

  }

}