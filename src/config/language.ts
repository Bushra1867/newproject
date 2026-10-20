export type SiteLanguage = 'en' | 'ar' | 'ru'

export function readSiteLanguage(): SiteLanguage {
  let value = document.documentElement.lang.toLowerCase()
  try {
    value = window.localStorage.getItem('minik-language')?.toLowerCase() ?? value
  } catch {
    // The current document language remains usable when storage is unavailable.
  }
  return value === 'ar' || value === 'ru' ? value : 'en'
}

export function setSiteLanguage(language: SiteLanguage) {
  document.documentElement.lang = language
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  try {
    window.localStorage.setItem('minik-language', language.toUpperCase())
  } catch {
    // The language still applies for this page when storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent('site-language-change', { detail: language.toUpperCase() }))
}
