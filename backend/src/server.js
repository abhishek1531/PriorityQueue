require("dotenv").config()

const express = require("express")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")

const connectDB = require("./config/db")
const requestRoutes = require("./routes/requestRoutes")
const { register } = require("./utils/metrics")

const app = express()

/* -----------------------------
   Create HTTP Server
------------------------------ */

const server = http.createServer(app)

/* -----------------------------
   Socket.io Setup
------------------------------ */

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

/* Make io accessible everywhere */

app.set("io", io)

/* -----------------------------
   Database Connection
------------------------------ */

connectDB()

/* -----------------------------
   Middlewares
------------------------------ */

app.use(cors())
app.use(express.json())

/* -----------------------------
   Routes
------------------------------ */

app.use("/api", requestRoutes)

/* -----------------------------
   Health Check Route
------------------------------ */

app.get("/", (req, res) => {
  res.send("Priority Request Queue System Running")
})

/* -----------------------------
   Prometheus Metrics Route
------------------------------ */

app.get("/metrics", async (req, res) => {

  res.set("Content-Type", register.contentType)

  const metrics = await register.metrics()

  res.send(metrics)

})

/* -----------------------------
   Socket Connection
------------------------------ */

io.on("connection", (socket) => {

  console.log("Dashboard connected:", socket.id)

  socket.on("disconnect", () => {
    console.log("Dashboard disconnected:", socket.id)
  })

})

/* -----------------------------
   Start Server
------------------------------ */

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log("API: http://localhost:5000")
  console.log("Metrics: http://localhost:5000/metrics")
})
