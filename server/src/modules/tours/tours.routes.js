const express = require('express')
const { pool } = require('../../db/pool')

const toursRouter = express.Router()

toursRouter.get('/', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim()
    const where = []
    const values = []
    let i = 1
    if (q) {
      where.push(`(t.title ILIKE $${i} OR d.title ILIKE $${i} OR d.country ILIKE $${i})`)
      values.push(`%${q}%`)
      i++
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
    const { rows } = await pool.query(
      `
      SELECT t.id, t.slug, t.title, t.duration_days, t.price_usd, t.hotel_included, t.transport, t.description,
             d.slug AS destination_slug, d.title AS destination_title, d.country
      FROM tours t
      JOIN destinations d ON d.id = t.destination_id
      ${whereSql}
      ORDER BY t.price_usd ASC
    `,
      values,
    )
    res.json({ items: rows })
  } catch (e) {
    next(e)
  }
})

module.exports = { toursRouter }

