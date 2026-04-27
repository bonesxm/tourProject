const express = require('express')
const { z } = require('zod')
const { pool } = require('../../db/pool')
const { validateBody } = require('../../lib/validate')
const { HttpError } = require('../../lib/errors')
const { requireAuth, requireRole } = require('../../lib/auth')

const destinationsRouter = express.Router()

destinationsRouter.get('/', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim()
    const limit = Math.min(Number(req.query.limit || 24) || 24, 100)
    const offset = Math.max(Number(req.query.offset || 0) || 0, 0)
    const country = String(req.query.country || '').trim()

    const where = []
    const values = []
    let i = 1

    if (q) {
      where.push(`(title ILIKE $${i} OR city ILIKE $${i} OR country ILIKE $${i})`)
      values.push(`%${q}%`)
      i++
    }
    if (country) {
      where.push(`country = $${i}`)
      values.push(country)
      i++
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

    const { rows } = await pool.query(
      `
      SELECT id, slug, title, country, city, description, price_from_usd, rating, hero_image_url
      FROM destinations
      ${whereSql}
      ORDER BY rating DESC, price_from_usd ASC
      LIMIT $${i} OFFSET $${i + 1}
    `,
      [...values, limit, offset],
    )

    res.json({ items: rows, limit, offset })
  } catch (e) {
    next(e)
  }
})

destinationsRouter.get('/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug
    const { rows } = await pool.query(
      `
      SELECT id, slug, title, country, city, description, price_from_usd, rating, hero_image_url
      FROM destinations
      WHERE slug = $1
      LIMIT 1
    `,
      [slug],
    )
    const item = rows[0]
    if (!item) return next(new HttpError(404, 'Destination not found', { code: 'DESTINATION_NOT_FOUND' }))
    res.json({ item })
  } catch (e) {
    next(e)
  }
})

const upsertSchema = z.object({
  slug: z.string().min(2).max(80),
  title: z.string().min(2).max(120),
  country: z.string().min(2).max(120),
  city: z.string().min(0).max(120).optional(),
  description: z.string().min(0).max(2000).optional(),
  priceFromUsd: z.number().int().min(0).max(1_000_000),
  rating: z.number().min(0).max(5),
  heroImageUrl: z.string().url().optional(),
})

// Admin-only (role=admin). For now: token kind must be admin and role must be admin.
destinationsRouter.post(
  '/',
  requireAuth(),
  requireRole(['admin']),
  validateBody(upsertSchema),
  async (req, res, next) => {
    try {
      const d = req.body
      const { rows } = await pool.query(
        `
        INSERT INTO destinations (slug, title, country, city, description, price_from_usd, rating, hero_image_url)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          country = EXCLUDED.country,
          city = EXCLUDED.city,
          description = EXCLUDED.description,
          price_from_usd = EXCLUDED.price_from_usd,
          rating = EXCLUDED.rating,
          hero_image_url = EXCLUDED.hero_image_url,
          updated_at = NOW()
        RETURNING id, slug, title, country, city, description, price_from_usd, rating, hero_image_url
      `,
        [
          d.slug,
          d.title,
          d.country,
          d.city || null,
          d.description || null,
          d.priceFromUsd,
          d.rating,
          d.heroImageUrl || null,
        ],
      )
      res.status(201).json({ item: rows[0] })
    } catch (e) {
      next(e)
    }
  },
)

module.exports = { destinationsRouter }

