import { readSiteLanguage } from './language'

/** Replace these sample details with the wholesaler's real contact channels. */
export const business = {
  name: 'Minik Studio',
  logo: 'MINIK',
  tagline: "Children's fashion, thoughtfully made.",
  description: "A wholesale children's clothing partner in Istanbul, bringing considered design and dependable service to boutiques, retailers and distributors worldwide.",
  whatsappNumber: '905016506221',
  instagramUrl: '',
  facebookUrl: '',
  tiktokUrl: 'https://www.tiktok.com/',
  email: 'wholesale@example.com',
  phone: '+90 501 650 62 21',
  location: 'Istanbul, Turkey',
  workingHours: 'Monday – Friday, 09:00 – 18:00 (TRT)',
} as const

export const inquiryEndpoint = import.meta.env.VITE_INQUIRY_ENDPOINT?.trim() ?? ''

const wholesaleMessages = {
  en: "Hello, I am interested in your wholesale children's clothing collection. Please send me your latest catalog and wholesale prices.",
  ar: 'مرحباً، أهتم بمجموعات ملابس الأطفال لديكم للبيع بالجملة. يرجى إرسال أحدث كتالوج وأسعار الجملة.',
  ru: 'Здравствуйте! Меня интересуют ваши оптовые коллекции детской одежды. Пожалуйста, отправьте актуальный каталог и оптовые цены.',
}

export function whatsappUrl(message = wholesaleMessages[readSiteLanguage()]) {
  const directChatUrl = `https://wa.me/${business.whatsappNumber.replace(/\D/g, '')}`
  return message ? `${directChatUrl}?text=${encodeURIComponent(message)}` : directChatUrl
}
