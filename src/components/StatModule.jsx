// FILE: src/components/StatModule.jsx
import { motion } from 'framer-motion'

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, type: 'spring', stiffness: 120, damping: 14 },
  }),
}

/**
 * @param {object} props
 * @param {string}  props.label
 * @param {number|null} props.value
 * @param {string}  props.unit
 * @param {'safe'|'alert'} props.status
 * @param {string}  props.threshold   e.g. "6.5 – 8.5" or "< 500 mg/L"
 * @param {number}  [props.index]     stagger index
 * @param {number}  [props.percentage] 0-100 fill for progress bar
 */
export default function StatModule({ label, value, unit, status, threshold, index = 0, percentage = 0 }) {
  const isSafe  = status === 'safe'
  const isAlert = status === 'alert'
  const isIdle  = value == null

  // ── colour tokens ────────────────────────────────────────────────
  const safeGreen  = '#22c55e'
  const alertRed   = '#ef4444'
  const accentColor = isIdle ? '#94a3b8' : isSafe ? safeGreen : alertRed

  const cardStyle = {
    background: '#ffffff',
    border: `1px solid ${isAlert ? 'rgba(239,68,68,0.25)' : '#e2e8f0'}`,
    borderRadius: '2rem',
    padding: '28px 24px', position: 'relative', overflow: 'hidden', cursor: 'default',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease',
  }

  // ── IS 10500 compliance badge ────────────────────────────────────
  const badgeStyle = isIdle
    ? {
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '4px 12px', borderRadius: '999px', fontSize: '10px',
        fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
        border: '1px solid rgba(148,163,184,0.3)', color: '#94a3b8',
      }
    : isSafe
    ? {
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '4px 12px', borderRadius: '999px', fontSize: '10px',
        fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
        border: `1px solid #00B8A9`, color: '#00B8A9',
        boxShadow: '0 0 6px rgba(0,184,169,0.2)',
      }
    : {
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '4px 12px', borderRadius: '999px', fontSize: '10px',
        fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
        border: `1px solid ${alertRed}`, color: alertRed,
        animation: 'is10500Pulse 1s ease-in-out infinite',
      }

  const latencyBadge = {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    padding: '3px 10px', borderRadius: '999px', fontSize: '9px',
    fontWeight: 500, letterSpacing: '0.04em',
    border: '1px solid rgba(0,0,0,0.05)', color: '#64748b', marginTop: '6px',
  }

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        translateY: -8, scale: 1.01,
        boxShadow: `0 15px 30px rgba(0,0,0,0.06)`,
        transition: { duration: 0.25 },
      }}
      style={cardStyle}
    >
      {/* Ambient glow blob */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '140px', height: '140px', borderRadius: '50%',
        background: `radial-gradient(circle, ${accentColor}08 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Alert pulse overlay */}
      {isAlert && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '2rem',
          background: 'rgba(239,68,68,0.04)',
          animation: 'alertOverlay 1.5s ease-in-out infinite', pointerEvents: 'none',
        }} />
      )}

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#475569', marginBottom: '4px' }}>
            {label}
          </p>
          <div style={badgeStyle}>
            {!isIdle && (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
            )}
            {isIdle ? 'IS 10500 · IDLE' : isSafe ? 'IS 10500 · SAFE' : 'IS 10500 · ALERT'}
          </div>
          <br />
          <span style={latencyBadge}>⚡ Detection Latency: &lt;5s</span>
        </div>

        <div style={{
          width: '10px', height: '10px', borderRadius: '50%',
          background: isIdle ? '#cbd5e1' : isSafe ? '#00B8A9' : alertRed,
          boxShadow: isIdle ? 'none' : `0 0 6px ${isSafe ? '#00B8A9' : alertRed}`,
          marginTop: '4px',
          animation: isAlert ? 'dotPulse 1s ease-in-out infinite' : 'none',
        }} />
      </div>

      {/* Value */}
      <div style={{ marginBottom: '20px' }}>
        <span style={{
          fontSize: '3.25rem', fontWeight: 800, lineHeight: 1,
          color: isIdle ? '#94a3b8' : isSafe ? '#0f172a' : alertRed,
          fontVariantNumeric: 'tabular-nums', fontFamily: "'JetBrains Mono', monospace",
        }}>
          {value != null ? value : '—'}
        </span>
        {unit && (
          <span style={{ fontSize: '1rem', color: '#64748b', marginLeft: '6px', fontWeight: 500 }}>
            {unit}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ height: '4px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden', marginBottom: '10px' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            height: '100%', borderRadius: '4px',
            background: isIdle
              ? '#cbd5e1'
              : isSafe
              ? `linear-gradient(90deg, #00B8A9, #34d399)`
              : `linear-gradient(90deg, #ef4444, #f87171)`,
          }}
        />
      </div>

      {/* Threshold label */}
      <p style={{ fontSize: '10px', color: '#64748b', fontWeight: 500 }}>
        Safe range: <span style={{ color: '#0f172a' }}>{threshold}</span>
      </p>
    </motion.div>
  )
}
