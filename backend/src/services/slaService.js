const Request = require("../models/request")

exports.checkSLA = async () => {

  const now = new Date()

  const violations = await Request.find({
    status: { $in: ["queued", "processing"] },
    slaDeadline: { $lt: now }
  })

  for (let req of violations) {
    await Request.findByIdAndUpdate(req._id, {
      priority: 0
    })
  }

  return violations
}