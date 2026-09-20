import PageHeader from './PageHeader.jsx'

export default function LegalPage({ doc }) {
  return (
    <>
      <PageHeader title={doc.title} intro={doc.intro} />
      <section className="section-light py-14 md:py-20">
        <div className="container-edge">
          <div className="mx-auto max-w-[68ch]">
            <p className="mb-10 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-[14px] leading-[1.6] text-ink/80">
              Draft for review. This text has not been checked by legal counsel, and items in square
              brackets still need to be filled in before launch.
            </p>
            {doc.sections.map((s) => (
              <div key={s.heading} className="mb-10">
                <h2 className="font-display text-[1.4rem] leading-snug text-ink">{s.heading}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="mt-3 text-[16px] leading-[1.75] text-ink/75">{p}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
