import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useSensor } from './context/SensorContext'
import { useAuth } from './context/AuthContext'

import MeshBackground from './components/MeshBackground'
import FloatingNavbar from './components/FloatingNavbar'
import ToastContainer from './components/ToastContainer'
import ProtectedRoute from './components/ProtectedRoute'

import LandingPage    from './pages/LandingPage'
import DashboardPage  from './pages/DashboardPage'
import AnalyticsPage  from './pages/AnalyticsPage'
import SettingsPage   from './pages/SettingsPage'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'

import './App.css'

/* ═══════════════════════════════════════════════════════════════════
   App — Router shell.
   Guest-only routes : /login, /register  (redirect to / if logged in)
   Protected routes  : /, /dashboard, /analytics, /settings  (require auth)
   Persistent layers : MeshBackground, FloatingNavbar, ToastContainer
   ═══════════════════════════════════════════════════════════════════ */

/* GuestRoute — redirects logged-in users away from /login and /register */
function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null              // wait for silent-refresh before deciding
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const location = useLocation()
  const { toasts, dismissToast } = useSensor()

  // Auth pages manage their own full-page layout
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div style={{ minHeight: '100vh', position: 'relative', fontFamily: "'Inter', sans-serif" }}>
      {/* MeshBackground & FloatingNavbar only for authenticated app pages */}
      {!isAuthPage && <MeshBackground />}
      {!isAuthPage && <FloatingNavbar />}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Watermark — hidden on auth pages */}
      {!isAuthPage && (
        <div style={{
          position: 'fixed', bottom: '40px', right: '40px',
          fontSize: '7rem', fontWeight: 900, opacity: 0.015,
          pointerEvents: 'none', userSelect: 'none', zIndex: 0,
          color: '#00f2ff', letterSpacing: '0.05em',
        }}>HYDROTRACK</div>
      )}

      {/* Page routes with AnimatePresence transitions */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* ── Guest-only routes ── */}
          <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

          {/* ── ALL other routes are protected ── */}
          <Route path="/" element={
            <ProtectedRoute><LandingPage /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute><AnalyticsPage /></ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute><SettingsPage /></ProtectedRoute>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
