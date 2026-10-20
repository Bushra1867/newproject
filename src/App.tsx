import { useEffect } from 'react'
import './editorial.css'
import { business } from './config/business'
import { readSiteLanguage } from './config/language'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SmartInquiry from './components/SmartInquiry'
import { About, Collections, Benefits, Process, Wholesale, Social, Contact, Footer } from './components/WholesaleSections'
import CartPage from './cart/CartPage'
import './cart/cart.css'
import { currentRoutePath } from './config/navigation'

function App() {
  const isCartPage = currentRoutePath() === '/cart'

  useEffect(() => {
    const updateMetadata = (language: ReturnType<typeof readSiteLanguage>) => {
      const metadata = {
        en: { title: `${business.name} | Wholesale Children's Fashion from Turkey`, description: 'Premium Turkish children’s clothing wholesale for boutiques, retailers and distributors worldwide. Explore our collections and request wholesale details.' },
        ar: { title: `${business.name} | أزياء أطفال تركية بالجملة`, description: 'ملابس أطفال تركية راقية للبيع بالجملة للمتاجر والبوتيكات والموزعين حول العالم. اكتشفوا مجموعاتنا واطلبوا تفاصيل الجملة.' },
        ru: { title: `${business.name} | Детская одежда оптом из Турции`, description: 'Качественная детская одежда из Турции оптом для бутиков, магазинов и дистрибьюторов по всему миру.' },
      }[language]
      document.title = metadata.title
      document.querySelector('meta[name="description"]')?.setAttribute('content', metadata.description)
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', metadata.title)
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', metadata.description)
    }
    updateMetadata(readSiteLanguage())
    const onLanguageChange = (event: Event) => {
      const value = (event as CustomEvent<string>).detail?.toLowerCase()
      if (value === 'en' || value === 'ar' || value === 'ru') updateMetadata(value)
    }
    window.addEventListener('site-language-change', onLanguageChange)
    const scrollToHash = () => {
      const id = window.location.hash.slice(1)
      if (!id) return
      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start',
        })
      })
    }
    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)
    return () => {
      window.removeEventListener('site-language-change', onLanguageChange)
      window.removeEventListener('hashchange', scrollToHash)
    }
  }, [])

  return (
    <div className="site-shell">
      <Navbar />
      {isCartPage ? <><CartPage /><Footer /></> : <>
      <main>
        <Hero />
        <About />
        <Collections />
        <Benefits />
        <Process />
        <Wholesale />
        <Social />
        <SmartInquiry />
        <Contact />
      </main>
      <Footer />
      </>}
    </div>
  )
}

export default App