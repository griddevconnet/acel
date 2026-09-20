import Reveal, { StaggerGroup, StaggerItem } from './Reveal.jsx'
import { whatWeDo } from '../data/content.js'

export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="section-dark text-paper py-24 md:py-32">
      <div className="container-edge">
        <Reveal className="max-w-2xl mb-14">
          <p className="text-[13px] tracking-wide text-gold-bright mb-4">{whatWeDo.eyebrow}</p>
          <h2 className="font-display text-[2rem] sm:text-[2.4rem] leading-[1.12] text-balance text-paper">
            {whatWeDo.heading}
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="dark-glass-card overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-paper/15">
                  <th className="w-16 px-6 py-4 text-[12.5px] font-medium uppercase tracking-wide text-paper/45 sm:px-7">
                    #
                  </th>
                  <th className="px-6 py-4 text-[12.5px] font-medium uppercase tracking-wide text-paper/45 sm:px-7 sm:w-[26%]">
                    What we do
                  </th>
                  <th className="px-6 py-4 text-[12.5px] font-medium uppercase tracking-wide text-paper/45 sm:px-7">
                    What that means
                  </th>
                </tr>
              </thead>
              <StaggerGroup as="tbody">
                {whatWeDo.items.map((it, i) => (
                  <StaggerItem
                    key={it.title}
                    as="tr"
                    className="group border-b border-paper/10 last:border-0 hover:bg-paper/[0.04]"
                  >
                    <td className="px-6 py-5 align-top font-display text-[13px] text-gold-bright/80 sm:px-7">
                      {String(i + 1).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-5 align-top font-display text-[1.02rem] leading-snug text-paper group-hover:text-gold-bright transition-colors sm:px-7">
                      {it.title}
                    </td>
                    <td className="px-6 py-5 align-top text-[14.5px] leading-[1.65] text-paper/70 sm:px-7">
                      {it.body}
                    </td>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  )
}