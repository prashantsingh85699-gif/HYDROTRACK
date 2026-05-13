/* ═══════════════════════════════════════════════════════════════════
   LoginPage — Water-themed glassmorphism auth card
   ═══════════════════════════════════════════════════════════════════ */

import { useState, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

/* ── Inline styles (water theme) ────────────────────────────────────── */
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
    background: 'radial-gradient(circle at 30% 30%, rgba(0,180,216,0.25), rgba(0,119,182,0.08))',
    top, left,
    animation: `bubbleFloat 6s ease-in-out ${delay}s infinite alternate`,
    pointerEvents: 'none',
  }),
  card: {
    background: 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRadius: '2rem',
    border: '1px solid rgba(0,180,216,0.25)',
    boxShadow: '0 8px 48px rgba(0,119,182,0.15), 0 2px 12px rgba(0,180,216,0.1)',
    padding: '2.75rem 2.5rem',
    width: '100%',
    maxWidth: 440,
    position: 'relative',
    zIndex: 10,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    marginBottom: '0.5rem',
  },
  logoIcon: {
    width: 42, height: 42,
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #0077B6, #00B4D8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.3rem',
    boxShadow: '0 4px 16px rgba(0,119,182,0.35)',
  },
  logoText: {
    fontSize: '1.45rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #0077B6, #00B4D8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.03em',
  },
  heading: {
    fontSize: '1.6rem',
    fontWeight: 700,
    color: '#03045E',
    marginTop: '1.5rem',
    marginBottom: '0.35rem',
  },
  subheading: {
    fontSize: '0.88rem',
    color: '#48CAE4',
    marginBottom: '2rem',
    fontWeight: 500,
  },
  fieldWrap: {
    position: 'relative',
    marginBottom: '1.4rem',
  },
  input: (focused, hasError) => ({
    width: '100%',
    padding: '1.05rem 1rem 0.45rem',
    border: `1.5px solid ${hasError ? '#e74c3c' : focused ? '#0077B6' : 'rgba(0,180,216,0.3)'}`,
    borderRadius: '0.9rem',
    background: 'rgba(255,255,255,0.9)',
    fontSize: '0.95rem',
    color: '#03045E',
    outline: 'none',
    transition: 'border-color 0.25s, box-shadow 0.25s',
    boxShadow: focused
      ? `0 0 0 3px ${hasError ? 'rgba(231,76,60,0.12)' : 'rgba(0,119,182,0.12)'}`
      : 'none',
    fontFamily: "'Inter', sans-serif",
  }),
  label: (focused, hasValue, hasError) => ({
    position: 'absolute',
    left: '1rem',
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
    position: 'absolute',
    right: '0.9rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#90E0EF',
    display: 'flex',
    padding: 4,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.6rem',
    gap: '0.5rem',
  },
  checkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.84rem',
    color: '#0077B6',
    fontWeight: 500,
    userSelect: 'none',
  },
  forgotLink: {
    fontSize: '0.84rem',
    color: '#00B4D8',
    fontWeight: 600,
    textDecoration: 'none',
  },
  btn: (loading) => ({
    width: '100%',
    padding: '0.9rem',
    borderRadius: '0.9rem',
    border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer',
    background: loading
      ? 'linear-gradient(135deg, #90E0EF, #ADE8F4)'
      : 'linear-gradient(135deg, #0077B6, #00B4D8)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: '0.02em',
    transition: 'all 0.25s',
    boxShadow: loading ? 'none' : '0 4px 20px rgba(0,119,182,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: "'Inter', sans-serif",
  }),
  errorBanner: {
    background: 'rgba(231,76,60,0.08)',
    border: '1px solid rgba(231,76,60,0.3)',
    borderRadius: '0.75rem',
    padding: '0.7rem 1rem',
    color: '#c0392b',
    fontSize: '0.85rem',
    fontWeight: 500,
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  fieldError: {
    color: '#e74c3c',
    fontSize: '0.75rem',
    marginTop: '0.3rem',
    fontWeight: 500,
    paddingLeft: '0.2rem',
  },
  divider: {
    textAlign: 'center',
    margin: '1.5rem 0 1.25rem',
    position: 'relative',
    color: '#90E0EF',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  registerLink: {
    textAlign: 'center',
    fontSize: '0.88rem',
    color: '#48CAE4',
  },
  registerLinkA: {
    color: '#0077B6',
    fontWeight: 700,
    textDecoration: 'none',
  },
}

/* ── Floating label input ───────────────────────────────────────────── */
function FloatInput({ id, label, type = 'text', value, onChange, error, autoComplete }) {
  const [focused, setFocused] = useState(false)
  const [showPw, setShowPw]   = useState(false)
  const isPassword = type === 'password'
  const inputType  = isPassword ? (showPw ? 'text' : 'password') : type

  return (
    <div style={S.fieldWrap}>
      <input
        id={id}
        type={inputType}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        style={S.input(focused, !!error)}
      />
      <label htmlFor={id} style={S.label(focused, !!value, !!error)}>{label}</label>
      {isPassword && (
        <button
          type="button"
          style={S.eyeBtn}
          onClick={() => setShowPw(p => !p)}
          tabIndex={-1}
          aria-label={showPw ? 'Hide password' : 'Show password'}
        >
          {showPw ? '🙈' : '👁️'}
        </button>
      )}
      {error && <p style={S.fieldError}>{error}</p>}
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
export default function LoginPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { login } = useAuth()
  const from      = location.state?.from?.pathname ?? '/dashboard'

  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [remember, setRemember]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [shake, setShake]         = useState(false)
  const [fieldErrors, setFE]      = useState({})

  function validate() {
    const errs = {}
    if (!email)                              errs.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email))   errs.email    = 'Enter a valid email'
    if (!password)                           errs.password = 'Password is required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setFE(errs); triggerShake(); return }
    setFE({})
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }

  return (
    <div style={S.page}>
      {/* Decorative bubbles */}
      <div style={S.bubble('280px', '-80px', '-60px', 0)} />
      <div style={S.bubble('180px', '60%', '-40px', 1.5)} />
      <div style={S.bubble('220px', '70%', '75%', 0.8)} />
      <div style={S.bubble('120px', '-30px', '65%', 2.2)} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes bubbleFloat { from { transform: translateY(0) scale(1); } to { transform: translateY(-18px) scale(1.04); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shakeX {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-10px); }
          40%     { transform: translateX(10px); }
          60%     { transform: translateX(-8px); }
          80%     { transform: translateX(8px); }
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,119,182,0.5) !important;
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .forgot-link:hover { text-decoration: underline; }
        .register-anchor:hover { text-decoration: underline; }
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

        <h1 style={S.heading}>Welcome back</h1>
        <p style={S.subheading}>Sign in to monitor your water quality</p>

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
            id="login-email"
            label="Email address"
            type="email"
            value={email}
            onChange={v => { setEmail(v); setFE(p => ({ ...p, email: '' })) }}
            error={fieldErrors.email}
            autoComplete="email"
          />
          <FloatInput
            id="login-password"
            label="Password"
            type="password"
            value={password}
            onChange={v => { setPassword(v); setFE(p => ({ ...p, password: '' })) }}
            error={fieldErrors.password}
            autoComplete="current-password"
          />

          <div style={S.row}>
            <label style={S.checkLabel}>
              <input
                type="checkbox"
                id="remember-me"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{ accentColor: '#0077B6', width: 15, height: 15 }}
              />
              Remember me
            </label>
            <a href="#forgot" style={S.forgotLink} className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            style={S.btn(loading)}
            className="login-btn"
          >
            {loading ? <><Spinner /> Signing in…</> : '🚀 Sign In'}
          </button>
        </form>

        <div style={S.divider}>
          <span style={{
            background: 'rgba(255,255,255,0.82)',
            padding: '0 0.75rem',
            position: 'relative',
            zIndex: 1,
          }}>
            — or —
          </span>
          <div style={{
            position: 'absolute', top: '50%', left: 0, right: 0,
            height: 1, background: 'rgba(0,180,216,0.2)', zIndex: 0,
          }} />
        </div>

        <p style={S.registerLink}>
          Don't have an account?{' '}
          <Link to="/register" style={S.registerLinkA} className="register-anchor">
            Create one for free
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
