const mongoose = require("mongoose")

const RequestSchema = new mongoose.Schema({

  requestId: {
    type: String,
    required: true,
    unique: true
  },

  payload: {
    type: Object,
    required: true
  },

  priority: {
    type: Number,
    required: true,
    index: true
  },

  status: {
    type: String,
    enum: ["queued", "processing", "completed", "failed"],
    default: "queued",
    index: true
  },

  retries: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  startedAt: {
    type: Date
  },

  completedAt: {
    type: Date
  },

  slaDeadline: {
    type: Date,
    required: true,
    index: true
  }

},
{
  timestamps: true
})

module.exports = mongoose.model("Request", RequestSchema)