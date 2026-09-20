import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'

export default function NotFound() {
  return (
    <>
      <PageHeader
        title="Page not found"
        intro="The page you were looking for does not exist or has moved."
      />
      <section className="section-light py-14 md:py-20">
        <div className="container-edge">
          <Link
            to="/"
            className="liquid-btn liquid-btn-hero"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            <span className="liquid-blob" />
            <span className="liquid-blob two" />
            <span className="liquid-label">Go to the home page</span>
          </Link>
        </div>
      </section>
    </>
  )
}
