import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, ShoppingBag, X } from 'lucide-react'
import { business } from '../config/business'
import { setSiteLanguage, type SiteLanguage } from '../config/language'
import { currentRoutePath, sectionHref, sitePath } from '../config/navigation'
import SocialIcon from './SocialIcon'
import WhatsAppButton from './WhatsAppButton'
import { useCart } from '../cart/useCart'

const navigation = {
  EN: { home: 'Home', about: 'About us', collections: 'Collections', why: 'Why us', contact: 'Contact', inquiry: 'Request a quote', contactWhatsApp: 'Contact us on WhatsApp', language: 'Language', navigation: 'Main navigation', chooseLanguage: 'Choose language', openMenu: 'Open navigation menu', closeMenu: 'Close navigation menu', cart: 'Cart', pieces: 'pieces', wholesale: 'WHOLESALE · ISTANBUL' },
  AR: { home: 'الرئيسية', about: 'من نحن', collections: 'المجموعة', why: 'لماذا نحن', contact: 'تواصل معنا', inquiry: 'اطلب عرض سعر', contactWhatsApp: 'تواصل معنا عبر واتساب', language: 'اللغة', navigation: 'القائمة الرئيسية', chooseLanguage: 'اختر اللغة', openMenu: 'فتح قائمة التنقل', closeMenu: 'إغلاق قائمة التنقل', cart: 'السلة', pieces: 'قطعة', wholesale: 'ملابس أطفال بالجملة · إسطنبول' },
  RU: { home: 'Главная', about: 'О нас', collections: 'Коллекции', why: 'Почему мы', contact: 'Контакты', inquiry: 'Запросить предложение', contactWhatsApp: 'Связаться в WhatsApp', language: 'Язык', navigation: 'Главная навигация', chooseLanguage: 'Выбрать язык', openMenu: 'Открыть меню навигации', closeMenu: 'Закрыть меню навигации', cart: 'Корзина', pieces: 'шт.', wholesale: 'ОПТ · СТАМБУЛ' },
}

export default function Navbar() {
  const { pieceCount } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState(() => {
    try {
      const value = window.localStorage.getItem('minik-language')
      return value === 'EN' || value === 'AR' || value === 'RU' ? value : 'EN'
    } catch {
      return 'EN'
    }
  })

  const selectLanguage = (value: string) => {
    if (value !== 'EN' && value !== 'AR' && value !== 'RU') return
    setLanguage(value)
    setSiteLanguage(value.toLowerCase() as SiteLanguage)
  }

  useEffect(() => {
    const syncLanguage = (event: Event) => {
      const value = (event as CustomEvent<string>).detail
      if (value === 'EN' || value === 'AR' || value === 'RU') setLanguage(value)
    }
    window.addEventListener('site-language-change', syncLanguage)
    return () => window.removeEventListener('site-language-change', syncLanguage)
  }, [])

  useEffect(() => {
    document.documentElement.lang = language.toLowerCase()
    document.documentElement.dir = language === 'AR' ? 'rtl' : 'ltr'
  }, [language])

  const closeMenu = () => setIsMenuOpen(false)
  const text = navigation[language as keyof typeof navigation]
  const links = [
    { label: text.home, href: sectionHref('home') },
    { label: text.about, href: sectionHref('about') },
    { label: text.collections, href: sectionHref('collections') },
    { label: text.why, href: sectionHref('why-us') },
    { label: text.contact, href: sectionHref('contact') },
  ]

  return (
    <header className="site-header">
      <nav className="nav-wrap" aria-label={text.navigation}>
        <a className="brand-mark" href={sectionHref('home')} onClick={closeMenu} aria-label={`${business.name} ${language === 'AR' ? 'الرئيسية' : language === 'RU' ? 'Главная' : 'home'}`}>
          <span className="brand-symbol">m<span>.</span></span>
          <span className="brand-name">{business.logo}<small>{text.wholesale}</small></span>
        </a>
        <div className="desktop-nav">
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </div>
        <div className="nav-actions">
          <label className="language-select">
            <span className="sr-only">{text.language}</span>
            <select value={language} onChange={(event) => selectLanguage(event.target.value)} aria-label={text.chooseLanguage}>
              <option value="EN">EN</option>
              <option value="AR">AR</option>
              <option value="RU">RU</option>
            </select>
          </label>
          {business.facebookUrl && <a className="nav-social-link" href={business.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook"><SocialIcon network="facebook" size={16} /></a>}
          {business.instagramUrl && <a className="nav-social-link" href={business.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram"><SocialIcon network="instagram" size={16} /></a>}
          <a className={`nav-cart ${currentRoutePath() === '/cart' ? 'active' : ''}`} href={sitePath('cart')} aria-label={`${language === 'AR' ? 'السلة' : language === 'RU' ? 'Корзина' : 'Cart'} · ${pieceCount} ${language === 'AR' ? 'قطعة' : language === 'RU' ? 'шт.' : 'pieces'}`} title={language === 'AR' ? 'السلة' : language === 'RU' ? 'Корзина' : 'Cart'}>
            <ShoppingBag size={18} aria-hidden="true" /><span>{pieceCount}</span>
          </a>
          <a className="nav-inquiry" href={sectionHref('inquiry')}>{text.inquiry}</a>
          <WhatsAppButton className="nav-whatsapp">WhatsApp <ArrowUpRight size={15} aria-hidden="true" /></WhatsAppButton>
          <button className="menu-toggle" type="button" aria-expanded={isMenuOpen} aria-controls="mobile-menu" aria-label={isMenuOpen ? text.closeMenu : text.openMenu} onClick={() => setIsMenuOpen((open) => !open)}>
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
      <div className="mobile-menu" id="mobile-menu" hidden={!isMenuOpen} inert={!isMenuOpen}>
        {links.map((link) => <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}<ArrowUpRight size={15} /></a>)}
        <a href={sectionHref('inquiry')} onClick={closeMenu}>{text.inquiry}<ArrowUpRight size={15} /></a>
        <a href={sitePath('cart')} onClick={closeMenu}><ShoppingBag size={16} /> {text.cart} · {pieceCount} {text.pieces}</a>
        <WhatsAppButton className="mobile-menu-cta" onClick={closeMenu}>{text.contactWhatsApp}</WhatsAppButton>
        <p>{text.language}: {['EN', 'AR', 'RU'].map((item) => <button key={item} type="button" className={language === item ? 'active-language' : ''} onClick={() => selectLanguage(item)}>{item}</button>)}</p>
      </div>
    </header>
  )
}