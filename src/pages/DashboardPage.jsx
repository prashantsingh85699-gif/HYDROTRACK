import { motion } from 'framer-motion'
import { useSensor, getStatProps, SENSOR_CONFIG, getStatus, getOverallStatus, formatTime } from '../context/SensorContext'
import StatModule from '../components/StatModule'
import ForecastChart from '../components/ForecastChart'
import AlertOverlays from '../components/AlertOverlays'
import { Activity, Power, Cpu, Wifi } from 'lucide-react'

function ControlPanel({ isRunning, onStart, onReset, selectedSample, onSampleChange }) {
  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Power size={14} style={{ color: '#00f2ff' }} />
        <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f1f5f9' }}>Simulation Control</h3>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <button className={isRunning ? 'btn-ghost' : 'btn-primary'} onClick={onStart} disabled={isRunning} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isRunning ? '#00f2ff' : '#020617', animation: isRunning ? 'dotPulse 1s ease-in-out infinite' : 'none' }} />
          {isRunning ? 'Monitoring Active' : 'Start Simulation'}
        </button>
        <button className="btn-ghost" onClick={onReset}>Reset</button>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '10px', color: '#94a3b8', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Load Test Sample</label>
        <select value={selectedSample ?? ''} onChange={(e) => onSampleChange?.(e?.target?.value ?? '')} style={{ width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '9px 12px', fontSize: '12px', color: '#f1f5f9', outline: 'none', cursor: 'pointer', appearance: 'none' }}>
          <option value="">Random Simulation</option>
          <option value="sample-a">Sample A — Tap Water</option>
          <option value="sample-b">Sample B — Acidic</option>
          <option value="sample-c">Sample C — Alkaline</option>
          <option value="sample-d">Sample D — Filtered</option>
        </select>
      </div>
    </div>
  )
}

function AutoShutoffPanel({ isActivated }) {
  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: isActivated ? 'rgba(239,68,68,0.1)' : undefined, border: isActivated ? '1px solid rgba(239,68,68,0.3)' : undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
        <Power size={14} style={{ color: '#00f2ff' }} />
        <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f1f5f9' }}>Auto Shutoff</h3>
      </div>
      <div style={{ position: 'relative' }}>
        <motion.div animate={isActivated ? { boxShadow: ['0 0 15px rgba(239,68,68,0.3)', '0 0 30px rgba(239,68,68,0.4)', '0 0 15px rgba(239,68,68,0.3)'] } : {}} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: '72px', height: '72px', borderRadius: '50%', background: isActivated ? 'rgba(239,68,68,0.2)' : 'rgba(0,242,255,0.05)', border: `2px solid ${isActivated ? 'rgba(239,68,68,0.5)' : 'rgba(0,242,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Power size={28} style={{ color: isActivated ? '#ef4444' : '#00f2ff' }} />
        </motion.div>
      </div>
      <p style={{ fontSize: '12px', fontWeight: 700, color: isActivated ? '#ef4444' : '#00f2ff' }}>{isActivated ? 'ACTIVATED' : 'READY'}</p>
      <p style={{ fontSize: '9px', color: '#94a3b8', textAlign: 'center' }}>{isActivated ? 'Automatic shutoff triggered' : 'Valve armed for critical detection'}</p>
    </div>
  )
}

function SystemHealth({ isRunning, lastSampled }) {
  const devices = [
    { name: 'NodeMCU ESP8266', status: isRunning ? 'Online' : 'Standby', icon: Cpu },
    { name: 'Arduino Uno',     status: isRunning ? 'Online' : 'Standby', icon: Cpu },
    { name: 'Wi-Fi Module',    status: 'Connected',                      icon: Wifi },
  ]
  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Activity size={14} style={{ color: '#00f2ff' }} />
        <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f1f5f9' }}>System Health</h3>
        <div style={{ marginLeft: 'auto', width: '7px', height: '7px', borderRadius: '50%', background: isRunning ? '#10b981' : '#475569', boxShadow: isRunning ? '0 0 10px rgba(16,185,129,0.5)' : 'none' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {devices.map((d, i) => {
          const Icon = d.icon
          const isOn = d.status === 'Online' || d.status === 'Connected'
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}><Icon size={12} style={{ color: '#00f2ff' }} /> {d.name}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: isOn ? '#10b981' : '#64748b' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isOn ? '#10b981' : '#475569' }} />{d.status}</span>
            </div>
          )
        })}
      </div>
      <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
        <span style={{ color: '#64748b' }}>Last Sampled</span>
        <span style={{ color: '#f1f5f9', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{lastSampled ? formatTime(lastSampled) : '—'}</span>
      </div>
    </div>
  )
}

function DataLogTable({ readings = [] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card" style={{ padding: '24px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <Activity size={14} style={{ color: '#00f2ff' }} />
        <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f1f5f9' }}>Live Data Log</h3>
        <span style={{ marginLeft: 'auto', fontSize: '9px', color: '#64748b' }}>Last 10 readings</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {['#','Timestamp','pH','Turbidity','TDS','Hardness','Status'].map(h => <th key={h} style={{ padding: '6px 8px', textAlign: 'left', color: '#94a3b8', fontWeight: 600, fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {readings.length > 0 ? readings.map((r, i) => {
              const os = getOverallStatus(r)
              const statusColor = os === 'SAFE' ? '#10b981' : os === 'WARNING' ? '#f59e0b' : '#ef4444'
              return (
                <tr key={r?.id ?? i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '8px', color: '#64748b', fontFamily: "'JetBrains Mono', monospace" }}>{readings.length - i}</td>
                  <td style={{ padding: '8px', color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>{r?.timestamp ? formatTime(new Date(r.timestamp)) : '—'}</td>
                  <td style={{ padding: '8px', fontWeight: 600, color: getStatus('pH', r?.pH) === 'CRITICAL' ? '#ef4444' : '#f1f5f9' }}>{r?.pH ?? '—'}</td>
                  <td style={{ padding: '8px', fontWeight: 600, color: getStatus('turbidity', r?.turbidity) === 'CRITICAL' ? '#ef4444' : getStatus('turbidity', r?.turbidity) === 'WARNING' ? '#f59e0b' : '#f1f5f9' }}>{r?.turbidity ?? '—'} NTU</td>
                  <td style={{ padding: '8px', fontWeight: 600, color: getStatus('tds', r?.tds) === 'CRITICAL' ? '#ef4444' : getStatus('tds', r?.tds) === 'WARNING' ? '#f59e0b' : '#f1f5f9' }}>{r?.tds ?? '—'}</td>
                  <td style={{ padding: '8px', fontWeight: 600, color: getStatus('hardness', r?.hardness) === 'CRITICAL' ? '#ef4444' : getStatus('hardness', r?.hardness) === 'WARNING' ? '#f59e0b' : '#f1f5f9' }}>{r?.hardness ?? '—'}</td>
                  <td style={{ padding: '8px' }}>
                    <span style={{ padding: '3px 9px', borderRadius: '999px', fontSize: '8px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: `${statusColor}20`, border: `1px solid ${statusColor}40`, color: statusColor }}>{os}</span>
                  </td>
                </tr>
              )
            }) : <tr><td colSpan={7} style={{ padding: '28px 0', textAlign: 'center', color: '#64748b' }}>No readings yet — start simulation</td></tr>}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const {
    isRunning, sensorData, selectedSample, readings, lastSampled,
    overallStatus, valveActivated, criticalAlerts,
    setSelectedSample, handleStart, handleReset,
  } = useSensor()

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}
      style={{ padding: '28px 28px 28px 96px', maxWidth: '1480px', margin: '0 auto' }}
    >
      <AlertOverlays alerts={criticalAlerts} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.01em' }}>Monitoring Dashboard</h2>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>IS 10500:2012 compliant · Real-time sensor data</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '18px' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <StatModule {...getStatProps(sensorData, 'pH')} index={0} />
        </div>
        <SystemHealth isRunning={isRunning} lastSampled={lastSampled} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '18px' }}>
        <StatModule {...getStatProps(sensorData, 'turbidity')} index={1} />
        <StatModule {...getStatProps(sensorData, 'tds')} index={2} />
        <StatModule {...getStatProps(sensorData, 'hardness')} index={3} />
      </div>

      <div style={{ marginBottom: '18px' }}>
        <ForecastChart data={[]} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
        <ControlPanel
          isRunning={isRunning} onStart={handleStart} onReset={handleReset}
          selectedSample={selectedSample} onSampleChange={setSelectedSample}
        />
        <AutoShutoffPanel isActivated={valveActivated} />
      </div>

      <DataLogTable readings={readings} />
    </motion.div>
  )
}
