import { useRef, useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, ShieldCheck, Zap, Droplets, Activity, Database, Users, User, Menu, X, ArrowRight, BarChart3, Mail, MapPin, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/* ═══════════════════════════════════════════════════════════════════
   LandingPage — Full Single Page Application Style Landing
   Light, Clean, and Modern Theme 
   ═══════════════════════════════════════════════════════════════════ */

// ── Glowing Grid + Particles + Connection Lines Background ──────────
function GridBackground() {
  const particles = useMemo(() => 
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      r: Math.random() * 1.5 + 0.5,
      dur: Math.random() * 20 + 10,
      delay: Math.random() * -20,
    })), 
  [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden', background: '#f8fafc' }}>
      {/* Base light gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #ffffff 0%, #f1f5f9 40%, #e2e8f0 70%, #ffffff 100%)',
      }} />

      {/* Ripple flow effect */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '-20%', left: '10%', right: '10%', height: '60%',
          background: 'radial-gradient(ellipse at center, rgba(0,184,169,0.08) 0%, transparent 60%)',
          filter: 'blur(50px)', transformOrigin: 'bottom center',
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'absolute', bottom: '-25%', left: '-10%', right: '-10%', height: '70%',
          background: 'radial-gradient(ellipse at center, rgba(0,184,169,0.06) 0%, transparent 60%)',
          filter: 'blur(60px)', transformOrigin: 'bottom center',
        }}
      />

      {/* Glowing grid SVG */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4 }}>
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="gridFade" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="gridMask">
            <rect width="100%" height="100%" fill="url(#gridFade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridMask)" />
      </svg>

      {/* Small floating particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          animate={{
            y: ['0vh', '-100vh'], opacity: [0, 0.5, 0], x: ['0px', `${Math.random() * 100 - 50}px`, '0px']
          }}
          transition={{
            y: { duration: p.dur, repeat: Infinity, ease: 'linear', delay: p.delay },
            opacity: { duration: p.dur, repeat: Infinity, ease: 'linear', delay: p.delay },
            x: { duration: p.dur * 0.5, repeat: Infinity, ease: 'easeInOut', delay: p.delay }
          }}
          style={{
            position: 'absolute', left: p.x, bottom: '-5%',
            width: `${p.r * 2}px`, height: `${p.r * 2}px`, borderRadius: '50%',
            background: '#00B8A9', boxShadow: '0 0 6px rgba(0,184,169,0.4)'
          }}
        />
      ))}
    </div>
  )
}

// ── Top Navigation Bar ──────────────────────────────────────────────
const NAV_LINKS = ['Home', 'About', 'Features', 'Architecture', 'Demo', 'Team', 'Contact']

function TopNavbar() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_LINKS.map(link => document.getElementById(link.toLowerCase()))
      const scrollPos = window.scrollY + 100
      let current = 'home'
      for (const section of sections) {
        if (section && section.offsetTop <= scrollPos) {
          current = section.getAttribute('id')
        }
      }
      setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    setMobileMenuOpen(false)
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 clamp(16px, 5vw, 48px)', height: '76px',
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => scrollToSection('home')}>
          {/* Logo Molecule */}
          <div style={{ position: 'relative', width: '38px', height: '38px', flexShrink: 0 }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              width: '24px', height: '24px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #00B8A9, #00877C)',
              boxShadow: '0 0 12px rgba(0,184,169,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 800, color: '#ffffff',
            }}>O</div>
            <div style={{
              position: 'absolute', top: '0', left: '0', width: '14px', height: '14px', borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #00B8A9, #00877C)', boxShadow: '0 0 8px rgba(0,184,169,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', fontWeight: 800, color: '#fff'
            }}>H</div>
            <div style={{
              position: 'absolute', top: '0', right: '0', width: '14px', height: '14px', borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #00B8A9, #00877C)', boxShadow: '0 0 8px rgba(0,184,169,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', fontWeight: 800, color: '#fff'
            }}>H</div>
          </div>
          <span style={{
            fontSize: '22px', fontWeight: 900, letterSpacing: '0.06em',
            color: '#0f172a'
          }}>HYDROTRACK</span>
        </div>

        {/* Desktop Nav */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '32px' }} className="md-flex">
          {NAV_LINKS.map(link => {
            const id = link.toLowerCase()
            const isActive = activeSection === id
            return (
              <span
                key={id} onClick={() => scrollToSection(id)}
                style={{
                  cursor: 'pointer', fontSize: '13px', fontWeight: 600, letterSpacing: '0.03em',
                  color: isActive ? '#00B8A9' : '#475569', transition: 'color 0.2s',
                  position: 'relative',
                }}
              >
                {link}
                {isActive && (
                  <motion.div layoutId="navIndicator" style={{ position: 'absolute', bottom: '-6px', left: 0, right: 0, height: '2px', background: '#00B8A9', borderRadius: '2px' }} />
                )}
              </span>
            )
          })}
        </nav>

        {/* Action / Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <motion.button onClick={() => navigate('/dashboard')}
            whileHover={{ scale: 1.03, boxShadow: '0 4px 15px rgba(0,184,169,0.3)' }} whileTap={{ scale: 0.97 }}
            style={{
              display: 'none', padding: '10px 24px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
              color: '#ffffff', background: '#00B8A9', border: 'none',
              cursor: 'pointer', letterSpacing: '0.04em'
            }} className="md-block">
            Dashboard
          </motion.button>

          {/* Logout Button — Desktop */}
          {user && (
            <motion.button onClick={handleLogout}
              whileHover={{ scale: 1.03, boxShadow: '0 4px 15px rgba(239,68,68,0.25)' }} whileTap={{ scale: 0.97 }}
              style={{
                display: 'none', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
                color: '#ffffff', background: '#ef4444', border: 'none',
                cursor: 'pointer', letterSpacing: '0.04em', alignItems: 'center', gap: '6px',
              }} className="md-flex-btn">
              <LogOut size={15} /> Logout
            </motion.button>
          )}
          
          <button className="md-hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ all: 'unset', cursor: 'pointer', color: '#0f172a' }}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: '76px', left: 0, right: 0, zIndex: 99,
              background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(0,0,0,0.05)',
              padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px',
            }}
          >
            {NAV_LINKS.map(link => (
              <span key={link} onClick={() => scrollToSection(link.toLowerCase())} style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', padding: '10px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                {link}
              </span>
            ))}
            <button onClick={() => navigate('/dashboard')} style={{ padding: '14px', borderRadius: '12px', background: '#00B8A9', color: '#ffffff', fontWeight: 800, marginTop: '10px', textAlign: 'center', border: 'none', cursor: 'pointer' }}>
              Launch Dashboard
            </button>
            {user && (
              <button onClick={handleLogout} style={{ padding: '14px', borderRadius: '12px', background: '#ef4444', color: '#ffffff', fontWeight: 800, marginTop: '6px', textAlign: 'center', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <LogOut size={16} /> Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) { .md-flex { display: flex !important; } .md-block { display: block !important; } .md-flex-btn { display: inline-flex !important; } .md-hidden { display: none !important; } }
      `}</style>
    </>
  )
}

// ── Shared UI Components ────────────────────────────────────────────
function MagneticButton({ children, onClick, variant = 'primary' }) {
  const ref = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setOffset({ x: (e.clientX - rect.left - rect.width / 2) * 0.22, y: (e.clientY - rect.top - rect.height / 2) * 0.22 })
  }

  const isPrimary = variant === 'primary'

  return (
    <motion.button ref={ref} onClick={onClick} onMouseMove={handleMouseMove} onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }} whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      style={{
        all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px',
        padding: isPrimary ? '18px 42px' : '17px 40px', borderRadius: '14px', fontSize: '15px', fontWeight: 700,
        letterSpacing: '0.04em', position: 'relative', overflow: 'hidden',
        ...(isPrimary ? {
          color: '#ffffff', background: '#00B8A9', boxShadow: '0 8px 25px rgba(0,184,169,0.3)',
        } : {
          color: '#00B8A9', background: 'transparent', border: '2px solid #00B8A9', boxShadow: '0 4px 15px rgba(0,184,169,0.1)',
        }),
      }}>
      {isPrimary && (
        <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.5 }}
          style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', pointerEvents: 'none' }} />
      )}
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </motion.button>
  )
}

function SectionHeading({ title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '16px',
          color: '#0f172a'
        }}>{title}</motion.h2>
      {subtitle && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
        style={{ fontSize: '16px', color: '#475569', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>{subtitle}</motion.p>}
    </div>
  )
}

// ── Sections ────────────────────────────────────────────────────────

function HomeSection({ navigate }) {
  return (
    <section id="home" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: '160px', paddingBottom: '100px', minHeight: '100vh', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: '999px', marginBottom: '32px',
          background: 'rgba(0,184,169,0.1)', border: '1px solid rgba(0,184,169,0.3)',
        }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00B8A9', animation: 'dotPulse 1.5s ease-in-out infinite' }} />
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#009a8d', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Real-Time IoT Water Safety Intelligence</span>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ delay: 0.1, duration: 0.8 }}
        style={{ fontSize: 'clamp(3.5rem, 9vw, 7.5rem)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: '24px', color: '#0f172a' }}>
        HYDROTRACK
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#475569', lineHeight: 1.7, maxWidth: '650px', margin: '0 auto 8px', fontWeight: 500 }}>
        Real-time IoT water safety intelligence for institutional campuses. Edge-AI powered. Bureau of Indian Standards compliant.
      </motion.p>
      
      <motion.p initial={{ opacity: 0, filter: 'blur(5px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ delay: 0.45, duration: 0.8 }}
        style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: '#00B8A9', letterSpacing: '0.05em', fontFamily: "'JetBrains Mono', monospace" }}>
        {'>'} Built for institutional safety.
      </motion.p>

      {/* Another badge requested */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          margin: '12px 0 32px', display: 'flex', justifyContent: 'center'
        }}>
         <div style={{
           fontSize: '14px', fontWeight: 600, color: '#009a8d',
           display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '10px 24px',
           borderRadius: '99px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
         }}>
            <Activity size={18} color="#00B8A9" />
            Real-time Water Quality Monitoring
         </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <MagneticButton variant="primary" onClick={() => navigate('/dashboard')}>Launch Dashboard <ArrowRight size={18}/></MagneticButton>
        <MagneticButton variant="outline" onClick={() => { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) }}>Explore Features</MagneticButton>
      </motion.div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    { icon: <Zap size={28} />, title: '5s Detection Latency', desc: 'Instantaneous data transmission ensures zero-delay contamination alerts.' },
    { icon: <Cpu size={28} />, title: 'Edge-AI Powered Analysis', desc: 'LSTM neural networks forecast water quality trends 48 hours in advance.' },
    { icon: <ShieldCheck size={28} />, title: 'IS 10500 Compliant', desc: 'Strict regulatory adherence mapped natively to Indian Standards for Drinking Water.' },
    { icon: <Droplets size={28} />, title: '4-Parameter Sensing', desc: 'Simultaneous monitoring of pH, Turbidity, Total Dissolved Solids (TDS), and Hardness.' },
    { icon: <Activity size={28} />, title: 'Real-time Alerts', desc: 'Automated critical notifications and shutoff valve triggers on safety breaches.' },
    { icon: <BarChart3 size={28} />, title: 'Historical Analytics', desc: 'Deep data logging and visual reporting for facility audits and compliance.' },
  ]

  return (
    <section id="features" style={{ padding: '120px 24px', position: 'relative', zIndex: 1 }}>
      <SectionHeading title="Powerful Features" subtitle="Enterprise-grade IoT infrastructure deployed for rigorous institutional safety." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', maxWidth: '1200px', margin: '0 auto' }}>
        {features.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8, boxShadow: '0 15px 40px rgba(0,0,0,0.08)' }}
            style={{
              padding: '40px 32px', borderRadius: '24px', background: '#ffffff',
              border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'all 0.3s ease'
            }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(0,184,169,0.1)', color: '#00B8A9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              {f.icon}
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>{f.title}</h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about" style={{ padding: '100px 24px', position: 'relative', zIndex: 1, background: 'linear-gradient(180deg, transparent, rgba(0,184,169,0.04), transparent)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
          style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#00B8A9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', boxShadow: '0 10px 25px rgba(0,184,169,0.3)' }}>
          <ShieldCheck size={40} color="#ffffff" />
        </motion.div>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>The HYDROTRACK Mission</h2>
        <p style={{ fontSize: 'clamp(16px, 2vw, 18px)', color: '#475569', lineHeight: 1.8, maxWidth: '800px', marginBottom: '40px' }}>
          Born from the labs of NIAT VGU, HYDROTRACK was engineered to bridge the gap between reactive water testing and proactive health safety. By combining standard edge hardware with sophisticated cloud-based machine learning networks, we deliver a 24/7 autonomous sentinel for institutional water supplies.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', width: '100%' }}>
           <div style={{ padding: '24px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}><h4 style={{ fontSize: '32px', fontWeight: 900, color: '#00B8A9' }}>0</h4><p style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Manual Tests Required</p></div>
           <div style={{ padding: '24px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}><h4 style={{ fontSize: '32px', fontWeight: 900, color: '#00B8A9' }}>24/7</h4><p style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Continuous Monitoring</p></div>
           <div style={{ padding: '24px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}><h4 style={{ fontSize: '32px', fontWeight: 900, color: '#00B8A9' }}>98%</h4><p style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Cost Reduction</p></div>
        </div>
      </div>
    </section>
  )
}

function ArchitectureSection() {
  return (
    <section id="architecture" style={{ padding: '120px 24px', position: 'relative', zIndex: 1 }}>
      <SectionHeading title="System Architecture" subtitle="How our Edge-to-Cloud data pipeline securely processes physical water samples into actionable intelligence." />
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ height: '400px', borderRadius: '24px', background: '#ffffff', border: '2px dashed #cbd5e1', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(0,184,169,0.05), transparent 70%)' }} />
          
          <Database size={48} color="#00B8A9" style={{ marginBottom: '20px', zIndex: 1 }} />
          <h3 style={{ fontSize: '20px', color: '#0f172a', fontWeight: 700, zIndex: 1 }}>Interactive Diagram Area</h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px', zIndex: 1 }}>[NodeMCU → Firebase RTDB → React Dashboard → LSTM Python Edge]</p>
        </motion.div>
      </div>
    </section>
  )
}

function DemoSection({ navigate }) {
  return (
    <section id="demo" style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'linear-gradient(135deg, #ffffff, #f1f5f9)', borderRadius: '32px', border: '1px solid #e2e8f0', padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.06)' }}>
         <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }} style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(0,184,169,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
            <Activity size={40} color="#00B8A9" />
         </motion.div>
         <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>See HYDROTRACK in Action.</h2>
         <p style={{ fontSize: '16px', color: '#475569', maxWidth: '600px', marginBottom: '40px', lineHeight: 1.6 }}>Experience the real-time React dashboard simulation. Inject sample data, visualize historical trends, and trigger auto-shutoff security protocols instantly.</p>
         <MagneticButton onClick={() => navigate('/dashboard')}>Launch Live Demo</MagneticButton>
      </div>
    </section>
  )
}

function TeamSection() {
  const students = [
    { num: '01', name: 'Prashant Singh', role: 'Full Stack Developer & Project Lead' },
    { num: '02', name: 'Divyansh Sharma', role: 'Firmware & Embedded Systems' },
    { num: '03', name: 'Shreyansh Purohit', role: 'Testing & Validation' },
    { num: '04', name: 'Simran Kumari', role: 'Data Analysis & Visualization' },
    { num: '05', name: 'Abhinav Raj', role: 'Hardware Integration' },
  ]

  return (
    <section id="team" style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
      <SectionHeading title="The Team Behind HYDROTRACK" subtitle="Developed proudly at NIAT VGU to secure modern institutional infrastructure." />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Supervisor Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          whileHover={{ y: -8, boxShadow: '0 15px 40px rgba(0,0,0,0.08)' }}
          style={{ padding: '40px', borderRadius: '24px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease' }}>
          
          <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(0,184,169,0.05) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
          
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,184,169,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <User size={30} color="#00B8A9" />
          </div>
          
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Dr. Manish Kumar Goyal</h3>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#00B8A9', letterSpacing: '0.04em', marginBottom: '16px' }}>Project Supervisor & Mentor</p>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, flexGrow: 1, marginBottom: '32px' }}>
            "Guiding the team through research direction, technical reviews, and validation — ensuring HYDROTRACK meets real-world deployment standards."
          </p>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', background: 'rgba(0,184,169,0.1)', alignSelf: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#009a8d' }}>Vivekananda Global University</span>
          </div>
        </motion.div>

        {/* Student Team Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          whileHover={{ y: -8, boxShadow: '0 15px 40px rgba(0,0,0,0.08)' }}
          style={{ padding: '40px', borderRadius: '24px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease' }}>
          
          <div style={{ position: 'absolute', top: 0, left: 0, width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(148,163,184,0.08) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
          
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,184,169,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <Users size={30} color="#00B8A9" />
          </div>
          
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Student Team</h3>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#00B8A9', letterSpacing: '0.04em', marginBottom: '24px' }}>Hardware & ML Engineering</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {students.map((st, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '14px', borderBottom: idx !== students.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#cbd5e1', fontFamily: "'JetBrains Mono', monospace" }}>{st.num}.</span>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>{st.name}</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{st.role}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section id="contact" style={{ padding: '100px 24px 40px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '80px' }}>
         <SectionHeading title="Get in Touch" subtitle="Interested in deploying HYDROTRACK at your campus? Contact our research team for deployment details." />
         <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '16px 32px', borderRadius: '99px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}><Mail size={18} color="#00B8A9" /><span style={{ color: '#0f172a', fontWeight: 600 }}>research@niatvgu.edu</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '16px 32px', borderRadius: '99px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}><MapPin size={18} color="#00B8A9" /><span style={{ color: '#0f172a', fontWeight: 600 }}>NIAT VGU Campus</span></div>
         </div>
      </div>
      
      {/* Footer Element */}
      <footer style={{ borderTop: '1px solid #e2e8f0', paddingTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '13px', color: '#64748b', letterSpacing: '0.04em' }}>
        <span style={{ fontWeight: 800, color: '#0f172a' }}>NIAT VGU</span> · <span>2025-26 Research Project</span> · <span>v3.0</span>
      </footer>
    </section>
  )
}

// ── Page ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Add smooth scrolling to html element for hash links
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = 'auto'; }
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
      style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      <GridBackground />
      <TopNavbar />
      <HomeSection navigate={navigate} />
      <AboutSection />
      <FeaturesSection />
      <ArchitectureSection />
      <DemoSection navigate={navigate} />
      <TeamSection />
      <ContactSection />
    </motion.div>
  )
}
