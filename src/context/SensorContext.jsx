import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

/* ════════════════════════════════════════════════════════════════════════
   SensorContext — All simulation state & logic, lifted verbatim from App.
   NOTHING in this file was rewritten — only moved here so every page
   can subscribe via useSensor().
   ════════════════════════════════════════════════════════════════════════ */

// ─── Constants ──────────────────────────────────────────────────────────
export const SAMPLING_INTERVAL = 5000

export const TEST_SAMPLES = {
  'sample-a': { name: 'Sample A (Tap Water)', pH: 7.2, turbidity: 2.1, tds: 320, hardness: 180 },
  'sample-b': { name: 'Sample B (Acidic)', pH: 3.8, turbidity: 1.5, tds: 580, hardness: 420 },
  'sample-c': { name: 'Sample C (Alkaline/Secondary)', pH: 9.4, turbidity: 8.7, tds: 1200, hardness: 750 },
  'sample-d': { name: 'Sample D (Filtered)', pH: 7.0, turbidity: 0.8, tds: 150, hardness: 90 },
}

export const SENSOR_CONFIG = {
  pH:        { label: 'pH Level',              unit: '',    icon: '⚗️', description: 'Acidity/alkalinity balance',    safeMin: 6.5, safeMax: 8.5,  min: 0, max: 14   },
  turbidity: { label: 'Turbidity',             unit: 'NTU', icon: '💧', description: 'Water clarity measure',         safeMax: 1,   warnMax: 5,    min: 0, max: 15   },
  tds:       { label: 'Total Dissolved Solids', unit: 'mg/L',icon: '🔬', description: 'Dissolved mineral content',    safeMax: 500, warnMax: 1000, min: 0, max: 2000 },
  hardness:  { label: 'Water Hardness',        unit: 'mg/L',icon: '🧪', description: 'Calcium & magnesium levels',   safeMax: 200, warnMax: 600,  min: 0, max: 1000 },
}

// ─── Utility Functions ──────────────────────────────────────────────────
export function getStatus(type, value) {
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

export function getOverallStatus(data) {
  if (!data) return 'IDLE'
  const pH = data?.pH
  const turbidity = data?.turbidity
  const tds = data?.tds
  const hardness = data?.hardness

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

export function formatTime(date) {
  return date?.toLocaleTimeString?.('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) ?? '--:--:--'
}

// ─── Helper: build StatModule-compatible props for a sensor type ────────
export function getStatProps(sensorData, type) {
  const cfg = SENSOR_CONFIG[type]
  const value = sensorData?.[type] ?? null
  const rawStatus = getStatus(type, value)
  const status = rawStatus === 'SAFE' ? 'safe' : rawStatus === 'IDLE' ? 'safe' : 'alert'
  const isIdle = value == null
  let threshold = ''
  if (type === 'pH') threshold = `${cfg.safeMin} – ${cfg.safeMax}`
  else threshold = `≤ ${cfg.safeMax} ${cfg.unit}`
  const percentage = value != null
    ? Math.min(100, Math.max(0, ((value - (cfg.min ?? 0)) / ((cfg.max ?? 1) - (cfg.min ?? 0))) * 100))
    : 0
  return { label: cfg.label, value: isIdle ? null : value, unit: cfg.unit, status, threshold, percentage }
}

// ─── Context ────────────────────────────────────────────────────────────
const SensorContext = createContext(null)

export function SensorProvider({ children }) {
  const [isRunning, setIsRunning]       = useState(false)
  const [sensorData, setSensorData]     = useState(null)
  const [selectedSample, setSelectedSample] = useState('')
  const [readings, setReadings]         = useState([])
  const [lastSampled, setLastSampled]   = useState(null)
  const [toasts, setToasts]             = useState([])
  const [currentTime, setCurrentTime]   = useState(new Date())
  const intervalRef = useRef(null)
  const toastIdRef  = useRef(0)

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

  const criticalAlerts = sensorData && overallStatus === 'CRITICAL'
    ? (['pH', 'turbidity', 'tds', 'hardness']
        .filter(t => getStatus(t, sensorData?.[t]) === 'CRITICAL')
        .map(t => ({ sensor: SENSOR_CONFIG[t].label, reading: sensorData[t] })))
    : []

  const value = {
    isRunning, sensorData, selectedSample, readings, lastSampled,
    toasts, currentTime, overallStatus, valveActivated, criticalAlerts,
    setSelectedSample, handleStart, handleReset, dismissToast, addToast,
  }

  return <SensorContext.Provider value={value}>{children}</SensorContext.Provider>
}

export function useSensor() {
  const ctx = useContext(SensorContext)
  if (!ctx) throw new Error('useSensor must be used within SensorProvider')
  return ctx
}
