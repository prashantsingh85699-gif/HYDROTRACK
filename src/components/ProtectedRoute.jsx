/* ═══════════════════════════════════════════════════════════════════
   ProtectedRoute — redirects unauthenticated users to /login
   Shows a full-screen water spinner while auth state is loading.
   ═══════════════════════════════════════════════════════════════════ */

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #CAF0F8 0%, #ffffff 100%)',
        gap: '1.5rem',
      }}>
        {/* Animated water drop spinner */}
        <div style={{ position: 'relative', width: 64, height: 64 }}>
          <div style={{
            width: 64, height: 64,
            borderRadius: '50% 50% 50% 0',
            transform: 'rotate(-45deg)',
            background: 'linear-gradient(135deg, #0077B6, #00B4D8)',
            animation: 'dropSpin 1.2s ease-in-out infinite',
          }} />
        </div>
        <p style={{ color: '#0077B6', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '0.95rem' }}>
          Verifying session…
        </p>
        <style>{`
          @keyframes dropSpin {
            0%   { transform: rotate(-45deg) scale(1);    opacity: 1;   }
            50%  { transform: rotate(135deg) scale(0.85); opacity: 0.7; }
            100% { transform: rotate(-45deg) scale(1);    opacity: 1;   }
          }
        `}</style>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
