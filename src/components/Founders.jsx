import Reveal, { StaggerGroup, StaggerItem } from './Reveal.jsx'
import { founders } from '../data/content.js'

export default function Founders() {
  return (
    <section className="section-dark text-paper py-24 md:py-32">
      <div className="container-edge">
        <Reveal className="max-w-2xl mb-14">
          <p className="text-[13px] tracking-wide text-gold-bright mb-4">{founders.eyebrow}</p>
          <h2 className="font-display text-[2rem] sm:text-[2.4rem] leading-[1.12] text-balance mb-5">
            {founders.heading}
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-paper/65 max-w-[58ch]">{founders.body}</p>
        </Reveal>

        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {founders.people.map((p) => (
            <StaggerItem key={p.name}>
              <div className="h-full rounded-xl border border-paper/15 bg-paper/[0.04] p-6">
                <h3 className="font-display text-[1.05rem] leading-snug text-paper mb-1">{p.name}</h3>
                <p className="text-[13px] text-gold-bright mb-3">{p.role}</p>
                {p.body && <p className="text-[13.5px] leading-[1.65] text-paper/60">{p.body}</p>}
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
