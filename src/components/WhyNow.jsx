import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Reveal from './Reveal.jsx'
import { whyNow } from '../data/content.js'

export default function WhyNow() {
  const lineRef = useRef(null)
  const lineInView = useInView(lineRef, { once: true, margin: '-100px' })

  return (
    <section className="section-dark text-paper py-24 md:py-32">
      <div className="container-edge">
        <div className="max-w-[840px] mx-auto text-center">
          <Reveal>
            <p className="text-[13px] tracking-wide text-gold-bright mb-4">{whyNow.eyebrow}</p>
            <h2 className="font-display text-[1.9rem] sm:text-[2.3rem] leading-[1.14] text-balance mb-10">
              {whyNow.heading}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="font-display text-[1.7rem] sm:text-[2.15rem] leading-[1.3] text-balance text-paper/95">
              {whyNow.body}
            </p>
          </Reveal>

          {/* Line draws itself in once — the "timeline completing" moment */}
          <div ref={lineRef} className="flex justify-center my-10">
            <motion.div
              className="h-px bg-gold-bright origin-left"
              initial={{ scaleX: 0, width: '220px' }}
              animate={lineInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <Reveal delay={0.15}>
            <p className="text-[15.5px] leading-[1.75] text-paper/55 max-w-[56ch] mx-auto">
              {whyNow.extra}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}