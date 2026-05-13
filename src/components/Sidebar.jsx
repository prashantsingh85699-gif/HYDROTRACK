// FILE: src/components/Sidebar.jsx
import { useState } from 'react'
import { LayoutDashboard, Activity, ShieldCheck, FlaskConical, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Activity,        label: 'Live Feed',  id: 'live'      },
  { icon: ShieldCheck,     label: 'Compliance', id: 'compliance'},
  { icon: FlaskConical,    label: 'Analysis',   id: 'analysis'  },
  { icon: Settings,        label: 'Settings',   id: 'settings'  },
]

export default function Sidebar() {
  const [active, setActive] = useState('dashboard')

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      style={{
        position: 'fixed', top: '50%', left: '16px', transform: 'translateY(-50%)',
        width: '64px', zIndex: 50, display: 'flex', flexDirection: 'column', gap: '8px',
        padding: '16px 8px', borderRadius: '1.5rem',
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
      }}
    >
      {/* Logo dot */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #00B8A9, #00877C)',
          boxShadow: '0 0 10px rgba(0,184,169,0.3)',
        }} />
      </div>

      <div style={{ width: '100%', height: '1px', background: 'rgba(0,0,0,0.05)', margin: '4px 0' }} />

      {navItems.map(({ icon: Icon, label, id }) => {
        const isActive = active === id
        return (
          <button
            key={id} onClick={() => setActive(id)} title={label}
            style={{
              all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '10px 0',
              borderRadius: '1rem', transition: 'background 0.2s ease',
              background: isActive ? 'rgba(0,184,169,0.1)' : 'transparent', position: 'relative',
            }}
          >
            <Icon size={20} style={{ color: isActive ? '#00B8A9' : '#64748b', transition: 'color 0.2s' }} />
            {isActive && (
              <motion.div
                layoutId="sidebar-underline"
                style={{ width: '20px', height: '2px', borderRadius: '2px', background: '#00B8A9', boxShadow: '0 0 4px rgba(0,184,169,0.4)' }}
              />
            )}
          </button>
        )
      })}
    </motion.aside>
  )
}
