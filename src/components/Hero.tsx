import { ArrowDown, ArrowRight, ArrowUpRight, Globe2 } from 'lucide-react'
import WhatsAppButton from './WhatsAppButton'

export default function Hero() {
  return (
    <section className="hero-section" id="home" aria-labelledby="hero-title">
      <div className="hero-photo" role="img" aria-label="Children's fashion campaign in warm natural light" />
      <div className="hero-shade" />
      <div className="hero-content page-width">
        <div className="hero-copy">
          <p className="eyebrow light-eyebrow"><span className="eyebrow-line" /> Istanbul, Turkey <span className="eyebrow-dot" /> Wholesale since 2014</p>
          <h1 id="hero-title">Wholesale Children’s<br /><em>Fashion from Turkey</em></h1>
          <p className="hero-description">Premium children’s clothing for boutiques, retailers and distributors worldwide.</p>
          <div className="hero-actions">
            <WhatsAppButton>Contact us on WhatsApp <ArrowUpRight size={16} aria-hidden="true" /></WhatsAppButton>
            <a className="button button-ghost" href="#collections">View collections <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="hero-bottomline">
          <span><Globe2 size={15} /> A considered collection for a world of little ones</span>
          <a href="#about">Discover Minik <ArrowDown size={14} /></a>
        </div>
      </div>
      <div className="hero-index" aria-hidden="true">01 / 04</div>
    </section>
  )
}