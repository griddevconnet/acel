import Reveal, { StaggerGroup, StaggerItem } from './Reveal.jsx'
import { values } from '../data/content.js'

export default function Values() {
  return (
    <section className="section-light py-24 md:py-32">
      <div className="container-edge">
        <Reveal className="max-w-2xl mb-14">
          <p className="text-[13px] tracking-wide text-emerald mb-4">{values.eyebrow}</p>
          <h2 className="font-display text-[2rem] sm:text-[2.4rem] leading-[1.12] text-balance">
            {values.heading}
          </h2>
        </Reveal>

        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
          {values.items.map((v, i) => (
            <StaggerItem key={v.title}>
              <div className="glass-card h-full rounded-xl p-8">
                <span className="font-display text-[13px] text-gold">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-[1.15rem] mt-3 mb-3 leading-snug">{v.title}</h3>
                <p className="text-[14.5px] leading-[1.65] text-ink/65 max-w-[38ch]">{v.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
