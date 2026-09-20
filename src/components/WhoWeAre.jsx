import { motion } from 'framer-motion'
import Reveal from './Reveal.jsx'
import { whoWeAre, vision } from '../data/content.js'

/* Liquid glass card: two blurred color blobs drift slowly behind a
   frosted surface, giving the glass a soft, alive quality rather than
   a flat blur. Motion is slow/looping and self-contained to the card —
   not a page-level effect. */
function LiquidCard({ title, body, tone = 'emerald' }) {
  const blobA = tone === 'emerald' ? 'bg-emerald/35' : 'bg-gold/40'
  const blobB = tone === 'emerald' ? 'bg-gold/25' : 'bg-emerald/25'

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/50 bg-white/30 backdrop-blur-xl shadow-[0_20px_45px_-25px_rgba(0,20,13,0.35)] p-6">
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute h-40 w-40 rounded-full blur-3xl ${blobA}`}
        animate={{ x: [0, 26, -10, 0], y: [0, -18, 14, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: '-30%', left: '-20%' }}
      />
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute h-36 w-36 rounded-full blur-3xl ${blobB}`}
        animate={{ x: [0, -20, 16, 0], y: [0, 16, -12, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        style={{ bottom: '-25%', right: '-15%' }}
      />
      <div className="relative">
        <h3 className="font-display text-[15px] text-emerald mb-2">{title}</h3>
        <p className="text-[14.5px] leading-[1.65] text-ink/70">{body}</p>
      </div>
    </div>
  )
}

export default function WhoWeAre() {
  return (
    <section id="about" className="section-light py-24 md:py-32">
      <div className="container-edge">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10">
          <Reveal className="lg:col-span-4">
            <p className="text-[13px] tracking-wide text-emerald mb-4">{whoWeAre.eyebrow}</p>
            <h2 className="font-display text-[2rem] sm:text-[2.5rem] leading-[1.12] text-balance">
              {whoWeAre.heading}
            </h2>

            <blockquote className="relative mt-9 pl-1">
              <span
                aria-hidden
                className="absolute -top-6 -left-1 font-display text-[4.5rem] leading-none text-gold/25 select-none"
              >
                &ldquo;
              </span>
              <p className="relative font-display text-[1.2rem] leading-[1.55] text-ink/85 italic border-l-2 border-gold pl-5">
                {whoWeAre.quote}
              </p>
            </blockquote>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6 flex flex-col justify-center gap-6">
            {whoWeAre.paragraphs.map((p, i) => (
              <p key={i} className="text-[16.5px] leading-[1.75] text-ink/75 max-w-[62ch]">
                {p}
              </p>
            ))}

            <div className="mt-4 grid sm:grid-cols-2 gap-5">
              <LiquidCard title="Vision" body={vision.vision} tone="emerald" />
              <LiquidCard title="Mission" body={vision.mission} tone="gold" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}