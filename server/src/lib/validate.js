const { HttpError } = require('./errors')

function validateBody(schema) {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      return next(
        new HttpError(400, 'Validation error', {
          code: 'VALIDATION_ERROR',
          details: parsed.error.flatten(),
          expose: true,
        }),
      )
    }
    req.body = parsed.data
    next()
  }
}

module.exports = { validateBody }

