import { Link } from 'react-router-dom'
import Reveal from './Reveal.jsx'
import { joinCta } from '../data/content.js'

export default function JoinCTA() {
  return (
    <section id="join" className="relative bg-ink text-paper py-24 md:py-32 overflow-hidden">
      {/* Hairline divider, ties back into the rest of the page's editorial rules */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-paper/0 via-paper/15 to-paper/0" />

      <div className="container-edge relative">
        <Reveal>
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* ---------- Copy ---------- */}
            <div className="lg:col-span-9">
              <h2 className="font-display text-[2.1rem] sm:text-[2.7rem] leading-[1.1] text-balance mb-6 text-paper">
                {joinCta.heading}
              </h2>
              <p className="text-[17px] leading-[1.7] text-paper/70 max-w-[52ch] mb-10">
                {joinCta.body}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/membership"
                  className="liquid-btn liquid-btn-nav"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                >
                  <span className="liquid-blob" />
                  <span className="liquid-blob two" />
                  <span className="liquid-label">{joinCta.buttons[0]}</span>
                </Link>
                <Link
                  to="/certification/register"
                  className="inline-flex items-center rounded-full border border-paper/25 px-7 py-3.5 text-[15px] font-medium text-paper hover:border-gold hover:text-gold-bright transition-colors"
                >
                  {joinCta.buttons[1]}
                </Link>
              </div>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  )
}