const { pool } = require('./pool')

async function migrate() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Core extensions (uuid)
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

    // Users & admins
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
        avatar_url TEXT,
        phone TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    // Destinations
    await client.query(`
      CREATE TABLE IF NOT EXISTS destinations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        country TEXT NOT NULL,
        city TEXT,
        description TEXT,
        price_from_usd INTEGER NOT NULL DEFAULT 0,
        rating NUMERIC(2,1) NOT NULL DEFAULT 0,
        hero_image_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    // Tours
    await client.query(`
      CREATE TABLE IF NOT EXISTS tours (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        duration_days INTEGER NOT NULL,
        price_usd INTEGER NOT NULL,
        hotel_included BOOLEAN NOT NULL DEFAULT TRUE,
        transport TEXT,
        description TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    // Hotels
    await client.query(`
      CREATE TABLE IF NOT EXISTS hotels (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        stars INTEGER NOT NULL DEFAULT 3,
        price_per_night_usd INTEGER NOT NULL,
        address TEXT,
        description TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    // Bookings & payments
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tour_id UUID REFERENCES tours(id) ON DELETE SET NULL,
        hotel_id UUID REFERENCES hotels(id) ON DELETE SET NULL,
        status TEXT NOT NULL DEFAULT 'pending', -- pending|approved|rejected|cancelled|completed
        total_usd INTEGER NOT NULL DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
        provider TEXT NOT NULL DEFAULT 'demo',
        amount_usd INTEGER NOT NULL,
        currency TEXT NOT NULL DEFAULT 'USD',
        status TEXT NOT NULL DEFAULT 'created', -- created|paid|failed|refunded
        external_id TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    // Reviews
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
        tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        text TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    // Favorites
    await client.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, destination_id)
      );
    `)

    // Notifications
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    // Chatbot logs
    await client.query(`
      CREATE TABLE IF NOT EXISTS chatbot_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        message TEXT NOT NULL,
        response TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    await client.query('COMMIT')
    // eslint-disable-next-line no-console
    console.log('Migration completed')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
    await pool.end()
  }
}

migrate().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('Migration failed', e)
  process.exit(1)
})

