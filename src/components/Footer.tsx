import { whatsappUrl } from '../config/business'

const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Location', href: '#location' },
  { label: 'Contact', href: '#contact' },
]

function Footer() {
  return (
    <footer id="footer" className="border-t border-[#e7e0d3]/15 bg-[#10110f] px-6 py-16 text-[#f6f0e4] sm:py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.3fr_0.7fr_1fr] lg:gap-24">
          <div>
            <a href="#home" className="font-display text-3xl tracking-[0.24em] text-[#f6f0e4] transition-colors hover:text-[#d4ad6a]">
              SAPORE
            </a>
            <p className="mt-6 max-w-xs text-sm leading-6 text-[#e7e0d3]/60">
              Handmade pasta, honest ingredients, and the generous spirit of Italy in the heart of Istanbul.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="mb-5 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#d4ad6a]">Explore</h2>
            <ul className="space-y-3">
              {navigation.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-[#e7e0d3]/65 transition-colors hover:text-[#d4ad6a]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            <div>
              <h2 className="mb-5 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#d4ad6a]">Visit us</h2>
              <address className="not-italic text-sm leading-6 text-[#e7e0d3]/65">
                Istiklal Avenue,<br />Beyoglu, Istanbul, Turkey
              </address>
              <p className="mt-4 text-sm leading-6 text-[#e7e0d3]/65">Monday - Sunday<br />12:00 PM - 12:00 AM</p>
            </div>
            <div>
              <h2 className="mb-5 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#d4ad6a]">Connect</h2>
              <ul className="space-y-3 text-sm">
                <li><a href="https://instagram.com/sapore.restaurant" target="_blank" rel="noopener noreferrer" className="text-[#e7e0d3]/65 transition-colors hover:text-[#d4ad6a]">Instagram</a></li>
                <li><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="text-[#e7e0d3]/65 transition-colors hover:text-[#d4ad6a]">WhatsApp</a></li>
                <li><a href="tel:+905555555555" className="text-[#e7e0d3]/65 transition-colors hover:text-[#d4ad6a]">+90 555 555 55 55</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[#e7e0d3]/15 pt-5 text-[0.62rem] uppercase tracking-[0.16em] text-[#e7e0d3]/40 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Sapore. All rights reserved.</p>
          <p>Made for slow evenings</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer