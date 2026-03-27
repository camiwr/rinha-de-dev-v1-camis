import { Pool } from 'pg'

export const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  user:     process.env.DB_USER     || 'admin',
  password: process.env.DB_PASS     || '123',
  database: process.env.DB_NAME     || 'rinha',

  max: 10,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 3_000,

})

pool.on('error', (err) => {
  process.stderr.write(`Pool error: ${err.message}\n`)
})