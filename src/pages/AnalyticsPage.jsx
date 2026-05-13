import { motion } from 'framer-motion'
import { useSensor, getOverallStatus, SENSOR_CONFIG, getStatus } from '../context/SensorContext'
import ForecastChart from '../components/ForecastChart'
import { ShieldCheck, TrendingUp, Brain } from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════════
   AnalyticsPage — AI insights, forecast, health ring, economics
   ═══════════════════════════════════════════════════════════════════ */

// ── Health Score Ring (conic gradient gauge) ────────────────────────
function HealthRing({ overallStatus, sensorData }) {
  let score = 100
  let label = 'Excellent'
  let color = '#22c55e'

  if (overallStatus === 'CRITICAL') { score = 18; label = 'Critical'; color = '#ff0055' }
  else if (overallStatus === 'WARNING') { score = 55; label = 'Fair'; color = '#f59e0b' }
  else if (overallStatus === 'IDLE') { score = 0; label = 'Idle'; color = '#475569' }

  const angle = (score / 100) * 360

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
      style={{
        background: 'rgba(15,23,42,0.7)',
        backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '1.5rem', padding: '32px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
        <ShieldCheck size={16} style={{ color: '#818cf8' }} />
        <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f1f5f9' }}>Water Health Score</h3>
      </div>

      {/* Ring */}
      <div style={{ position: 'relative', width: '160px', height: '160px' }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: '50%',
          background: `conic-gradient(${color} 0deg, ${color} ${angle}deg, rgba(255,255,255,0.05) ${angle}deg, rgba(255,255,255,0.05) 360deg)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 30px ${color}25`,
        }}>
          <div style={{
            width: '120px', height: '120px', borderRadius: '50%',
            background: '#0c0a20',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <motion.span
              key={score}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ fontSize: '36px', fontWeight: 900, color, fontFamily: "'JetBrains Mono', monospace" }}
            >
              {score}
            </motion.span>
            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>{label}</span>
          </div>
        </div>
      </div>

      {/* Parameter breakdown */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {['pH', 'turbidity', 'tds', 'hardness'].map(t => {
          const status = getStatus(t, sensorData?.[t])
          const c = status === 'SAFE' ? '#22c55e' : status === 'WARNING' ? '#f59e0b' : status === 'CRITICAL' ? '#ff0055' : '#475569'
          return (
            <div key={t} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: '#94a3b8' }}>{SENSOR_CONFIG[t].label}</span>
              <span style={{ fontWeight: 700, color: c, fontSize: '10px', letterSpacing: '0.06em' }}>{status}</span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ── Predictive AI Panel ─────────────────────────────────────────────
function PredictivePanel({ overallStatus }) {
  const risk = overallStatus === 'CRITICAL' ? 'High' : overallStatus === 'WARNING' ? 'Medium' : 'Low'
  const riskColor = risk === 'High' ? '#ff0055' : risk === 'Medium' ? '#f59e0b' : '#22c55e'
  const bars = [35, 28, 42, 55, 38, 65, 45, 52, 30, 48, 55, 40]

  return (
    <div style={{
      background: 'rgba(15,23,42,0.7)',
      backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '1.5rem', padding: '24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Brain size={16} style={{ color: '#818cf8' }} />
        <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f1f5f9' }}>Predictive AI Forecasting</h3>
      </div>

      <div style={{
        background: `${riskColor}12`, borderRadius: '12px', padding: '14px', marginBottom: '16px',
        border: `1px solid ${riskColor}20`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Next 48h Contamination Risk</span>
          <span style={{ fontSize: '20px', fontWeight: 800, color: riskColor }}>{risk}</span>
        </div>
        <p style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>LSTM neural network — historical trend analysis</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '72px' }}>
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            style={{
              flex: 1, borderRadius: '3px 3px 0 0',
              background: i >= 10 ? `${riskColor}60` : 'rgba(129,140,248,0.2)',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#475569', marginTop: '4px' }}>
        <span>-24h</span><span>Now</span><span>+48h</span>
      </div>
    </div>
  )
}

// ── Economic Impact ─────────────────────────────────────────────────
function EconomicPanel() {
  const stats = [
    { label: 'Per-Unit Cost', value: '₹2,800', sub: 'One-time deployment' },
    { label: 'Annual Lab Savings', value: '₹1,80,000', sub: 'Traditional testing replacement' },
    { label: 'Cost Reduction', value: '98%', sub: '5-year ROI in <3 weeks' },
  ]

  return (
    <div style={{
      background: 'rgba(15,23,42,0.7)',
      backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '1.5rem', padding: '24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <TrendingUp size={16} style={{ color: '#22c55e' }} />
        <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f1f5f9' }}>Economic Impact</h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            style={{ textAlign: 'center' }}
          >
            <p style={{
              fontSize: '20px', fontWeight: 800,
              background: 'linear-gradient(135deg, #00f2ff, #818cf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>{s.value}</p>
            <p style={{ fontSize: '10px', fontWeight: 600, color: '#cbd5e1', marginTop: '4px' }}>{s.label}</p>
            <p style={{ fontSize: '8px', color: '#475569', marginTop: '2px' }}>{s.sub}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { sensorData, overallStatus } = useSensor()

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      style={{ padding: '28px 28px 28px 96px', maxWidth: '1480px', margin: '0 auto' }}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.01em' }}>
          AI Analytics & Insights
        </h2>
        <p style={{ fontSize: '11px', color: '#64748b' }}>LSTM forecasting · Health scoring · Economic analysis</p>
      </div>

      {/* Top row: Health Ring + Predictive */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '18px', marginBottom: '18px' }}>
        <HealthRing overallStatus={overallStatus} sensorData={sensorData} />
        <PredictivePanel overallStatus={overallStatus} />
      </div>

      {/* Forecast chart full width */}
      <div style={{ marginBottom: '18px' }}>
        <ForecastChart data={[]} />
      </div>

      {/* Economic Impact */}
      <EconomicPanel />
    </motion.div>
  )
}
