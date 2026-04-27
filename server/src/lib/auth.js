const { HttpError } = require('./errors')
const { verifyAccessToken } = require('./jwt')

function requireAuth() {
  return (req, _res, next) => {
    const auth = req.header('authorization') || ''
    const [scheme, token] = auth.split(' ')
    if (scheme !== 'Bearer' || !token) return next(new HttpError(401, 'Missing auth token'))

    try {
      const payload = verifyAccessToken(token)
      req.user = payload
      return next()
    } catch {
      return next(new HttpError(401, 'Invalid or expired token'))
    }
  }
}

function requireRole(roles) {
  const roleSet = new Set(Array.isArray(roles) ? roles : [roles])
  return (req, _res, next) => {
    const role = req.user?.role
    if (!role || !roleSet.has(role)) return next(new HttpError(403, 'Forbidden'))
    next()
  }
}

module.exports = { requireAuth, requireRole }

