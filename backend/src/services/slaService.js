const Request = require("../models/request")
const logger = require("../logs/logger")

exports.checkSLA = async () => {

  try {

    const now = new Date()

    /* Find requests whose SLA deadline is passed */

    const violations = await Request.find({
      status: "queued",
      slaDeadline: { $lt: now }
    })

    for (let req of violations) {

      logger.warn(SLA violation detected for request ${req.requestId})

      /* Escalate priority to highest */

      if (req.priority !== 1) {

        await Request.findByIdAndUpdate(req._id, {
          priority: 1
        })

      }

    }

    logger.info(SLA check completed. Violations found: ${violations.length})

    return violations

  } catch (error) {

    logger.error(SLA service error: ${error.message})

    throw error

  }

}