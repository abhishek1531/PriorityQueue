const logger = require("../logs/logger")

const PRIORITY_LEVELS = {
  CRITICAL: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4
}

function calculatePriority(type) {

  if (!type) {
    logger.warn("Priority type not provided. Using default priority.")
    return 5
  }

  const normalizedType = type.toUpperCase()

  const priority = PRIORITY_LEVELS[normalizedType]

  if (!priority) {
    logger.warn(`Unknown priority type: ${type}. Using default.`)
    return 5
  }

  return priority
}

module.exports = calculatePriority