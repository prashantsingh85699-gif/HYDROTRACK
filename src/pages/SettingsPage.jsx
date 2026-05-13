import { motion } from 'framer-motion'
import { useSensor, SENSOR_CONFIG, TEST_SAMPLES } from '../context/SensorContext'
import { Settings2, RotateCcw, Info, Database, ShieldCheck } from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════════
   SettingsPage — Configuration, threshold reference, about
   ═══════════════════════════════════════════════════════════════════ */

const cardStyle = {
  background: 'rgba(15,23,42,0.7)',
  backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '1.5rem', padding: '24px',
}

export default function SettingsPage() {
  const { selectedSample, setSelectedSample, handleReset, isRunning, handleStart } = useSensor()

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      style={{ padding: '28px 28px 28px 96px', maxWidth: '1080px', margin: '0 auto' }}
    >
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9' }}>Settings</h2>
        <p style={{ fontSize: '11px', color: '#64748b' }}>Configuration · Thresholds · System info</p>
      </div>

      {/* Simulation Config */}
      <div style={{ ...cardStyle, marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <Settings2 size={16} style={{ color: '#00f2ff' }} />
          <h3 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f1f5f9' }}>Simulation Configuration</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Sample selector */}
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#64748b', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Test Sample</label>
            <select
              value={selectedSample ?? ''}
              onChange={(e) => setSelectedSample(e.target.value)}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', padding: '10px 12px', fontSize: '12px',
                color: '#f1f5f9', outline: 'none', cursor: 'pointer', appearance: 'none',
              }}
            >
              <option value="">Random Simulation</option>
              {Object.entries(TEST_SAMPLES).map(([key, s]) => (
                <option key={key} value={key}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleStart}
              disabled={isRunning}
              style={{
                padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '12px',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                background: isRunning ? 'rgba(0,242,255,0.08)' : 'linear-gradient(135deg, #0891b2, #00f2ff)',
                color: isRunning ? '#00f2ff' : '#020617',
                border: '1px solid rgba(0,242,255,0.3)',
                opacity: isRunning ? 0.6 : 1,
              }}
            >
              {isRunning ? '● Monitoring Active' : '▶ Start Simulation'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleReset}
              style={{
                padding: '10px 20px', borderRadius: '10px', fontWeight: 600, fontSize: '12px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                background: 'rgba(255,0,85,0.08)', color: '#ff6b8a',
                border: '1px solid rgba(255,0,85,0.2)',
              }}
            >
              <RotateCcw size={13} />Reset All Data
            </motion.button>
          </div>
        </div>
      </div>

      {/* IS 10500 Threshold Reference */}
      <div style={{ ...cardStyle, marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <ShieldCheck size={16} style={{ color: '#818cf8' }} />
          <h3 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f1f5f9' }}>IS 10500:2012 Threshold Reference</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Parameter', 'Unit', 'Safe Range', 'Warning', 'Critical'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(SENSOR_CONFIG).map(([key, cfg]) => (
                <tr key={key} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: '#f1f5f9' }}>{cfg.label}</td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{cfg.unit || '—'}</td>
                  <td style={{ padding: '10px 12px', color: '#22c55e', fontWeight: 600 }}>
                    {key === 'pH' ? `${cfg.safeMin} – ${cfg.safeMax}` : `≤ ${cfg.safeMax}`}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#f59e0b', fontWeight: 600 }}>
                    {key === 'pH' ? '—' : cfg.warnMax ? `≤ ${cfg.warnMax}` : '—'}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#ff0055', fontWeight: 600 }}>
                    {key === 'pH' ? `< ${cfg.safeMin} or > ${cfg.safeMax}` : `> ${cfg.warnMax || cfg.safeMax}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* About Section */}
      <div style={{ ...cardStyle }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <Info size={16} style={{ color: '#00f2ff' }} />
          <h3 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f1f5f9' }}>About HYDROTRACK</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '16px' }}>
              HYDROTRACK is a real-time IoT water safety framework designed for institutional campuses.
              It uses edge-AI powered monitoring with IS 10500:2012 compliance to ensure safe drinking water.
            </p>
            <p style={{ fontSize: '10px', color: '#64748b' }}>
              <strong style={{ color: '#94a3b8' }}>Institution:</strong> NIAT VGU · Academic Year 2025-26
            </p>
          </div>

          <div>
            <p style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, marginBottom: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Tech Stack</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['React 19', 'Vite 7', 'Framer Motion', 'Recharts', 'Tailwind CSS', 'NodeMCU ESP8266', 'Arduino Uno', 'Firebase RTDB'].map(t => (
                <span key={t} style={{
                  padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 600,
                  background: 'rgba(0,242,255,0.06)', border: '1px solid rgba(0,242,255,0.12)',
                  color: '#00f2ff',
                }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={12} style={{ color: '#475569' }} />
          <span style={{ fontSize: '10px', color: '#475569' }}>Production Grade · v3.0 · Data sampling interval: 5s</span>
        </div>
      </div>
    </motion.div>
  )
}
