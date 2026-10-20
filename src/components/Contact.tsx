import { whatsappUrl } from '../config/business'

type ContactIcon = 'whatsapp' | 'instagram' | 'phone'

const contacts: Array<{
  icon: ContactIcon
  title: string
  description: string
  action: string
  href: string
  external?: boolean
}> = [
  {
    icon: 'whatsapp',
    title: 'WhatsApp',
    description: 'Chat with us and reserve your table.',
    action: 'Start a Conversation',
    href: whatsappUrl(),
    external: true,
  },
  {
    icon: 'instagram',
    title: 'Instagram',
    description: 'Follow Sapore for dishes, stories and daily moments.',
    action: 'Follow Us',
    href: 'https://instagram.com/sapore.restaurant',
    external: true,
  },
  {
    icon: 'phone',
    title: 'Call Us',
    description: "We'd love to hear from you.",
    action: 'Call the Restaurant',
    href: 'tel:+905555555555',
  },
]

function ContactIconMark({ icon }: { icon: ContactIcon }) {
  if (icon === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className="h-7 w-7">
        <path d="M20 11.5a8 8 0 0 1-11.8 7.1L4 20l1.4-4A8 8 0 1 1 20 11.5Z" />
        <path d="M8.5 8.6c.2-.4.4-.4.7-.4h.4c.2 0 .4.1.5.4l.6 1.4c.1.2.1.4-.1.6l-.5.6c.7 1.3 1.7 2.2 3 2.9l.5-.6c.2-.2.4-.2.6-.1l1.4.6c.3.1.4.3.4.5v.4c0 .3 0 .5-.4.7-.4.2-1.2.3-2.1 0-1-.3-2.2-1-3.4-2.1-1.1-1-1.8-2.1-2.1-3.1-.3-.9-.2-1.7.1-2.1Z" />
      </svg>
    )
  }

  if (icon === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className="h-7 w-7">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.6" cy="6.5" r=".7" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className="h-7 w-7">
      <path d="M7.2 4.5h2.1l1.1 3.4-1.5 1.2a13.8 13.8 0 0 0 5.9 5.9l1.2-1.5 3.4 1.1v2.1c0 1-.8 1.8-1.8 1.8C11.3 18.5 5.5 12.7 5.5 5.3c0-1 .7-1.8 1.7-1.8Z" />
    </svg>
  )
}

function Contact() {
  return (
    <section id="contact" className="bg-[#ebe4d7] px-6 py-24 text-[#20211c] sm:py-32 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="mb-6 flex items-center gap-4 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[#a47c3c]">
            <span className="h-px w-10 bg-[#b9985c]" aria-hidden="true" />
            Get in touch
          </p>
          <h2 className="font-display text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl">
            Let&apos;s Make It a Night<br />to <em className="font-serif text-[#a47c3c]">Remember.</em>
          </h2>
          <p className="mt-7 max-w-xl text-base leading-7 text-[#20211c]/70 sm:text-lg">
            Whether you&apos;re planning a dinner for two or gathering with friends, we&apos;re here to make your evening special.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-3 lg:mt-20 lg:gap-7">
          {contacts.map((contact, index) => (
            <li key={contact.title} className={`group border p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#a47c3c] sm:p-8 ${index === 0 ? 'border-[#b9985c] bg-[#20211c] text-[#f6f0e4]' : 'border-[#20211c]/20 bg-[#e3dbcd]'}`}>
              <div className={`mb-12 flex h-12 w-12 items-center justify-center border ${index === 0 ? 'border-[#b9985c] text-[#d4ad6a]' : 'border-[#a47c3c] text-[#a47c3c]'}`}>
                <ContactIconMark icon={contact.icon} />
              </div>
              <h3 className="font-display text-3xl">{contact.title}</h3>
              <p className={`mt-4 min-h-12 max-w-xs text-sm leading-6 ${index === 0 ? 'text-[#e7e0d3]/65' : 'text-[#20211c]/65'}`}>
                {contact.description}
              </p>
              <a
                href={contact.href}
                target={contact.external ? '_blank' : undefined}
                rel={contact.external ? 'noopener noreferrer' : undefined}
                className={`mt-8 inline-flex items-center border-b pb-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] transition-colors ${index === 0 ? 'border-[#b9985c] text-[#d4ad6a] hover:text-[#f6f0e4]' : 'border-[#a47c3c] text-[#8c682f] hover:text-[#20211c]'}`}
              >
                {contact.action} <span className="ml-3 text-base" aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Contact