const client = require("prom-client")

/* Create registry */

const register = new client.Registry()

client.collectDefaultMetrics({ register })

/* Total processed requests */

const requestsTotal = new client.Counter({
  name: "requests_total",
  help: "Total processed requests"
})

/* Failed requests */

const failedRequests = new client.Counter({
  name: "failed_requests_total",
  help: "Total failed requests"
})

/* Queue size gauge */

const queueSize = new client.Gauge({
  name: "queue_size",
  help: "Current queue size"
})

/* Job processing time */

const jobDuration = new client.Histogram({
  name: "job_processing_duration_seconds",
  help: "Time taken to process jobs",
  buckets: [0.5, 1, 2, 5, 10]
})

register.registerMetric(requestsTotal)
register.registerMetric(failedRequests)
register.registerMetric(queueSize)
register.registerMetric(jobDuration)

module.exports = {
  register,
  requestsTotal,
  failedRequests,
  queueSize,
  jobDuration
}