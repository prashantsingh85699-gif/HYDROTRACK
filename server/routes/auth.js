/* ═══════════════════════════════════════════════════════════════════
   Auth Routes — /api/auth/*
   POST /register  POST /login  POST /logout  POST /refresh  GET /me
   ═══════════════════════════════════════════════════════════════════ */

const express   = require('express')
const jwt       = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const User      = require('../models/User')
const { verifyAccessToken } = require('../middleware/auth')

const router = express.Router()

/* ── Token helpers ─────────────────────────────────────────────────── */
function signAccessToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  )
}

function signRefreshToken(user) {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )
}

function setRefreshCookie(res, token) {
  res.cookie('hydrotrack_rt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth/refresh',
  })
}

function clearRefreshCookie(res) {
  res.clearCookie('hydrotrack_rt', { path: '/api/auth/refresh' })
}

/* ── POST /api/auth/register ──────────────────────────────────────── */
router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
      .matches(/[0-9]/).withMessage('Password must contain a number'),
    body('confirmPassword').custom((val, { req }) => {
      if (val !== req.body.password) throw new Error('Passwords do not match')
      return true
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    try {
      const { name, email, password } = req.body

      const existing = await User.findOne({ email })
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email already registered' })
      }

      const user = await User.create({ name, email, password })

      const accessToken  = signAccessToken(user)
      const refreshToken = signRefreshToken(user)

      // Store refresh token hash in DB
      user.refreshToken = refreshToken
      await user.save()

      setRefreshCookie(res, refreshToken)

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        accessToken,
        user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
      })
    } catch (err) {
      console.error('Register error:', err)
      return res.status(500).json({ success: false, message: 'Server error during registration' })
    }
  }
)

/* ── POST /api/auth/login ─────────────────────────────────────────── */
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    try {
      const { email, password } = req.body

      const user = await User.findOne({ email }).select('+password +refreshToken')
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' })
      }

      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' })
      }

      const accessToken  = signAccessToken(user)
      const refreshToken = signRefreshToken(user)

      user.refreshToken = refreshToken
      await user.save()

      setRefreshCookie(res, refreshToken)

      return res.json({
        success: true,
        message: 'Login successful',
        accessToken,
        user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
      })
    } catch (err) {
      console.error('Login error:', err)
      return res.status(500).json({ success: false, message: 'Server error during login' })
    }
  }
)

/* ── POST /api/auth/logout ────────────────────────────────────────── */
router.post('/logout', verifyAccessToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null })
    clearRefreshCookie(res)
    return res.json({ success: true, message: 'Logged out successfully' })
  } catch (err) {
    console.error('Logout error:', err)
    return res.status(500).json({ success: false, message: 'Server error during logout' })
  }
})

/* ── POST /api/auth/refresh ───────────────────────────────────────── */
router.post('/refresh', async (req, res) => {
  const token = req.cookies?.hydrotrack_rt
  if (!token) {
    return res.status(401).json({ success: false, message: 'No refresh token' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    const user    = await User.findById(decoded.id).select('+refreshToken')

    if (!user || user.refreshToken !== token) {
      clearRefreshCookie(res)
      return res.status(401).json({ success: false, message: 'Invalid refresh token' })
    }

    // Rotate refresh token
    const newAccess  = signAccessToken(user)
    const newRefresh = signRefreshToken(user)

    user.refreshToken = newRefresh
    await user.save()

    setRefreshCookie(res, newRefresh)

    return res.json({
      success: true,
      accessToken: newAccess,
      user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
    })
  } catch (err) {
    clearRefreshCookie(res)
    return res.status(401).json({ success: false, message: 'Refresh token expired or invalid' })
  }
})

/* ── GET /api/auth/me ─────────────────────────────────────────────── */
router.get('/me', verifyAccessToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    return res.json({ success: true, user })
  } catch (err) {
    console.error('Me error:', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

module.exports = router
