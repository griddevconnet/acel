import { useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion'
import Reveal, { StaggerGroup, StaggerItem } from './Reveal.jsx'
import { differentiators } from '../data/content.js'

/* Same cursor-tracked tilt as Governance's cards — emerald spotlight
   tuned for a light surface, distinct from Membership's gold-on-dark
   version. */
function TiltCard({ children, className = '', strength = 7 }) {
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
  const background = useMotionTemplate`radial-gradient(260px circle at ${glowX} ${glowY}, rgba(4,118,34,0.13), transparent 70%)`

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
      whileHover={{ scale: 1.015, y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`relative [transform-style:preserve-3d] h-full ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{ background, opacity: hovered ? 1 : 0 }}
      />
      <div className="relative h-full" style={{ transform: 'translateZ(16px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  )
}

export default function Differentiators() {
  return (
    <section className="section-light py-24 md:py-32">
      <div className="container-edge">
        <Reveal className="max-w-2xl mb-14">
          <p className="text-[13px] tracking-wide text-emerald mb-4">What sets the Chamber apart</p>
          <h2 className="font-display text-[2rem] sm:text-[2.4rem] leading-[1.12] text-balance">
            Built differently, on purpose.
          </h2>
        </Reveal>

        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr [perspective:1200px]">
          {differentiators.map((d, i) => (
            <StaggerItem key={d.title}>
              <TiltCard className="glass-card rounded-xl p-8 md:p-10 hover:border-emerald/25 transition-colors duration-300">
                <span className="font-display text-[13px] text-gold">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-[1.2rem] mt-3 mb-3 leading-snug">{d.title}</h3>
                <p className="text-[15px] leading-[1.7] text-ink/65 max-w-[42ch]">{d.body}</p>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}