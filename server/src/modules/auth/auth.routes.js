const express = require('express')
const bcrypt = require('bcrypt')
const { z } = require('zod')
const crypto = require('crypto')
const { pool } = require('../../db/pool')
const { HttpError } = require('../../lib/errors')
const { validateBody } = require('../../lib/validate')
const { signAccessToken, signRefreshToken } = require('../../lib/jwt')
const { requireAuth } = require('../../lib/auth')

const authRouter = express.Router()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  confirmPassword: z.string().min(8).max(72),
  fullName: z.string().min(2).max(120),
  phone: z.string().min(7).max(30),
})

authRouter.post('/register', validateBody(registerSchema), async (req, res, next) => {
  try {
    const { email, password, confirmPassword, fullName, phone } = req.body
    if (password !== confirmPassword) {
      return next(new HttpError(400, 'Passwords do not match', { code: 'PASSWORD_MISMATCH' }))
    }
    const hash = await bcrypt.hash(password, 10)

    const { rows } = await pool.query(
      `
      INSERT INTO users (email, password_hash, full_name, phone)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, full_name, role, is_blocked, avatar_url, phone, created_at
    `,
      [email.toLowerCase(), hash, fullName, phone],
    )

    const user = rows[0]
    const accessToken = signAccessToken({ sub: user.id, role: user.role, kind: 'user' })
    const refreshToken = signRefreshToken({ sub: user.id, role: user.role, kind: 'user' })

    res.status(201).json({ user, tokens: { accessToken, refreshToken } })
  } catch (e) {
    if (String(e?.message || '').includes('duplicate key')) {
      return next(new HttpError(409, 'Email already registered', { code: 'EMAIL_TAKEN' }))
    }
    next(e)
  }
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(72),
})

authRouter.post('/login', validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body
    const { rows } = await pool.query(
      `SELECT id, email, password_hash, full_name, role, is_blocked, avatar_url, phone FROM users WHERE email = $1`,
      [email.toLowerCase()],
    )
    const user = rows[0]
    if (!user) return next(new HttpError(401, 'Invalid credentials', { code: 'AUTH_FAILED' }))
    if (user.is_blocked) return next(new HttpError(403, 'User is blocked', { code: 'USER_BLOCKED' }))

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) return next(new HttpError(401, 'Invalid credentials', { code: 'AUTH_FAILED' }))

    const accessToken = signAccessToken({ sub: user.id, role: user.role, kind: 'user' })
    const refreshToken = signRefreshToken({ sub: user.id, role: user.role, kind: 'user' })

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        avatarUrl: user.avatar_url,
        phone: user.phone,
      },
      tokens: { accessToken, refreshToken },
    })
  } catch (e) {
    next(e)
  }
})

authRouter.post('/logout', (_req, res) => {
  res.json({ ok: true })
})

authRouter.get('/me', requireAuth(), async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, email, full_name, role, avatar_url, phone, created_at FROM users WHERE id = $1`,
      [req.user.sub],
    )
    if (!rows[0]) return next(new HttpError(404, 'User not found'))
    res.json({
      user: {
        id: rows[0].id,
        email: rows[0].email,
        fullName: rows[0].full_name,
        role: rows[0].role,
        avatarUrl: rows[0].avatar_url,
        phone: rows[0].phone,
        createdAt: rows[0].created_at,
      },
    })
  } catch (e) {
    next(e)
  }
})

const forgotSchema = z.object({
  email: z.string().email(),
})

authRouter.post('/forgot-password', validateBody(forgotSchema), async (req, res, next) => {
  try {
    const { email } = req.body
    const { rows } = await pool.query(`SELECT id FROM users WHERE email = $1`, [email.toLowerCase()])
    if (!rows[0]) return res.json({ ok: true })
    const token = crypto.randomBytes(24).toString('hex')
    await pool.query(
      `
      INSERT INTO password_resets (user_id, token, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '30 minutes')
    `,
      [rows[0].id, token],
    )
    // Demo mode: return token (replace with email service in production)
    res.json({ ok: true, resetToken: token, resetUrl: `/reset-password?token=${token}` })
  } catch (e) {
    next(e)
  }
})

const resetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8).max(72),
  confirmPassword: z.string().min(8).max(72),
})

authRouter.post('/reset-password', validateBody(resetSchema), async (req, res, next) => {
  try {
    const { token, password, confirmPassword } = req.body
    if (password !== confirmPassword) {
      return next(new HttpError(400, 'Passwords do not match', { code: 'PASSWORD_MISMATCH' }))
    }
    const { rows } = await pool.query(
      `
      SELECT id, user_id
      FROM password_resets
      WHERE token = $1 AND used_at IS NULL AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `,
      [token],
    )
    const reset = rows[0]
    if (!reset) return next(new HttpError(400, 'Reset token is invalid or expired'))
    const hash = await bcrypt.hash(password, 10)
    await pool.query(`UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`, [
      hash,
      reset.user_id,
    ])
    await pool.query(`UPDATE password_resets SET used_at = NOW() WHERE id = $1`, [reset.id])
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

const changeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(72),
  confirmPassword: z.string().min(8).max(72),
})

authRouter.post('/change-password', requireAuth(), validateBody(changeSchema), async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body
    if (newPassword !== confirmPassword) {
      return next(new HttpError(400, 'Passwords do not match', { code: 'PASSWORD_MISMATCH' }))
    }
    const { rows } = await pool.query(`SELECT password_hash FROM users WHERE id = $1`, [req.user.sub])
    if (!rows[0]) return next(new HttpError(404, 'User not found'))
    const ok = await bcrypt.compare(currentPassword, rows[0].password_hash)
    if (!ok) return next(new HttpError(400, 'Current password is incorrect'))
    const hash = await bcrypt.hash(newPassword, 10)
    await pool.query(`UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`, [
      hash,
      req.user.sub,
    ])
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

module.exports = { authRouter }

