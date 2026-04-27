const express = require('express')
const { z } = require('zod')
const { pool } = require('../../db/pool')
const { requireAuth, requireRole } = require('../../lib/auth')
const { validateBody } = require('../../lib/validate')
const { HttpError } = require('../../lib/errors')

const adminRouter = express.Router()

adminRouter.use(requireAuth(), requireRole(['admin']))

adminRouter.get('/stats', async (_req, res, next) => {
  try {
    const [users, bookings, revenue, popular] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS total FROM users`),
      pool.query(`SELECT COUNT(*)::int AS total FROM bookings`),
      pool.query(`SELECT COALESCE(SUM(amount_usd),0)::int AS total FROM payments WHERE status = 'paid'`),
      pool.query(`
        SELECT d.title, COUNT(b.id)::int AS bookings
        FROM bookings b
        LEFT JOIN tours t ON t.id = b.tour_id
        LEFT JOIN destinations d ON d.id = t.destination_id
        GROUP BY d.title
        ORDER BY bookings DESC
        LIMIT 5
      `),
    ])
    res.json({
      cards: {
        totalUsers: users.rows[0].total,
        totalBookings: bookings.rows[0].total,
        revenueUsd: revenue.rows[0].total,
      },
      popularDestinations: popular.rows,
    })
  } catch (e) {
    next(e)
  }
})

adminRouter.get('/users', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT u.id, u.full_name, u.email, u.phone, u.is_blocked, u.created_at,
             COUNT(b.id)::int AS bookings_count
      FROM users u
      LEFT JOIN bookings b ON b.user_id = u.id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `)
    res.json({ items: rows })
  } catch (e) {
    next(e)
  }
})

const userUpdateSchema = z.object({
  fullName: z.string().min(2).max(120),
  phone: z.string().min(7).max(30),
  isBlocked: z.boolean(),
})

adminRouter.put('/users/:id', validateBody(userUpdateSchema), async (req, res, next) => {
  try {
    const { id } = req.params
    const { fullName, phone, isBlocked } = req.body
    const { rows } = await pool.query(
      `
      UPDATE users
      SET full_name = $1, phone = $2, is_blocked = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING id, full_name, email, phone, is_blocked, created_at
    `,
      [fullName, phone, isBlocked, id],
    )
    if (!rows[0]) throw new HttpError(404, 'User not found')
    res.json({ item: rows[0] })
  } catch (e) {
    next(e)
  }
})

adminRouter.delete('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    await pool.query(`DELETE FROM users WHERE id = $1`, [id])
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

adminRouter.get('/tours', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT t.*, d.title AS destination_title
      FROM tours t
      LEFT JOIN destinations d ON d.id = t.destination_id
      ORDER BY t.created_at DESC
    `)
    res.json({ items: rows })
  } catch (e) {
    next(e)
  }
})

const tourSchema = z.object({
  destinationId: z.string().uuid(),
  slug: z.string().min(2).max(120),
  title: z.string().min(2).max(160),
  durationDays: z.number().int().min(1),
  priceUsd: z.number().int().min(0),
  hotelIncluded: z.boolean(),
  transport: z.string().max(120).optional(),
  description: z.string().max(2000).optional(),
})

adminRouter.post('/tours', validateBody(tourSchema), async (req, res, next) => {
  try {
    const t = req.body
    const { rows } = await pool.query(
      `
      INSERT INTO tours (destination_id, slug, title, duration_days, price_usd, hotel_included, transport, description)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `,
      [t.destinationId, t.slug, t.title, t.durationDays, t.priceUsd, t.hotelIncluded, t.transport || null, t.description || null],
    )
    res.status(201).json({ item: rows[0] })
  } catch (e) {
    next(e)
  }
})

adminRouter.put('/tours/:id', validateBody(tourSchema), async (req, res, next) => {
  try {
    const t = req.body
    const { rows } = await pool.query(
      `
      UPDATE tours
      SET destination_id=$1, slug=$2, title=$3, duration_days=$4, price_usd=$5, hotel_included=$6, transport=$7, description=$8, updated_at=NOW()
      WHERE id=$9
      RETURNING *
    `,
      [t.destinationId, t.slug, t.title, t.durationDays, t.priceUsd, t.hotelIncluded, t.transport || null, t.description || null, req.params.id],
    )
    if (!rows[0]) throw new HttpError(404, 'Tour not found')
    res.json({ item: rows[0] })
  } catch (e) {
    next(e)
  }
})

adminRouter.delete('/tours/:id', async (req, res, next) => {
  try {
    await pool.query(`DELETE FROM tours WHERE id=$1`, [req.params.id])
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

adminRouter.get('/hotels', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT h.*, d.title AS destination_title
      FROM hotels h
      LEFT JOIN destinations d ON d.id = h.destination_id
      ORDER BY h.created_at DESC
    `)
    res.json({ items: rows })
  } catch (e) {
    next(e)
  }
})

const hotelSchema = z.object({
  destinationId: z.string().uuid(),
  slug: z.string().min(2).max(120),
  name: z.string().min(2).max(160),
  stars: z.number().int().min(1).max(5),
  pricePerNightUsd: z.number().int().min(0),
  address: z.string().max(300).optional(),
  description: z.string().max(2000).optional(),
})

adminRouter.post('/hotels', validateBody(hotelSchema), async (req, res, next) => {
  try {
    const h = req.body
    const { rows } = await pool.query(
      `
      INSERT INTO hotels (destination_id, slug, name, stars, price_per_night_usd, address, description)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
    `,
      [h.destinationId, h.slug, h.name, h.stars, h.pricePerNightUsd, h.address || null, h.description || null],
    )
    res.status(201).json({ item: rows[0] })
  } catch (e) {
    next(e)
  }
})

adminRouter.put('/hotels/:id', validateBody(hotelSchema), async (req, res, next) => {
  try {
    const h = req.body
    const { rows } = await pool.query(
      `
      UPDATE hotels
      SET destination_id=$1, slug=$2, name=$3, stars=$4, price_per_night_usd=$5, address=$6, description=$7, updated_at=NOW()
      WHERE id=$8
      RETURNING *
    `,
      [h.destinationId, h.slug, h.name, h.stars, h.pricePerNightUsd, h.address || null, h.description || null, req.params.id],
    )
    if (!rows[0]) throw new HttpError(404, 'Hotel not found')
    res.json({ item: rows[0] })
  } catch (e) {
    next(e)
  }
})

adminRouter.delete('/hotels/:id', async (req, res, next) => {
  try {
    await pool.query(`DELETE FROM hotels WHERE id=$1`, [req.params.id])
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

adminRouter.get('/bookings', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT b.*, u.full_name, u.email
      FROM bookings b
      JOIN users u ON u.id = b.user_id
      ORDER BY b.created_at DESC
    `)
    res.json({ items: rows })
  } catch (e) {
    next(e)
  }
})

adminRouter.post('/bookings/:id/status', async (req, res, next) => {
  try {
    const status = String(req.body.status || '')
    if (!['pending', 'approved', 'rejected', 'cancelled', 'completed'].includes(status)) {
      throw new HttpError(400, 'Invalid status')
    }
    const { rows } = await pool.query(
      `UPDATE bookings SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING id,status,updated_at`,
      [status, req.params.id],
    )
    if (!rows[0]) throw new HttpError(404, 'Booking not found')
    res.json({ item: rows[0] })
  } catch (e) {
    next(e)
  }
})

adminRouter.get('/reviews', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT r.*, u.full_name
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      ORDER BY r.created_at DESC
    `)
    res.json({ items: rows })
  } catch (e) {
    next(e)
  }
})

adminRouter.post('/reviews/:id/approve', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `UPDATE reviews SET is_approved = TRUE WHERE id=$1 RETURNING id,is_approved`,
      [req.params.id],
    )
    if (!rows[0]) throw new HttpError(404, 'Review not found')
    res.json({ item: rows[0] })
  } catch (e) {
    next(e)
  }
})

adminRouter.delete('/reviews/:id', async (req, res, next) => {
  try {
    await pool.query(`DELETE FROM reviews WHERE id=$1`, [req.params.id])
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

adminRouter.get('/ai-logs', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT c.*, u.email
      FROM chatbot_logs c
      LEFT JOIN users u ON u.id = c.user_id
      ORDER BY c.created_at DESC
      LIMIT 300
    `)
    res.json({ items: rows })
  } catch (e) {
    next(e)
  }
})

module.exports = { adminRouter }

