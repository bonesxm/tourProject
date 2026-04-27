const bcrypt = require('bcrypt')
const { pool } = require('./pool')

module.exports = async function seedRunner() {
  const adminPass = await bcrypt.hash('Admin123!', 10)
  await pool.query(
    `
    INSERT INTO admins (email, password_hash, full_name)
    VALUES ($1, $2, $3)
    ON CONFLICT (email) DO NOTHING
  `,
    ['admin@smarttourism.local', adminPass, 'Platform Admin'],
  )

  const userPass = await bcrypt.hash('User123!', 10)
  await pool.query(
    `
    INSERT INTO users (email, password_hash, full_name)
    VALUES ($1, $2, $3)
    ON CONFLICT (email) DO NOTHING
  `,
    ['user@smarttourism.local', userPass, 'Demo User'],
  )

  const destinations = [
    {
      slug: 'almaty',
      title: 'Almaty',
      country: 'Kazakhstan',
      city: 'Almaty',
      description: 'Mountains, cafes, and vibrant city life with easy access to Shymbulak.',
      price_from_usd: 120,
      rating: 4.8,
    },
    {
      slug: 'istanbul',
      title: 'Istanbul',
      country: 'Türkiye',
      city: 'Istanbul',
      description: 'Historic districts, Bosphorus cruises, and world-class cuisine.',
      price_from_usd: 190,
      rating: 4.7,
    },
    {
      slug: 'dubai',
      title: 'Dubai',
      country: 'UAE',
      city: 'Dubai',
      description: 'Luxury shopping, iconic architecture, desert adventures.',
      price_from_usd: 260,
      rating: 4.9,
    },
    {
      slug: 'baku',
      title: 'Baku',
      country: 'Azerbaijan',
      city: 'Baku',
      description: 'Caspian seafront, modern skyline, and Old City charm.',
      price_from_usd: 140,
      rating: 4.6,
    },
  ]

  for (const d of destinations) {
    await pool.query(
      `
      INSERT INTO destinations (slug, title, country, city, description, price_from_usd, rating)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        country = EXCLUDED.country,
        city = EXCLUDED.city,
        description = EXCLUDED.description,
        price_from_usd = EXCLUDED.price_from_usd,
        rating = EXCLUDED.rating,
        updated_at = NOW()
    `,
      [d.slug, d.title, d.country, d.city, d.description, d.price_from_usd, d.rating],
    )
  }
}

