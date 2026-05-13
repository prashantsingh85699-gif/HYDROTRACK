import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Home, LayoutDashboard, BarChart2, Settings, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function FloatingNavbar() {
  const location = useLocation()
  const navigate  = useNavigate()
  const { logout, user } = useAuth()

  const navItems = [
    { to: '/',           icon: Home,            label: 'Home'      },
    { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/analytics',  icon: BarChart2,       label: 'Analytics' },
    { to: '/settings',   icon: Settings,        label: 'Settings'  },
  ]

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <motion.nav
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.2 }}
      style={{
        position: 'fixed', top: '50%', left: '16px', transform: 'translateY(-50%)',
        width: '64px', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '6px', padding: '18px 0', borderRadius: '2rem',
        background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      }}
    >
      {/* Logo dot */}
      <div style={{ marginBottom: '6px' }}>
        <div style={{
          width: '30px', height: '30px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #00f2ff, #818cf8)',
          boxShadow: '0 0 14px rgba(0,242,255,0.5)',
        }} />
      </div>

      <div style={{ width: '36px', height: '1px', background: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />

      {navItems.map(({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to
        return (
          <NavLink
            key={to} to={to} title={label}
            style={{
              textDecoration: 'none', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '4px',
              padding: '10px 0', width: '48px', borderRadius: '14px',
              background: isActive ? 'rgba(0,242,255,0.12)' : 'transparent',
              transition: 'background 0.2s ease', position: 'relative',
            }}
          >
            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.92 }}>
              <Icon size={20} style={{ color: isActive ? '#00f2ff' : '#94a3b8', transition: 'color 0.2s' }} />
            </motion.div>
            {isActive && (
              <motion.div
                layoutId="nav-active-indicator"
                style={{ width: '18px', height: '2px', borderRadius: '2px', background: '#00f2ff', boxShadow: '0 0 8px rgba(0,242,255,0.7)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span style={{ fontSize: '8px', fontWeight: 600, color: isActive ? '#00f2ff' : '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {label}
            </span>
          </NavLink>
        )
      })}

      {/* Divider + Logout */}
      <div style={{ width: '36px', height: '1px', background: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />

      {user && (
        <>
          {/* User avatar initial */}
          <div title={user.name} style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0077B6, #00B4D8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 800, color: '#fff',
            border: '2px solid rgba(0,242,255,0.3)',
            cursor: 'default',
          }}>
            {user.name?.[0]?.toUpperCase() ?? '?'}
          </div>

          {/* Logout button */}
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            title="Sign out"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '4px', padding: '8px 0', width: '48px', borderRadius: '14px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={18} style={{ color: '#64748b' }} />
            <span style={{ fontSize: '7px', fontWeight: 600, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Out
            </span>
          </motion.button>
        </>
      )}
    </motion.nav>
  )
}
