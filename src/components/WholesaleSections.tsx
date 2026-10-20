import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, ArrowUpRight, BadgeCheck, Globe2, Mail, MapPin, MessageCircle, PackageCheck, Phone, Scissors, Search, Shirt, Truck, Clock3, Handshake } from 'lucide-react'
import { business, whatsappUrl } from '../config/business'
import { readSiteLanguage } from '../config/language'
import { sectionHref } from '../config/navigation'
import { products } from '../data/products'
import ProductGallery from './ProductGallery'
import SocialIcon from './SocialIcon'
import WhatsAppButton from './WhatsAppButton'
import AddToCartDialog from '../cart/AddToCartDialog'
import { useCart } from '../cart/useCart'

export function About() {
  return (
    <section className="section about-section" id="about">
      <div className="page-width about-grid">
        <div className="section-heading about-heading">
          <p className="eyebrow"><span className="eyebrow-line" /> A partner in every detail</p>
          <h2>Made for little ones.<br /><em>Ready for the world.</em></h2>
          <p className="section-intro">We’re a wholesale children’s clothing studio based in Istanbul, connecting thoughtful design with the needs of independent retailers worldwide.</p>
          <a className="text-link" href="#contact">Meet your supply partner <ArrowRight size={17} /></a>
        </div>
        <div className="about-image-wrap">
          <img src="https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=900&q=85" alt="Children in carefully styled occasion wear" loading="lazy" />
          <div className="image-note"><span className="note-mark">m.</span><span>Designed with care<br />in Istanbul, Türkiye</span></div>
        </div>
        <div className="about-details">
          <p>Our collections bring together modern, European-inspired design and the quality Turkish production is known for. We work closely with boutiques, retailers and distributors to make sourcing simple and dependable.</p>
          <p>Explore a considered range of models, sizes and colors, with international shipping available. Assortment and availability vary by collection—our team will share the latest details directly.</p>
          <div className="about-points"><span><BadgeCheck size={16} /> Curated seasonal collections</span><span><Globe2 size={16} /> International B2B supply</span></div>
        </div>
      </div>
    </section>
  )
}

export function Collections() {
  const { addLine, lines: cartLines } = useCart()
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState(readSiteLanguage)
  const copy = {
    en: { eyebrow: 'The collection', title: 'Small details.', subtitle: 'Big little moments.', intro: 'A preview of our latest wholesale range. Ask our team for the full catalog, current availability and pricing.', all: 'All pieces', girls: "Girls' Dresses", boys: "Boys' Clothing", occasion: 'Occasion Wear', holiday: 'Eid & Holiday', new: 'New Arrivals', search: 'Search styles or model numbers', filter: 'Filter collection by category', sizes: 'Sizes', age: 'Age range', fabric: 'Fabric', colors: 'Colors', ask: 'Ask for wholesale price', empty: 'No products match your search.', note: 'Wholesale catalog preview', noteText: 'Styles, sizes and colors are subject to availability. Contact us for the current line sheet.', categories: { "Girls' Dresses": "Girls' Dresses", "Boys' Clothing": "Boys' Clothing", 'Occasion Wear': 'Occasion Wear', 'Eid & Holiday': 'Eid & Holiday', 'New Arrivals': 'New Arrivals' } },
    ar: { eyebrow: 'المجموعة', title: 'تفاصيل صغيرة.', subtitle: 'لحظات جميلة.', intro: 'تعرّف على مجموعة الجملة. تواصل معنا للحصول على الكتالوج الكامل والأسعار والتوفر الحالي.', all: 'جميع المنتجات', girls: 'فساتين البنات', boys: 'ملابس الأولاد', occasion: 'ملابس المناسبات', holiday: 'الأعياد والمناسبات', new: 'وصل حديثاً', search: 'ابحث عن الموديل أو رقمه', filter: 'تصفية المجموعة حسب الفئة', sizes: 'المقاسات', age: 'الفئة العمرية', fabric: 'القماش', colors: 'الألوان', ask: 'اسأل عن سعر الجملة', empty: 'لا توجد منتجات مطابقة لبحثك.', note: 'معاينة كتالوج الجملة', noteText: 'تختلف الموديلات والمقاسات والألوان حسب التوفر. تواصل معنا للحصول على قائمة المنتجات الحالية.', categories: { "Girls' Dresses": 'فساتين البنات', "Boys' Clothing": 'ملابس الأولاد', 'Occasion Wear': 'ملابس المناسبات', 'Eid & Holiday': 'الأعياد والمناسبات', 'New Arrivals': 'وصل حديثاً' } },
    ru: { eyebrow: 'Коллекция', title: 'Важны детали.', subtitle: 'Красивые моменты.', intro: 'Обзор оптовой коллекции. Полный каталог, наличие и цены уточняйте у нашей команды.', all: 'Все модели', girls: 'Платья для девочек', boys: 'Одежда для мальчиков', occasion: 'Нарядная одежда', holiday: 'Праздничная коллекция', new: 'Новинки', search: 'Поиск по модели или номеру', filter: 'Фильтр по категориям', sizes: 'Размеры', age: 'Возраст', fabric: 'Ткань', colors: 'Цвета', ask: 'Запросить оптовую цену', empty: 'По вашему запросу ничего не найдено.', note: 'Предварительный каталог', noteText: 'Наличие моделей, размеров и цветов уточняйте у нашей команды.', categories: { "Girls' Dresses": 'Платья для девочек', "Boys' Clothing": 'Одежда для мальчиков', 'Occasion Wear': 'Нарядная одежда', 'Eid & Holiday': 'Праздничная коллекция', 'New Arrivals': 'Новинки' } },
  }[language]
  const categories = [
    { id: 'all', label: copy.all },
    { id: "Girls' Dresses", label: copy.girls },
    { id: "Boys' Clothing", label: copy.boys },
    { id: 'Occasion Wear', label: copy.occasion },
    { id: 'Eid & Holiday', label: copy.holiday },
    { id: 'New Arrivals', label: copy.new },
  ]
  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory
    const term = search.trim().toLocaleLowerCase()
    const matchesSearch = !term || `${product.name} ${product.modelCode} ${product.category} ${product.sizes} ${product.colors}`.toLocaleLowerCase().includes(term)
    return matchesCategory && matchesSearch
  }), [activeCategory, search])

  useEffect(() => {
    const syncLanguage = (event: Event) => {
      const value = (event as CustomEvent<string>).detail?.toLowerCase()
      if (value === 'en' || value === 'ar' || value === 'ru') setLanguage(value)
    }
    window.addEventListener('site-language-change', syncLanguage)
    return () => window.removeEventListener('site-language-change', syncLanguage)
  }, [])

  return (
    <section className="section collection-section" id="collections">
      <div className="page-width">
        <div className="section-topline">
          <div className="section-heading">
            <p className="eyebrow"><span className="eyebrow-line" /> {copy.eyebrow}</p>
            <h2>{copy.title}<br /><em>{copy.subtitle}</em></h2>
          </div>
          <p className="section-sidecopy">{copy.intro}</p>
        </div>
        <div className="catalog-controls">
          <div className="category-list" role="group" aria-label={copy.filter}>
            {categories.map((category) => <button key={category.id} type="button" className={activeCategory === category.id ? 'category-chip selected' : 'category-chip'} aria-pressed={activeCategory === category.id} onClick={() => setActiveCategory(category.id)}>{category.label}</button>)}
          </div>
          <label className="catalog-search"><Search size={17} aria-hidden="true" /><span className="sr-only">{copy.search}</span><input value={search} onChange={(event) => setSearch(event.target.value.slice(0, 100))} placeholder={copy.search} /></label>
        </div>
        <div className="product-grid" aria-live="polite">
          {visibleProducts.map((product) => (
            <article className="product-card" key={product.modelCode}>
              <div className="product-photo-wrap">
                <ProductGallery product={product} />
                {product.badge && <span className="product-badge">{product.badge}</span>}
                <span className="product-category">{copy.categories[product.category as keyof typeof copy.categories] ?? product.category}</span>
              </div>
              <div className="product-info">
                <div className="product-title-row"><h3>{product.name}</h3><span>{product.modelCode}</span></div>
                <dl className="product-specs">
                  {product.ageRange && <div><dt>{copy.age}</dt><dd>{product.ageRange}</dd></div>}
                  <div><dt>{copy.sizes}</dt><dd>{product.sizes}</dd></div>
                  {product.fabric && <div><dt>{copy.fabric}</dt><dd>{product.fabric}</dd></div>}
                  <div><dt>{copy.colors}</dt><dd>{product.colors}</dd></div>
                </dl>
                <a className="product-ask" href={whatsappUrl(`Hello, I am interested in ${product.name} (${product.modelCode}). Please share its wholesale price and current availability.`)} target="_blank" rel="noopener noreferrer">{copy.ask} <ArrowUpRight size={16} /></a>
                <AddToCartDialog product={product} otherModelQuantity={cartLines.filter((line) => line.modelCode === product.modelCode).reduce((total, line) => total + Object.values(line.quantities).reduce((sum, quantity) => sum + quantity, 0), 0)} onSave={addLine} />
              </div>
            </article>
          ))}
        </div>
        {visibleProducts.length === 0 && <p className="catalog-empty" role="status">{copy.empty}</p>}
        <p className="catalog-note"><span>{copy.note}</span> · {copy.noteText}</p>
      </div>
    </section>
  )
}

const benefits = [
  { icon: Scissors, title: 'Turkish quality', text: 'Thoughtful materials and careful finishing from a trusted apparel region.' },
  { icon: Shirt, title: 'Wholesale only', text: 'A focused B2B partner for stores, boutiques, importers and distributors.' },
  { icon: BadgeCheck, title: 'Modern designs', text: 'Easy-to-merchandise styles with a fresh, European-inspired sensibility.' },
  { icon: Truck, title: 'International shipping', text: 'We coordinate shipping options for buyers across our international markets.' },
  { icon: PackageCheck, title: 'Flexible assortments', text: 'Ask about available models, sizes, colors and order quantities.' },
  { icon: Handshake, title: 'Reliable B2B service', text: 'Clear communication and practical support from inquiry to dispatch.' },
]

export function Benefits() {
  return (
    <section className="section benefits-section" id="why-us">
      <div className="page-width">
        <div className="section-heading centered-heading"><p className="eyebrow"><span className="eyebrow-line" /> The Minik difference</p><h2>Good business,<br /><em>beautifully made.</em></h2></div>
        <div className="benefit-grid">{benefits.map(({ icon: Icon, title, text }, index) => <article className="benefit-card" key={title}><span className="benefit-index">0{index + 1}</span><Icon size={23} strokeWidth={1.5} /><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div>
    </section>
  )
}

const steps = [
  ['01', 'Browse our collections', 'Explore the styles in our catalog preview.'],
  ['02', 'Contact us on WhatsApp', 'Tell us about your store and what you’re looking for.'],
  ['03', 'Receive wholesale details', 'We’ll share current models, sizes, colors and prices.'],
  ['04', 'Confirm and ship', 'Agree your assortment and delivery arrangements with our team.'],
]

export function Process() {
  return (
    <section className="section process-section" id="how-it-works">
      <div className="page-width process-layout">
        <div className="section-heading"><p className="eyebrow"><span className="eyebrow-line" /> A simple way to work together</p><h2>From first look<br /><em>to first delivery.</em></h2><p className="section-intro">A personal, straightforward process designed around wholesale buyers.</p><WhatsAppButton className="process-cta">Start a conversation</WhatsAppButton></div>
        <div className="process-steps">{steps.map(([number, title, text]) => <div className="process-step" key={number}><span className="step-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight className="step-arrow" size={18} /></div>)}</div>
      </div>
    </section>
  )
}

export function Wholesale() {
  return (
    <section className="wholesale-section">
      <div className="wholesale-image" role="img" aria-label="A child wearing a timeless neutral outfit" />
      <div className="wholesale-overlay" />
      <div className="page-width wholesale-content"><p className="eyebrow light-eyebrow"><span className="eyebrow-line" /> For wholesale buyers</p><h2>Your next collection<br /><em>starts with a hello.</em></h2><p>Looking for a reliable children’s clothing supplier from Turkey? Contact us for our latest wholesale collections, available sizes, colors, prices and shipping information.</p><WhatsAppButton>Request the wholesale catalog <ArrowUpRight size={16} /></WhatsAppButton><span className="wholesale-footnote">For boutiques · retailers · importers · distributors</span></div>
    </section>
  )
}

export function Social() {
  const channels: Array<{ name: string; handle: string; href: string; icon: 'instagram' | 'facebook' | 'whatsapp' }> = [
    ...(business.instagramUrl ? [{ name: 'Instagram', handle: 'New collections & latest arrivals', href: business.instagramUrl, icon: 'instagram' as const }] : []),
    ...(business.facebookUrl ? [{ name: 'Facebook', handle: 'Follow our brand updates', href: business.facebookUrl, icon: 'facebook' as const }] : []),
    { name: 'WhatsApp', handle: 'Talk to our wholesale team', href: whatsappUrl(), icon: 'whatsapp' },
  ]
  return (
    <section className="section social-section" id="social">
      <div className="page-width social-layout"><div className="section-heading"><p className="eyebrow"><span className="eyebrow-line" /> Stay in the loop</p><h2>Follow along<br /><em>with Minik.</em></h2><p className="section-intro">Follow us for new collections, thoughtful details and the latest arrivals.</p></div>
        <div className="social-grid">{channels.map(({ name, handle, href, icon }) => <a className={`social-card ${icon === 'whatsapp' ? 'whatsapp' : ''}`} href={href} key={name} target="_blank" rel="noopener noreferrer" aria-label={`${name}: ${handle}`} title={handle}><span className="social-icon">{icon === 'whatsapp' ? <MessageCircle size={20} strokeWidth={1.7} /> : <SocialIcon network={icon} size={20} />}</span><span><strong>{name}</strong><small>{handle}</small></span><ArrowUpRight className="social-arrow" size={17} /></a>)}</div>
      </div>
    </section>
  )
}

export function Contact() {
  return (
    <section className="section contact-section" id="contact">
      <div className="page-width contact-layout">
        <div className="contact-copy"><p className="eyebrow"><span className="eyebrow-line" /> Let’s talk business</p><h2>Good things<br /><em>begin here.</em></h2><p className="section-intro">Use our smart wholesale inquiry to share your requirements, or contact us directly. Follow our social channels for new collections and model updates.</p>
          <div className="contact-details">
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><span className="contact-icon"><MessageCircle size={18} /></span><span><small>WhatsApp</small><strong>{business.phone}</strong></span><ArrowUpRight size={15} /></a>
            <a href={`tel:${business.phone.replace(/[^+\d]/g, '')}`}><span className="contact-icon"><Phone size={18} /></span><span><small>Phone</small><strong>{business.phone}</strong></span><ArrowUpRight size={15} /></a>
            <a href={`mailto:${business.email}`}><span className="contact-icon"><Mail size={18} /></span><span><small>Email</small><strong>{business.email}</strong></span><ArrowUpRight size={15} /></a>
            {business.facebookUrl && <a href={business.facebookUrl} target="_blank" rel="noopener noreferrer"><span className="contact-icon"><SocialIcon network="facebook" size={18} /></span><span><small>Facebook</small><strong>Follow our business</strong></span><ArrowUpRight size={15} /></a>}
            {business.instagramUrl && <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer"><span className="contact-icon"><SocialIcon network="instagram" size={18} /></span><span><small>Instagram</small><strong>See new collections</strong></span><ArrowUpRight size={15} /></a>}
            <div className="contact-static"><span className="contact-icon"><MapPin size={18} /></span><span><small>Location</small><strong>{business.location}</strong></span></div>
            <div className="contact-static"><span className="contact-icon"><Clock3 size={18} /></span><span><small>Working hours</small><strong>{business.workingHours}</strong></span></div>
          </div>
        </div>
        <div className="contact-inquiry-card"><p className="eyebrow"><span className="eyebrow-line" /> Wholesale buyers</p><h3>Share exactly what you need.</h3><p>Choose models, sizes, quantities and order requirements in your preferred language.</p><a className="button button-primary" href="#inquiry">Start a wholesale inquiry <ArrowRight size={16} /></a></div>
      </div>
    </section>
  )
}

export function Footer() {
  const [language, setLanguage] = useState(readSiteLanguage)
  const footerCopy = {
    en: { explore: 'Explore', about: 'About us', collections: 'Collections', why: 'Why choose us', how: 'How we work', contact: 'Contact', getInTouch: 'Get in touch', whatsapp: 'WhatsApp', call: 'Call our team', email: 'Email us', follow: 'Follow along', followText: 'Follow for new collections and model updates.', backToTop: 'Back to top' },
    ar: { explore: 'استكشف', about: 'من نحن', collections: 'المجموعة', why: 'لماذا نحن', how: 'كيف نعمل', contact: 'تواصل معنا', getInTouch: 'تواصل معنا', whatsapp: 'واتساب', call: 'اتصل بفريقنا', email: 'البريد الإلكتروني', follow: 'تابعنا', followText: 'تابع أحدث المجموعات والموديلات.', backToTop: 'العودة إلى الأعلى' },
    ru: { explore: 'Разделы', about: 'О нас', collections: 'Коллекции', why: 'Почему мы', how: 'Как мы работаем', contact: 'Контакты', getInTouch: 'Связаться с нами', whatsapp: 'WhatsApp', call: 'Позвонить нашей команде', email: 'Электронная почта', follow: 'Мы в соцсетях', followText: 'Следите за новыми коллекциями и моделями.', backToTop: 'Наверх' },
  }
  const t = footerCopy[language]

  useEffect(() => {
    const syncLanguage = (event: Event) => {
      const value = (event as CustomEvent<string>).detail?.toLowerCase()
      if (value === 'en' || value === 'ar' || value === 'ru') setLanguage(value)
    }
    window.addEventListener('site-language-change', syncLanguage)
    return () => window.removeEventListener('site-language-change', syncLanguage)
  }, [])

  return (
    <footer className="site-footer" dir={language === 'ar' ? 'rtl' : 'ltr'}><div className="page-width footer-main">
      <div className="footer-brand"><a className="brand-mark footer-mark" href={sectionHref('home')} aria-label={`${business.name} home`}><span className="brand-symbol">m<span>.</span></span><span className="brand-name">{business.logo}<small>WHOLESALE · ISTANBUL</small></span></a><p>{business.description}</p><a className="footer-email" href={`mailto:${business.email}`}>{business.email} <ArrowUpRight size={14} /></a></div>
      <div className="footer-links"><h3>{t.explore}</h3><a href={sectionHref('about')}>{t.about}</a><a href={sectionHref('collections')}>{t.collections}</a><a href={sectionHref('why-us')}>{t.why}</a><a href={sectionHref('how-it-works')}>{t.how}</a><a href={sectionHref('contact')}>{t.contact}</a></div>
      <div className="footer-links"><h3>{t.getInTouch}</h3><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">{t.whatsapp} <ArrowUpRight size={13} /></a><a href={`tel:${business.phone.replace(/[^+\d]/g, '')}`}>{t.call}</a><a href={`mailto:${business.email}`}>{t.email}</a><span><MapPin size={13} /> {business.location}</span></div>
      <div className="footer-social"><h3>{t.follow}</h3><p>{t.followText}</p><div>{business.instagramUrl && <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram"><SocialIcon network="instagram" size={17} /></a>}{business.facebookUrl && <a href={business.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook"><SocialIcon network="facebook" size={17} /></a>}<a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="Contact via WhatsApp"><MessageCircle size={17} /></a></div></div>
    </div><div className="page-width footer-bottom"><span>© {new Date().getFullYear()} {business.name}. All rights reserved.</span><span>Wholesale children’s fashion · Istanbul, Türkiye</span><a href={sectionHref('home')}>{t.backToTop} ↑</a></div></footer>
  )
}