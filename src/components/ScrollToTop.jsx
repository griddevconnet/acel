import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// On every navigation: jump to the top of the new page, or, when the URL has a
// #hash (e.g. /what-we-do#sectors), to that element once the page has rendered.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      // Wait a frame so the target page has mounted.
      const raf = requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        else window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      })
      return () => cancelAnimationFrame(raf)
    }
    // 'instant' overrides the site-wide `scroll-behavior: smooth` so new pages open at the top.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
