import { ArrowDown, ArrowRight, ArrowUpRight, Globe2 } from 'lucide-react'
import { useSiteLanguage } from '../hooks/useSiteLanguage'
import WhatsAppButton from './WhatsAppButton'

export default function Hero() {
  const language = useSiteLanguage()
  const copy = {
    en: { location: 'Istanbul, Turkey', since: 'Wholesale since 2014', title: <>Wholesale Children’s<br /><em>Fashion from Turkey</em></>, description: 'Premium children’s clothing for boutiques, retailers and distributors worldwide.', whatsapp: 'Contact us on WhatsApp', collections: 'View collections', collectionNote: 'A considered collection for a world of little ones', discover: 'Discover Minik', image: 'Two children wearing cozy neutral outfits in a warm nursery' },
    ar: { location: 'إسطنبول، تركيا', since: 'تجارة الجملة منذ ٢٠١٤', title: <>أزياء أطفال<br /><em>تركية بالجملة</em></>, description: 'ملابس أطفال راقية للمتاجر والبوتيكات والموزعين حول العالم.', whatsapp: 'تواصل معنا عبر واتساب', collections: 'تصفح المجموعات', collectionNote: 'مجموعة مختارة بعناية للأطفال حول العالم', discover: 'اكتشفوا مينيك', image: 'طفلان بملابس شتوية ناعمة بألوان حيادية في غرفة دافئة' },
    ru: { location: 'Стамбул, Турция', since: 'Оптовые поставки с 2014 года', title: <>Детская одежда<br /><em>оптом из Турции</em></>, description: 'Качественная детская одежда для бутиков, магазинов и дистрибьюторов по всему миру.', whatsapp: 'Напишите нам в WhatsApp', collections: 'Смотреть коллекцию', collectionNote: 'Продуманная коллекция для детей по всему миру', discover: 'Откройте для себя Minik', image: 'Двое детей в уютной нейтральной одежде в теплой детской комнате' },
  }[language]

  return (
    <section className="hero-section" id="home" aria-labelledby="hero-title">
      <div className="hero-content page-width">
        <div className="hero-copy">
          <p className="eyebrow light-eyebrow"><span className="eyebrow-line" /> {copy.location} <span className="eyebrow-dot" /> {copy.since}</p>
          <h1 id="hero-title">{copy.title}</h1>
          <p className="hero-description">{copy.description}</p>
          <div className="hero-actions">
            <WhatsAppButton>{copy.whatsapp} <ArrowUpRight size={16} aria-hidden="true" /></WhatsAppButton>
            <a className="button button-ghost" href="#collections">{copy.collections} <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="hero-gallery">
          <div className="hero-gallery-main-frame">
            <img
              className="hero-gallery-main"
              src={`${import.meta.env.BASE_URL}cozy-nursery-friends.jpg`}
              alt={copy.image}
              fetchPriority="high"
            />
          </div>
        </div>
        <div className="hero-bottomline">
          <span><Globe2 size={15} /> {copy.collectionNote}</span>
          <a href="#about">{copy.discover} <ArrowDown size={14} /></a>
        </div>
      </div>
      <div className="hero-index" aria-hidden="true">01 / 04</div>
    </section>
  )
}