const express = require('express')
const { pool } = require('../../db/pool')

const hotelsRouter = express.Router()

hotelsRouter.get('/', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim()
    const where = []
    const values = []
    let i = 1
    if (q) {
      where.push(`(h.name ILIKE $${i} OR d.title ILIKE $${i} OR d.country ILIKE $${i})`)
      values.push(`%${q}%`)
      i++
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

    const { rows } = await pool.query(
      `
      SELECT h.id, h.slug, h.name, h.stars, h.price_per_night_usd, h.address, h.description,
             d.slug AS destination_slug, d.title AS destination_title, d.country
      FROM hotels h
      JOIN destinations d ON d.id = h.destination_id
      ${whereSql}
      ORDER BY h.price_per_night_usd ASC
    `,
      values,
    )
    res.json({ items: rows })
  } catch (e) {
    next(e)
  }
})

module.exports = { hotelsRouter }

