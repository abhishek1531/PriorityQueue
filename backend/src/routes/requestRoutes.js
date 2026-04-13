const express = require("express")
const router = express.Router()

/* Controllers */
const {
  createRequest,
  getRequests,
  getCompletedRequests,
  getGroupedByPriority,
  getCompletedGrouped
} = require("../controllers/requestController")

/* Services */
const { applyPriorityAging } = require("../services/agingService")
const { checkSLA } = require("../services/slaService")

/* Model */
const Request = require("../models/request")

/*  Redis Connection */
const { connection } = require("../queue/queueManager")

/* ------------------------------------
   Create Request
------------------------------------ */
router.post("/request", createRequest)

/* ------------------------------------
   Get All Requests
------------------------------------ */
router.get("/requests", getRequests)

/* ------------------------------------
   Get Completed Requests
------------------------------------ */
router.get("/requests/completed", getCompletedRequests)

/* ------------------------------------
   Group Requests by Priority
------------------------------------ */
router.get("/requests/grouped", getGroupedByPriority)

/* ------------------------------------
   Group Completed Requests
------------------------------------ */
router.get("/requests/completed/grouped", getCompletedGrouped)

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

    //  Get worker count from Redis
    const activeWorkers = parseInt(await connection.get("activeWorkers")) || 0

    res.json({
      total,
      queued,
      processing,
      completed,
      failed,
      activeWorkers
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: "Failed to fetch queue statistics"
    })
  }
})

/* ------------------------------------
   Worker Health (Updated)
------------------------------------ */
router.get("/workers", async (req, res) => {
  try {

    const activeWorkers = parseInt(await connection.get("activeWorkers")) || 0

    res.json({
      activeWorkers,
      workerIds: Array.from({ length: activeWorkers }, (_, i) => `worker-${i + 1}`),
      timestamp: new Date()
    })

  } catch (err) {

    res.status(500).json({
      error: "Failed to fetch workers"
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