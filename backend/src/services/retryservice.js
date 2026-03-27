/* Retry configuration for queue jobs */

const retryConfig = {

  attempts: 3,

  backoff: {
    type: "exponential",
    delay: 2000
  },

  removeOnComplete: true,

  removeOnFail: false

}

module.exports = { retryConfig }