/* ═══════════════════════════════════════════════════════════════════
   HydroTrack Auth Server — Entry Point
   Uses in-memory MongoDB if MONGO_URI is not set in .env
   ═══════════════════════════════════════════════════════════════════ */

require('dotenv').config()
const express    = require('express')
const cors       = require('cors')
const cookieParser = require('cookie-parser')
const rateLimit  = require('express-rate-limit')
const mongoose   = require('mongoose')
const authRoutes = require('./routes/auth')

const app  = express()
const PORT = process.env.PORT || 5001

/* ── CORS ──────────────────────────────────────────────────────────── */
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}))

/* ── Body / Cookie parsers ─────────────────────────────────────────── */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

/* ── Global rate limiter ───────────────────────────────────────────── */
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
}))

/* ── Routes ────────────────────────────────────────────────────────── */
app.use('/api/auth', authRoutes)

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }))

/* ── DB + Server bootstrap ─────────────────────────────────────────── */
async function startServer() {
  let mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    console.log('⚡  No MONGO_URI found — booting in-memory MongoDB...')
    const { MongoMemoryServer } = require('mongodb-memory-server')
    const memServer = await MongoMemoryServer.create()
    mongoUri = memServer.getUri()
    console.log('✅  In-memory MongoDB ready:', mongoUri)
  }

  await mongoose.connect(mongoUri, {
    dbName: 'hydrotrack',
    serverSelectionTimeoutMS: 5000,
  })
  console.log('🗄️   MongoDB connected')

  app.listen(PORT, () => {
    console.log(`🚀  HydroTrack Auth API running on http://localhost:${PORT}`)
    console.log(`    Endpoints: POST /api/auth/{register|login|logout|refresh} | GET /api/auth/me`)
  })
}

startServer().catch(err => {
  console.error('❌  Failed to start server:', err)
  process.exit(1)
})
