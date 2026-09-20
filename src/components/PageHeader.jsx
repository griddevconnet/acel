// Heading band for pages that don't start with a full section of their own
// (contact, forms, legal). The top padding clears the fixed nav bar.
export default function PageHeader({ eyebrow, title, intro }) {
  return (
    <section className="section-dark text-paper pt-36 md:pt-44 pb-14 md:pb-20">
      <div className="container-edge">
        {eyebrow && <p className="mb-4 text-[13px] tracking-wide text-gold-bright">{eyebrow}</p>}
        <h1 className="max-w-[20ch] font-display text-[2.4rem] leading-[1.1] text-balance sm:text-[3rem] md:text-[3.6rem]">
          {title}
        </h1>
        {intro && (
          <p className="mt-6 max-w-[58ch] text-[17px] leading-[1.7] text-paper/70">{intro}</p>
        )}
      </div>
    </section>
  )
}
