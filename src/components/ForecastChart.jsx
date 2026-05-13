import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'

const mockForecast = [
  { time: '00:00', value: 320 },
  { time: '04:00', value: 410 },
  { time: '08:00', value: 380 },
  { time: '12:00', value: 460 },
  { time: '16:00', value: 500 },
  { time: '20:00', value: 430 },
  { time: '24:00', value: 390 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(15,23,42,0.95)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '10px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <p style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '4px' }}>{label}</p>
      <p style={{ color: '#00f2ff', fontSize: '16px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
        {payload[0].value} <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 400 }}>mg/L</span>
      </p>
    </div>
  )
}

export default function ForecastChart({ data }) {
  const chartData = (data && data.length > 0) ? data : mockForecast

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 100, damping: 16 }}
      className="glass-card"
      style={{ padding: '28px 24px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', bottom: '-60px', left: '50%',
        transform: 'translateX(-50%)',
        width: '400px', height: '200px',
        background: 'radial-gradient(ellipse, rgba(0,242,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f1f5f9', marginBottom: '4px' }}>
            Predicted TDS Trend — Next 24h
          </h3>
          <p style={{ fontSize: '11px', color: '#94a3b8' }}>LSTM Neural Network Forecast · IS 10500:2012 Threshold: 500 mg/L</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '6px 14px', borderRadius: '999px',
          border: '1px solid rgba(0,242,255,0.2)', background: 'rgba(0,242,255,0.05)',
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f2ff', boxShadow: '0 0 12px rgba(0,242,255,0.8)' }} />
          <span style={{ fontSize: '11px', color: '#00f2ff', fontWeight: 600 }}>LSTM · LIVE</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f2ff" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#00f2ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis label={{ value: 'TDS (mg/L)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11, dx: -4 }} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={500} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'IS 10500 Limit', fill: '#ef4444', fontSize: 10, position: 'right' }} />
          <Area type="monotone" dataKey="value" stroke="#00f2ff" strokeWidth={2} fill="url(#cyanGradient)" dot={{ r: 4, fill: '#00f2ff', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#00f2ff', boxShadow: '0 0 15px rgba(0,242,255,0.6)' }} isAnimationActive={true} animationDuration={1500} animationEasing="ease-in-out" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
