const axios = require("axios")

const TOTAL_REQUESTS = 1000
const CONCURRENT_REQUESTS = 75

let sent = 0

// 🔥 Random data generators
const types = ["HIGH", "LOW", "MEDIUM", "CRITICAL"]

const getRandomType = () => {
  return types[Math.floor(Math.random() * types.length)]
}

const generatePayload = (id, type) => {

  switch (type) {

    case "HIGH":
      return {
        task: "Process payment",
        amount: Math.floor(Math.random() * 5000),
        userId: "U" + (100 + id)
      }

    case "LOW":
      return {
        task: "Send email",
        email: `user${id}@example.com`
      }

    case "MEDIUM":
      return {
        task: "Generate report",
        month: ["Jan", "Feb", "Mar"][Math.floor(Math.random() * 3)]
      }

    case "CRITICAL":
      return {
        task: "Fraud check",
        transactionId: "TX" + (1000 + id)
      }

    default:
      return {
        task: "Generic task"
      }
  }
}

const sendRequest = async (id) => {

  const type = getRandomType()
  const payload = generatePayload(id, type)

  try {

    await axios.post("http://localhost:5000/api/request", {
      type,
      payload
    })

    console.log(` Request ${id} sent (${type})`)

  } catch (error) {

    console.error(` Request ${id} failed`, error.message)

  }

}

const runLoadTest = async () => {

  while (sent < TOTAL_REQUESTS) {

    const batch = []

    for (let i = 0; i < CONCURRENT_REQUESTS && sent < TOTAL_REQUESTS; i++) {

      sent++
      batch.push(sendRequest(sent))

    }

    await Promise.all(batch)
  }

  console.log(" Load test completed")

}

runLoadTest()