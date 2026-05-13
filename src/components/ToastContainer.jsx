import { motion, AnimatePresence } from 'framer-motion'

/* ═══════════════════════════════════════════════════════════════════
   ToastContainer — Extracted toast notification overlay
   Shared across all pages via App shell.
   ═══════════════════════════════════════════════════════════════════ */

// Inline mini-icons (so this component has no external deps)
const BellSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const WarnSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)
const CheckSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const palette = {
  critical: { bg: 'rgba(127,29,29,0.75)', border: 'rgba(239,68,68,0.45)', icon: '#ef4444' },
  warning:  { bg: 'rgba(120,53,15,0.75)', border: 'rgba(245,158,11,0.45)', icon: '#f59e0b' },
  safe:     { bg: 'rgba(6,78,59,0.75)',   border: 'rgba(34,197,94,0.45)',  icon: '#22c55e' },
}

export default function ToastContainer({ toasts = [], onDismiss }) {
  return (
    <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '360px' }}>
      <AnimatePresence>
        {toasts.map(toast => {
          const t = toast?.type ?? 'safe'
          const p = palette[t] ?? palette.safe
          return (
            <motion.div
              key={toast.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '14px 16px', borderRadius: '1rem',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                background: p.bg, border: `1px solid ${p.border}`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ marginTop: '2px', color: p.icon }}>
                {t === 'critical' ? <BellSvg /> : t === 'warning' ? <WarnSvg /> : <CheckSvg />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '13px', color: '#f1f5f9' }}>{toast?.title ?? 'Alert'}</p>
                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{toast?.message ?? ''}</p>
              </div>
              <button
                onClick={() => onDismiss?.(toast?.id)}
                style={{ all: 'unset', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', fontSize: '18px', lineHeight: 1, padding: '0 2px' }}
              >×</button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
