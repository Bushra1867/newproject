import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import './editorial.css'
import { business } from './config/business'
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
    return () => window.removeEventListener('hashchange', scrollToHash)
  }, [])

  return (
    <div className="site-shell">
      <Helmet>
        <meta name="description" content="Premium Turkish children's clothing wholesale for boutiques, retailers and distributors worldwide. Explore our collections and request wholesale details." />
        <meta name="keywords" content="wholesale children's clothing, kids clothing wholesale Turkey, Turkish children's clothing, children's fashion wholesale, kids dresses wholesale, wholesale kids fashion, children's clothing supplier Turkey, Istanbul kids clothing wholesale" />
        <meta name="theme-color" content="#f7f5f0" />
        <meta property="og:title" content={`${business.name} | Wholesale Children's Fashion from Turkey`} />
        <meta property="og:description" content="Premium children's clothing for boutiques, retailers and distributors worldwide." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1200&q=85" />
      </Helmet>
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