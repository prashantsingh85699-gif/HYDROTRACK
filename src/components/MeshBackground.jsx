import { motion } from 'framer-motion'
import { useMemo } from 'react'

/* ═══════════════════════════════════════════════════════════════════
   MeshBackground — Animated CSS blob mesh + starfield
   Fixed layer at z-index 0, pointer-events: none
   ═══════════════════════════════════════════════════════════════════ */

const blobs = [
  { color: 'rgba(0,242,255,0.10)',  size: 600, x: ['10%','25%','8%'],   y: ['10%','30%','15%'],  dur: 18 },
  { color: 'rgba(129,140,248,0.09)',size: 500, x: ['75%','60%','80%'],  y: ['15%','40%','20%'],  dur: 22 },
  { color: 'rgba(30,27,75,0.25)',   size: 700, x: ['40%','55%','35%'],  y: ['60%','45%','65%'],  dur: 16 },
  { color: 'rgba(0,242,255,0.06)',  size: 450, x: ['80%','65%','85%'],  y: ['75%','60%','80%'],  dur: 20 },
]

export default function MeshBackground() {
  const stars = useMemo(() =>
    Array.from({ length: 70 }, (_, i) => ({
      id: i,
      cx: `${Math.random() * 100}%`,
      cy: `${Math.random() * 100}%`,
      r: Math.random() * 1.4 + 0.3,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    })),
  [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Base gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #020617 0%, #0c0a24 35%, #1e1b4b 65%, #020617 100%)',
      }} />

      {/* Animated blobs */}
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          animate={{ x: b.x, y: b.y }}
          transition={{ duration: b.dur, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
          style={{
            position: 'absolute', width: b.size, height: b.size, borderRadius: '50%',
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
            filter: 'blur(80px)', willChange: 'transform',
          }}
        />
      ))}

      {/* Starfield */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {stars.map(s => (
          <circle
            key={s.id} cx={s.cx} cy={s.cy} r={s.r} fill="rgba(241,245,249,0.5)"
            style={{ animation: `starTwinkle ${s.duration}s ${s.delay}s ease-in-out infinite alternate` }}
          />
        ))}
      </svg>
    </div>
  )
}
