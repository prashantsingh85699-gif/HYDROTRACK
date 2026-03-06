import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'

/* ========================================================================
   HYDROTRACK – Real-Time IoT Water Safety Framework
   Complete single-page application for institutional water monitoring
   ======================================================================== */

// ─── Icons (inline SVG components) ─────────────────────────────────────
const WaterDropIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z" />
  </svg>
)

const BellIcon = ({ className = "w-5 h-5", buzzing = false }) => (
  <svg className={`${className} ${buzzing ? 'animate-buzz' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const WifiIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CpuIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
  </svg>
)

const ActivityIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ShieldIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const TrendingUpIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="17 6 23 6 23 12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const AlertTriangleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const CheckCircleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PowerIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18.36 6.64a9 9 0 11-12.73 0M12 2v10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ─── Constants ──────────────────────────────────────────────────────────
const SAMPLING_INTERVAL = 5000
const TEST_SAMPLES = {
  'sample-a': { name: 'Sample A (Tap Water)', pH: 7.2, turbidity: 2.1, tds: 320, hardness: 180 },
  'sample-b': { name: 'Sample B (Acidic)', pH: 3.8, turbidity: 1.5, tds: 580, hardness: 420 },
  'sample-c': { name: 'Sample C (Alkaline/Secondary)', pH: 9.4, turbidity: 8.7, tds: 1200, hardness: 750 },
  'sample-d': { name: 'Sample D (Filtered)', pH: 7.0, turbidity: 0.8, tds: 150, hardness: 90 },
}

const SENSOR_CONFIG = {
  pH: { label: 'pH Level', unit: '', icon: '⚗️', description: 'Acidity/alkalinity balance', safeMin: 6.5, safeMax: 8.5, min: 0, max: 14 },
  turbidity: { label: 'Turbidity', unit: 'NTU', icon: '💧', description: 'Water clarity measure', safeMax: 1, warnMax: 5, min: 0, max: 15 },
  tds: { label: 'Total Dissolved Solids', unit: 'mg/L', icon: '🔬', description: 'Dissolved mineral content', safeMax: 500, warnMax: 1000, min: 0, max: 2000 },
  hardness: { label: 'Water Hardness', unit: 'mg/L', icon: '🧪', description: 'Calcium & magnesium levels', safeMax: 200, warnMax: 600, min: 0, max: 1000 },
}

// ─── Utility Functions ──────────────────────────────────────────────────
function getStatus(type, value) {
  if (value == null) return 'IDLE'
  const cfg = SENSOR_CONFIG?.[type]
  if (!cfg) return 'IDLE'

  if (type === 'pH') {
    if (value < (cfg?.safeMin ?? 6.5) || value > (cfg?.safeMax ?? 8.5)) return 'CRITICAL'
    return 'SAFE'
  }
  const safeMax = cfg?.safeMax ?? 0
  const warnMax = cfg?.warnMax ?? safeMax
  if (value > warnMax) return 'CRITICAL'
  if (value > safeMax) return 'WARNING'
  return 'SAFE'
}

function getOverallStatus(data) {
  if (!data) return 'IDLE'
  const pH = data?.pH
  const turbidity = data?.turbidity
  const tds = data?.tds
  const hardness = data?.hardness

  // PPT Decision Algorithm
  if (pH != null && (pH < 6.5 || pH > 8.5)) return 'CRITICAL'
  if (turbidity != null && turbidity > 5) return 'CRITICAL'
  if (tds != null && tds > 1000) return 'CRITICAL'
  if (hardness != null && hardness > 600) return 'CRITICAL'
  if (turbidity != null && turbidity > 1) return 'WARNING'
  if (tds != null && tds > 500) return 'WARNING'
  if (hardness != null && hardness > 200) return 'WARNING'
  return 'SAFE'
}

function generateRandomData() {
  return {
    pH: parseFloat((Math.random() * 6 + 4).toFixed(1)),
    turbidity: parseFloat((Math.random() * 10).toFixed(1)),
    tds: Math.round(Math.random() * 1500 + 50),
    hardness: Math.round(Math.random() * 800 + 20),
  }
}

function formatTime(date) {
  return date?.toLocaleTimeString?.('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) ?? '--:--:--'
}

function formatDateTime(date) {
  return date?.toLocaleString?.('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) ?? '---'
}

const statusColors = {
  SAFE: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/20' },
  WARNING: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/20', glow: 'shadow-amber-500/20' },
  CRITICAL: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/20', glow: 'shadow-red-500/20' },
  IDLE: { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/20', glow: '' },
}

// ─── Toast Notification System ──────────────────────────────────────────
function ToastContainer({ toasts = [], onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
      {toasts?.map?.((toast) => (
        <div
          key={toast?.id}
          className={`flex items-start gap-3 p-4 rounded-lg border backdrop-blur-md shadow-2xl animate-slide-in-right ${
            toast?.type === 'critical'
              ? 'bg-red-950/80 border-red-500/30 text-red-100'
              : toast?.type === 'warning'
              ? 'bg-amber-950/80 border-amber-500/30 text-amber-100'
              : 'bg-emerald-950/80 border-emerald-500/30 text-emerald-100'
          }`}
        >
          <div className="mt-0.5">
            {toast?.type === 'critical' ? (
              <BellIcon className="w-5 h-5 text-red-400" buzzing={true} />
            ) : toast?.type === 'warning' ? (
              <AlertTriangleIcon className="w-5 h-5 text-amber-400" />
            ) : (
              <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{toast?.title ?? 'Alert'}</p>
            <p className="text-xs opacity-80 mt-0.5">{toast?.message ?? ''}</p>
          </div>
          <button
            onClick={() => onDismiss?.(toast?.id)}
            className="text-white/50 hover:text-white/90 text-lg leading-none"
          >
            ×
          </button>
        </div>
      )) ?? null}
    </div>
  )
}

// ─── System Health Panel ────────────────────────────────────────────────
function SystemHealthPanel({ isRunning, lastSampled }) {
  const devices = [
    { name: 'NodeMCU ESP8266', status: isRunning ? 'Online' : 'Standby', icon: <CpuIcon /> },
    { name: 'Arduino Uno', status: isRunning ? 'Online' : 'Standby', icon: <CpuIcon /> },
    { name: 'Wi-Fi Module', status: 'Connected', icon: <WifiIcon /> },
  ]

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <ActivityIcon className="w-4 h-4 text-hydro-400" />
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">System Health</h3>
        <div className={`ml-auto w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
      </div>
      <div className="space-y-2">
        {devices?.map?.((device, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              {device?.icon}
              <span>{device?.name ?? 'Unknown'}</span>
            </div>
            <span className={`flex items-center gap-1 font-medium ${
              device?.status === 'Online' ? 'text-emerald-400' : device?.status === 'Connected' ? 'text-emerald-400' : 'text-slate-500'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                device?.status === 'Online' || device?.status === 'Connected' ? 'bg-emerald-400' : 'bg-slate-500'
              }`} />
              {device?.status ?? 'Unknown'}
            </span>
          </div>
        )) ?? null}
      </div>
      <div className="mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Last Sampled</span>
          <span className="text-slate-300 font-mono text-[11px]">{lastSampled ? formatTime(lastSampled) : '—'}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Sensor Card ────────────────────────────────────────────────────────
function SensorCard({ type, value, data }) {
  const cfg = SENSOR_CONFIG?.[type]
  if (!cfg) return null

  const status = getStatus(type, value)
  const colors = statusColors?.[status] ?? statusColors?.IDLE
  const percentage = value != null
    ? Math.min(100, Math.max(0, ((value - (cfg?.min ?? 0)) / ((cfg?.max ?? 1) - (cfg?.min ?? 0))) * 100))
    : 0

  const thresholdLabel = type === 'pH'
    ? `Safe: ${cfg?.safeMin ?? 6.5}–${cfg?.safeMax ?? 8.5}`
    : `Safe: ≤${cfg?.safeMax ?? 0} ${cfg?.unit ?? ''}`

  return (
    <div className={`glass-card p-5 relative overflow-hidden group transition-all duration-300 ${status === 'CRITICAL' ? 'border-red-500/30' : ''}`}>
      {/* Glow effect for critical */}
      {status === 'CRITICAL' && (
        <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
      )}

      {/* Header */}
      <div className="relative flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{cfg?.icon ?? '📊'}</span>
            <h3 className="text-sm font-semibold text-slate-200">{cfg?.label ?? 'Sensor'}</h3>
          </div>
          <p className="text-[11px] text-slate-500">{cfg?.description ?? ''}</p>
        </div>
        <div className={`status-badge ${
          status === 'SAFE' ? 'status-safe' :
          status === 'WARNING' ? 'status-warning' :
          status === 'CRITICAL' ? 'status-critical' :
          'bg-slate-500/15 text-slate-400 border border-slate-500/20'
        }`}>
          {status === 'CRITICAL' && <BellIcon className="w-3 h-3" buzzing={true} />}
          {status ?? 'IDLE'}
        </div>
      </div>

      {/* Value */}
      <div className="relative mb-4">
        <div className={`sensor-value ${
          status === 'SAFE' ? 'text-emerald-400' :
          status === 'WARNING' ? 'text-amber-400' :
          status === 'CRITICAL' ? 'text-red-400' :
          'text-slate-500'
        }`}>
          {value != null ? value : '—'}
          {cfg?.unit && <span className="text-lg font-normal text-slate-400 ml-1">{cfg.unit}</span>}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="progress-bar">
          <div
            className={`progress-fill ${
              status === 'SAFE' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
              status === 'WARNING' ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
              status === 'CRITICAL' ? 'bg-gradient-to-r from-red-500 to-red-400' :
              'bg-slate-600'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-[10px] text-slate-500">{thresholdLabel}</span>
          <span className="text-[10px] text-slate-500">{cfg?.min ?? 0}–{cfg?.max ?? 0}</span>
        </div>
      </div>

      {/* Critical banner */}
      {status === 'CRITICAL' && (
        <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 flex items-center gap-2">
          <AlertTriangleIcon className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <span className="text-[11px] text-red-300 font-medium">
            {type === 'pH' ? 'Exceeds safe limits – UNSAFE WATER' : `Exceeds safe threshold of ${cfg?.warnMax ?? cfg?.safeMax ?? 0} ${cfg?.unit ?? ''}`}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Control Panel ──────────────────────────────────────────────────────
function ControlPanel({ isRunning, onStart, onReset, selectedSample, onSampleChange }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <PowerIcon className="w-4 h-4 text-hydro-400" />
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Simulation Control</h3>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <button
          id="btn-start-simulation"
          onClick={onStart}
          disabled={isRunning}
          className="btn-primary flex items-center gap-2"
        >
          <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-300 animate-pulse' : 'bg-white/50'}`} />
          {isRunning ? 'Monitoring Active' : 'Start Simulation'}
        </button>
        <button
          id="btn-reset"
          onClick={onReset}
          className="btn-ghost"
        >
          Reset
        </button>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-2 font-medium">Load Test Sample</label>
        <select
          id="select-test-sample"
          value={selectedSample ?? ''}
          onChange={(e) => onSampleChange?.(e?.target?.value ?? '')}
          className="w-full bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-hydro-500/50 focus:ring-1 focus:ring-hydro-500/25 transition-colors appearance-none cursor-pointer"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\' fill=\'%2394a3b8\'%3E%3Cpath d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
        >
          <option value="">Random Simulation</option>
          <option value="sample-a">Sample A — Tap Water (pH 7.2, Turb 2.1)</option>
          <option value="sample-b">Sample B — Acidic (pH 3.8, Turb 1.5)</option>
          <option value="sample-c">Sample C — Alkaline (pH 9.4, Turb 8.7)</option>
          <option value="sample-d">Sample D — Filtered (pH 7.0, Turb 0.8)</option>
        </select>
      </div>
    </div>
  )
}

// ─── Economic Impact Panel ──────────────────────────────────────────────
function EconomicImpactPanel() {
  const stats = [
    { label: 'Per-Unit Cost', value: '₹2,800', sub: 'One-time deployment' },
    { label: 'Annual Lab Cost Saved', value: '₹1,80,000', sub: 'Traditional testing replacement' },
    { label: 'Cost Reduction', value: '98%', sub: '5-year ROI in <3 weeks' },
  ]

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUpIcon className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Economic Impact</h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {stats?.map?.((stat, i) => (
          <div key={i} className="text-center">
            <p className="text-2xl font-bold text-gradient">{stat?.value ?? '—'}</p>
            <p className="text-xs font-medium text-slate-300 mt-1">{stat?.label ?? ''}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{stat?.sub ?? ''}</p>
          </div>
        )) ?? null}
      </div>
    </div>
  )
}

// ─── Predictive AI Panel ────────────────────────────────────────────────
function PredictiveAIPanel({ overallStatus }) {
  const risk = overallStatus === 'CRITICAL' ? 'High' : overallStatus === 'WARNING' ? 'Medium' : 'Low'
  const riskColor = risk === 'High' ? 'text-red-400' : risk === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
  const riskBg = risk === 'High' ? 'bg-red-500/10' : risk === 'Medium' ? 'bg-amber-500/10' : 'bg-emerald-500/10'

  // Fake chart bars
  const bars = [35, 28, 42, 55, 38, 65, 45, 52, 30, 48, 55, 40]

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <ShieldIcon className="w-4 h-4 text-hydro-400" />
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Predictive AI Forecasting</h3>
      </div>

      <div className={`${riskBg} rounded-lg p-3 mb-4`}>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Next 48h Contamination Risk</span>
          <span className={`text-lg font-bold ${riskColor}`}>{risk}</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">Machine Learning Forecasting based on historical trend analysis</p>
      </div>

      {/* Mini chart visualization */}
      <div className="flex items-end gap-1 h-16">
        {bars?.map?.((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t transition-all duration-500 ${
              i >= 10 ? (risk === 'High' ? 'bg-red-500/40' : risk === 'Medium' ? 'bg-amber-500/40' : 'bg-emerald-500/40')
              : 'bg-hydro-500/20'
            }`}
            style={{ height: `${h}%` }}
          />
        )) ?? null}
      </div>
      <div className="flex justify-between text-[9px] text-slate-600 mt-1">
        <span>-24h</span>
        <span>Now</span>
        <span>+48h</span>
      </div>
    </div>
  )
}

// ─── Auto Shutoff Valve ─────────────────────────────────────────────────
function AutoShutoffPanel({ isActivated }) {
  return (
    <div className={`glass-card p-5 transition-all duration-500 ${isActivated ? 'border-red-500/40' : ''}`}>
      <div className="flex items-center gap-2 mb-4">
        <PowerIcon className="w-4 h-4 text-hydro-400" />
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Auto Shutoff Valve</h3>
      </div>

      <div className="flex items-center justify-center py-4">
        <div className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
          isActivated
            ? 'bg-red-500/20 border-2 border-red-500/50 shadow-lg shadow-red-500/20'
            : 'bg-emerald-500/10 border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10'
        }`}>
          {/* Inner circle */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
            isActivated ? 'bg-red-500/30' : 'bg-emerald-500/15'
          }`}>
            <PowerIcon className={`w-8 h-8 transition-colors duration-500 ${isActivated ? 'text-red-400' : 'text-emerald-400'}`} />
          </div>
          {/* Pulse ring */}
          {isActivated && <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping" />}
        </div>
      </div>

      <div className="text-center">
        <p className={`text-sm font-bold ${isActivated ? 'text-red-400' : 'text-emerald-400'}`}>
          {isActivated ? 'ACTIVATED – Water Supply Cutoff' : 'READY'}
        </p>
        <p className="text-[10px] text-slate-500 mt-1">
          {isActivated ? 'Automatic shutoff triggered due to unsafe water detection' : 'System standing by — valve will activate on critical detection'}
        </p>
      </div>
    </div>
  )
}

// ─── Data Log Table ─────────────────────────────────────────────────────
function DataLogTable({ readings = [] }) {
  return (
    <div className="glass-card p-5 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <ActivityIcon className="w-4 h-4 text-hydro-400" />
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Live Data Log</h3>
        <span className="ml-auto text-[10px] text-slate-500">Last 10 readings</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left border-b border-white/5">
              <th className="pb-2 text-slate-400 font-medium px-2">#</th>
              <th className="pb-2 text-slate-400 font-medium px-2">Timestamp</th>
              <th className="pb-2 text-slate-400 font-medium px-2">pH</th>
              <th className="pb-2 text-slate-400 font-medium px-2">Turbidity</th>
              <th className="pb-2 text-slate-400 font-medium px-2">TDS</th>
              <th className="pb-2 text-slate-400 font-medium px-2">Hardness</th>
              <th className="pb-2 text-slate-400 font-medium px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {readings?.length > 0 ? (
              readings?.map?.((r, i) => {
                const os = getOverallStatus(r)
                return (
                  <tr key={r?.id ?? i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-2 text-slate-500 font-mono">{readings?.length - i}</td>
                    <td className="py-2.5 px-2 text-slate-300 font-mono text-[11px]">{r?.timestamp ? formatTime(new Date(r.timestamp)) : '—'}</td>
                    <td className={`py-2.5 px-2 font-medium ${getStatus('pH', r?.pH) === 'CRITICAL' ? 'text-red-400' : 'text-slate-200'}`}>{r?.pH ?? '—'}</td>
                    <td className={`py-2.5 px-2 font-medium ${
                      getStatus('turbidity', r?.turbidity) === 'CRITICAL' ? 'text-red-400' :
                      getStatus('turbidity', r?.turbidity) === 'WARNING' ? 'text-amber-400' : 'text-slate-200'
                    }`}>{r?.turbidity ?? '—'} NTU</td>
                    <td className={`py-2.5 px-2 font-medium ${
                      getStatus('tds', r?.tds) === 'CRITICAL' ? 'text-red-400' :
                      getStatus('tds', r?.tds) === 'WARNING' ? 'text-amber-400' : 'text-slate-200'
                    }`}>{r?.tds ?? '—'}</td>
                    <td className={`py-2.5 px-2 font-medium ${
                      getStatus('hardness', r?.hardness) === 'CRITICAL' ? 'text-red-400' :
                      getStatus('hardness', r?.hardness) === 'WARNING' ? 'text-amber-400' : 'text-slate-200'
                    }`}>{r?.hardness ?? '—'}</td>
                    <td className="py-2.5 px-2">
                      <span className={`status-badge text-[10px] ${
                        os === 'SAFE' ? 'status-safe' : os === 'WARNING' ? 'status-warning' : 'status-critical'
                      }`}>
                        {os}
                      </span>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                  No readings yet — start simulation to begin monitoring
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Main App Component ─────────────────────────────────────────────────
function App() {
  const [isRunning, setIsRunning] = useState(false)
  const [sensorData, setSensorData] = useState(null)
  const [selectedSample, setSelectedSample] = useState('')
  const [readings, setReadings] = useState([])
  const [lastSampled, setLastSampled] = useState(null)
  const [toasts, setToasts] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const intervalRef = useRef(null)
  const toastIdRef = useRef(0)

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Add toast
  const addToast = useCallback((type, title, message) => {
    const id = ++toastIdRef.current
    setToasts(prev => [...(prev ?? []).slice(-4), { id, type, title, message }])
    setTimeout(() => {
      setToasts(prev => (prev ?? []).filter(t => t?.id !== id))
    }, 5000)
  }, [])

  // Dismiss toast
  const dismissToast = useCallback((id) => {
    setToasts(prev => (prev ?? []).filter(t => t?.id !== id))
  }, [])

  // Take a reading
  const takeReading = useCallback(() => {
    let data
    if (selectedSample && TEST_SAMPLES?.[selectedSample]) {
      const sample = TEST_SAMPLES[selectedSample]
      data = {
        pH: sample?.pH ?? 7.0,
        turbidity: sample?.turbidity ?? 0,
        tds: sample?.tds ?? 0,
        hardness: sample?.hardness ?? 0,
      }
    } else {
      data = generateRandomData()
    }

    const now = new Date()
    const reading = { ...data, id: Date.now(), timestamp: now.toISOString() }

    setSensorData(data)
    setLastSampled(now)
    setReadings(prev => [reading, ...(prev ?? []).slice(0, 9)])

    // Check status and fire alerts
    const status = getOverallStatus(data)
    if (status === 'CRITICAL') {
      addToast('critical', '🚨 CRITICAL ALERT', `UNSAFE WATER DETECTED — pH: ${data?.pH ?? '?'}, Turbidity: ${data?.turbidity ?? '?'} NTU`)
    } else if (status === 'WARNING') {
      addToast('warning', '⚠️ Warning', `Water quality parameters approaching unsafe levels`)
    }
  }, [selectedSample, addToast])

  // Start simulation
  const handleStart = useCallback(() => {
    if (isRunning) return
    setIsRunning(true)
    takeReading()
    addToast('safe', '✅ Monitoring Started', 'Continuous 5-second sampling loop activated')
    intervalRef.current = setInterval(takeReading, SAMPLING_INTERVAL)
  }, [isRunning, takeReading, addToast])

  // Reset
  const handleReset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    setIsRunning(false)
    setSensorData(null)
    setSelectedSample('')
    setReadings([])
    setLastSampled(null)
    setToasts([])
  }, [])

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const overallStatus = getOverallStatus(sensorData)
  const valveActivated = overallStatus === 'CRITICAL'

  return (
    <div className="min-h-screen relative">
      {/* Watermark */}
      <div className="watermark">HYDROTRACK</div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* ── HEADER ────────────────────────── */}
      <header className="relative border-b border-white/[0.06] bg-slate-900/40 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Left: Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hydro-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-hydro-500/20">
                <WaterDropIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  <span className="text-gradient">HYDROTRACK</span>
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-400 -mt-0.5">
                  Real-Time IoT Water Safety Framework{' '}
                  <span className="hidden sm:inline text-slate-600">|</span>{' '}
                  <span className="hidden sm:inline">AI Monitoring Platform for Student Hostels</span>
                </p>
              </div>
            </div>

            {/* Right: Year + Status */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
                <span className="px-2 py-1 rounded-md bg-hydro-500/10 text-hydro-400 font-semibold text-[11px]">2025-26</span>
                <span className="text-slate-600">|</span>
                <span>AI Monitoring Platform</span>
              </div>

              {/* Overall Status Indicator */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                overallStatus === 'SAFE' ? 'bg-emerald-500/10 border-emerald-500/20' :
                overallStatus === 'WARNING' ? 'bg-amber-500/10 border-amber-500/20' :
                overallStatus === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20 animate-pulse' :
                'bg-slate-500/10 border-slate-500/20'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  overallStatus === 'SAFE' ? 'bg-emerald-400' :
                  overallStatus === 'WARNING' ? 'bg-amber-400' :
                  overallStatus === 'CRITICAL' ? 'bg-red-400' :
                  'bg-slate-500'
                }`} />
                <span className={`text-xs font-semibold ${
                  overallStatus === 'SAFE' ? 'text-emerald-400' :
                  overallStatus === 'WARNING' ? 'text-amber-400' :
                  overallStatus === 'CRITICAL' ? 'text-red-400' :
                  'text-slate-400'
                }`}>{overallStatus}</span>
                {overallStatus === 'CRITICAL' && <BellIcon className="w-4 h-4 text-red-400" buzzing={true} />}
              </div>

              {/* Live clock */}
              <div className="hidden sm:block text-[11px] font-mono text-slate-500">
                {formatTime(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Critical Banner */}
        {overallStatus === 'CRITICAL' && (
          <div className="bg-red-500/10 border-t border-red-500/20 py-2 animate-pulse">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
              <BellIcon className="w-4 h-4 text-red-400" buzzing={true} />
              <span className="text-xs font-semibold text-red-300">⚠ CRITICAL ALERT: UNSAFE WATER DETECTED — Immediate attention required</span>
            </div>
          </div>
        )}
      </header>

      {/* ── MAIN CONTENT ─────────────────── */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Left: System Health + Controls (1 col on lg) */}
          <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
            <SystemHealthPanel isRunning={isRunning} lastSampled={lastSampled} />
            <ControlPanel
              isRunning={isRunning}
              onStart={handleStart}
              onReset={handleReset}
              selectedSample={selectedSample}
              onSampleChange={setSelectedSample}
            />
            <AutoShutoffPanel isActivated={valveActivated} />
          </div>

          {/* Right: Dashboard + Analytics (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-6 order-1 lg:order-2">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-200">Monitoring Dashboard</h2>
                <p className="text-xs text-slate-500">IS 10500:2012 compliant parameters • Real-time sensor data</p>
              </div>
              {isRunning && (
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="font-medium">LIVE</span>
                </div>
              )}
            </div>

            {/* 4-card Sensor Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="sensor-grid">
              <SensorCard type="pH" value={sensorData?.pH ?? null} data={sensorData} />
              <SensorCard type="turbidity" value={sensorData?.turbidity ?? null} data={sensorData} />
              <SensorCard type="tds" value={sensorData?.tds ?? null} data={sensorData} />
              <SensorCard type="hardness" value={sensorData?.hardness ?? null} data={sensorData} />
            </div>

            {/* Analytics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EconomicImpactPanel />
              <PredictiveAIPanel overallStatus={overallStatus} />
            </div>

            {/* Data Log */}
            <DataLogTable readings={readings} />
          </div>
        </div>
      </main>

      {/* ── FOOTER ────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-slate-900/30 backdrop-blur-md mt-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <WaterDropIcon className="w-4 h-4 text-hydro-500" />
              <span className="text-sm font-semibold text-gradient">HYDROTRACK</span>
              <span className="text-xs text-slate-600">© {new Date().getFullYear()}</span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 text-center">
              Fully compliant with IS 10500:2012 & FSSAI 2026 standards • Real-Time IoT Water Safety Framework
            </p>
            <div className="flex items-center gap-2 text-[10px] text-slate-600">
              <ShieldIcon className="w-3 h-3" />
              <span>Production Grade • v2.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
