const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const path = require('path')
const { env } = require('./lib/env')
const { attachRequestId } = require('./lib/requestId')
const { errorHandler, notFoundHandler } = require('./lib/errors')
const { registerMetrics } = require('./monitoring/metrics')
const { bootstrap } = require('./db/bootstrap')

const { authRouter } = require('./modules/auth/auth.routes')
const { adminAuthRouter } = require('./modules/admin/adminAuth.routes')
const { destinationsRouter } = require('./modules/destinations/destinations.routes')
const { toursRouter } = require('./modules/tours/tours.routes')
const { hotelsRouter } = require('./modules/hotels/hotels.routes')
const { bookingsRouter } = require('./modules/bookings/bookings.routes')
const { adminRouter } = require('./modules/admin/admin.routes')
const { aiRouter } = require('./modules/ai/ai.routes')

const app = express()

app.disable('x-powered-by')

app.use(attachRequestId())
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
)
app.use(
  cors({
    origin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',').map((s) => s.trim()) : '*',
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use(
  rateLimit({
    windowMs: 60_000,
    max: 240,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

// Static uploads (avatars, etc.)
app.use('/uploads', express.static(path.resolve(process.cwd(), env.UPLOAD_DIR)))

registerMetrics(app)

app.get('/', (_req, res) => {
  res.json({
    service: 'smart-tourism-platform-api',
    docs: {
      healthz: '/healthz',
      metrics: '/metrics',
      destinations: '/api/destinations',
    },
  })
})

app.get('/healthz', (_req, res) => {
  res.json({ ok: true, service: 'smart-tourism-platform', time: new Date().toISOString() })
})

app.use('/api/auth', authRouter)
app.use('/api/admin/auth', adminAuthRouter)
app.use('/api/destinations', destinationsRouter)
app.use('/api/tours', toursRouter)
app.use('/api/hotels', hotelsRouter)
app.use('/api/bookings', bookingsRouter)
app.use('/api/admin', adminRouter)
app.use('/api/ai', aiRouter)

app.use(notFoundHandler)
app.use(errorHandler)

async function start() {
  await bootstrap()
  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${env.PORT}`)
  })
}

start().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('Server failed to start', e)
  process.exit(1)
})

