import { AnimatePresence, motion } from 'framer-motion'

export default function AlertOverlays({ alerts = [] }) {
  if (!alerts || alerts.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        key="alert-overlay"
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -60 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: 'linear-gradient(90deg, rgba(239,68,68,0.18) 0%, rgba(239,68,68,0.08) 100%)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(239,68,68,0.30)', padding: '14px 32px',
        }}
      >
        <motion.div
          animate={{ x: ['-100%', '110%'] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
          style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.06), transparent)', pointerEvents: 'none' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '1440px', margin: '0 auto' }}>
          <motion.div
            animate={{ scale: [1, 1.18, 1] }} transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
            style={{
              width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(239,68,68,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0,
              border: '1px solid rgba(239,68,68,0.5)', boxShadow: '0 0 14px rgba(239,68,68,0.5)',
            }}
          >🚨</motion.div>

          <div style={{ flex: 1 }}>
            <p style={{ color: '#fca5a5', fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
              ⚠ CRITICAL ALERT — UNSAFE WATER DETECTED
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {alerts.map((a, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '3px 10px', borderRadius: '999px', background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '11px', fontWeight: 600,
                  }}
                >
                  {a.sensor}: <span style={{ color: '#f1f5f9', fontFamily: "'JetBrains Mono', monospace" }}>{a.reading}</span>
                </span>
              ))}
            </div>
          </div>
          <div style={{ padding: '6px 14px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.1)', fontSize: '10px', color: '#ef4444', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}>
            IS 10500 VIOLATION
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
