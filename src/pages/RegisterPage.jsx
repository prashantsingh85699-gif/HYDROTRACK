/* ═══════════════════════════════════════════════════════════════════
   RegisterPage — Water-themed registration with password strength meter
   ═══════════════════════════════════════════════════════════════════ */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

/* ── Password strength calculator ───────────────────────────────────── */
function getStrength(pw) {
  let score = 0
  if (!pw) return { score: 0, label: '', color: '#e0e0e0' }
  if (pw.length >= 8)  score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  if (score <= 1) return { score: 1, label: 'Weak',      color: '#e74c3c' }
  if (score === 2) return { score: 2, label: 'Fair',      color: '#f39c12' }
  if (score === 3) return { score: 3, label: 'Good',      color: '#00B4D8' }
  if (score === 4) return { score: 4, label: 'Strong',    color: '#0077B6' }
  return               { score: 5, label: 'Very Strong', color: '#023e8a' }
}

/* ── Styles ─────────────────────────────────────────────────────────── */
const S = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #CAF0F8 0%, #ADE8F4 40%, #ffffff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    fontFamily: "'Inter', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  bubble: (size, top, left, delay) => ({
    position: 'absolute',
    width: size, height: size,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, rgba(0,180,216,0.2), rgba(0,119,182,0.06))',
    top, left,
    animation: `bubbleFloat 7s ease-in-out ${delay}s infinite alternate`,
    pointerEvents: 'none',
  }),
  card: {
    background: 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRadius: '2rem',
    border: '1px solid rgba(0,180,216,0.25)',
    boxShadow: '0 8px 48px rgba(0,119,182,0.15), 0 2px 12px rgba(0,180,216,0.1)',
    padding: '2.5rem 2.5rem',
    width: '100%',
    maxWidth: 460,
    position: 'relative',
    zIndex: 10,
  },
  logo: { display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' },
  logoIcon: {
    width: 42, height: 42,
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #0077B6, #00B4D8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.3rem',
    boxShadow: '0 4px 16px rgba(0,119,182,0.35)',
  },
  logoText: {
    fontSize: '1.45rem', fontWeight: 800,
    background: 'linear-gradient(135deg, #0077B6, #00B4D8)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    letterSpacing: '-0.03em',
  },
  heading:    { fontSize: '1.6rem', fontWeight: 700, color: '#03045E', marginTop: '1.5rem', marginBottom: '0.35rem' },
  subheading: { fontSize: '0.88rem', color: '#48CAE4', marginBottom: '1.75rem', fontWeight: 500 },
  fieldWrap:  { position: 'relative', marginBottom: '1.3rem' },
  input: (focused, hasError) => ({
    width: '100%',
    padding: '1.05rem 1rem 0.45rem',
    border: `1.5px solid ${hasError ? '#e74c3c' : focused ? '#0077B6' : 'rgba(0,180,216,0.3)'}`,
    borderRadius: '0.9rem',
    background: 'rgba(255,255,255,0.9)',
    fontSize: '0.95rem', color: '#03045E',
    outline: 'none', transition: 'border-color 0.25s, box-shadow 0.25s',
    boxShadow: focused
      ? `0 0 0 3px ${hasError ? 'rgba(231,76,60,0.12)' : 'rgba(0,119,182,0.12)'}`
      : 'none',
    fontFamily: "'Inter', sans-serif",
  }),
  label: (focused, hasValue, hasError) => ({
    position: 'absolute', left: '1rem',
    top: focused || hasValue ? '0.45rem' : '50%',
    transform: focused || hasValue ? 'translateY(0)' : 'translateY(-50%)',
    fontSize: focused || hasValue ? '0.7rem' : '0.9rem',
    fontWeight: 600,
    color: hasError ? '#e74c3c' : focused ? '#0077B6' : '#90E0EF',
    transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
    pointerEvents: 'none',
    letterSpacing: focused || hasValue ? '0.05em' : 0,
    textTransform: focused || hasValue ? 'uppercase' : 'none',
  }),
  eyeBtn: {
    position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: '#90E0EF',
    display: 'flex', padding: 4,
  },
  fieldError: { color: '#e74c3c', fontSize: '0.75rem', marginTop: '0.3rem', fontWeight: 500, paddingLeft: '0.2rem' },
  strengthWrap: { marginTop: '-0.6rem', marginBottom: '1.3rem' },
  strengthBars: { display: 'flex', gap: 4, marginBottom: '0.3rem' },
  strengthBar: (active, color) => ({
    height: 5, flex: 1, borderRadius: 10,
    background: active ? color : 'rgba(0,180,216,0.15)',
    transition: 'background 0.35s ease',
  }),
  strengthLabel: (color) => ({ fontSize: '0.75rem', fontWeight: 700, color, letterSpacing: '0.05em' }),
  checkLabel: {
    display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
    cursor: 'pointer', fontSize: '0.83rem', color: '#0077B6',
    fontWeight: 500, userSelect: 'none', marginBottom: '1.5rem',
    lineHeight: 1.5,
  },
  btn: (loading) => ({
    width: '100%', padding: '0.9rem', borderRadius: '0.9rem', border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer',
    background: loading
      ? 'linear-gradient(135deg, #90E0EF, #ADE8F4)'
      : 'linear-gradient(135deg, #0077B6, #00B4D8)',
    color: '#fff', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.02em',
    transition: 'all 0.25s',
    boxShadow: loading ? 'none' : '0 4px 20px rgba(0,119,182,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    fontFamily: "'Inter', sans-serif",
  }),
  errorBanner: {
    background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.3)',
    borderRadius: '0.75rem', padding: '0.7rem 1rem', color: '#c0392b',
    fontSize: '0.85rem', fontWeight: 500, marginBottom: '1.25rem',
    display: 'flex', alignItems: 'center', gap: '0.5rem',
  },
  loginLink: { textAlign: 'center', fontSize: '0.88rem', color: '#48CAE4', marginTop: '1.25rem' },
  loginLinkA: { color: '#0077B6', fontWeight: 700, textDecoration: 'none' },
}

/* ── Floating label input ───────────────────────────────────────────── */
function FloatInput({ id, label, type = 'text', value, onChange, error, autoComplete, hint }) {
  const [focused, setFocused] = useState(false)
  const [showPw, setShowPw]   = useState(false)
  const isPassword = type === 'password'
  const inputType  = isPassword ? (showPw ? 'text' : 'password') : type

  return (
    <div style={S.fieldWrap}>
      <input
        id={id} type={inputType} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        style={S.input(focused, !!error)}
      />
      <label htmlFor={id} style={S.label(focused, !!value, !!error)}>{label}</label>
      {isPassword && (
        <button type="button" style={S.eyeBtn} onClick={() => setShowPw(p => !p)}
          tabIndex={-1} aria-label={showPw ? 'Hide' : 'Show'}>
          {showPw ? '🙈' : '👁️'}
        </button>
      )}
      {error && <p style={S.fieldError}>{error}</p>}
    </div>
  )
}

/* ── Password strength meter ─────────────────────────────────────────── */
function StrengthMeter({ password }) {
  const { score, label, color } = getStrength(password)
  if (!password) return null
  return (
    <div style={S.strengthWrap}>
      <div style={S.strengthBars}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={S.strengthBar(i <= score, color)} />
        ))}
      </div>
      <span style={S.strengthLabel(color)}>{label}</span>
    </div>
  )
}

/* ── Spinner ─────────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <span style={{
      width: 18, height: 18,
      border: '2.5px solid rgba(255,255,255,0.4)',
      borderTop: '2.5px solid #fff',
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'spin 0.7s linear infinite',
    }} />
  )
}

/* ── Main component ──────────────────────────────────────────────────── */
export default function RegisterPage() {
  const navigate    = useNavigate()
  const { register } = useAuth()

  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [agreed, setAgreed]       = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [shake, setShake]         = useState(false)
  const [fieldErrors, setFE]      = useState({})

  function validate() {
    const errs = {}
    if (!name || name.trim().length < 2)              errs.name     = 'Name must be at least 2 characters'
    if (!email || !/\S+@\S+\.\S+/.test(email))       errs.email    = 'Enter a valid email address'
    if (!password || password.length < 8)             errs.password = 'Password must be at least 8 characters'
    else if (!/[A-Z]/.test(password))                 errs.password = 'Must contain an uppercase letter'
    else if (!/[0-9]/.test(password))                 errs.password = 'Must contain a number'
    if (confirm !== password)                          errs.confirm  = 'Passwords do not match'
    if (!agreed)                                       errs.agreed   = 'You must accept the terms'
    return errs
  }

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setFE(errs); triggerShake(); return }
    setFE({})
    setError('')
    setLoading(true)
    try {
      await register({ name: name.trim(), email, password, confirmPassword: confirm })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={S.page}>
      {/* Decorative bubbles */}
      <div style={S.bubble('260px', '-70px', '-50px', 0)} />
      <div style={S.bubble('160px', '65%', '-30px', 1.2)} />
      <div style={S.bubble('200px', '65%', '78%', 0.6)} />
      <div style={S.bubble('100px', '-20px', '70%', 2)} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes bubbleFloat { from { transform: translateY(0) scale(1); } to { transform: translateY(-20px) scale(1.04); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shakeX {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-10px); }
          40%     { transform: translateX(10px); }
          60%     { transform: translateX(-8px); }
          80%     { transform: translateX(8px); }
        }
        .reg-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,119,182,0.5) !important; }
        .reg-btn:active:not(:disabled) { transform: translateY(0); }
        .login-anchor:hover { text-decoration: underline; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          ...S.card,
          animation: shake ? 'shakeX 0.5s ease' : 'none',
        }}
      >
        {/* Logo */}
        <div style={S.logo}>
          <div style={S.logoIcon}>💧</div>
          <span style={S.logoText}>HYDROTRACK</span>
        </div>

        <h1 style={S.heading}>Create your account</h1>
        <p style={S.subheading}>Start monitoring water quality in seconds</p>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={S.errorBanner}
            >
              <span>⚠️</span> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} noValidate>
          <FloatInput
            id="reg-name" label="Full name"
            value={name} onChange={v => { setName(v); setFE(p => ({ ...p, name: '' })) }}
            error={fieldErrors.name} autoComplete="name"
          />
          <FloatInput
            id="reg-email" label="Email address" type="email"
            value={email} onChange={v => { setEmail(v); setFE(p => ({ ...p, email: '' })) }}
            error={fieldErrors.email} autoComplete="email"
          />
          <FloatInput
            id="reg-password" label="Password" type="password"
            value={password} onChange={v => { setPassword(v); setFE(p => ({ ...p, password: '' })) }}
            error={fieldErrors.password} autoComplete="new-password"
          />

          {/* Password strength meter */}
          <StrengthMeter password={password} />

          <FloatInput
            id="reg-confirm" label="Confirm password" type="password"
            value={confirm} onChange={v => { setConfirm(v); setFE(p => ({ ...p, confirm: '' })) }}
            error={fieldErrors.confirm} autoComplete="new-password"
          />

          {/* Terms */}
          <label style={{
            ...S.checkLabel,
            color: fieldErrors.agreed ? '#e74c3c' : '#0077B6',
          }}>
            <input
              type="checkbox"
              id="reg-terms"
              checked={agreed}
              onChange={e => { setAgreed(e.target.checked); setFE(p => ({ ...p, agreed: '' })) }}
              style={{ accentColor: '#0077B6', width: 15, height: 15, marginTop: 2, flexShrink: 0 }}
            />
            I agree to the{' '}
            <a href="#terms" style={{ color: '#00B4D8', fontWeight: 700 }}>Terms of Service</a>
            {' '}and{' '}
            <a href="#privacy" style={{ color: '#00B4D8', fontWeight: 700 }}>Privacy Policy</a>
            {fieldErrors.agreed && (
              <span style={{ color: '#e74c3c', fontSize: '0.75rem', display: 'block' }}>
                {fieldErrors.agreed}
              </span>
            )}
          </label>

          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            style={S.btn(loading)}
            className="reg-btn"
          >
            {loading ? <><Spinner /> Creating account…</> : '💧 Create Account'}
          </button>
        </form>

        <p style={S.loginLink}>
          Already have an account?{' '}
          <Link to="/login" style={S.loginLinkA} className="login-anchor">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
