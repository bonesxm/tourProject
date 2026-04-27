const { pool } = require('./pool')

async function bootstrap() {
  // Run migrations + seed automatically in container/dev.
  // This keeps the project "one command to run" for demos.
  // In production you may prefer explicit migrations.
  const migrate = require('./migrateRunner')
  const seed = require('./seedRunner')
  await migrate()
  await seed()
}

module.exports = { bootstrap }

