import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Seal from './Seal.jsx'

// Order and labels match the agreed sitemap.
const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'What we do', to: '/what-we-do' },
  { label: 'Membership', to: '/membership' },
  { label: 'Certification', to: '/certification' },
  { label: 'Governance', to: '/governance' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header style={{ position: 'fixed', top: 16, left: 0, right: 0, zIndex: 50, padding: '0 16px' }}>
      <nav
        className="flex items-center justify-between"
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          borderRadius: 999,
          padding: '10px 28px',
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          // Slightly firmer edge on inner pages, where the bar sits over light sections.
          border: isHome ? '1px solid rgba(255,255,255,0.96)' : '1px solid rgba(0,20,45,0.08)',
          boxShadow: '0 16px 34px rgba(0,20,45,0.12), inset 0 1px 0 rgba(255,255,255,0.95)',
        }}
      >
        <Link to="/" className="brand-link" aria-label="ACEL home">
          <span style={{ display: 'flex', width: 54, height: 54, flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', background: '#FFFFFF', boxShadow: '0 4px 12px rgba(0,20,45,0.14)' }}>
            <Seal size={44} />
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontFamily: "'Fraunces', serif", color: '#00142D', fontSize: 22, letterSpacing: '-0.01em', lineHeight: 1 }}>
            <span>ACEL</span>
            <span style={{ maxWidth: 148, color: '#C37C0C', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10.5, fontWeight: 600, lineHeight: 1.15, letterSpacing: '0.01em', marginTop: 4 }}>
              African Chamber<br />of ESG Leadership
            </span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center" style={{ gap: 34, color: '#1F3046', fontSize: 15, fontWeight: 500, listStyle: 'none' }}>
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className="nav-link" style={{ color: 'inherit', textDecoration: 'none' }}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Link to="/membership/apply" className="liquid-btn liquid-btn-nav" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            <span className="liquid-blob" />
            <span className="liquid-blob two" />
            <span className="liquid-label">Become a member</span>
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="lg:hidden"
          style={{ color: '#00142D', background: 'rgba(0,20,45,0.06)', border: '1px solid rgba(0,20,45,0.12)', borderRadius: 999, padding: 8 }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div
          className="lg:hidden"
          style={{
            maxWidth: 1240,
            margin: '8px auto 0',
            borderRadius: 20,
            padding: '22px 26px',
            background: 'rgba(255,255,255,0.94)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(255,255,255,0.96)',
            boxShadow: '0 16px 34px rgba(0,20,45,0.12)',
          }}
        >
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, color: '#00142D', fontSize: 17, listStyle: 'none', padding: 0, margin: 0 }}>
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  style={({ isActive }) => ({
                    color: isActive ? '#C37C0C' : 'inherit',
                    textDecoration: 'none',
                    display: 'block',
                    padding: '10px 12px',
                    borderRadius: 12,
                  })}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link
            to="/membership/apply"
            className="liquid-btn liquid-btn-nav"
            style={{ marginTop: 18, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            <span className="liquid-blob" />
            <span className="liquid-blob two" />
            <span className="liquid-label">Become a member</span>
          </Link>
        </div>
      )}
    </header>
  )
}
