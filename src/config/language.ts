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
