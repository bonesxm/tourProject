const express = require('express')
const { z } = require('zod')
const { pool } = require('../../db/pool')
const { requireAuth, requireRole } = require('../../lib/auth')
const { validateBody } = require('../../lib/validate')
const { HttpError } = require('../../lib/errors')

const bookingsRouter = express.Router()

bookingsRouter.get('/my', requireAuth(), requireRole(['user']), async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT id, user_id, tour_id, hotel_id, status, total_usd, notes, created_at, updated_at
      FROM bookings
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
      [req.user.sub],
    )
    res.json({ items: rows })
  } catch (e) {
    next(e)
  }
})

const createSchema = z.object({
  tourId: z.string().uuid().optional(),
  hotelId: z.string().uuid().optional(),
  totalUsd: z.number().int().min(0),
  notes: z.string().max(1000).optional(),
})

bookingsRouter.post(
  '/',
  requireAuth(),
  requireRole(['user']),
  validateBody(createSchema),
  async (req, res, next) => {
    try {
      const b = req.body
      if (!b.tourId && !b.hotelId) {
        throw new HttpError(400, 'Provide tourId or hotelId')
      }
      const { rows } = await pool.query(
        `
      INSERT INTO bookings (user_id, tour_id, hotel_id, status, total_usd, notes)
      VALUES ($1,$2,$3,'pending',$4,$5)
      RETURNING id, user_id, tour_id, hotel_id, status, total_usd, notes, created_at
    `,
        [req.user.sub, b.tourId || null, b.hotelId || null, b.totalUsd, b.notes || null],
      )
      res.status(201).json({ item: rows[0] })
    } catch (e) {
      next(e)
    }
  },
)

bookingsRouter.post('/:id/cancel', requireAuth(), requireRole(['user']), async (req, res, next) => {
  try {
    const id = req.params.id
    const { rows } = await pool.query(
      `
      UPDATE bookings
      SET status = 'cancelled', updated_at = NOW()
      WHERE id = $1 AND user_id = $2
      RETURNING id, status, updated_at
    `,
      [id, req.user.sub],
    )
    if (!rows[0]) throw new HttpError(404, 'Booking not found')
    res.json({ item: rows[0] })
  } catch (e) {
    next(e)
  }
})

module.exports = { bookingsRouter }

