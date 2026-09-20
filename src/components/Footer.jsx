import { Link } from 'react-router-dom'
import Seal from './Seal.jsx'
import { useState } from 'react'
import { footer, meta } from '../data/content.js'

// Footer label -> route. "Sectors" points at a section on another page.
const FOOTER_LINK_TARGETS = {
  About: '/about',
  'What we do': '/what-we-do',
  Membership: '/membership',
  Certification: '/certification',
  Governance: '/governance',
  Sectors: '/what-we-do#sectors',
  'Become a member': '/membership/apply',
  'Member directory': '/membership/directory',
  'Verify a certificate': '/certification/verify',
  Contact: '/contact',
}

const linkTo = (label) => FOOTER_LINK_TARGETS[label] || '/'

export default function Footer() {
  const columns = Array.isArray(footer?.columns) ? footer.columns : []
  const [openColumns, setOpenColumns] = useState({})

  return (
    <footer className="section-dark text-paper pt-16 pb-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src="/footer-background.jfif"
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover scale-110 blur-[24px] saturate-[0.8] brightness-[0.42]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-deep/55 via-emerald-deep/80 to-ink/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(143,212,164,0.2),transparent_28rem)]" />
      </div>

      <div className="container-edge relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 pb-10 border-b border-paper/10">
          {/* Brand column — mark, name, tagline, about copy, all stacked as one unit */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="flex items-center gap-3.5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_8px_22px_rgba(0,0,0,0.2)]">
                <Seal size={44} />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-display text-[20px] tracking-tight">ACEL</span>
                <span className="text-[12px] text-paper/45">{meta?.tagline}</span>
              </div>
            </div>
            <div className="max-w-[38ch]">
              <p className="text-[11px] uppercase tracking-[0.16em] text-gold-bright mb-2">
                About ACEL
              </p>
              <p className="text-[13.5px] leading-[1.65] text-paper/70">{footer?.brandLine}</p>
            </div>
          </div>

          {/* Link columns — own sub-grid alongside the brand column */}
          {columns.length > 0 && (
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {columns.map((col) => (
                <div
                  key={col.title}
                  className="rounded-lg border border-paper/10 bg-paper/[0.03] p-5 transition-colors duration-200 hover:border-gold-bright/25 hover:bg-paper/[0.05]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenColumns((current) => ({ ...current, [col.title]: !current[col.title] }))}
                    aria-expanded={Boolean(openColumns[col.title])}
                    className="flex w-full items-center justify-between text-left sm:hidden"
                  >
                    <span className="font-display text-[13.5px] text-gold-bright">{col.title}</span>
                    <span aria-hidden="true" className="text-lg leading-none text-gold-bright">
                      {openColumns[col.title] ? '−' : '+'}
                    </span>
                  </button>
                  <h4 className="hidden font-display text-[13.5px] text-gold-bright mb-3 sm:block">{col.title}</h4>
                  <ul className={`flex flex-col gap-2 overflow-hidden transition-[max-height,opacity] duration-300 sm:flex sm:max-h-none sm:opacity-100 ${openColumns[col.title] ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {(col.links || []).map((link) => (
                      <li key={link}>
                        <Link
                          to={linkTo(link)}
                          className="group inline-flex items-center gap-1.5 text-[13.5px] text-paper/60 hover:text-paper transition-colors duration-200"
                        >
                          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                            {link}
                          </span>
                          <span
                            aria-hidden="true"
                            className="opacity-0 -translate-x-1 text-gold-bright transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                          >
                            ›
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 pb-4 flex flex-col items-center gap-2 text-center text-[11px] text-paper/45 sm:flex-row sm:justify-between sm:text-left">
          <p>{footer?.footLine}</p>
          <p className="flex gap-4">
            <Link to="/privacy" className="hover:text-paper transition-colors">Privacy policy</Link>
            <Link to="/terms" className="hover:text-paper transition-colors">Terms of use</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}