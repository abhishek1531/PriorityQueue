const { fork } = require("child_process")
const os = require("os")

/* CPU cores detect */

const cpuCount = os.cpus().length

console.log("CPU Cores:", cpuCount)
console.log("Starting workers...")

/* Start workers equal to CPU cores */

for (let i = 0; i < cpuCount; i++) {

  const worker = fork("./src/worker/worker.js")

  console.log(`Worker ${i + 1} started with PID ${worker.pid}`)

}
