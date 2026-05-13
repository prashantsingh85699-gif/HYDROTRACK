/* ═══════════════════════════════════════════════════════════════════
   JWT Auth Middleware — Verifies Bearer access token on protected routes
   ═══════════════════════════════════════════════════════════════════ */

const jwt  = require('jsonwebtoken')
const User = require('../models/User')

async function verifyAccessToken(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' })
  }

  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    // Attach minimal user payload to request
    req.user = { id: decoded.id, email: decoded.email, name: decoded.name }
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Access token expired' })
    }
    return res.status(401).json({ success: false, message: 'Invalid access token' })
  }
}

module.exports = { verifyAccessToken }
