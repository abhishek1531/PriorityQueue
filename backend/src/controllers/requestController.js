const Request = require("../models/request")
const logger = require("../logs/logger")

const calculatePriority = require("../services/priorityService")
const { requestQueue } = require("../queue/queueManager")

//  Priority Mapping
const priorityMap = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3
}

// Reverse map
const reversePriorityMap = {
  0: "CRITICAL",
  1: "HIGH",
  2: "MEDIUM",
  3: "LOW"
}



//  CREATE REQUEST
exports.createRequest = async (req, res) => {
  try {

    const requests = Array.isArray(req.body) ? req.body : [req.body]

    const createdRequests = []

    for (let item of requests) {

      const { type, payload } = item

      if (!payload) {
        return res.status(400).json({
          error: "Payload is required in all requests"
        })
      }

      const priority = calculatePriority(type)

      const request = await Request.create({
        requestId: "REQ_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        payload,
        priority,
        status: "queued",

        //   shorter SLA for demo
        slaDeadline: new Date(Date.now() + 5000)
      })

      await requestQueue.add(
        "processRequest",
        request,
        {
          priority,
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 3000
          }
        }
      )

      logger.info(`Request created ${request.requestId}`)

      createdRequests.push(request.requestId)
    }

    res.json({
      message: "Request(s) added to queue",
      requestIds: createdRequests
    })

  } catch (error) {
    logger.error(error.message)
    res.status(500).json({
      error: "Failed to create request"
    })
  }
}

//  GET ALL REQUESTS (FILTER)

exports.getRequests = async (req, res) => {
  try {

    const { priority, status } = req.query
    const filter = {}

    //  Priority filter
    if (priority) {
      const mapped = priorityMap[priority.toUpperCase()]
      if (mapped === undefined) {
        return res.status(400).json({ error: "Invalid priority" })
      }
      filter.priority = mapped
    }

    //  Status filter 
    if (status) {
      filter.status = status
    }

    const requests = await Request.find(filter).sort({ createdAt: -1 })

    const formatted = requests.map(r => ({
      ...r.toObject(),
      priorityLabel: reversePriorityMap[r.priority]
    }))

    res.json(formatted)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch requests" })
  }
}


//  GET COMPLETED REQUESTS

exports.getCompletedRequests = async (req, res) => {
  try {

    const { priority } = req.query

    const filter = { status: "completed" }

    if (priority) {
      const mapped = priorityMap[priority.toUpperCase()]
      if (mapped === undefined) {
        return res.status(400).json({ error: "Invalid priority" })
      }
      filter.priority = mapped
    }

    const requests = await Request.find(filter)

    const formatted = requests.map(r => ({
      ...r.toObject(),
      priorityLabel: reversePriorityMap[r.priority]
    }))

    res.json(formatted)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch completed requests" })
  }
}


//  GROUP BY PRIORITY
exports.getGroupedByPriority = async (req, res) => {
  try {

    const data = await Request.aggregate([
      {
        $group: {
          _id: "$priority",
          total: { $sum: 1 }
        }
      }
    ])

    const formatted = data.map(item => ({
      priority: reversePriorityMap[item._id],
      total: item.total
    }))

    res.json(formatted)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Aggregation failed" })
  }
}



//  GROUP COMPLETED
exports.getCompletedGrouped = async (req, res) => {
  try {

    const data = await Request.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$priority",
          total: { $sum: 1 }
        }
      }
    ])

    const formatted = data.map(item => ({
      priority: reversePriorityMap[item._id],
      total: item.total
    }))

    res.json(formatted)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Aggregation failed" })
  }
}