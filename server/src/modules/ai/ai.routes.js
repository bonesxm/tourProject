const express = require('express')
const { z } = require('zod')
const { env } = require('../../lib/env')
const { validateBody } = require('../../lib/validate')
const { pool } = require('../../db/pool')
const { verifyAccessToken } = require('../../lib/jwt')

const aiRouter = express.Router()

const chatSchema = z.object({
  message: z.string().min(2).max(2000),
})

async function askModel(message) {
  if (!env.OPENAI_API_KEY) {
    return `Demo assistant: based on your request "${message.slice(0, 120)}", I suggest Almaty for mountains, Istanbul for culture, or Dubai for luxury.`
  }

  const resp = await fetch(`${env.OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a tourism assistant. Provide concise travel recommendations and practical planning tips.',
        },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
    }),
  })
  if (!resp.ok) {
    throw new Error(`OpenAI request failed with ${resp.status}`)
  }
  const json = await resp.json()
  return json.choices?.[0]?.message?.content || 'No response'
}

aiRouter.post('/chat', validateBody(chatSchema), async (req, res, next) => {
  try {
    let userId = null
    const auth = req.header('authorization') || ''
    const [scheme, token] = auth.split(' ')
    if (scheme === 'Bearer' && token) {
      try {
        const payload = verifyAccessToken(token)
        userId = payload?.sub || null
      } catch {
        userId = null
      }
    }

    const message = req.body.message
    const answer = await askModel(message)

    await pool.query(
      `INSERT INTO chatbot_logs (user_id, message, response) VALUES ($1,$2,$3)`,
      [userId, message, answer],
    )

    res.json({ answer })
  } catch (e) {
    next(e)
  }
})

module.exports = { aiRouter }

