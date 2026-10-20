import { MessageCircle } from 'lucide-react'
import { whatsappUrl } from '../config/business'
import { useSiteLanguage } from '../hooks/useSiteLanguage'

export default function FloatingWhatsApp() {
  const language = useSiteLanguage()
  const label = language === 'ar'
    ? 'تواصل معنا عبر واتساب'
    : language === 'ru'
      ? 'Написать нам в WhatsApp'
      : 'Chat with us on WhatsApp'

  return (
    <a
      className="floating-whatsapp"
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
    >
      <MessageCircle size={22} strokeWidth={2} aria-hidden="true" />
      <span>{label}</span>
    </a>
  )
}
