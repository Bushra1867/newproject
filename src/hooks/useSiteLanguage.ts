import { useEffect, useState } from 'react'
import { readSiteLanguage, type SiteLanguage } from '../config/language'

export function useSiteLanguage() {
  const [language, setLanguage] = useState<SiteLanguage>(readSiteLanguage)

  useEffect(() => {
    const syncLanguage = (event: Event) => {
      const value = (event as CustomEvent<string>).detail?.toLowerCase()
      if (value === 'en' || value === 'ar' || value === 'ru') setLanguage(value)
    }
    window.addEventListener('site-language-change', syncLanguage)
    return () => window.removeEventListener('site-language-change', syncLanguage)
  }, [])

  return language
}
