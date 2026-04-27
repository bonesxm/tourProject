function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      requestId: req.requestId,
    },
  })
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  const status = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500
  const code = err.code || (status === 500 ? 'INTERNAL' : 'BAD_REQUEST')
  const message = err.expose ? err.message : status === 500 ? 'Internal server error' : err.message

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error(err)
  }

  res.status(status).json({
    error: {
      code,
      message,
      requestId: req.requestId,
      details: err.details,
    },
  })
}

class HttpError extends Error {
  constructor(statusCode, message, opts = {}) {
    super(message)
    this.statusCode = statusCode
    this.code = opts.code
    this.expose = opts.expose ?? statusCode < 500
    this.details = opts.details
  }
}

module.exports = { notFoundHandler, errorHandler, HttpError }

