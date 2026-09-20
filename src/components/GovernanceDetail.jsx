import Reveal, { StaggerGroup, StaggerItem } from './Reveal.jsx'
import { boardOfficers, boardCommittees, standardsBodies, secretariat } from '../data/content.js'

function ListBlock({ eyebrow, heading, body, items, renderItem }) {
  return (
    <Reveal className="mb-16 last:mb-0">
      <p className="text-[13px] tracking-wide text-emerald mb-4">{eyebrow}</p>
      <h3 className="font-display text-[1.6rem] sm:text-[1.8rem] leading-[1.15] text-balance mb-4 max-w-[36ch]">
        {heading}
      </h3>
      {body && <p className="text-[15px] leading-[1.75] text-ink/65 max-w-[62ch] mb-8">{body}</p>}
      <StaggerGroup className="grid sm:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <StaggerItem key={item.name || item.role}>{renderItem(item, i)}</StaggerItem>
        ))}
      </StaggerGroup>
    </Reveal>
  )
}

const Card = ({ title, body }) => (
  <div className="rounded-xl border border-ink/10 bg-white p-6 h-full">
    <h4 className="font-display text-[1.02rem] mb-2 leading-snug text-emerald">{title}</h4>
    <p className="text-[14px] leading-[1.65] text-ink/60">{body}</p>
  </div>
)

export default function GovernanceDetail() {
  return (
    <section className="section-light py-24 md:py-32">
      <div className="container-edge">
        <ListBlock
          eyebrow={boardOfficers.eyebrow}
          heading={boardOfficers.heading}
          body={boardOfficers.body}
          items={boardOfficers.items}
          renderItem={(item) => <Card title={item.role} body={item.body} />}
        />

        <ListBlock
          eyebrow={boardCommittees.eyebrow}
          heading={boardCommittees.heading}
          items={boardCommittees.items}
          renderItem={(item) => <Card title={item.name} body={item.body} />}
        />

        <ListBlock
          eyebrow={standardsBodies.eyebrow}
          heading={standardsBodies.heading}
          body={standardsBodies.body}
          items={standardsBodies.items}
          renderItem={(item) => <Card title={item.name} body={item.body} />}
        />

        <Reveal>
          <p className="text-[13px] tracking-wide text-emerald mb-4">{secretariat.eyebrow}</p>
          <h3 className="font-display text-[1.6rem] sm:text-[1.8rem] leading-[1.15] text-balance mb-4 max-w-[40ch]">
            {secretariat.heading}
          </h3>
          <p className="text-[15px] leading-[1.75] text-ink/65 max-w-[62ch] mb-8">{secretariat.body}</p>

          <div className="rounded-2xl border border-ink/10 bg-white p-6 md:p-8">
            <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
              {secretariat.directorates.map((d) => (
                <StaggerItem key={d}>
                  <div className="flex items-start gap-3 text-[14px] leading-[1.6] text-ink/75">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {d}
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
          <p className="mt-6 text-[13.5px] leading-[1.7] text-ink/50 max-w-[68ch]">{secretariat.note}</p>
        </Reveal>
      </div>
    </section>
  )
}
