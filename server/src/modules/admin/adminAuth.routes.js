const express = require('express')
const bcrypt = require('bcrypt')
const { z } = require('zod')
const { pool } = require('../../db/pool')
const { HttpError } = require('../../lib/errors')
const { validateBody } = require('../../lib/validate')
const { signAccessToken, signRefreshToken } = require('../../lib/jwt')

const adminAuthRouter = express.Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(72),
})

adminAuthRouter.post('/login', validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body
    const { rows } = await pool.query(
      `SELECT id, email, password_hash, full_name, role FROM admins WHERE email = $1`,
      [email.toLowerCase()],
    )
    const admin = rows[0]
    if (!admin) return next(new HttpError(401, 'Invalid credentials', { code: 'AUTH_FAILED' }))

    const ok = await bcrypt.compare(password, admin.password_hash)
    if (!ok) return next(new HttpError(401, 'Invalid credentials', { code: 'AUTH_FAILED' }))

    const accessToken = signAccessToken({ sub: admin.id, role: admin.role, kind: 'admin' })
    const refreshToken = signRefreshToken({ sub: admin.id, role: admin.role, kind: 'admin' })

    res.json({
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.full_name,
        role: admin.role,
      },
      tokens: { accessToken, refreshToken },
    })
  } catch (e) {
    next(e)
  }
})

module.exports = { adminAuthRouter }

