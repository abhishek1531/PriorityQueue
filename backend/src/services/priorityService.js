const logger = require("../logs/logger")

const PRIORITY_LEVELS = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3
}

function calculatePriority(type) {

  if (!type) {
    logger.warn("Priority type not provided. Using LOW.")
    return PRIORITY_LEVELS.LOW
  }

  const normalizedType = type.toUpperCase()
  const priority = PRIORITY_LEVELS[normalizedType]

  if (priority === undefined) {
    logger.warn(`Unknown priority type: ${type}`)
    return PRIORITY_LEVELS.LOW
  }

  return priority
}

module.exports = calculatePriority