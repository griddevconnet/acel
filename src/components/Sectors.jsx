import { useEffect, useMemo, useState } from 'react'
import Reveal, { StaggerGroup, StaggerItem } from './Reveal.jsx'
import { sectors } from '../data/content.js'

// Computes an even radial spread for N sectors around a center point.
// Abstract data (not real coordinates), so — unlike the hero's fixed
// geographic node positions — these are derived, not hand-placed.
function useRadialPositions(count) {
  return useMemo(() => {
    const rx = 40 // % horizontal radius
    const ry = 36 // % vertical radius
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2
      return {
        x: 50 + rx * Math.cos(angle),
        y: 50 + ry * Math.sin(angle),
      }
    })
  }, [count])
}

export default function Sectors() {
  const [active, setActive] = useState(null)
  const [mounted, setMounted] = useState(false)
  const positions = useRadialPositions(sectors.list.length)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <section id="sectors" className="section-light py-24 md:py-32 relative overflow-hidden">
      <style>{`
        .sector-orbit {
          position: relative;
          aspect-ratio: 4 / 3;
          max-width: 420px;
          margin: 0 auto;
        }
        @media (min-width: 1024px) {
          .sector-orbit { max-width: none; margin: 0; }
        }

        .sector-orbit-lines {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        .sector-line {
          stroke: rgba(15, 61, 36, 0.16);
          stroke-width: 0.5;
          transition: stroke 320ms ease, stroke-width 320ms ease;
        }
        .sector-line-active {
          stroke: #D09941;
          stroke-width: 0.9;
        }

        /* hub: the shared standard every sector connects back to */
        .sector-hub {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 2;
        }
        .sector-hub-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #D09941;
          box-shadow: 0 0 0 4px rgba(208,153,65,0.16);
        }
        .sector-hub-ring {
          position: absolute;
          top: -14px;
          left: 50%;
          width: 40px;
          height: 40px;
          margin-left: -20px;
          border-radius: 50%;
          border: 1px solid rgba(208,153,65,0.5);
          animation: hub-breathe 3.6s ease-in-out infinite;
        }
        @keyframes hub-breathe {
          0%, 100% { transform: scale(0.85); opacity: 0.55; }
          50% { transform: scale(1.15); opacity: 0.1; }
        }
        .sector-hub-label {
          font-size: 11px;
          letter-spacing: 0.02em;
          color: rgba(15, 61, 36, 0.6);
          white-space: nowrap;
        }

        /* satellite nodes: same language as the hero's regional markers,
           tuned for a light background */
        .sector-node {
          position: absolute;
          transform: translate(-50%, -50%);
          background: none;
          border: none;
          padding: 14px;
          margin: -14px;
          cursor: pointer;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .sector-node-dot {
          display: block;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #3B9453;
          border: 2px solid #F4EFE6;
          box-shadow: 0 0 0 3px rgba(59,148,83,0.16);
          transition: transform 240ms cubic-bezier(0.22,1,0.36,1), background 240ms ease, box-shadow 240ms ease;
          animation: node-idle 3.2s ease-in-out infinite;
          animation-delay: var(--delay, 0ms);
        }
        @keyframes node-idle {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .sector-node:hover .sector-node-dot,
        .sector-node:focus-visible .sector-node-dot,
        .sector-node.active .sector-node-dot {
          transform: scale(1.55);
          background: #D09941;
          box-shadow: 0 0 0 5px rgba(208,153,65,0.2);
        }
        .sector-node:focus-visible {
          outline: none;
        }
        .sector-node:focus-visible .sector-node-dot {
          outline: 2px solid #D09941;
          outline-offset: 3px;
        }

        .sector-tooltip {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%) translateY(2px);
          white-space: nowrap;
          background: #0F2318;
          color: #F4EFE6;
          font-size: 12.5px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid rgba(208,153,65,0.4);
          opacity: 0;
          pointer-events: none;
          transition: opacity 200ms ease, transform 200ms ease;
        }
        .sector-tooltip.visible {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        /* mount-in stagger for the constellation — settles quickly so it
           reads correctly whether seen immediately or after scrolling in */
        .sector-orbit-lines line,
        .sector-node {
          opacity: 0;
          transition: opacity 480ms ease var(--delay, 0ms);
        }
        .sector-orbit.is-in .sector-orbit-lines line,
        .sector-orbit.is-in .sector-node {
          opacity: 1;
        }

        .sector-node-dot-static {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3B9453;
          flex-shrink: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .sector-hub-ring { animation: none; opacity: 0.3; }
          .sector-node-dot { animation: none; }
          .sector-orbit-lines line, .sector-node { transition: opacity 200ms ease; }
        }
      `}</style>

      <div className="container-edge">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          <Reveal className="lg:col-span-5">
            <p className="text-[13px] tracking-wide text-emerald mb-4">{sectors.eyebrow}</p>
            <h2 className="font-display text-[2rem] sm:text-[2.4rem] leading-[1.12] text-balance mb-5">
              {sectors.heading}
            </h2>
            <p className="text-[15.5px] leading-[1.75] text-ink/65 max-w-[52ch]">{sectors.body}</p>
          </Reveal>

          {/* radial node diagram — sm and up */}
          <Reveal className="hidden sm:block lg:col-span-6 lg:col-start-7">
            <div
              className={`sector-orbit${mounted ? ' is-in' : ''}`}
              aria-label="Sectors the Chamber convenes, connected under one shared standard"
            >
              <svg className="sector-orbit-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {positions.map((pos, i) => (
                  <line
                    key={sectors.list[i]}
                    x1="50"
                    y1="50"
                    x2={pos.x}
                    y2={pos.y}
                    className={`sector-line ${active === i ? 'sector-line-active' : ''}`}
                    style={{ '--delay': `${140 + i * 70}ms` }}
                  />
                ))}
              </svg>

              <div className="sector-hub" aria-hidden="true">
                <span className="sector-hub-ring" />
                <span className="sector-hub-dot" />
                <span className="sector-hub-label">One standard</span>
              </div>

              {sectors.list.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  className={`sector-node${active === i ? ' active' : ''}`}
                  style={{
                    left: `${positions[i].x}%`,
                    top: `${positions[i].y}%`,
                    '--delay': `${140 + i * 70}ms`,
                  }}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive((c) => (c === i ? null : c))}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive((c) => (c === i ? null : c))}
                >
                  <span className="sector-node-dot" />
                  <span className={`sector-tooltip${active === i ? ' visible' : ''}`}>{s}</span>
                </button>
              ))}
            </div>
          </Reveal>

          {/* narrow-viewport fallback: same node styling, honest stacked layout */}
          <StaggerGroup className="sm:hidden lg:col-span-6 lg:col-start-7 flex flex-col">
            {sectors.list.map((s) => (
              <StaggerItem key={s}>
                <div className="flex items-center gap-3 py-2.5 border-b border-ink/10">
                  <span className="sector-node-dot-static" />
                  <span className="text-[14.5px] text-ink/80">{s}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  )
}