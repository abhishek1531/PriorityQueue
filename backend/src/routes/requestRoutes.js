const express = require("express")
const router = express.Router()

/* Controllers */

const { createRequest } = require("../controllers/requestController")

/* Services */

const { applyPriorityAging } = require("../services/agingService")
const { checkSLA } = require("../services/slaService")

/* Model */

const Request = require("../models/request")

/* Redis */

const Redis = require("ioredis")

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379
})

/* ------------------------------------
   Create Request
------------------------------------ */

router.post("/request", createRequest)

/* ------------------------------------
   Apply Priority Aging
------------------------------------ */

router.post("/aging", async (req, res) => {

  try {

    await applyPriorityAging()

    res.json({
      message: "Priority aging applied successfully"
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: "Failed to apply priority aging"
    })

  }

})

/* ------------------------------------
   SLA Monitoring
------------------------------------ */

router.get("/sla", async (req, res) => {

  try {

    const violations = await checkSLA()

    res.json(violations)

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: "SLA check failed"
    })

  }

})

/* ------------------------------------
   Queue Statistics (Dashboard)
------------------------------------ */

router.get("/stats", async (req, res) => {

  try {

    const total = await Request.countDocuments()
    const queued = await Request.countDocuments({ status: "queued" })
    const processing = await Request.countDocuments({ status: "processing" })
    const completed = await Request.countDocuments({ status: "completed" })
    const failed = await Request.countDocuments({ status: "failed" })

    res.json({
      total,
      queued,
      processing,
      completed,
      failed
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: "Failed to fetch queue statistics"
    })

  }

})

/* ------------------------------------
   Worker Health (Real-Time)
------------------------------------ */

router.get("/workers", async (req, res) => {

  try {

    const workers = await redis.smembers("active_workers")

    res.json({
      count: workers.length,
      workers: workers,
      status: "running",
      timestamp: new Date()
    })

  } catch (error) {

    console.error("Worker health error:", error)

    res.status(500).json({
      error: "Failed to fetch worker health"
    })

  }

})

/* ------------------------------------
   System Health
------------------------------------ */

router.get("/health", (req, res) => {

  res.json({
    status: "OK",
    service: "Priority Request Queue System",
    time: new Date()
  })

})

module.exports = router