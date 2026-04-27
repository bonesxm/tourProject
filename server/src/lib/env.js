const dotenv = require('dotenv')

dotenv.config()

function mustGet(name) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env var: ${name}`)
  return v
}

function getInt(name, fallback) {
  const raw = process.env[name]
  if (!raw) return fallback
  const n = Number(raw)
  if (!Number.isFinite(n)) return fallback
  return n
}

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: getInt('PORT', 8080),
  DATABASE_URL: mustGet('DATABASE_URL'),
  JWT_ACCESS_SECRET: mustGet('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: mustGet('JWT_REFRESH_SECRET'),
  JWT_ACCESS_TTL: process.env.JWT_ACCESS_TTL || '15m',
  JWT_REFRESH_TTL: process.env.JWT_REFRESH_TTL || '30d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_UPLOAD_MB: getInt('MAX_UPLOAD_MB', 5),
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
}

module.exports = { env }

