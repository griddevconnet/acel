import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal, { StaggerGroup, StaggerItem } from './Reveal.jsx'
import { certification } from '../data/content.js'

// Tracks how far the section has traveled through the viewport, 0 → 1.
// Used to drive the pathway line and heading rule — a scroll effect
// that visualizes "progress through certification," not generic parallax.
function useSectionProgress(ref) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = null

    const measure = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const total = rect.height + vh
      const traveled = vh - rect.top
      setProgress(Math.min(1, Math.max(0, traveled / total)))
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        measure()
        raf = null
      })
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref])

  return progress
}

function LiquidLevelCard({ lvl, index }) {
  const cardRef = useRef(null)
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const handleMove = (e) => {
    const card = cardRef.current
    if (!card || reducedMotion.current) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    card.style.setProperty('--rx', `${(0.5 - y) * 12}deg`)
    card.style.setProperty('--ry', `${(x - 0.5) * 12}deg`)
    card.style.setProperty('--mx', `${x * 100}%`)
    card.style.setProperty('--my', `${y * 100}%`)
  }

  const resetTilt = () => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--rx', '0deg')
    card.style.setProperty('--ry', '0deg')
  }

  return (
    <StaggerItem className="relative">
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={resetTilt}
        className="liquid-card dark-glass-card rounded-2xl p-7 relative overflow-hidden"
      >
        <span className="liquid-card-sheen" aria-hidden="true" />
        <span className="liquid-card-numeral font-display" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="relative z-10">
          <div className="hidden md:flex w-3 h-3 rounded-full bg-gold-bright mb-6" aria-hidden="true" />
          <span className="font-display text-[13px] text-gold-bright">{lvl.level}</span>
          <h3 className="font-display text-[1.5rem] mt-2 mb-3">{lvl.name}</h3>
          <p className="text-[15px] leading-[1.7] text-paper/65 max-w-[36ch]">{lvl.body}</p>
        </div>
      </div>
    </StaggerItem>
  )
}

export default function Certification() {
  const sectionRef = useRef(null)
  const progress = useSectionProgress(sectionRef)

  return (
    <section
      id="certification"
      ref={sectionRef}
      className="section-dark text-paper py-24 md:py-32 relative overflow-hidden"
    >
      <style>{`
        .cert-ambient {
          position: absolute;
          inset: -10%;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(480px 480px at 12% 20%, rgba(208,153,65,0.10), transparent 60%),
            radial-gradient(560px 560px at 88% 78%, rgba(143,212,164,0.08), transparent 60%);
          filter: blur(2px);
          animation: cert-ambient-drift 22s ease-in-out infinite;
        }
        @keyframes cert-ambient-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-2%, 2%) scale(1.04); }
        }

        .cert-progress-track {
          position: relative;
          height: 1px;
          width: 100%;
          background: rgba(244,239,230,0.15);
        }
        .cert-progress-fill {
          position: absolute;
          inset: 0;
          transform-origin: left;
          background: #D09941;
        }

        .liquid-card {
          --rx: 0deg;
          --ry: 0deg;
          --mx: 50%;
          --my: 50%;
          transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));
          transform-style: preserve-3d;
          border: 1px solid rgba(244,239,230,0.12);
          box-shadow: 0 18px 40px rgba(0,0,0,0.28);
          transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
          will-change: transform;
        }
        .liquid-card:hover {
          border-color: rgba(208,153,65,0.4);
          box-shadow: 0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(208,153,65,0.18);
        }

        .liquid-card-sheen {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0;
          background: radial-gradient(220px circle at var(--mx) var(--my), rgba(255,255,255,0.16), rgba(208,153,65,0.10) 40%, transparent 70%);
          transition: opacity 320ms ease;
        }
        .liquid-card:hover .liquid-card-sheen { opacity: 1; }

        .liquid-card-numeral {
          position: absolute;
          right: 14px;
          bottom: -10px;
          font-size: 6.5rem;
          line-height: 1;
          z-index: 0;
          pointer-events: none;
          color: rgba(244,239,230,0.06);
          -webkit-text-stroke: 1px rgba(244,239,230,0.14);
          transition: transform 420ms cubic-bezier(0.22,1,0.36,1), -webkit-text-stroke-color 420ms ease;
        }
        .liquid-card:hover .liquid-card-numeral {
          transform: translateY(-6px);
          -webkit-text-stroke-color: rgba(208,153,65,0.45);
        }

        @media (prefers-reduced-motion: reduce) {
          .cert-ambient { animation: none; }
          .liquid-card, .liquid-card-numeral { transition: none; }
        }
      `}</style>

      <div className="cert-ambient" aria-hidden="true" />

      <div className="container-edge relative">
        <Reveal className="mb-16 md:mb-20">
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-8 md:gap-14 items-end">
            <div>
              <p className="text-[13px] tracking-wide text-gold-bright mb-4">{certification.eyebrow}</p>
              <h2 className="font-display text-[2.2rem] sm:text-[2.8rem] md:text-[3.2rem] leading-[1.08] text-balance">
                {certification.heading}
              </h2>
            </div>
            <p className="text-[16.5px] leading-[1.75] text-paper/70 max-w-[42ch] md:pb-1">
              {certification.body}
            </p>
          </div>

          <div className="cert-progress-track mt-10">
            <span
              className="cert-progress-fill"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        </Reveal>

        <StaggerGroup className="relative">
          <div
            className="hidden md:block absolute top-6 left-0 right-0 h-px bg-paper/20 overflow-hidden"
            aria-hidden="true"
          >
            <span
              className="block h-full bg-gold-bright origin-left"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {certification.levels.map((lvl, i) => (
              <LiquidLevelCard key={lvl.name} lvl={lvl} index={i} />
            ))}
          </div>
        </StaggerGroup>

        <Reveal className="mt-14 md:mt-16 flex flex-wrap items-center gap-5">
          <Link
            to="/certification/register"
            className="liquid-btn liquid-btn-hero"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            <span className="liquid-blob" />
            <span className="liquid-blob two" />
            <span className="liquid-label">Register for certification</span>
          </Link>
          <Link
            to="/certification/verify"
            className="text-[14.5px] font-medium text-paper/70 underline underline-offset-4 hover:text-gold-bright"
          >
            Verify a certificate
          </Link>
        </Reveal>
      </div>
    </section>
  )
}