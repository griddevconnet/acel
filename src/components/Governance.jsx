import { useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion'
import Reveal, { StaggerGroup, StaggerItem } from './Reveal.jsx'
import { governance } from '../data/content.js'

/* Same cursor-tracked tilt used in Membership's bento grid, recolored:
   a deep-emerald spotlight instead of gold, since gold loses contrast
   on a light card. */
function TiltCard({ children, className = '', strength = 8 }) {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), {
    stiffness: 260,
    damping: 22,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), {
    stiffness: 260,
    damping: 22,
  })
  const glowX = useTransform(x, [-0.5, 0.5], ['0%', '100%'])
  const glowY = useTransform(y, [-0.5, 0.5], ['0%', '100%'])
  const background = useMotionTemplate`radial-gradient(260px circle at ${glowX} ${glowY}, rgba(4,118,34,0.14), transparent 70%)`

  function handleMove(e) {
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function handleLeave() {
    x.set(0)
    y.set(0)
    setHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`relative [transform-style:preserve-3d] ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{ background, opacity: hovered ? 1 : 0 }}
      />
      <div style={{ transform: 'translateZ(18px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  )
}

export default function Governance() {
  return (
    <section id="governance" className="relative overflow-hidden bg-[#EDF6EF] text-ink py-24 md:py-32">
      {/* Layered light-green atmosphere instead of a flat fill */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-emerald/15 blur-[110px]" />
        <div className="absolute -bottom-40 -left-32 h-[380px] w-[380px] rounded-full bg-gold/10 blur-[100px]" />
      </div>

      <div className="container-edge relative">
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          <Reveal className="lg:col-span-5">
            <p className="text-[13px] tracking-wide text-emerald mb-4">{governance.eyebrow}</p>
            <h2 className="font-display text-[2rem] sm:text-[2.4rem] leading-[1.12] text-balance mb-5 text-ink">
              {governance.heading}
            </h2>
            <p className="text-[15.5px] leading-[1.75] text-ink/65 max-w-[52ch]">{governance.body}</p>
          </Reveal>

          {/* Kept as the one dark, high-contrast element in the section */}
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <ul className="rounded-2xl bg-ink p-6 md:p-7 flex flex-col gap-4 shadow-[0_25px_60px_-25px_rgba(0,20,13,0.45)]">
              {governance.principles.map((p) => (
                <li key={p} className="flex items-center gap-3 text-[14.5px] text-paper/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-bright shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 [perspective:1200px]">
          {governance.bodies.map((b, i) => (
            <StaggerItem key={b.name} className={i % 2 === 1 ? 'lg:mt-8' : ''}>
              <TiltCard className="h-full rounded-xl border border-ink/10 bg-white/70 backdrop-blur-sm p-7 shadow-[0_15px_35px_-20px_rgba(0,20,13,0.25)] hover:border-emerald/30 transition-colors duration-300">
                <h3 className="font-display text-[1.05rem] mb-3 leading-snug text-emerald">{b.name}</h3>
                <p className="text-[14px] leading-[1.65] text-ink/60">{b.body}</p>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}