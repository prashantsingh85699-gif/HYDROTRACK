/* ═══════════════════════════════════════════════════════════════════
   User Model — Mongoose schema with bcrypt password hashing
   ═══════════════════════════════════════════════════════════════════ */

const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name must be at most 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // never returned in queries by default
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
)

/* ── Hash password before save ─────────────────────────────────────── */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

/* ── Instance method: compare password ─────────────────────────────── */
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

/* ── Sanitise output: strip password from toJSON/toObject ─────────── */
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password
    delete ret.refreshToken
    return ret
  },
})

module.exports = mongoose.model('User', userSchema)
