import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import WhatWeDo from './pages/WhatWeDo.jsx'
import Membership from './pages/Membership.jsx'
import MembershipApply from './pages/MembershipApply.jsx'
import MembershipDirectory from './pages/MembershipDirectory.jsx'
import Certification from './pages/Certification.jsx'
import CertificationRegister from './pages/CertificationRegister.jsx'
import CertificationVerify from './pages/CertificationVerify.jsx'
import Governance from './pages/Governance.jsx'
import Contact from './pages/Contact.jsx'
import Privacy from './pages/Privacy.jsx'
import Terms from './pages/Terms.jsx'
import NotFound from './pages/NotFound.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-paper">
        <ScrollToTop />
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/what-we-do" element={<WhatWeDo />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/membership/apply" element={<MembershipApply />} />
            <Route path="/membership/directory" element={<MembershipDirectory />} />
            <Route path="/certification" element={<Certification />} />
            <Route path="/governance" element={<Governance />} />
            <Route path="/certification/register" element={<CertificationRegister />} />
            <Route path="/certification/verify" element={<CertificationVerify />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
