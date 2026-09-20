import { useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion'
import { Link } from 'react-router-dom'
import Reveal, { StaggerGroup, StaggerItem } from './Reveal.jsx'
import { membership } from '../data/content.js'

const MEMBERSHIP_BG = '/membership-background.png'

/* ---------------------------------------------------------------- */
/* 3D tilt card — cursor-tracked rotation + a gold spotlight that
   follows the pointer. Content is lifted in Z-space so it reads as
   genuinely dimensional, not just a flat tilt. */
/* ---------------------------------------------------------------- */
function TiltCard({ children, className = '', strength = 10, lift = 26 }) {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), {
    stiffness: 250,
    damping: 22,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), {
    stiffness: 250,
    damping: 22,
  })
  const glowX = useTransform(x, [-0.5, 0.5], ['0%', '100%'])
  const glowY = useTransform(y, [-0.5, 0.5], ['0%', '100%'])
  const background = useMotionTemplate`radial-gradient(320px circle at ${glowX} ${glowY}, rgba(208,153,65,0.22), transparent 70%)`

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
      whileHover={{ scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`relative [transform-style:preserve-3d] ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{ background, opacity: hovered ? 1 : 0 }}
      />
      <div
        className="relative"
        style={{ transform: `translateZ(${lift}px)`, transformStyle: 'preserve-3d' }}
      >
        {children}
      </div>
    </motion.div>
  )
}

function TierList({ title, note, items }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="font-display text-[1.15rem] text-paper">{title}</h3>
        <span className="text-[12.5px] text-paper/45">{note}</span>
      </div>
      <ul className="flex flex-col">
        {items.map((t) => (
          <li
            key={t.name}
            className="group relative py-4 border-t border-paper/10 last:border-b pl-0 hover:pl-4 transition-[padding] duration-300"
          >
            <span className="absolute left-0 top-4 bottom-4 w-[2.5px] bg-gold scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />
            <p className="font-medium text-[15.5px] text-paper group-hover:text-gold-bright transition-colors">
              {t.name}
            </p>
            <p className="text-[14px] leading-relaxed text-paper/60 mt-1">{t.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Membership() {
  const [stream, setStream] = useState('org')

  return (
    <section id="membership" className="relative py-24 md:py-32 overflow-hidden">
      {/* ---------- Background image + scrim ---------- */}
      <div className="absolute inset-0 z-0">
        <img
          src={MEMBERSHIP_BG}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        {/* Diagonal dark wash, echoes the hero treatment */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(120deg, rgba(4,20,13,0.94) 0%, rgba(4,20,13,0.86) 30%, rgba(4,20,13,0.66) 58%, rgba(4,20,13,0.5) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(4,20,13,0.85), rgba(4,20,13,0) 35%)',
          }}
        />
      </div>

      <div className="container-edge relative z-10">
        {/* ---------- Editorial intro ---------- */}
        <Reveal className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-end mb-20">
          <div className="lg:col-span-7">
            <p className="text-[13px] tracking-[0.14em] uppercase text-emerald mb-4">
              {membership.eyebrow}
            </p>
            <h2 className="font-display text-[2.1rem] sm:text-[2.7rem] leading-[1.08] text-balance text-paper">
              {membership.heading}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pl-9 lg:border-l lg:border-paper/15">
            <p className="text-[16px] leading-[1.75] text-paper/75">{membership.body}</p>
          </div>
        </Reveal>

        {/* ---------- Why join — bento grid, glass-over-photo ---------- */}
        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 auto-rows-[1fr] gap-5 mb-24 [perspective:1200px]">
          {membership.whyJoin.map((w, i) => (
            <StaggerItem
              key={w.title}
              className={i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}
            >
              <TiltCard
                strength={i === 0 ? 6 : 10}
                className={`h-full rounded-2xl border border-paper/15 bg-paper/[0.07] backdrop-blur-xl p-7 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)] hover:shadow-[0_30px_60px_-16px_rgba(208,153,65,0.4)] hover:border-gold/50 hover:bg-paper/[0.1] transition-[box-shadow,border-color,background] duration-300 flex flex-col ${
                  i === 0 ? 'justify-between' : 'justify-start'
                }`}
              >
                <span className="font-display text-[12px] text-gold/80 mb-4 block">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3
                  className={`font-display leading-snug mb-2 text-paper ${
                    i === 0 ? 'text-[1.4rem] max-w-[22ch]' : 'text-[15.5px]'
                  }`}
                >
                  {w.title}
                </h3>
                <p
                  className={`text-paper/65 leading-[1.65] ${
                    i === 0 ? 'text-[15px] max-w-[38ch] mt-2' : 'text-[14px]'
                  }`}
                >
                  {w.body}
                </p>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* ---------- Tier switcher ---------- */}
        <Reveal className="relative rounded-2xl p-7 md:p-10 mb-24 border border-paper/15 bg-paper/[0.06] backdrop-blur-xl overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gold/15 blur-3xl"
          />
          <div className="relative flex items-center gap-2 mb-9">
            {[
              { id: 'org', label: 'Organisational tiers' },
              { id: 'ind', label: 'Individual grades' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStream(tab.id)}
                className={`relative px-5 py-2.5 rounded-full text-[14px] font-medium transition-colors ${
                  stream === tab.id ? 'text-ink' : 'text-paper/60 hover:text-paper'
                }`}
              >
                {stream === tab.id && (
                  <motion.span
                    layoutId="tier-pill"
                    className="absolute inset-0 rounded-full bg-gold"
                    transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={stream}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {stream === 'org' ? (
                <TierList
                  title="Organisations join by size"
                  note={`${membership.orgTiers.length} tiers`}
                  items={membership.orgTiers}
                />
              ) : (
                <TierList
                  title="Individuals join by experience"
                  note={`${membership.individualGrades.length} grades`}
                  items={membership.individualGrades}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Reveal>

        {/* ---------- How to apply — connected roadmap ---------- */}
        <Reveal className="mb-10">
          <h3 className="font-display text-[1.3rem] text-paper">How to apply</h3>
        </Reveal>
        <div className="relative mb-24">
          <div className="hidden md:block absolute top-[22px] left-0 right-0 h-px bg-gradient-to-r from-paper/0 via-paper/20 to-paper/0" />
          <StaggerGroup className="grid md:grid-cols-3 gap-x-10 gap-y-12">
            {membership.steps.map((s, i) => (
              <StaggerItem key={s.title}>
                <div className="flex md:flex-col items-start gap-4 md:gap-0">
                  <span className="relative z-10 shrink-0 flex h-11 w-11 items-center justify-center rounded-full bg-ink/40 backdrop-blur border border-paper/25 font-display text-[13px] text-gold md:mb-5 transition-all duration-300 hover:scale-110 hover:border-gold hover:shadow-[0_0_0_6px_rgba(208,153,65,0.18)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="font-display text-[16px] mb-2 leading-snug text-paper">
                      {s.title}
                    </h4>
                    <p className="text-[14px] leading-[1.65] text-paper/60 max-w-[34ch]">
                      {s.body}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        <Reveal className="flex flex-wrap justify-center items-center gap-5">
          <Link
            to="/membership/apply"
            className="liquid-btn liquid-btn-hero"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            <span className="liquid-blob" />
            <span className="liquid-blob two" />
            <span className="liquid-label">Apply for membership</span>
          </Link>
          <Link
            to="/membership/directory"
            className="text-[14.5px] font-medium text-paper/70 underline underline-offset-4 hover:text-gold-bright"
          >
            View member directory
          </Link>
        </Reveal>

      </div>
    </section>
  )
}