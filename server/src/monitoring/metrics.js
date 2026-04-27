const promClient = require('prom-client')

function registerMetrics(app) {
  promClient.collectDefaultMetrics()

  const httpDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  })

  app.use((req, res, next) => {
    const start = process.hrtime.bigint()
    res.on('finish', () => {
      const end = process.hrtime.bigint()
      const seconds = Number(end - start) / 1e9
      const route = req.route?.path || req.path || 'unknown'
      httpDuration.observe(
        { method: req.method, route, status_code: String(res.statusCode) },
        seconds,
      )
    })
    next()
  })

  app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', promClient.register.contentType)
    res.end(await promClient.register.metrics())
  })
}

module.exports = { registerMetrics }

