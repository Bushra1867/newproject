import type { MouseEventHandler, ReactNode } from 'react'
import { MessageCircle } from 'lucide-react'
import { whatsappUrl } from '../config/business'
import { useSiteLanguage } from '../hooks/useSiteLanguage'

type WhatsAppButtonProps = {
  children: ReactNode
  className?: string
  message?: string
  icon?: boolean
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export default function WhatsAppButton({ children, className = '', message, icon = true, onClick }: WhatsAppButtonProps) {
  const language = useSiteLanguage()
  const label = language === 'ar' ? 'تواصل معنا عبر واتساب' : language === 'ru' ? 'Связаться с нами в WhatsApp' : 'Contact us on WhatsApp'

  return (
    <a className={`button button-primary ${className}`} href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" aria-label={label} onClick={onClick}>
      {icon && <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />}
      <span>{children}</span>
    </a>
  )
}